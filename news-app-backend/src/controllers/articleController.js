import ApprovalRequest from "../models/ApprovalRequest.js";
import Article from "../models/Article.js";
import {
  fetchSerapiNews,
  fetchSerapiNewsForAllCategories,
} from "../utils/externalApi.js";

// ✅ Submit article for approval (reporter)
export const submitArticleForApproval = async (req, res) => {
  try {
    const { title, description, url, category, image } = req.body;

    const newRequest = await ApprovalRequest.create({
      reporter: req.user.id,
      articleData: { title, description, url, category, image },
    });

    res.status(201).json({
      message: "Article submitted for approval",
      request: newRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Fetch approved articles only
export const getArticles = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const filter = category ? { category } : {};

    const skip = (page - 1) * limit;

    // ✅ Fetch paginated articles
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name");

    const total = await Article.countDocuments(filter);

    const formatted = articles.map((a) => ({
      ...a.toObject(),
      displayAuthor: a.author?.name || a.externalAuthor || "Unknown",
    }));

    res.json({
      articles: formatted,
      hasMore: skip + articles.length < total, // ✅ useful for frontend Load More
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: err.message });
  }
};

//  Sync news from SerpAPI (single category)
export const syncSerapiNews = async (req, res) => {
  try {
    const { category = "general" } = req.body;
    const added = await fetchSerapiNews(category);
    res.json({
      message: "SerpAPI sync complete",
      category,
      count: added.length,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Sync news from SerpAPI (all categories)
export const syncSerapiNewsAll = async (_req, res) => {
  try {
    const total = await fetchSerapiNewsForAllCategories();
    res.json({
      message: "SerpAPI sync (all categories) complete",
      total,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
