const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

const mockUsers = [
  { id: 1, name: "Natalie Erdedi", role: "trainer" },
  { id: 2, name: "Jin Young Lee", role: "coordinator" },
  { id: 3, name: "Shannon O'Shea", role: "support" },
];

// GET all users (admin only)
router.get("/", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    console.warn(`Unauthorized user tried to access user list: ${req.user.username}`);
    return res.sendStatus(403);
  }
  res.json(mockUsers);
});

// POST create user (admin only)
router.post("/", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    console.warn(`Unauthorized user tried to create user: ${req.user.username}`);
    return res.sendStatus(403);
  }
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Missing name or role" });
  }
  // Simulate user creation
  res.status(201).json({ message: "User created", user: { name, role } });
});

module.exports = router;
