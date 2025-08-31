import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

const router = Router();

// @route   POST /users/register
// @desc    Register a new user
// @access  Public
router.route('/register').post(async (req, res) => {
  try {
    const { username, password, industry } = req.body;

    // Simple validation
    if (!username || !password || !industry) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 1. Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with that username already exists.' });
    }

    // 2. Hash the password
    // A salt is random text added to the password before hashing to make it more secure.
    // 10 is the number of "salt rounds" - a good standard for security vs. performance.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user with the hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
      industry
    });

    // 4. Save the user to the database
    const savedUser = await newUser.save();
    res.json({
      msg: 'User registered successfully!',
      user: {
        id: savedUser.id,
        username: savedUser.username
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We will add a login route here later that uses bcrypt.compare() to verify passwords

export default router;