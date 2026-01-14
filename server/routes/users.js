import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import 'dotenv/config';
import { requireSignin } from '../middleware/auth.js';

const router = express.Router();

// Synchronize with your frontend login requirements
const TOKEN_EXPIRY = '120d';

// --- User Signup ---
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// --- User Login (Email/Password) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if account is Google-only
    if (!user.password && user.googleId) {
      return res.status(400).json({ message: 'This account is linked with Google. Please login with Google.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    // We return the user object so the frontend can immediately check for onboarding status
    res.status(200).json({
      token,
      user: { 
        id: user._id, 
        username: user.username,
        careerProfile: user.careerProfile // CRITICAL for onboarding redirect logic
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error: ' + error.message });
  }
});

// --- Google OAuth Routes ---

// 1. Initial request to Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// 2. Google's callback URL

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    // Use dynamic redirect for failure
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
      });

      // USE CLIENT_URL FOR PRODUCTION REDIRECT
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (err) {
      console.error("JWT Sign Error:", err);
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/login?error=token_error`);
    }
  }
);

// --- Get Logged-In User's Data ---
router.get('/me', requireSignin, async (req, res) => {
  try {
    // req.auth.id comes from express-jwt middleware
    const user = await User.findById(req.auth.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Create or Update User's Career Profile ---
router.post('/profile', requireSignin, async (req, res) => {
  try {
    const { industry, currentRole, desiredRole, skills } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.auth.id,
      { careerProfile: { industry, currentRole, desiredRole, skills } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;