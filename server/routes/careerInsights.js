import express from "express";
import { requireSignin } from "../middleware/auth.js";
import CareerInsight from "../models/CareerInsight.js";
import generateWithGemini from "../utils/gemini.js";

const router = express.Router();

/**
 * DASHBOARD LOAD (Static/Cached)
 * This route is called when the user opens the dashboard.
 * It ONLY looks at the database. 0% AI usage here.
 */
router.get("/my-insight", requireSignin, async (req, res) => {
  try {
    const { role } = req.query;
    // We search the DB for the user's specific role insight
    const cachedInsight = await CareerInsight.findOne({ 
      user: req.auth.id, 
      targetRole: role 
    });

    // If it exists, send it. If not, the frontend will show a 'Generate' button.
    res.json(cachedInsight); 
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * REGENERATE / INITIAL ONBOARDING (AI Call)
 * This is the ONLY route that calls the gemini utility.
 */
router.post("/generate", requireSignin, async (req, res) => {
  const { industry, currentRole, desiredRole, skills } = req.body;

  try {
    const prompt = `Return ONLY a valid JSON object. No intro, no backticks. 
    Format: {
      "industryTrends": ["trend1", "trend2"],
      "inDemandSkills": ["skill1", "skill2"],
      "skillGapAnalysis": { "matchedSkills": [], "missingSkills": [] },
      "actionableFeedback": "detailed roadmap..."
    } 
    Context: Industry: ${industry}, Target: ${desiredRole}, Current skills: ${skills.join(", ")}`;

    const aiData = await generateWithGemini(prompt);
    
    // DEFENSIVE PARSING: Removes ```json or other fluff Gemini might add
    const cleaned = aiData.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const updatedInsight = await CareerInsight.findOneAndUpdate(
      { user: req.auth.id, targetRole: desiredRole },
      { ...parsed, user: req.auth.id, industry, currentRole, targetRole: desiredRole, skills },
      { upsert: true, new: true }
    );

    res.json(updatedInsight);
  } catch (err) {
    console.error("AI ROUTE ERROR:", err);
    res.status(500).json({ error: "AI failed to generate. Please check API Key or JSON format." });
  }
});

export default router;