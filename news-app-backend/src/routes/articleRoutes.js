import express from "express";
import {
  createArticle,
  getArticles,
  syncExternalNews,
} from "../controllers/articleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getArticles); // fetch local + external stored
router.post("/", protect, createArticle); // reporter/admin create
router.post("/sync", protect, adminOnly, syncExternalNews); // admin pulls from NewsAPI

export default router;
