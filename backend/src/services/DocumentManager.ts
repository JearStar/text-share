import { CursorPosition, DocumentState, TextOperation } from '../types/Document';
import { RedisClientType, RedisDefaultModules, RedisFunctions, RedisScripts } from 'redis';
import { ONE_MINUTE } from '../utils/TimeConstants';

export class DocumentManager {
  private documents: Map<string, DocumentState> = new Map();
  private redisClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>;
  private cleanupInterval: NodeJS.Timeout;
  private readonly INACTIVE_THRESHOLD = 30 * ONE_MINUTE;
  private readonly REDIS_TTL = 24 * 60 * 60;

  constructor(redisClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>) {
    this.redisClient = redisClient;
    this.cleanupInterval = setInterval(() => this.cleanupInactiveDocuments(), 5 * ONE_MINUTE);
  }

  async initializeDocument(docId: string): Promise<DocumentState> {
    const cachedDoc = await this.redisClient.get(`doc:${docId}`);
    if (cachedDoc) {
      const state: DocumentState = JSON.parse(cachedDoc);
      state.activeUsers = new Set(state.activeUsers);
      state.cursors = new Map(Object.entries(state.cursors));
      state.lastAccessed = Date.now();
      this.documents.set(docId, state);
      return state;
    }

    const newState: DocumentState = {
      content: '',
      version: 0,
      lastAccessed: Date.now(),
      operations: [],
      activeUsers: new Set(),
      cursors: new Map(),
    };

    this.documents.set(docId, newState);
    await this.saveToRedis(docId);
    return newState;
  }

  async applyOperation(docId: string, operation: TextOperation): Promise<DocumentState> {
    const state = await this.getDocument(docId);

    if (operation.type === 'insert' && operation.text) {
      state.content =
        state.content.slice(0, operation.position) +
        operation.text +
        state.content.slice(operation.position);
    } else if (operation.type === 'delete' && operation.length) {
      state.content =
        state.content.slice(0, operation.position) +
        state.content.slice(operation.position + operation.length);
    }

    state.version++;
    state.operations.push(operation);

    if (state.operations.length > 50) {
      state.operations = state.operations.slice(-50);
    }

    await this.saveToRedis(docId);
    return state;
  }

  async updateCursor(docId: string, cursor: CursorPosition): Promise<Map<string, CursorPosition>> {
    const state = await this.getDocument(docId);
    state.cursors.set(cursor.userId, cursor);
    await this.saveToRedis(docId);
    return state.cursors;
  }

  async addUser(docId: string, userId: string): Promise<Set<string>> {
    const state = await this.getDocument(docId);
    state.activeUsers.add(userId);
    await this.saveToRedis(docId);
    return state.activeUsers;
  }

  async removeUser(docId: string, userId: string): Promise<Set<string>> {
    const state = await this.getDocument(docId);
    state.activeUsers.delete(userId);
    state.cursors.delete(userId);
    await this.saveToRedis(docId);
    return state.activeUsers;
  }

  private async getDocument(docId: string): Promise<DocumentState> {
    let state = this.documents.get(docId);
    if (!state) {
      state = await this.initializeDocument(docId);
    }
    state.lastAccessed = Date.now();
    return state;
  }

  private async saveToRedis(docId: string): Promise<void> {
    const state = this.documents.get(docId);
    if (state) {
      const serializedState = {
        content: state.content,
        version: state.version,
        operations: state.operations,
        activeUsers: Array.from(state.activeUsers),
        cursors: Object.fromEntries(state.cursors),
        lastAccessed: state.lastAccessed,
      };
      await this.redisClient.setEx(`doc:${docId}`, this.REDIS_TTL, JSON.stringify(serializedState));
    }
  }

  private async cleanupInactiveDocuments(): Promise<void> {
    const now = Date.now();
    for (const [docId, state] of this.documents.entries()) {
      // If document hasn't been accessed in 30 minutes and has no active users
      if (now - state.lastAccessed > this.INACTIVE_THRESHOLD && state.activeUsers.size === 0) {
        // Remove from memory
        this.documents.delete(docId);
        // Remove from Redis if it exists
        await this.redisClient.del(`doc:${docId}`);
        console.log(`Cleaned up inactive document: ${docId} from memory and Redis`);
      }
    }

    // Also check for orphaned Redis documents (ones in Redis but not in memory)
    try {
      const keys = await this.redisClient.keys('doc:*');
      for (const key of keys) {
        const docId = key.replace('doc:', '');
        if (!this.documents.has(docId)) {
          const docStr = await this.redisClient.get(key);
          if (docStr) {
            const doc = JSON.parse(docStr);
            // If the document is old and has no active users
            if (
              now - doc.lastAccessed > this.INACTIVE_THRESHOLD &&
              (!doc.activeUsers || doc.activeUsers.length === 0)
            ) {
              await this.redisClient.del(key);
              console.log(`Cleaned up orphaned Redis document: ${docId}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up Redis documents:', error);
    }
  }

  public shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
