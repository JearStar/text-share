import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './lib/prisma';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.send('Text Share Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
