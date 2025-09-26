const express = require("express");
const router = express.Router();

// Notifications endpoints
router.get("/", async (req, res) => {
  try {
    // Mock notifications data
    res.json({
      success: true,
      data: [
        {
          id: 1,
          type: "assignment",
          title: "New Assignment Available",
          message: "You have a new assignment in Financial Literacy",
          read: false,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          id: 2,
          type: "achievement",
          title: "Achievement Unlocked!",
          message: "You completed the Digital Skills course",
          read: true,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
        },
      ],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

router.post("/mark-read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Mock marking notification as read
    res.json({
      success: true,
      message: `Notification ${id} marked as read`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});

module.exports = router;
