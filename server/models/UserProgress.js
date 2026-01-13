import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roadmapId: { type: String, required: true }, // The unique ID of the roadmap node/skill
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("UserProgress", userProgressSchema);