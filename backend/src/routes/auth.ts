import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

const JWT_SECRET = 'meow meow key'

router.post('/signup', async (req: Request, res: Response) => {
  console.log("here")
  const { email, password, name } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) {
    res.status(400).json({ error: 'Email already in use' });
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    }
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({
    message: 'User created successfully',
    token
  })
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password' });
    return
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email},
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Logged in successfully',
    token
  });
});

export default router;