import express from "express";
import {
  createArticle,
  getArticles,
  syncSerapiNews,
  syncSerapiNewsAll,
} from "../controllers/articleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Reporter/Admin create local article with image (base64)
router.post("/", protect, createArticle);

// Other routes unchanged
router.get("/", getArticles);
router.post("/sync-serapi", protect, adminOnly, syncSerapiNews);
router.post("/sync-serapi-all", protect, adminOnly, syncSerapiNewsAll);
router.post("/sync", protect, adminOnly, syncSerapiNewsAll);

export default router;
