import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const router = express.Router();

const JWT_SECRET = 'meow meow key';

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = randomBytes(32).toString('hex');
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
        tokenExpires,
      },
    });
  } catch (error) {
    res.json({ error: error });
    return;
  }

  const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'test@resend.dev',
    to: email,
    subject: 'Account Verification',
    html: `<p>Welcome to Text Share! Please verify your email with the following link: ${verificationLink}</p>`,
  });
  res.status(200).json({ message: 'Signup successful, check your email to verify the account.' });
});

router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      tokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    res.status(400).json({ error: 'Token invalid or expired' });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      tokenExpires: null,
    },
  });

  res.json({ message: 'Email verified successfully!' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  if (!user.isVerified) {
    res.status(403).json({ error: 'Please verify your email before logging in' });
    return;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: 'Logged in successfully',
    token,
  });
});

export default router;
