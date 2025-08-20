import express from "express";
import { loginUser, registerReporter } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", protect, adminOnly, registerReporter);

export default router;
