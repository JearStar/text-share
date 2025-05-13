import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token is required.' });
    return;
  }

  try {
    req.user = jwt.verify(token, ACCESS_SECRET) as { userId: string; email: string };
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid or expired access token' });
  }
}
