const express = require("express");

const router = express.Router();
const authenticateToken = require("../middleware/auth");

// GET all users (admin only)
router.get("/", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  res.json([
    { id: 1, name: "Admin", role: "admin" },
    { id: 2, name: "Student", role: "student" },
  ]);
});

// POST create user (admin only)
router.post("/", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  // Add user creation logic
  res.status(201).json({ message: "User created" });
});

module.exports = router;
