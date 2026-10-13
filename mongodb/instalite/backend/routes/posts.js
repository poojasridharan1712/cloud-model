const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Post = require("../models/Post");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function removeFile(imageUrl) {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(uploadDir, filename);
  fs.unlink(filePath, () => {});
}

// GET /posts - fetch all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

// POST /posts - create a post with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { username, caption } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }
    if (!username || !username.trim()) {
      removeFile(req.file.filename);
      return res
        .status(400)
        .json({ success: false, message: "Username is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const post = await Post.create({
      username: username.trim(),
      caption: caption || "",
      imageUrl,
    });

    res.status(201).json({ success: true, message: "Post created", post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

// PUT /posts/:id - update caption
router.put("/:id", async (req, res) => {
  try {
    const { caption } = req.body;
    if (caption === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Caption is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { caption: caption.trim() },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Caption updated", post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
});

// DELETE /posts/:id - delete a post
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    removeFile(post.imageUrl);
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
});

module.exports = router;
