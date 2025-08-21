import express from "express";
import {
  createArticle,
  getArticles,
  syncSerapiNews,
  syncSerapiNewsAll,
} from "../controllers/articleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All stored articles (local + external already in DB)
// Optional: /api/articles?category=technology
router.get("/", getArticles);

// Reporter/Admin create local article
router.post("/", protect, createArticle);

// Admin-only: manual sync for one category
router.post("/sync-serapi", protect, adminOnly, syncSerapiNews);

// Admin-only: manual sync for all categories
router.post("/sync-serapi-all", protect, adminOnly, syncSerapiNewsAll);

// 🔹 NEW: shortcut route used by AdminDashboard.jsx
router.post("/sync", protect, adminOnly, syncSerapiNewsAll);

export default router;
