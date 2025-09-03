const express = require("express");
const router = express.Router();

// GET all study materials
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Algebra Book" },
    { id: 2, title: "Biology Notes" },
  ]);
});

// POST create material
router.post("/", (req, res) => {
  // Add material creation logic
  res.status(201).json({ message: "Material created" });
});

module.exports = router;
