# Khan Academy Integration Guide for Windgap Academy

This guide explains how to integrate Khan Academy educational content and exercises into the Windgap Academy platform.

## Integration Options

### 1. Using Khan Academy's Public API

Khan Academy offers a public API that allows you to access their content programmatically:

#### Setup

1. Register for a Khan Academy developer account:
   - Visit [Khan Academy Developers](https://www.khanacademy.org/api-apps/register)
   - Follow the registration process to obtain API credentials

2. Create an API client in the Windgap Academy backend:

```javascript
// /backend/api/khan-integration.js
import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// Khan Academy API configuration
const KHAN_API_URL = "https://www.khanacademy.org/api/v1";
const CONSUMER_KEY = process.env.KHAN_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.KHAN_CONSUMER_SECRET;

// OAuth 1.0a setup
const oauth = OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

// API client
export const khanClient = {
  /**
   * Get topics from Khan Academy
   */
  getTopics: async () => {
    const requestData = {
      url: `${KHAN_API_URL}/topictree`,
      method: "GET",
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    try {
      const response = await axios.get(requestData.url, {
        headers: authHeader,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Khan Academy topics:", error);
      throw error;
    }
  },

  /**
   * Get exercises for a specific topic
   */
  getExercises: async (topicSlug) => {
    const requestData = {
      url: `${KHAN_API_URL}/topic/${topicSlug}/exercises`,
      method: "GET",
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    try {
      const response = await axios.get(requestData.url, {
        headers: authHeader,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises for topic ${topicSlug}:`, error);
      throw error;
    }
  },

  /**
   * Get videos for a specific topic
   */
  getVideos: async (topicSlug) => {
    const requestData = {
      url: `${KHAN_API_URL}/topic/${topicSlug}/videos`,
      method: "GET",
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    try {
      const response = await axios.get(requestData.url, {
        headers: authHeader,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for topic ${topicSlug}:`, error);
      throw error;
    }
  },
};

export default khanClient;
```

3. Create environment variables in your `.env` file:

```
KHAN_CONSUMER_KEY=your_consumer_key_here
KHAN_CONSUMER_SECRET=your_consumer_secret_here
```

4. Create API endpoints to serve Khan Academy content:

```javascript
// /backend/api/khan.js
import express from "express";
import { khanClient } from "./khan-integration.js";

const router = express.Router();

router.get("/topics", async (req, res) => {
  try {
    const topics = await khanClient.getTopics();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/exercises/:topicSlug", async (req, res) => {
  try {
    const exercises = await khanClient.getExercises(req.params.topicSlug);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/videos/:topicSlug", async (req, res) => {
  try {
    const videos = await khanClient.getVideos(req.params.topicSlug);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

5. Add the routes to your main API file:

```javascript
// /backend/api/index.js
import khanRoutes from "./khan.js";

// Add this line with your other router.use statements
router.use("/khan", khanRoutes);
```

### 2. Embedding Khan Academy Content via iframes

You can embed Khan Academy exercises and content directly into your application using iframes:

```javascript
// /components/KhanAcademyEmbed.jsx
import React from "react";
import PropTypes from "prop-types";

const KhanAcademyEmbed = ({ exerciseId, width = "800px", height = "600px" }) => {
  const exerciseUrl = `https://www.khanacademy.org/embed_video?v=${exerciseId}`;

  return (
    <div className="khan-academy-embed">
      <iframe
        src={exerciseUrl}
        width={width}
        height={height}
        allowFullScreen
        allow="autoplay; encrypted-media"
        title="Khan Academy Exercise"
        frameBorder="0"
      />
    </div>
  );
};

KhanAcademyEmbed.propTypes = {
  exerciseId: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default KhanAcademyEmbed;
```

Usage:

```jsx
import KhanAcademyEmbed from "../components/KhanAcademyEmbed";

// In your component
<KhanAcademyEmbed exerciseId="arithmetic_basics" />;
```

### 3. Using Khan Academy Exercise Repository (khan-exercises)

If you want to use Khan Academy's exercise framework directly, you can:

1. Clone the Khan Academy exercises repository:

```bash
cd /workspaces/windgapacademy
git clone https://github.com/Khan/khan-exercises.git
```

2. Create a simple server to serve these exercises:

```javascript
// /scripts/serve-khan-exercises.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

// Serve static files from khan-exercises directory
app.use(express.static(path.join(__dirname, "../khan-exercises")));

app.listen(port, () => {
  console.log(`Khan exercises server running at http://localhost:${port}`);
});
```

3. Add a script to package.json:

```json
"scripts": {
  "khan:serve": "node scripts/serve-khan-exercises.js"
}
```

4. Create a component to embed these locally served exercises:

```javascript
// /components/LocalKhanExercise.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const LocalKhanExercise = ({ exerciseName, width = "100%", height = "600px" }) => {
  const exerciseUrl = `http://localhost:3001/exercises/${exerciseName}.html`;

  return (
    <div className="local-khan-exercise">
      <iframe
        src={exerciseUrl}
        width={width}
        height={height}
        title={`Khan Exercise: ${exerciseName}`}
        frameBorder="0"
      />
    </div>
  );
};

LocalKhanExercise.propTypes = {
  exerciseName: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default LocalKhanExercise;
```

## Implementation Steps

1. Choose the integration approach that best fits your needs
2. Set up the required backend components
3. Create React components to display Khan Academy content
4. Add the components to your curriculum or lesson pages

## Best Practices

1. Cache API responses to avoid exceeding rate limits
2. Implement error handling for when Khan Academy content is unavailable
3. Consider fallback content if Khan Academy resources cannot be loaded
4. Track student interaction with Khan Academy content for progress monitoring

## Limitations and Considerations

- Khan Academy's API and embedding policies may change
- Content may not always align perfectly with your curriculum
- Some features may require direct use of Khan Academy's website

## Additional Resources

- [Khan Academy API Documentation](https://github.com/Khan/khan-api)
- [Khan Academy Exercises Repository](https://github.com/Khan/khan-exercises)
- [Khan Academy Developer Portal](https://www.khanacademy.org/api-apps/register)
