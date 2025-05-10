import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import * as EmailService from './emailService';
import * as TimeConstants from '../utils/timeConstants';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

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
  const { emailToken, emailTokenExpiry } = generateEmailToken(60);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
        },
      });

      await tx.emailToken.create({
        data: {
          tokenHash: hash(emailToken),
          type: 'VERIFY_EMAIL',
          expiresAt: emailTokenExpiry,
          userId: user.id,
        },
      });
    });

    const verificationLink = constructVerifyEmailLink(emailToken);
    await EmailService.sendSignupVerificationEmail(email, verificationLink);

    res.status(200).json({ message: 'Signup successful, check your email to verify the account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
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
    const token = await prisma.emailToken.findFirst({
      where: { userId: user.id, type: 'VERIFY_EMAIL', expiresAt: { gt: new Date() } },
    });
    // there is no verify email token or there is an expired email token, issue a new one
    if (!token) {
      const { emailToken, emailTokenExpiry } = generateEmailToken(60);
      const verificationLink = constructVerifyEmailLink(emailToken);
      await prisma.emailToken.create({
        data: {
          tokenHash: hash(emailToken),
          type: 'VERIFY_EMAIL',
          expiresAt: emailTokenExpiry,
          userId: user.id,
        },
      });

      await EmailService.sendSignupVerificationEmailExpired(email, verificationLink);
    }

    res.status(403).json({
      error: 'Your email is not verified. Please check your inbox for the verification link.',
    });
    return;
  }

  const { userAgent, ipAddress, fingerprint } = getDeviceIdentifier(req);
  const device = await prisma.device.findFirst({
    where: {
      userId: user.id,
      deviceHash: hash(userAgent + ipAddress + fingerprint),
      expiresAt: { gt: new Date() },
    },
  });

  // login from new device
  if (!device) {
    const { emailToken, emailTokenExpiry } = generateEmailToken(15);
    const verificationLink = constructVerifyLoginLink(emailToken);
    await prisma.emailToken.create({
      data: {
        tokenHash: hash(emailToken),
        type: 'VERIFY_NEW_DEVICE',
        expiresAt: emailTokenExpiry,
        userId: user.id,
      },
    });

    await EmailService.sendLoginVerificationEmail(email, verificationLink, ipAddress, userAgent);
    res
      .status(403)
      .json({ error: 'New login detected. Check your inbox for the verification link.' });
    return;
  }

  const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: '7d',
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hash(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * TimeConstants.ONE_DAY),
      deviceId: device.id,
    },
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    maxAge: 7 * TimeConstants.ONE_DAY,
  });

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

  const emailToken = await prisma.emailToken.findFirst({
    where: {
      tokenHash: hash(token),
      expiresAt: { gt: new Date() },
      type: 'VERIFY_EMAIL',
    },
  });

  if (!emailToken) {
    res
      .status(400)
      .json({ error: 'Token invalid or expired. Please login again to generate a new token' });
    return;
  }

  await prisma.user.update({
    where: {
      id: emailToken.userId,
    },
    data: {
      isVerified: true,
    },
  });

  await prisma.emailToken.delete({
    where: {
      userId: emailToken.userId,
      id: emailToken.id,
    },
  });

  res.json({ message: 'Email verified successfully!' });
}

export async function verifyLogin(req: Request, res: Response) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  const emailToken = await prisma.emailToken.findFirst({
    where: {
      tokenHash: hash(token),
      expiresAt: { gt: new Date() },
      type: 'VERIFY_NEW_DEVICE',
    },
  });

  if (!emailToken) {
    res
      .status(400)
      .json({ error: 'Token invalid or expired. Please login again to generate a new token' });
    return;
  }
  const { userAgent, ipAddress, fingerprint } = getDeviceIdentifier(req);
  await prisma.device.create({
    data: {
      userId: emailToken.userId,
      deviceHash: hash(userAgent + ipAddress + fingerprint),
      expiresAt: new Date(Date.now() + 30 * TimeConstants.ONE_DAY),
    },
  });

  await prisma.user.update({
    where: { id: emailToken.userId },
    data: {
      isVerified: true,
    },
  });

  await prisma.emailToken.delete({
    where: {
      userId: emailToken.userId,
      id: emailToken.id,
    },
  });

  res.json({ message: 'Email verified successfully!' });
}

export async function refreshToken(req: Request, res: Response) {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    res.status(401).json({ error: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as {
      userId: string;
      email: string;
    };

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.userId,
        tokenHash: hash(oldRefreshToken),
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      res.status(403).json({ error: 'Refresh token invalid or expired' });
      return;
    }
    // token is valid
    await prisma.refreshToken.deleteMany({
      where: {
        userId: decoded.userId,
        tokenHash: hash(oldRefreshToken),
      },
    });

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      REFRESH_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // TODO: Handle case where old refresh token is valid but device hash not found in DB
    // await prisma.refreshToken.create({
    //   data: {
    //     tokenHash: hash(newRefreshToken),
    //     userId: decoded.userId,
    //     expiresAt: new Date(Date.now() + 7 * TimeConstants.ONE_DAY),
    //   },
    // });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
      maxAge: 7 * TimeConstants.ONE_DAY,
    });

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      message: 'Access token refreshed',
      token: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ error: 'Something went wrong' });
    console.error(error);
  }
}

export async function logoutUser(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash: hash(refreshToken),
      },
    });
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully ' });
}

export async function forgotPassword(req: Request, res: Response) {}
export async function resetPassword(req: Request, res: Response) {}
export async function updatePassword(req: Request, res: Response) {}

function generateEmailToken(expiryInMinutes: number): {
  emailToken: string;
  emailTokenExpiry: Date;
} {
  const emailToken = randomBytes(32).toString('hex');
  const emailTokenExpiry = new Date(Date.now() + expiryInMinutes * TimeConstants.ONE_MINUTE);
  return { emailToken, emailTokenExpiry };
}

function constructVerifyEmailLink(token: string): string {
  return `${API_BASE_URL}/api/auth/verify-email?token=${token}`;
}

function constructVerifyLoginLink(token: string): string {
  return `${API_BASE_URL}/api/auth/verify-login?token=${token}`;
}

function hash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function getDeviceIdentifier(req: Request) {
  const userAgent: string = req.get('User-Agent') || '';
  const ipAddress: string = req.ip || '';
  const fingerprint: string = req.body.fingerprint || '';
  return { userAgent, ipAddress, fingerprint };
}
