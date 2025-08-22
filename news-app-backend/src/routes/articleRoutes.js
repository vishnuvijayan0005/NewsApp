import express from "express";
import {
  submitArticleForApproval, // ✅ renamed
  getArticles,
  syncSerapiNews,
  syncSerapiNewsAll,
} from "../controllers/articleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Reporter submits article for admin approval
router.post("/", protect, submitArticleForApproval);

// ✅ Get approved articles (anyone can fetch)
router.get("/", getArticles);

// ✅ Sync external news (single category, admin only)
router.post("/sync-serapi", protect, adminOnly, syncSerapiNews);

// ✅ Sync external news (all categories, admin only)
router.post("/sync-serapi-all", protect, adminOnly, syncSerapiNewsAll);
router.post("/sync", protect, adminOnly, syncSerapiNewsAll);

export default router;
