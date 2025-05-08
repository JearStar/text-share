import express from 'express';
import * as AuthService from '../services/authService';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many signups, please try again later'
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many login attempts, please try again later'
})

router.post('/signup', signupLimiter, AuthService.signupUser);
router.post('/login', loginLimiter, AuthService.loginUser);
router.get('/verify-email', AuthService.verifyEmail);

export default router;
