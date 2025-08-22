import express from "express";
import ApprovalRequest from "../models/ApprovalRequest.js";
import Article from "../models/Article.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /
 * Reporter submits an article for approval
 */
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      imageUrl,
      externalAuthor,
      source,
      url,
    } = req.body;

    const newRequest = await ApprovalRequest.create({
      reporter: req.user.id,
      articleData: {
        title,
        description: description || "",
        content: content || "",
        category: category || "general",
        imageUrl: imageUrl || "",
        externalAuthor: externalAuthor || null,
        source: source || "local",
        url: url || null,
      },
    });

    res.status(201).json({
      message: "Article submitted for approval",
      request: newRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /my
 * Reporter fetches their submissions
 */
router.get("/my", protect, async (req, res) => {
  try {
    const submissions = await ApprovalRequest.find({ reporter: req.user.id })
      .sort({ createdAt: -1 })
      .populate("reporter", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /
 * Admin fetches all pending approval requests
 */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const requests = await ApprovalRequest.find({ status: "pending" })
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /:id
 * Admin approves or rejects a request
 */
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminMessage } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const request = await ApprovalRequest.findById(req.params.id).populate(
      "reporter",
      "_id name email"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (status === "approved") {
      // Ensure all fields from articleData are applied
      const {
        title,
        description,
        content,
        category,
        imageUrl,
        externalAuthor,
        source,
        url,
      } = request.articleData;

      await Article.create({
        title,
        description,
        content,
        category,
        imageUrl,
        externalAuthor,
        source: source || "local",
        url,
        author: request.reporter._id,
      });
    }

    request.status = status;
    request.adminMessage = adminMessage || "";
    request.approvedBy = req.user.id;
    await request.save();

    res.json({
      message: status === "approved" ? "Article approved" : "Article rejected",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
