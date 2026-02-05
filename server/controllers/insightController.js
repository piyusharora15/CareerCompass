import CareerInsight from "../models/CareerInsight.js";
import generateWithGemini from "../utils/gemini.js";

// --- GET CACHED INSIGHT, it ONLY looks at the database. 0% AI usage here---
export const getMyInsight = async (req, res) => {
  try {
    const { role } = req.query;
    // We search the DB for the user's specific role insight
    const cachedInsight = await CareerInsight.findOne({ 
      user: req.auth.id, 
      targetRole: role 
    });

    // If it exists, send it. If not, the frontend shows the 'Generate' button.
    res.json(cachedInsight); 
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

// --- GENERATE NEW INSIGHT (AI CALL) ---
export const generateInsight = async (req, res) => {
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
    
    // DEFENSIVE PARSING: Sanitizes the AI output
    const cleaned = aiData.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Atomic update: creates if doesn't exist, updates if it does
    const updatedInsight = await CareerInsight.findOneAndUpdate(
      { user: req.auth.id, targetRole: desiredRole },
      { 
        ...parsed, 
        user: req.auth.id, 
        industry, 
        currentRole, 
        targetRole: desiredRole, 
        skills 
      },
      { upsert: true, new: true }
    );

    res.json(updatedInsight);
  } catch (err) {
    console.error("AI CONTROLLER ERROR:", err);
    res.status(500).json({ error: "AI failed to generate. Please check API Key or JSON format." });
  }
};