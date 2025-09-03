const express = require("express");
const router = express.Router();

// GET all assignments
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Math Assignment" },
    { id: 2, title: "Science Project" },
  ]);
});

// POST create assignment
router.post("/", (req, res) => {
  // Add assignment creation logic
  res.status(201).json({ message: "Assignment created" });
});

module.exports = router;
