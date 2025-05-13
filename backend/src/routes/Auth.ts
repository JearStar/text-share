import express from 'express';
import * as AuthService from '../services/AuthService';
import rateLimit from 'express-rate-limit';
import { verifyAccessToken } from '../middleware/Auth';

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many password reset requests, please try again later',
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many login attempts, please try again later',
});

const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many token refresh attempts, please try again later',
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many signups, please try again later',
});

const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many verify email requests, please try again later',
});

const verifyLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many verify login requests, please try again later',
});

// Public Routes
router.post('/forgot-password', forgotPasswordLimiter, AuthService.forgotPassword);
router.post('/login', loginLimiter, AuthService.loginUser);
router.post('/refresh-token', refreshTokenLimiter, AuthService.refreshToken);
router.post('/reset-password', AuthService.resetPassword);
router.post('/signup', signupLimiter, AuthService.signupUser);
router.get('/verify-email', verifyEmailLimiter, AuthService.verifyEmail);
router.get('/verify-login', verifyLoginLimiter, AuthService.verifyLogin);

// Private Routes
router.post('/logout', verifyAccessToken, AuthService.logoutUser);
router.post('/update-password', verifyAccessToken, AuthService.updatePassword);

export default router;
