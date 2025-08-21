import User from "../models/User.js";
import Article from "../models/Article.js";

// ➤ Add Reporter
export const addReporter = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Reporter already exists" });

    const reporter = await User.create({
      name,
      email,
      password,
      role: "reporter",
    });
    res.status(201).json({ message: "Reporter added", reporter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Disable/Enable Reporter
export const toggleReporterStatus = async (req, res) => {
  try {
    const reporter = await User.findById(req.params.id);
    if (!reporter)
      return res.status(404).json({ message: "Reporter not found" });

    reporter.status = reporter.status === "active" ? "disabled" : "active";
    await reporter.save();
    res.json({ message: `Reporter ${reporter.status}`, reporter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Delete Reporter
export const deleteReporter = async (req, res) => {
  try {
    const reporter = await User.findByIdAndDelete(req.params.id);
    if (!reporter)
      return res.status(404).json({ message: "Reporter not found" });
    res.json({ message: "Reporter deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get All News
export const getAllNews = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name email role");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Delete News
export const deleteNews = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ➤ Get All Reporters
export const getAllReporters = async (req, res) => {
  try {
    const reporters = await User.find({ role: "reporter" });
    res.json(reporters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
