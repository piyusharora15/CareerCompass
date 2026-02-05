import express from 'express';
import passport from 'passport';
import { requireSignin } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// --- Google OAuth Routes ---
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  userController.googleCallback
);

// --- Profile & Data Routes ---
router.get('/me', requireSignin, userController.getMe);
router.post('/profile', requireSignin, userController.updateProfile);

export default router;