const express = require("express");
const router = express.Router();

// Analytics endpoints
router.get("/user-stats", async (req, res) => {
  try {
    // Mock analytics data
    res.json({
      success: true,
      data: {
        totalUsers: 1250,
        activeUsers: 450,
        completionRate: 78.5,
        averageScore: 85.2,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
});

router.get("/course-stats", async (req, res) => {
  try {
    // Mock course analytics
    res.json({
      success: true,
      data: {
        totalCourses: 25,
        popularCourses: [
          { id: 1, name: "Financial Literacy", enrollments: 320 },
          { id: 2, name: "Digital Skills", enrollments: 280 },
          { id: 3, name: "Career Development", enrollments: 245 },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course statistics",
    });
  }
});

module.exports = router;
