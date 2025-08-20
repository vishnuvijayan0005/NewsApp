import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String },
    category: {
      type: String,
      enum: ["politics", "sports", "tech", "business", "health", "general"],
      default: "general",
    },
    imageUrl: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: { type: String, default: "local" },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
