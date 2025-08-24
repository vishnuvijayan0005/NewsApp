import mongoose from "mongoose";

const approvalRequestSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleData: {
      title: { type: String, required: true },
      description: { type: String, default: "" },
      url: { type: String, default: "" },
      content: { type: String, default: "" },
      category: {
        type: String,
        enum: [
          "all",
          "politics",
          "sports",
          "tech",
          "business",
          "health",
          "general",
          "entertainment",
          "science",
        ],
        default: "general",
      },
      imageUrl: { type: String, default: "" },
      externalAuthor: { type: String, default: null },
      source: {
        type: String,
        enum: ["local", "serpapi"],
        default: "local",
      },
      url: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminMessage: { type: String, default: "" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("ApprovalRequest", approvalRequestSchema);
