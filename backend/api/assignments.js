const express = require("express");
const router = express.Router();

// GET all assignments
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Math Assignment" },
    { id: 2, title: "Science Project" },
  ]);
});

// POST create assignment (restricted to educator/admin)
const authenticateToken = require("../middleware/authenticateToken");
router.post("/", authenticateToken, (req, res) => {
  if (req.user.role !== "educator" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  // Simulate assignment creation
  res.status(201).json({ message: "Assignment created", assignment: { title } });
});

module.exports = router;
