import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import cors from "cors";
// import { startCronJobs } from "./utils/cronJobs.js";
import adminRoutes from "./routes/adminRoutes.js";

// ✅ ES modules: import path and __dirname fix
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// ✅ Increase body size limit to handle larger JSON / base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you’re using cookies/auth headers
  })
);

// ✅ API routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

// ✅ Fix for serving uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // startCronJobs();
});
