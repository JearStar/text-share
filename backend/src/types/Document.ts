export interface TextOperation {
  type: 'insert' | 'delete';
  position: number;
  text?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

export interface CursorPosition {
  userId: string;
  position: number;
  username: string;
}

export interface DocumentState {
  docId: string;
  content: string;
  version: number;
  operations: TextOperation[];
  activeUsers: Set<string>;
  cursors: Map<string, CursorPosition>;
  lastAccessed: number;
}

export interface DocumentUpdate {
  docId: string;
  userId: string;
  operation: TextOperation;
  cursorPosition?: number;
}
