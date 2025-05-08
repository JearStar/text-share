import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { Resend } from 'resend';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;

export async function signupUser(req: Request, res: Response) {
  const { email, password, name } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = generateToken();
  const tokenExpires = generateTokenExpiry();

  try {
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        verificationToken: hashToken(verificationToken),
        tokenExpires: tokenExpires,
      },
    });
  } catch (error) {
    res.json({ error: error });
    return;
  }

  const verificationLink = constructVerificationLink(verificationToken);

  const resend = new Resend(RESEND_API_KEY);

  await resend.emails.send({
    from: 'test@resend.dev',
    to: email,
    subject: 'Account Verification',
    html: `<p>Welcome to Text Share! Please verify your email with the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  });
  res.status(200).json({ message: 'Signup successful, check your email to verify the account.' });
}

export async function loginUser(req: Request, res: Response) {
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
    if (user.tokenExpires && new Date(user.tokenExpires) < new Date()) {
      const verificationToken = generateToken();
      const tokenExpires = generateTokenExpiry();
      const verificationLink = constructVerificationLink(verificationToken);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: hashToken(verificationToken),
          tokenExpires: tokenExpires,
        },
      });

      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: 'test@resend.dev',
        to: email,
        subject: 'New Verification Link',
        html: `<p>Your previous verification link has expired. Please use this one: <a href="${verificationLink}">Verify Email</a></p>`,
      });
    }
    res.status(403).json({
      error: 'Your email is not verified. Please check your inbox for the verification link.'
    });
    return;
  }

  const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json({
    message: 'Logged in successfully',
    token: accessToken,
  });
}

export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashToken(token),
      tokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    res.status(400).json({ error: 'Token invalid or expired. Please login again to generate a new token' });
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
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string; email: string };

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Access token refreshed',
      token: newAccessToken
    });

  } catch (err) {
    res.status(403).json({ error: 'Something went wrong' });
    console.log(err);
  }
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

function generateTokenExpiry(): Date {
  return new Date(Date.now() + 1000 * 60 * 60);
}

function constructVerificationLink(verificationToken: string): string {
  return `${API_BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
}

function hashToken(verificationToken: string): string {
  return createHash('sha256').update(verificationToken).digest('hex');
}