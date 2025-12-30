import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // per user, per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "AI usage limit reached. Please try again later.",
  },
});