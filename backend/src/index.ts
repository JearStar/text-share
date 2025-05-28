import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth';
import documentRoutes from './routes/Documents';
import { connectRedis } from './utils/Redis';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  await connectRedis();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.set('trust proxy', 1);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);

  app.get('/', (req: Request, res: Response): void => {
    res.send('Text Share Backend is running!');
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
