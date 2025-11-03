import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; // Handles .env variables
import passport from 'passport';
import './config/passport-setup.js'; // Passport configuration

// Import routes
import usersRouter from './routes/users.js';
import aiRouter from './routes/ai.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(passport.initialize());

// Database Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Use Routes
app.use('/users', usersRouter);
app.use('/ai', aiRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});