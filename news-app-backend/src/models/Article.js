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
    imageUrl: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ external news won’t break
    },
    source: {
      type: String,
      enum: ["local", "serpapi"], // ✅ only local/serpapi allowed
      default: "local",
    },
    url: { type: String }, // ✅ store actual external article link
  },
  { timestamps: true }
);

// prevent duplicate articles by url + source
articleSchema.index({ url: 1, source: 1 }, { unique: true });

export default mongoose.model("Article", articleSchema);
