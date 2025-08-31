import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const router = Router();

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

router.route("/generate-resume-content").post(async (req, res) => {
  const { industry, skills } = req.body;

  try {
    const prompt = `You are an expert career coach and resume writer. Generate a concise and impactful professional summary for a resume. The candidate is in the ${industry} industry and has the following skills: ${skills}. The summary should be 3-4 sentences long and optimized for Applicant Tracking Systems (ATS).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
