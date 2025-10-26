import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import 'dotenv/config';
import { requireSignin } from '../middleware/auth.js';

const router = Router();

// @route   POST /users/signup
// @desc    Register a new user
// @access  Public
router.route('/signup').post(async (req, res) => {
   try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json('User created successfully!');
    } catch (error) {
        res.status(400).json('Error: ' + error.message);
    }
});

// --- User Login ---
router.route('/login').post(async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("Wrong password");
        }
        
        // Create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '120d' });
        res.status(200).json({ token, user: { id: user._id, username: user.username } });

    } catch (error) {
        res.status(500).json('Error: ' + error.message);
    }
});

// --- Google OAuth Routes ---

// 1. Initial request to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// 2. Google's callback URL
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        // Successful authentication, req.user is available
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Redirect to the frontend, passing the token as a query parameter
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

// --- Route: Get Logged-In User's Data ---
// This route is protected by our 'requireSignin' middleware.
router.get('/me', requireSignin, async (req, res) => {
    try {
        // 'req.auth.id' comes from our middleware after it decodes the JWT.
        // We find the user in the database but use '.select("-password")' to exclude their hashed password from the response for security.
        const user = await User.findById(req.auth.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // We send the full user object back to the frontend.
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- Route: Create or Update User's Career Profile ---
// This route is also protected.
router.post('/profile', requireSignin, async (req, res) => {
    try {
        // We get the career details from the request body (sent from our onboarding form).
        const { industry, currentRole, desiredRole, skills } = req.body;
        // We find the user by their ID and update their 'careerProfile' field with the new data.
        // '{ new: true }' ensures that the updated user document is returned.
        const updatedUser = await User.findByIdAndUpdate(
            req.auth.id,
            { careerProfile: { industry, currentRole, desiredRole, skills } },
            { new: true }
        ).select('-password');

        // We send back the updated user profile.
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;