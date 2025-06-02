import { Server } from 'socket.io';
import { DocumentManager } from '../services/DocumentManager';
import { pubClient } from './Redis';
import { CursorPosition, DocumentUpdate, TextOperation } from '../types/Document';

let documentManager: DocumentManager;

export function setupSocket(io: Server) {
  documentManager = new DocumentManager(pubClient);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    let currentDocument: string | null = null;

    socket.on('join document', async ({ docId, userId, username }) => {
      socket.data.userId = userId;
      socket.data.username = username;

      currentDocument = docId;
      socket.join(docId);
      const state = await documentManager.initializeDocument(docId);
      await documentManager.addUser(docId, userId);

      socket.emit('document state', {
        content: state.content,
        version: state.version,
        cursors: Array.from(state.cursors.values()),
        activeUsers: Array.from(state.activeUsers),
      });

      socket.to(docId).emit('user joined', { userId, username });
      console.log(`${username} (${userId}) joined document ${docId}`);
    });

    socket.on('text update', async (update: DocumentUpdate) => {
      if (!currentDocument) return;

      const operation: TextOperation = {
        ...update.operation,
        timestamp: Date.now(),
      };

      const state = await documentManager.applyOperation(currentDocument, operation);

      socket.to(currentDocument).emit('text update', {
        operation,
        version: state.version,
      });

      if (update.cursorPosition !== undefined) {
        const cursor: CursorPosition = {
          userId: update.userId,
          position: update.cursorPosition,
          username: socket.data.username || 'Anonymous',
        };
        const cursors = await documentManager.updateCursor(currentDocument, cursor);
        socket.to(currentDocument).emit('cursor update', Array.from(cursors.values()));
      }
    });

    socket.on('cursor update', async ({ docId, userId, position, username }) => {
      if (!docId) return;
      const cursor: CursorPosition = { userId, position, username };
      const cursors = await documentManager.updateCursor(docId, cursor);
      socket.to(docId).emit('cursor update', Array.from(cursors.values()));
    });

    socket.on('leave document', async ({ docId, userId }) => {
      if (docId && userId) {
        const activeUsers = await documentManager.removeUser(docId, userId);
        socket.to(docId).emit('user left', {
          userId,
          activeUsers: Array.from(activeUsers),
        });
        socket.leave(docId);
        currentDocument = null;
        console.log(`${userId} left document ${docId}`);
      }
    });

    socket.on('disconnect', async () => {
      if (currentDocument && socket.data.userId) {
        const activeUsers = await documentManager.removeUser(currentDocument, socket.data.userId);
        socket.to(currentDocument).emit('user left', {
          userId: socket.data.userId,
          activeUsers: Array.from(activeUsers),
        });
        console.log(`User ${socket.data.userId} disconnected from document ${currentDocument}`);
      }
    });
  });
}

export function shutdownSocket() {
  if (documentManager) {
    documentManager.shutdown();
  }
}
