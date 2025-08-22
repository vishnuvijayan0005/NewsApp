import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
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
    imageUrl: { type: String }, // ✅ base64 string OR external URL
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    source: {
      type: String,
      enum: ["local", "serpapi"],
      default: "local",
    },
    url: { type: String }, // for external API articles
  },
  { timestamps: true }
);

articleSchema.index({ url: 1, source: 1 }, { unique: true });

export default mongoose.model("Article", articleSchema);
