import { Router } from "express";
import { requireSignin } from "../middleware/auth.js";
import roadmapController from "../controllers/roadmapController.js";

const router = Router();

// Generation
router.post("/generate", requireSignin, roadmapController.generateRoadmap);

// Data Retrieval
router.get("/my-roadmap", requireSignin, roadmapController.getMyRoadmap);
router.get("/progress", requireSignin, roadmapController.getProgress);

// State Sync
router.post("/toggle-complete", requireSignin, roadmapController.toggleMilestone);

export default router;