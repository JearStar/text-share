import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', true);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.send('Text Share Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
