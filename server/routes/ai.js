import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { requireSignin } from "../middleware/auth.js";

const router = Router();

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This function will find and parse a JSON object from a string that might contain other text.
const parseAiResponse = (rawText) => {
    try {
        const startIndex = rawText.indexOf('{');
        const endIndex = rawText.lastIndexOf('}');
        
        if (startIndex === -1 || endIndex === -1) {
            // THE FIX: We log the bad response to our server console for debugging.
            console.error("--- DEBUG: AI RESPONSE DID NOT CONTAIN JSON ---");
            console.error(rawText);
            // Then we throw the error.
            throw new Error("No valid JSON object found in AI response.");
        }

        const jsonString = rawText.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonString);

    } catch (parseError) {
        console.error("DEBUG: Failed to parse AI response. Raw text:", rawText);
        throw new Error(`AI response was not valid JSON. Parse error: ${parseError.message}`);
    }
};

router.post('/generate-insights', requireSignin, async (req, res) => {
    const { industry, currentRole, desiredRole, skills } = req.body;

    if (!industry || !currentRole || !desiredRole || !skills) {
        return res.status(400).json({ error: 'Missing career profile information.' });
    }

    try {
        // --- THE FIX: A MUCH CLEANER AND MORE ROBUST PROMPT ---
        const prompt = `
            You are a world-class career analyst and senior tech recruiter.
            Your task is to provide a detailed career insights report based on the user's profile.

            User Profile:
            - Industry: "${industry}"
            - Current Role: "${currentRole}"
            - Desired Role: "${desiredRole}"
            - Current Skills: ${skills.join(', ')}

            Instructions for your response:
            1.  Your response MUST be a single, valid JSON object and nothing else.
            2.  Do not include any text, notes, or markdown formatting like \`\`\`json.
            3.  Analyze the user's profile and generate the following insights:
                - **industryTrends**: Provide 2-3 key trends impacting the user's industry.
                - **inDemandSkills**: List 3-5 of the most in-demand technical and soft skills for the user's *desired role*.
                - **skillGapAnalysis**:
                    - **matchedSkills**: List the skills from the user's profile that are relevant to their *desired role*.
                    - **missingSkills**: List 3-4 critical skills for the *desired role* that the user is missing.
                - **actionableFeedback**: Provide a concise, 2-3 sentence paragraph on the most important steps the user should take to transition from their *current role* to their *desired role*.

            Here is the required JSON structure. Populate it with your analysis, do not include the instructions from this prompt in your response:
            {
              "industryTrends": ["First key trend...", "Second key trend..."],
              "inDemandSkills": ["In-demand skill 1...", "In-demand skill 2...", "In-demand skill 3..."],
              "skillGapAnalysis": {
                "matchedSkills": ["Relevant skill 1...", "Relevant skill 2..."],
                "missingSkills": ["Missing skill 1...", "Missing skill 2..."]
              },
              "actionableFeedback": "To bridge the gap, the user should focus on..."
            }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // We log the raw text just in case, for debugging.
        console.log("--- DEBUG: RAW AI RESPONSE ---");
        console.log(text);

        // We use our safe parser.
        const insightsJson = parseAiResponse(text);
        
        res.json(insightsJson);

    } catch (error) {
        // This catch block is still correct and will report errors to the frontend.
        console.error("--- FULL AI ERROR STACK ---", error);
        res.status(500).json({ error: `Server Error: ${error.message}` });
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

// --- Route: Generate Career Insights ---
router.post("/generate-insights", requireSignin, async (req, res) => {
  // We get the user's career profile from the request body.
  const { industry, currentRole, desiredRole, skills } = req.body;

  // We check to make sure all the required data was sent.
  if (!industry || !currentRole || !desiredRole || !skills) {
    return res
      .status(400)
      .json({ error: "Missing career profile information." });
  }

  try {
    // --- The Prompt Engineering ---
    // This is the carefully crafted set of instructions for the Gemini AI.
    const prompt = `
            You are a world-class career analyst and senior tech recruiter. Your task is to provide a detailed career insights report based on the user's profile.

            User Profile:
            - Industry: "${industry}"
            - Current Role: "${currentRole}"
            - Desired Role: "${desiredRole}"
            - Current Skills: ${skills.join(", ")}

            Your response MUST be a single, valid JSON object and nothing else. Do not include any text, notes, or markdown formatting like \`\`\`json.
            
            The JSON object must follow this exact structure:
            {
              "industryTrends": ["Provide a key trend impacting the ${industry} industry.", "Provide a second, different key trend."],
              "inDemandSkills": ["List the top 3 most in-demand technical skills for a ${desiredRole}.", "List the top 2 most important soft skills for that role."],
              "skillGapAnalysis": {
                "matchedSkills": ["Analyze the user's skills and list which ones are a direct match for the ${desiredRole}."],
                "missingSkills": ["Analyze the user's skills and list the 3 most critical skills they are missing for the ${desiredRole}."]
              },
              "actionableFeedback": "To transition from a ${currentRole} to a ${desiredRole}, the user should prioritize the following steps: [Provide a concise, actionable 2-3 sentence paragraph on what they should learn or do next]."
            }
        `;

    // We get the generative model from our configured Gemini client.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });
    // We send the prompt to the AI.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // We get the raw text back from the AI, which should be a JSON string.
    const text = response.text();

    // We parse the JSON string into a real JavaScript object and send it back to the frontend.
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

export default router;
