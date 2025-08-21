import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import cors from "cors";
import { startCronJobs } from "./utils/cronJobs.js";
import adminRoutes from "./routes/adminRoutes.js";

// ...

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you’re using cookies/auth headers
  })
);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCronJobs();
});
