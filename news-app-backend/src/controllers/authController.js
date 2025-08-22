import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PendingReporter from "../models/PendingReporter.js";
import bcrypt from "bcryptjs";

// 🔑 Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🟢 Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.status === "disabled")
      return res
        .status(403)
        .json({ message: "Your account is disabled. Contact admin." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 🟢 Register Reporter (Pending Approval)
export const registerReporter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if already in pending queue
    const existingPending = await PendingReporter.findOne({ email });
    if (existingPending)
      return res
        .status(400)
        .json({ message: "You have already submitted registration." });

    // Check if already in users collection
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const pending = new PendingReporter({
      name,
      email,
      password: hashedPassword,
    });
    await pending.save();

    res.status(201).json({
      message:
        "Registration submitted. Admin verification required. Please try logging in after 24 hours.",
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};
