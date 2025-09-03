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
router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  userProgress[userId] = req.body;
  res.json({ success: true });
});

module.exports = router;
