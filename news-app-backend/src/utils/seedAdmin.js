import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      console.log("✅ Admin already exists:", exists.email);
      process.exit();
    }

    // ❌ no bcrypt.hash here
    const admin = await User.create({
      name: "Admin",
      email: "admin@newsapp.local",
      password: "Admin@123", // will be hashed by User model
      role: "admin",
    });

    console.log("🎉 Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
