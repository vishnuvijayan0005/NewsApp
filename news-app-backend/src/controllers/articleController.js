import Article from "../models/Article.js";
import {
  fetchSerapiNews,
  fetchSerapiNewsForAllCategories,
} from "../utils/externalApi.js";

// Create local article (reporter/admin)
export const createArticle = async (req, res) => {
  try {
    const { title, description, category, image } = req.body;

    const articleData = {
      title,
      description,
      category,
      author: req.user._id,
      source: "local",
    };

    // If base64 image present
    if (image) {
      articleData.imageUrl = image; // ✅ save base64 directly
    }

    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get stored articles (optionally by category)
export const getArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const articles = await Article.find(filter)
      .populate("author", "name email role")
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manually sync a single category (admin-only)
export const syncSerapiNews = async (req, res) => {
  try {
    const { category = "general" } = req.body;
    const added = await fetchSerapiNews(category);
    res.json({
      message: "SerpAPI sync complete",
      category,
      count: added.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manually sync all categories (admin-only)
export const syncSerapiNewsAll = async (_req, res) => {
  try {
    const total = await fetchSerapiNewsForAllCategories();
    res.json({
      message: "SerpAPI sync (all categories) complete",
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
