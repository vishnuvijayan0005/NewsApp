import express from "express";
import { loginUser, registerReporter } from "../controllers/authController.js";

const router = express.Router();

// 🟢 Reporter self-registration (goes to PendingReporter)
router.post("/register-reporter", registerReporter);

// 🟢 Login
router.post("/login", loginUser);

export default router;
