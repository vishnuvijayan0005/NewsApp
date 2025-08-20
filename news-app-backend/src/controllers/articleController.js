import Article from "../models/Article.js";
import { fetchExternalNews } from "../utils/externalApi.js";

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user._id,
      source: "local",
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// ✅ Now stores fetched news in DB
export const syncExternalNews = async (req, res) => {
  try {
    const articles = await fetchExternalNews();
    res.json({ message: "External news synced", count: articles.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
