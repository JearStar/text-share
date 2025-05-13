import express from 'express';
import * as AuthService from '../services/AuthService';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many signups, please try again later',
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

// Public Routes
router.post('/signup', signupLimiter, AuthService.signupUser);
router.post('/login', loginLimiter, AuthService.loginUser);
router.get('/verify-email', AuthService.verifyEmail);
router.get('/verify-login', AuthService.verifyLogin);
router.post('/refresh-token', refreshTokenLimiter, AuthService.refreshToken);
router.post('/logout', AuthService.logoutUser);
router.post('/forgot-password', AuthService.forgotPassword);
router.post('/reset-password', AuthService.resetPassword);
router.post('/update-password', AuthService.updatePassword);

export default router;
