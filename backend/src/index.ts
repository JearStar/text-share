import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth';
import documentRoutes from './routes/Documents';
import { createServer, Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { connectRedis, pubClient, subClient } from './utils/Redis';
import { setupSocket, shutdownSocket } from './utils/Socket';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;

async function startServer() {
  await connectRedis();

  app.use(
    cors({
      origin: FRONTEND_BASE_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.set('trust proxy', 1);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);

  app.get('/', (req: Request, res: Response): void => {
    res.send('Text Share Backend is running!');
  });

  const httpServer = createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: FRONTEND_BASE_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.adapter(createAdapter(pubClient, subClient));

  setupSocket(io);

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  process.on('SIGTERM', () => handleShutdown(server));
  process.on('SIGINT', () => handleShutdown(server));
}

async function handleShutdown(server: Server) {
  console.log('Shutting down server...');
  shutdownSocket();
  await pubClient.quit();
  await subClient.quit();
  server.close(() => {
    console.log('Server shut down complete');
    process.exit(0);
  });
}

startServer().catch(console.error);
