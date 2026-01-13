import mongoose from "mongoose";

const careerInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    industry: String,
    currentRole: String,
    targetRole: {
      type: String,
      required: true,
    },
    skills: [String],

    industryTrends: [String],
    inDemandSkills: [String],
    skillGapAnalysis: {
      matchedSkills: [String],
      missingSkills: [String],
    },
    actionableFeedback: String,

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

careerInsightSchema.index(
  { user: 1, targetRole: 1 },
  { unique: true }
);

export default mongoose.model("CareerInsight", careerInsightSchema);