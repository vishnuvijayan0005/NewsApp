import express from "express";
import {
  addReporter, // keep for manual add
  toggleReporterStatus,
  deleteReporter,
  getAllNews,
  deleteNews,
  getAllReporters,
  getPendingReporters,
  approveReporter,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Reporter Management
router.get("/reporters", protect, adminOnly, getAllReporters);
router.post("/reporters", protect, adminOnly, addReporter);
router.patch("/reporters/:id/toggle", protect, adminOnly, toggleReporterStatus);
router.delete("/reporters/:id", protect, adminOnly, deleteReporter);

// Pending Reporter Management
// Pending Reporter Management
router.get("/pending-reporters", protect, adminOnly, getPendingReporters);
router.patch("/pending-reporters/:id", protect, adminOnly, approveReporter);

// News Management
router.get("/news", protect, adminOnly, getAllNews);
router.delete("/news/:id", protect, adminOnly, deleteNews);

export default router;
