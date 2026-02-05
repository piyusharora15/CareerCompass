import express from "express";
import { requireSignin } from "../middleware/auth.js";
import * as insightController from "../controllers/insightController.js";

const router = express.Router();

// Get cached data for the dashboard
router.get("/my-insight", requireSignin, insightController.getMyInsight);

// Trigger AI generation
router.post("/generate", requireSignin, insightController.generateInsight);

export default router;