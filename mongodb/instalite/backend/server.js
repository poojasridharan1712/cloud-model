require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "InstaLite API is running" });
});

// Health check that reports DB state
app.get("/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    database: states[mongoose.connection.readyState] || "unknown",
  });
});

// Routes
app.use("/posts", postsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler (also catches Multer errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res
      .status(400)
      .json({ success: false, message: err.message || "Something went wrong" });
  }
  next();
});

const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI || MONGO_URI.includes("<") || MONGO_URI.includes("username")) {
    console.error("\n[MongoDB] MONGO_URI is missing or still a placeholder.");
    console.error("[MongoDB] Open backend/.env and paste your real MongoDB Atlas connection string.");
    console.error("[MongoDB] The server will still start, but post data will not be saved.\n");
  } else {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("[MongoDB] Connected to MongoDB Atlas successfully.");
    } catch (err) {
      console.error("[MongoDB] Connection failed:", err.message);
      console.error("[MongoDB] Check your connection string, password, and Atlas IP access list.");
    }
  }

  app.listen(PORT, () => {
    console.log(`[Server] InstaLite API running on http://localhost:${PORT}`);
    console.log(`[Server] Images served from http://localhost:${PORT}/uploads`);
  });
}

start();
