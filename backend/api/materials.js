const express = require("express");
const router = express.Router();

// GET all study materials
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Algebra Book" },
    { id: 2, title: "Biology Notes" },
  ]);
});

// POST create material (public, with validation)
router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  // Simulate material creation
  res.status(201).json({ message: "Material created", material: { title } });
});

module.exports = router;
