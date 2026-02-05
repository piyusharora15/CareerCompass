import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    desiredRole: {
      type: String,
      required: true,
    },
    milestones: {
      type: Array,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Roadmap", roadmapSchema);