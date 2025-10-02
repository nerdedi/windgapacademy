# Learning Analytics Integration Plan for Windgap Academy

## Overview

This implementation plan outlines the process for integrating comprehensive learning analytics into the Windgap Academy platform using the Experience API (xAPI) and a Learning Record Store (LRS). This will enable detailed tracking, analysis, and visualization of student learning activities and progress.

## Benefits

- **Deep Insights**: Track detailed learning activities beyond simple completion
- **Personalized Learning**: Data-driven recommendations and adaptive content
- **Progress Tracking**: Comprehensive understanding of student journeys
- **Instructor Support**: Identify struggling students early
- **Continuous Improvement**: Data to refine and optimize curriculum

## Architecture

We'll implement the learning analytics system using the following architecture:

1. **xAPI Statement Generator**:
   - Client-side tracking of learning activities
   - Standard-compliant xAPI statement creation
   - Batched statement sending

2. **Learning Record Store (LRS)**:
   - Data storage for xAPI statements
   - Query API for analytics
   - Data integrity and security

3. **Analytics Dashboard**:
   - Data visualization components
   - Filtering and reporting tools
   - Instructor and student views

## Implementation Steps

### Phase 1: Infrastructure Setup (Week 1)

#### 1.1 Choose LRS Solution

Options:

- **Self-hosted**: [Learning Locker](https://github.com/LearningLocker/learninglocker) (open-source)
- **Cloud-based**: [Watershed LRS](https://watershedlrs.com/) or [Yet Analytics](https://www.yetanalytics.com/)

Decision factors:

- Cost structure
- Scalability needs
- Compliance requirements
- Integration capabilities

#### 1.2 Environment Configuration

- Create necessary environment variables:
  ```
  LRS_ENDPOINT=https://your-lrs-endpoint.com/data/xAPI
  LRS_USERNAME=your_lrs_username
  LRS_PASSWORD=your_lrs_password
  LRS_AUTH_TOKEN=your_lrs_auth_token
  ```

#### 1.3 Install Dependencies

```bash
npm install xapi-js @xapi/xapi --save
```

### Phase 2: Backend Implementation (Week 2)

#### 2.1 Create xAPI Service

```javascript
// /backend/services/xapiService.js

import axios from "axios";

const LRS_ENDPOINT = process.env.LRS_ENDPOINT;
const LRS_AUTH = Buffer.from(`${process.env.LRS_USERNAME}:${process.env.LRS_PASSWORD}`).toString(
  "base64",
);

/**
 * Send xAPI statements to the LRS
 * @param {Array|Object} statements - xAPI statement or array of statements
 * @returns {Promise} - Response from LRS
 */
export const sendStatements = async (statements) => {
  const statementsArray = Array.isArray(statements) ? statements : [statements];

  try {
    const response = await axios.post(LRS_ENDPOINT + "/statements", statementsArray, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${LRS_AUTH}`,
        "X-Experience-API-Version": "1.0.3",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending xAPI statements:", error);
    throw error;
  }
};

/**
 * Query statements from the LRS
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response from LRS
 */
export const queryStatements = async (params = {}) => {
  try {
    const response = await axios.get(LRS_ENDPOINT + "/statements", {
      params,
      headers: {
        Authorization: `Basic ${LRS_AUTH}`,
        "X-Experience-API-Version": "1.0.3",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error querying xAPI statements:", error);
    throw error;
  }
};

/**
 * Get statements for a specific user
 * @param {string} userId - User ID
 * @param {Object} additionalParams - Additional query parameters
 * @returns {Promise} - Response from LRS
 */
export const getUserStatements = async (userId, additionalParams = {}) => {
  const params = {
    agent: JSON.stringify({
      objectType: "Agent",
      account: {
        name: userId,
        homePage: "https://windgapacademy.org",
      },
    }),
    ...additionalParams,
  };

  return queryStatements(params);
};

export default {
  sendStatements,
  queryStatements,
  getUserStatements,
};
```

#### 2.2 Create API Endpoints

```javascript
// /backend/api/analytics.js

import express from "express";
import { verifyToken } from "../middleware/auth";
import xapiService from "../services/xapiService";
import { validateXapiStatement } from "../utils/validators";

const router = express.Router();

// Middleware to ensure only authenticated users can access analytics
router.use(verifyToken);

// Send xAPI statements
router.post("/statements", async (req, res) => {
  try {
    const statements = req.body;

    // Validate statements
    if (Array.isArray(statements)) {
      for (const statement of statements) {
        if (!validateXapiStatement(statement)) {
          return res.status(400).json({ error: "Invalid xAPI statement format" });
        }
      }
    } else if (!validateXapiStatement(statements)) {
      return res.status(400).json({ error: "Invalid xAPI statement format" });
    }

    // Send statements to LRS
    const result = await xapiService.sendStatements(statements);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Query statements
router.get("/statements", async (req, res) => {
  try {
    // Check if user has permission to query statements
    if (!req.user.roles.includes("instructor") && !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await xapiService.queryStatements(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statements for current user
router.get("/my-statements", async (req, res) => {
  try {
    const result = await xapiService.getUserStatements(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get learning analytics dashboard data
router.get("/dashboard/:courseId?", async (req, res) => {
  try {
    // Check if user has permission to view dashboard
    if (!req.user.roles.includes("instructor") && !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Build query parameters
    const params = {
      since: req.query.since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      until: req.query.until || new Date().toISOString(),
    };

    // Add course context if specified
    if (req.params.courseId) {
      params.activity = `https://windgapacademy.org/courses/${req.params.courseId}`;
    }

    const statements = await xapiService.queryStatements(params);

    // Process statements into dashboard format
    const dashboardData = processDashboardData(statements);

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to process statements into dashboard format
function processDashboardData(statements) {
  // Implementation would depend on the specific dashboard requirements
  // This is a placeholder for the actual implementation

  return {
    activityCounts: {
      viewed: statements.statements.filter(
        (s) => s.verb.id === "http://id.tincanapi.com/verb/viewed",
      ).length,
      completed: statements.statements.filter(
        (s) => s.verb.id === "http://adlnet.gov/expapi/verbs/completed",
      ).length,
      attempted: statements.statements.filter(
        (s) => s.verb.id === "http://adlnet.gov/expapi/verbs/attempted",
      ).length,
    },
    timeSpent: calculateTotalTimeSpent(statements.statements),
    progressData: extractProgressData(statements.statements),
    recentActivities: statements.statements.slice(0, 10),
  };
}

export default router;
```

#### 2.3 Create Utility Functions

```javascript
// /backend/utils/validators.js

/**
 * Validate an xAPI statement
 * @param {Object} statement - xAPI statement to validate
 * @returns {boolean} - Whether the statement is valid
 */
export const validateXapiStatement = (statement) => {
  // Basic validation - in a real implementation, this would be more comprehensive
  if (!statement) return false;

  // Check required fields
  if (!statement.actor || !statement.verb || !statement.object) {
    return false;
  }

  // Check actor
  if (
    !statement.actor.objectType ||
    (statement.actor.objectType === "Agent" && !statement.actor.account)
  ) {
    return false;
  }

  // Check verb
  if (!statement.verb.id) {
    return false;
  }

  // Check object
  if (statement.object.objectType === "Activity" && !statement.object.id) {
    return false;
  }

  return true;
};

/**
 * Calculate total time spent based on xAPI statements
 * @param {Array} statements - Array of xAPI statements
 * @returns {number} - Total time spent in seconds
 */
export const calculateTotalTimeSpent = (statements) => {
  let totalSeconds = 0;

  for (const statement of statements) {
    if (statement.result && statement.result.duration) {
      // Parse ISO 8601 duration format
      const durationPattern =
        /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;
      const matches = statement.result.duration.match(durationPattern);

      if (matches) {
        const years = parseInt(matches[1] || 0);
        const months = parseInt(matches[2] || 0);
        const days = parseInt(matches[3] || 0);
        const hours = parseInt(matches[4] || 0);
        const minutes = parseInt(matches[5] || 0);
        const seconds = parseFloat(matches[6] || 0);

        // Approximate conversion
        totalSeconds += years * 31536000; // 365 days
        totalSeconds += months * 2592000; // 30 days
        totalSeconds += days * 86400;
        totalSeconds += hours * 3600;
        totalSeconds += minutes * 60;
        totalSeconds += seconds;
      }
    }
  }

  return totalSeconds;
};

/**
 * Extract progress data from xAPI statements
 * @param {Array} statements - Array of xAPI statements
 * @returns {Object} - Progress data
 */
export const extractProgressData = (statements) => {
  const completionData = {};

  for (const statement of statements) {
    // Look for completed statements
    if (
      statement.verb.id === "http://adlnet.gov/expapi/verbs/completed" &&
      statement.object.objectType === "Activity"
    ) {
      const activityId = statement.object.id;
      const userId = statement.actor.account.name;

      // Group by activity
      if (!completionData[activityId]) {
        completionData[activityId] = {
          activityId,
          activityName: statement.object.definition?.name?.["en-US"] || activityId,
          completedBy: [],
          completionCount: 0,
        };
      }

      // Add user to completions if not already added
      if (!completionData[activityId].completedBy.includes(userId)) {
        completionData[activityId].completedBy.push(userId);
        completionData[activityId].completionCount += 1;
      }
    }
  }

  return Object.values(completionData);
};
```

### Phase 3: Frontend Implementation (Week 3)

#### 3.1 Create xAPI Client

```javascript
// /src/services/xapiClient.js

import axios from "axios";

/**
 * xAPI Client for Windgap Academy
 */
class XapiClient {
  constructor() {
    this.pendingStatements = [];
    this.isSending = false;
    this.baseUrl = "/api/analytics";

    // Send pending statements when user leaves the page
    window.addEventListener("beforeunload", () => this.sendPendingStatements());

    // Send pending statements every 30 seconds
    setInterval(() => this.sendPendingStatements(), 30000);
  }

  /**
   * Create and queue a statement
   * @param {string} verbId - xAPI verb ID
   * @param {Object} activity - Activity object
   * @param {Object} result - Result object (optional)
   * @param {Object} context - Context object (optional)
   */
  track(verbId, activity, result = null, context = null) {
    const user = this.getCurrentUser();

    if (!user) {
      console.warn("Cannot track activity: No user logged in");
      return;
    }

    const statement = {
      actor: {
        objectType: "Agent",
        account: {
          name: user.id,
          homePage: "https://windgapacademy.org",
        },
        name: user.name,
      },
      verb: {
        id: verbId,
        display: { "en-US": this.getVerbDisplay(verbId) },
      },
      object: activity,
      timestamp: new Date().toISOString(),
    };

    if (result) {
      statement.result = result;
    }

    if (context) {
      statement.context = context;
    }

    this.queueStatement(statement);
  }

  /**
   * Queue a statement for sending
   * @param {Object} statement - xAPI statement
   */
  queueStatement(statement) {
    this.pendingStatements.push(statement);

    // If we have enough statements, send them immediately
    if (this.pendingStatements.length >= 5) {
      this.sendPendingStatements();
    }
  }

  /**
   * Send pending statements to the server
   */
  async sendPendingStatements() {
    if (this.pendingStatements.length === 0 || this.isSending) {
      return;
    }

    this.isSending = true;

    try {
      const statementsToSend = [...this.pendingStatements];
      this.pendingStatements = [];

      await axios.post(`${this.baseUrl}/statements`, statementsToSend);
    } catch (error) {
      console.error("Error sending xAPI statements:", error);

      // Put statements back in the queue
      this.pendingStatements = [...this.pendingStatements, ...this.pendingStatements];
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Get the current user from local storage
   * @returns {Object|null} - Current user or null if not logged in
   */
  getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  }

  /**
   * Get verb display text from verb ID
   * @param {string} verbId - xAPI verb ID
   * @returns {string} - Display text for the verb
   */
  getVerbDisplay(verbId) {
    const verbMap = {
      "http://adlnet.gov/expapi/verbs/completed": "completed",
      "http://adlnet.gov/expapi/verbs/attempted": "attempted",
      "http://id.tincanapi.com/verb/viewed": "viewed",
      "http://adlnet.gov/expapi/verbs/answered": "answered",
      "http://adlnet.gov/expapi/verbs/passed": "passed",
      "http://adlnet.gov/expapi/verbs/failed": "failed",
      // Add more verbs as needed
    };

    return verbMap[verbId] || "interacted with";
  }

  /**
   * Track page view
   * @param {string} pageUrl - URL of the page
   * @param {string} pageTitle - Title of the page
   */
  trackPageView(pageUrl, pageTitle) {
    this.track("http://id.tincanapi.com/verb/viewed", {
      objectType: "Activity",
      id: pageUrl,
      definition: {
        name: { "en-US": pageTitle },
        type: "http://activitystrea.ms/schema/1.0/page",
      },
    });
  }

  /**
   * Track lesson completion
   * @param {string} lessonId - Lesson ID
   * @param {string} lessonTitle - Lesson title
   * @param {number} score - Score (0-100)
   * @param {boolean} success - Whether the lesson was successfully completed
   * @param {number} timeSpent - Time spent in seconds
   */
  trackLessonCompletion(lessonId, lessonTitle, score, success, timeSpent) {
    const verbId = success
      ? "http://adlnet.gov/expapi/verbs/passed"
      : "http://adlnet.gov/expapi/verbs/failed";

    this.track(
      verbId,
      {
        objectType: "Activity",
        id: `https://windgapacademy.org/lessons/${lessonId}`,
        definition: {
          name: { "en-US": lessonTitle },
          type: "http://adlnet.gov/expapi/activities/lesson",
        },
      },
      {
        score: {
          raw: score,
          min: 0,
          max: 100,
          scaled: score / 100,
        },
        success: success,
        completion: true,
        duration: this.formatDuration(timeSpent),
      },
    );
  }

  /**
   * Format duration in seconds to ISO 8601 duration format
   * @param {number} seconds - Duration in seconds
   * @returns {string} - ISO 8601 duration format
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let duration = "PT";

    if (hours > 0) {
      duration += `${hours}H`;
    }

    if (minutes > 0) {
      duration += `${minutes}M`;
    }

    if (remainingSeconds > 0 || duration === "PT") {
      duration += `${remainingSeconds}S`;
    }

    return duration;
  }
}

// Create and export singleton instance
export default new XapiClient();
```

#### 3.2 Create Analytics Dashboard Components

```javascript
// /components/analytics/AnalyticsDashboard.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DateRangePicker from "./DateRangePicker";
import ActivityTable from "./ActivityTable";

const AnalyticsDashboard = ({ courseId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState({
    since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    until: new Date(),
  });

  useEffect(() => {
    fetchDashboardData();
  }, [courseId, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = courseId
        ? `/api/analytics/dashboard/${courseId}`
        : "/api/analytics/dashboard";

      const params = {
        since: dateRange.since.toISOString(),
        until: dateRange.until.toISOString(),
      };

      const response = await axios.get(endpoint, { params });
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading analytics data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Learning Analytics{courseId ? `: ${courseId}` : ""}</Heading>
        <DateRangePicker onChange={setDateRange} value={dateRange} />
      </Box>

      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Content Views</StatLabel>
          <StatNumber>{dashboardData.activityCounts.viewed || 0}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Activities Completed</StatLabel>
          <StatNumber>{dashboardData.activityCounts.completed || 0}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Activities Attempted</StatLabel>
          <StatNumber>{dashboardData.activityCounts.attempted || 0}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Time Spent</StatLabel>
          <StatNumber>{formatTimeSpent(dashboardData.timeSpent)}</StatNumber>
        </Stat>
      </StatGroup>

      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Progress</Tab>
          <Tab>Activities</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Activity by Type Chart */}
              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>
                  Activity by Type
                </Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Views", count: dashboardData.activityCounts.viewed || 0 },
                      { name: "Completions", count: dashboardData.activityCounts.completed || 0 },
                      { name: "Attempts", count: dashboardData.activityCounts.attempted || 0 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4FD1C5" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Recent Activity Timeline */}
              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>
                  Recent Activities
                </Heading>
                <ActivityTable activities={dashboardData.recentActivities} />
              </Box>
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            {/* Progress Data */}
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>
                Completion Progress
              </Heading>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={dashboardData.progressData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="activityName" width={80} />
                  <Tooltip />
                  <Bar dataKey="completionCount" fill="#4299E1" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>

          <TabPanel>
            {/* Detailed Activity List */}
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>
                All Activities
              </Heading>
              <ActivityTable activities={dashboardData.recentActivities} showAll={true} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AnalyticsDashboard;
```

#### 3.3 Create Activity Tracking Hook

```javascript
// /hooks/useTrackActivity.js

import { useEffect } from "react";
import xapiClient from "../services/xapiClient";
import { useRouter } from "next/router";

/**
 * Hook to track user activity
 */
const useTrackActivity = () => {
  const router = useRouter();

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Don't track analytics page itself
      if (url.includes("/analytics")) {
        return;
      }

      xapiClient.trackPageView(`https://windgapacademy.org${url}`, document.title);
    };

    // Track initial page view
    handleRouteChange(router.pathname);

    // Track route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return {
    // Method to track a lesson completion
    trackLessonCompletion: (lessonId, lessonTitle, score, success, timeSpent) => {
      xapiClient.trackLessonCompletion(lessonId, lessonTitle, score, success, timeSpent);
    },

    // Method to track a custom activity
    trackActivity: (verbId, activity, result, context) => {
      xapiClient.track(verbId, activity, result, context);
    },
  };
};

export default useTrackActivity;
```

#### 3.4 Integrate with Existing Components

```javascript
// /components/lessons/LessonPlayer.jsx (example)

import React, { useEffect, useState } from "react";
import useTrackActivity from "../../hooks/useTrackActivity";

const LessonPlayer = ({ lesson }) => {
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { trackLessonCompletion } = useTrackActivity();

  // Track when the lesson starts
  useEffect(() => {
    setStartTime(Date.now());

    return () => {
      // If the component unmounts and the lesson wasn't completed,
      // track as attempted but not completed
      if (!completed && startTime) {
        const timeSpent = (Date.now() - startTime) / 1000;
        trackLessonCompletion(lesson.id, lesson.title, 0, false, timeSpent);
      }
    };
  }, []);

  const handleLessonComplete = (score) => {
    const timeSpent = (Date.now() - startTime) / 1000;
    setCompleted(true);

    trackLessonCompletion(lesson.id, lesson.title, score, score >= lesson.passingScore, timeSpent);
  };

  // Rest of the component...
};
```

### Phase 4: Testing & Integration (Week 4)

#### 4.1 Manual Testing Plan

1. **Statement Generation Testing**:
   - Test automatic page view tracking
   - Test lesson completion tracking
   - Test custom activity tracking
   - Verify statement format compliance

2. **LRS Integration Testing**:
   - Verify statements are stored in LRS
   - Test query functionality
   - Verify security and access controls

3. **Dashboard Testing**:
   - Test data visualization components
   - Test filtering and date range selection
   - Verify data accuracy and consistency

4. **Performance Testing**:
   - Test with large data volumes
   - Verify statement batching behavior
   - Assess dashboard rendering performance

#### 4.2 Automated Testing

```javascript
// /src/__tests__/analytics/xapiClient.test.js

import xapiClient from "../../services/xapiClient";
import axios from "axios";

jest.mock("axios");

describe("xAPI Client", () => {
  beforeEach(() => {
    // Mock local storage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(
          () =>
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwibmFtZSI6IlRlc3QgVXNlciJ9.signature",
        ),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Reset the pending statements
    xapiClient.pendingStatements = [];

    // Mock window.addEventListener
    window.addEventListener = jest.fn();

    // Mock atob
    window.atob = jest.fn(() =>
      JSON.stringify({
        id: "user-123",
        name: "Test User",
      }),
    );
  });

  test("should create a valid page view statement", () => {
    xapiClient.trackPageView("https://windgapacademy.org/lessons/123", "Test Lesson");

    expect(xapiClient.pendingStatements.length).toBe(1);

    const statement = xapiClient.pendingStatements[0];
    expect(statement.verb.id).toBe("http://id.tincanapi.com/verb/viewed");
    expect(statement.object.id).toBe("https://windgapacademy.org/lessons/123");
    expect(statement.object.definition.name["en-US"]).toBe("Test Lesson");
  });

  test("should create a valid lesson completion statement", () => {
    xapiClient.trackLessonCompletion("lesson-123", "Test Lesson", 85, true, 300);

    expect(xapiClient.pendingStatements.length).toBe(1);

    const statement = xapiClient.pendingStatements[0];
    expect(statement.verb.id).toBe("http://adlnet.gov/expapi/verbs/passed");
    expect(statement.object.id).toBe("https://windgapacademy.org/lessons/lesson-123");
    expect(statement.result.score.raw).toBe(85);
    expect(statement.result.success).toBe(true);
    expect(statement.result.duration).toBe("PT5M");
  });

  test("should format duration correctly", () => {
    expect(xapiClient.formatDuration(30)).toBe("PT30S");
    expect(xapiClient.formatDuration(90)).toBe("PT1M30S");
    expect(xapiClient.formatDuration(3600)).toBe("PT1H");
    expect(xapiClient.formatDuration(3661)).toBe("PT1H1M1S");
  });

  test("should send statements to the server", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    xapiClient.trackPageView("https://windgapacademy.org/lessons/123", "Test Lesson");
    await xapiClient.sendPendingStatements();

    expect(axios.post).toHaveBeenCalledWith(
      "/api/analytics/statements",
      expect.arrayContaining([
        expect.objectContaining({
          verb: expect.objectContaining({
            id: "http://id.tincanapi.com/verb/viewed",
          }),
        }),
      ]),
    );

    expect(xapiClient.pendingStatements.length).toBe(0);
  });
});
```

### Phase 5: Deployment & Documentation (Week 5)

#### 5.1 Update Environment Variables in Production

- Configure LRS credentials in production environment
- Ensure secure handling of LRS authentication

#### 5.2 Documentation

- Create developer guide for xAPI statement generation
- Create administrator guide for LRS management
- Create instructor guide for analytics dashboard usage

#### 5.3 Monitoring

- Set up monitoring for LRS connectivity
- Track statement generation volume
- Monitor dashboard performance

## Resources

### Library Documentation

- [xAPI Specification](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-About.md)
- [Learning Locker Documentation](https://docs.learninglocker.net/)
- [Recharts Documentation](https://recharts.org/en-US/api)

### Additional Resources

- [xAPI Verbs](https://registry.tincanapi.com/#home/verbs)
- [xAPI Statement Generator](https://xapi.com/statements-101/)
- [xAPI Dashboard Examples](https://xapidashboard.com/)
