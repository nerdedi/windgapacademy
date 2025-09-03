const express = require("express");
const router = express.Router();

// In-memory store for demo (replace with DB in production)
let userProgress = {};

// Get simulation progress for a user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  res.json(userProgress[userId] || {});
});

// Save simulation progress for a user
router.post("/:userId", express.json(), (req, res) => {
  const { userId } = req.params;
  const progress = req.body;

  if (!progress || typeof progress !== "object") {
    return res.status(400).json({ error: "Invalid progress data" });
  }

  userProgress[userId] = progress;
  res.json({ success: true });
});

module.exports = router;
