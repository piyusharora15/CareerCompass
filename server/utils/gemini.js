import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using the specified Gemini 3 Flash model
const MODEL = "gemini-3-flash-preview";

export const generateWithGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      // Forces the model to respond with valid JSON objects
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    if (!text) throw new Error("EMPTY_RESPONSE");
    return text;

  } catch (err) {
    console.log("\n================= GEMINI FAILURE =================");
    console.log(err.message || err);
    console.log("=================================================\n");
    throw new Error("AI_SERVICE_UNAVAILABLE");
  }
};

export default generateWithGemini;