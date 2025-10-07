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

// --- Route for Resume Bullet Points ---
router.route("/generate-resume-bullets").post(async (req, res) => {
  const { accomplishment, skills } = req.body;

  if (!accomplishment || !skills) {
    return res
      .status(400)
      .json({ error: "Missing required fields: accomplishment, skills" });
  }
  try {
    const prompt = `
    You are an expert career analyst and tech recruiter for a top-tier company.
    Based on the following user profile, generate a detailed career insights report.

    User Profile:
    - Industry: "${industry}"
    - Current Role: "${currentRole}"
    - Desired Role: "${desiredRole}"
    - Current Skills: ${skills.join(", ")}

    Your response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.
    The JSON object must have the following structure:
    {
      "industryTrends": ["A key trend in ${industry} is...", "Another trend is..."],
      "inDemandSkills": ["For a ${desiredRole}, the most in-demand skills are...", "Also important is..."],
      "skillGapAnalysis": {
        "matchedSkills": ["List skills the user has that are relevant for the desired role"],
        "missingSkills": ["List critical skills for the desired role that the user does not have"]
      },
      "actionableFeedback": "To bridge the gap from a ${currentRole} to a ${desiredRole}, the user should focus on..."
    }
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ bullets: text.split("\n").filter((b) => b.startsWith("*")) });
  } catch (error) {
    console.error("Error generating resume bullets:", error);
    res.status(500).json({ error: "Failed to generate resume bullets" });
  }
});

// --- Route for Cover Letter ---
router.route("/generate-cover-letter").post(async (req, res) => {
  const { jobDescription, userSkills, companyName } = req.body;

  if (!jobDescription || !userSkills || !companyName) {
    return res.status(400).json({
      error: "Missing required fields: jobDescription, userSkills, companyName",
    });
  }

  try {
    const prompt = `
            You are a world-class professional career coach. Your task is to write a compelling and tailored cover letter for a job applicant.
            **Instructions:**
            1.  Analyze the provided Job Description to understand the key requirements, responsibilities, and desired qualifications.
            2.  Use the applicant's skills to highlight how they are a perfect match for the role.
            3.  The tone should be professional, confident, and enthusiastic.
            4.  Structure the letter with a clear introduction, body, and conclusion. Do not include placeholder names or addresses like "[Your Name]". Start directly with "Dear Hiring Manager,".
            5.  Keep the entire cover letter concise, ideally around 3-4 paragraphs.
            **Job Details:**
            - **Company Name:** ${companyName}
            - **Job Description:** "${jobDescription}"
            **Applicant's Key Skills:**
            - ${userSkills}
            Now, write the cover letter.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ coverLetter: text });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

export default router;
