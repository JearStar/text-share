import { CursorPosition, DocumentState, TextOperation } from '../types/Document';
import { RedisClientType, RedisDefaultModules, RedisFunctions, RedisScripts } from 'redis';

export class DocumentManager {
  private documents: Map<string, DocumentState> = new Map();
  private redisClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>;

  constructor(redisClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>) {
    this.redisClient = redisClient;
  }

  async initializeDocument(docId: string): Promise<DocumentState> {
    const cachedDoc = await this.redisClient.get(`doc:${docId}`);
    if (cachedDoc) {
      const state: DocumentState = JSON.parse(cachedDoc);
      state.activeUsers = new Set(state.activeUsers);
      state.cursors = new Map(Object.entries(state.cursors));
      this.documents.set(docId, state);
      return state;
    }

    const newState: DocumentState = {
      content: '',
      version: 0,
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
      };
      await this.redisClient.set(`doc${docId}`, JSON.stringify(serializedState));
    }
  }
}
