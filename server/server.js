import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import passport from 'passport';
import './config/passport-setup.js';

// Route Imports
import usersRouter from './routes/users.js';
import careerInsightsRoutes from "./routes/careerInsights.js";
import roadmapRouter from "./routes/roadmap.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Database Connection
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error("❌ ATLAS_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB connection established successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Auth & User Profile
app.use('/users', usersRouter);

// AI Industry Insights
app.use("/career-insights", careerInsightsRoutes);

// Skill Architect & Roadmap
app.use("/api/roadmap", roadmapRouter);

// --- GLOBAL ERROR HANDLING ---

app.use((err, req, res, next) => {
  // Handle JWT Unauthorized Errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  // Handle other Server Errors
  console.error("🔥 Server Error Log:", err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is live on port: ${port}`);
});