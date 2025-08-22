import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ------------------ Environment & DB ------------------
dotenv.config();
connectDB();

// ------------------ Express App ------------------
const app = express();

// Body parser with increased limit for base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Enable CORS for frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ------------------ API Routes ------------------
// Admin routes (includes reporter approval, toggling, etc.)
app.use("/api/admin", adminRoutes);

// Auth routes (login + pending reporter registration)
app.use("/api/auth", authRoutes);

// Article management routes
app.use("/api/articles", articleRoutes);

// Approval requests routes
app.use("/api/approval-requests", approvalRoutes);

// ------------------ Serve Static Uploads ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
