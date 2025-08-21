import express from "express";
import {
  addReporter,
  toggleReporterStatus,
  deleteReporter,
  getAllNews,
  deleteNews,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllReporters } from "../controllers/adminController.js";

const router = express.Router();
// Add this route
router.get("/reporters", protect, adminOnly, getAllReporters);
// Reporter Management
router.post("/reporters", protect, adminOnly, addReporter);
router.patch("/reporters/:id/toggle", protect, adminOnly, toggleReporterStatus);
router.delete("/reporters/:id", protect, adminOnly, deleteReporter);

// News Management
router.get("/news", protect, adminOnly, getAllNews);
router.delete("/news/:id", protect, adminOnly, deleteNews);

export default router;
