const express = require("express");
const router = express.Router();

// Collaboration endpoints
router.get("/groups", async (req, res) => {
  try {
    // Mock collaboration groups
    res.json({
      success: true,
      data: [
        {
          id: 1,
          name: "Study Group A",
          members: 5,
          course: "Financial Literacy",
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Project Team B",
          members: 8,
          course: "Digital Skills",
          createdAt: new Date(),
        },
      ],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collaboration groups",
    });
  }
});

router.post("/groups", async (req, res) => {
  try {
    const { name, course } = req.body;
    // Mock creating a new group
    res.json({
      success: true,
      data: {
        id: Date.now(),
        name,
        course,
        members: 1,
        createdAt: new Date(),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create collaboration group",
    });
  }
});

module.exports = router;
