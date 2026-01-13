import { Router } from "express";
import { requireSignin } from "../middleware/auth.js";
import generateWithGemini from "../utils/gemini.js";
import UserProgress from "../models/UserProgress.js";
import Roadmap from "../models/Roadmap.js";

const router = Router();

// 1. Generate AND Save Roadmap to DB
router.post("/generate", requireSignin, async (req, res) => {
  const { missingSkills, desiredRole } = req.body;

  const prompt = `
    Task: Generate a professional learning roadmap for a ${desiredRole}.
    Target Skills to bridge: ${missingSkills.join(", ")}.
    
    Return a JSON array of Milestones. 
    Each Milestone MUST follow this schema exactly:
    {
      "id": "string (lowercase-slug-of-skill)",
      "label": "string (readable skill name)",
      "difficulty": "Beginner | Intermediate | Advanced",
      "resources": [{"title": "string", "url": "url_string"}],
      "subtasks": ["string (concept 1)", "string (concept 2)"]
    }

    Rules: 
    1. Use real documentation URLs (MDN, Official Docs, or reputable blogs).
    2. Provide at least 5 milestones.
    3. Return ONLY valid JSON. No conversational text.
  `;

  try {
    const rawResponse = await generateWithGemini(prompt);
    const roadmapData = JSON.parse(rawResponse);

    // Save or Update the roadmap in MongoDB for persistence
    const savedRoadmap = await Roadmap.findOneAndUpdate(
      { user: req.auth.id },
      { 
        milestones: roadmapData, 
        desiredRole: desiredRole,
        lastUpdated: new Date() 
      },
      { upsert: true, new: true }
    );

    res.json(savedRoadmap.milestones);
  } catch (err) {
    console.error("Roadmap Generation Error:", err);
    res.status(500).json({ error: "Roadmap Architect failed. Please try again." });
  }
});

// 2. Fetch Existing Roadmap (The Refresh Fix)
router.get("/my-roadmap", requireSignin, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ user: req.auth.id });
    if (!roadmap) return res.json([]); 
    res.json(roadmap.milestones);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// 3. Mark node as complete
router.post("/toggle-complete", requireSignin, async (req, res) => {
  const { nodeId } = req.body;
  try {
    const existing = await UserProgress.findOne({ user: req.auth.id, roadmapId: nodeId });
    
    if (existing) {
      await UserProgress.deleteOne({ _id: existing._id });
      return res.json({ completed: false });
    } else {
      const newProgress = new UserProgress({ 
        user: req.auth.id, 
        roadmapId: nodeId, 
        completed: true, 
        completedAt: new Date() 
      });
      await newProgress.save();
      return res.json({ completed: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// 4. Get all completed node IDs
router.get("/progress", requireSignin, async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.auth.id });
    res.json(progress.map(p => p.roadmapId));
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;