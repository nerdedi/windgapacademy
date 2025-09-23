// Portions of this file were generated with the assistance of GitHub Copilot

import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "../../firebase";

/**
 * LearningModel - Machine learning model for analyzing user learning patterns
 *
 * This class implements various ML algorithms to extract insights from user analytics
 * and provide personalized recommendations for curriculum improvement.
 */
class LearningModel {
  constructor() {
    this.weights = {
      recency: 0.3, // Weight for recency of activities
      frequency: 0.25, // Weight for frequency of activities
      engagement: 0.2, // Weight for engagement metrics
      performance: 0.25, // Weight for performance metrics
    };

    this.featureImportance = {
      timeSpent: 0.15,
      completionRate: 0.2,
      interactionCount: 0.1,
      correctAnswers: 0.25,
      engagementScore: 0.3,
    };

    this.clusterCenters = [];
    this.initialized = false;
  }

  /**
   * Initialize the model with pre-trained data or defaults
   * @param {Object} options - Initialization options
   * @returns {Promise<void>}
   */
  async initialize(_options = {}) {
    try {
      // Try to load model parameters from Firestore
      const modelRef = doc(firestore, "models", "learningModel");
      const modelDoc = await getDoc(modelRef);

      if (modelDoc.exists()) {
        const modelData = modelDoc.data();
        this.weights = modelData.weights || this.weights;
        this.featureImportance = modelData.featureImportance || this.featureImportance;
        this.clusterCenters = modelData.clusterCenters || [];
      } else {
        // If no model exists, initialize with default values and save
        await setDoc(modelRef, {
          weights: this.weights,
          featureImportance: this.featureImportance,
          clusterCenters: this.clusterCenters,
          lastUpdated: Date.now(),
        });
      }

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing learning model:", error);
      // Fall back to defaults
    }
  }

  /**
   * Process user analytics data to generate insights
   * @param {Array} events - User event data
   * @param {Object} learningPatterns - User learning patterns
   * @returns {Object} - Processed insights
   */
  processUserData(events, learningPatterns) {
    if (!this.initialized || !events || events.length === 0) {
      return {
        strengths: [],
        weaknesses: [],
        learningStyle: "unknown",
        recommendedTopics: [],
        optimizationSuggestions: [],
      };
    }

    // Extract features from event data
    const features = this.extractFeatures(events, learningPatterns);

    // Determine learning style through clustering
    const learningStyle = this.determineLearningStyle(features);

    // Identify strengths and weaknesses
    const { strengths, weaknesses } = this.identifyStrengthsAndWeaknesses(learningPatterns);

    // Generate topic recommendations
    const recommendedTopics = this.generateTopicRecommendations(
      learningPatterns,
      strengths,
      weaknesses,
      learningStyle,
    );

    // Generate optimization suggestions
    const optimizationSuggestions = this.generateOptimizationSuggestions(features, learningStyle);

    return {
      strengths,
      weaknesses,
      learningStyle,
      recommendedTopics,
      optimizationSuggestions,
    };
  }

  /**
   * Extract features from user event data
   * @param {Array} events - User event data
   * @param {Object} learningPatterns - User learning patterns
   * @returns {Object} - Extracted features
   */
  extractFeatures(events, learningPatterns) {
    // Calculate time-based metrics
    const sessionDurations = [];
    const topicTimeSpent = {};
    let totalTimeSpent = 0;

    // Find session start/end pairs
    const sessionStarts = events.filter((e) => e.eventName === "session_start");
    const sessionEnds = events.filter((e) => e.eventName === "session_end");

    for (let i = 0; i < Math.min(sessionStarts.length, sessionEnds.length); i++) {
      const duration = sessionEnds[i].timestamp - sessionStarts[i].timestamp;
      sessionDurations.push(duration);
      totalTimeSpent += duration;
    }

    // Calculate topic-specific time spent
    Object.entries(learningPatterns).forEach(([topic, data]) => {
      topicTimeSpent[topic] = data.timeSpent || 0;
    });

    // Calculate interaction-based metrics
    const interactionCounts = events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1;
      return acc;
    }, {});

    // Calculate performance metrics
    const completionEvents = events.filter((e) => e.eventName.includes("complete"));
    const avgCompletionScore =
      completionEvents.reduce((sum, event) => {
        return sum + (event.eventData.score || 0);
      }, 0) / (completionEvents.length || 1);

    // Calculate engagement metrics
    const avgEngagementScore =
      events.reduce((sum, event) => {
        return sum + (event.engagementScore || 0);
      }, 0) / (events.length || 1);

    // Calculate time pattern metrics
    const timeOfDayDistribution = events.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours();
      const timeOfDay =
        hour < 6 ? "night" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

      acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
      return acc;
    }, {});

    // Normalize time of day distribution
    const totalEvents = events.length;
    Object.keys(timeOfDayDistribution).forEach((key) => {
      timeOfDayDistribution[key] /= totalEvents;
    });

    // Return compiled features
    return {
      sessionCount: sessionStarts.length,
      avgSessionDuration:
        sessionDurations.length > 0
          ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
          : 0,
      totalTimeSpent,
      topicTimeSpent,
      interactionCounts,
      avgCompletionScore,
      avgEngagementScore,
      timeOfDayDistribution,
      eventCount: events.length,
      uniqueEventTypes: Object.keys(interactionCounts).length,
      completionRate:
        completionEvents.length / (events.filter((e) => e.eventName.includes("start")).length || 1),
    };
  }

  /**
   * Determine user learning style through feature clustering
   * @param {Object} features - Extracted user features
   * @returns {string} - Identified learning style
   */
  determineLearningStyle(features) {
    // Prepare feature vector for clustering
    const featureVector = [
      features.avgSessionDuration / (60 * 60 * 1000), // Normalize to hours
      features.completionRate,
      features.avgEngagementScore / 10, // Normalize to 0-1 scale
      features.eventCount > 100 ? 1 : features.eventCount / 100, // Normalize to 0-1 scale
      Object.keys(features.topicTimeSpent).length / 10, // Normalize to 0-1 scale
    ];

    // If we have pre-computed cluster centers, use them
    if (this.clusterCenters.length > 0) {
      // Find closest cluster center (using Euclidean distance)
      let minDistance = Infinity;
      let closestCluster = 0;

      for (let i = 0; i < this.clusterCenters.length; i++) {
        const center = this.clusterCenters[i];
        const distance = this.euclideanDistance(featureVector, center.vector);

        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = i;
        }
      }

      return this.clusterCenters[closestCluster].label;
    }

    // If no cluster centers, use heuristic approach
    // Check for visual learner traits
    const videoEvents = features.interactionCounts["video_play"] || 0;
    const readingEvents =
      (features.interactionCounts["page_view"] || 0) +
      (features.interactionCounts["lesson_start"] || 0);

    if (videoEvents > readingEvents * 1.5) {
      return "visual";
    }

    // Check for hands-on learner traits
    const practiceEvents =
      (features.interactionCounts["exercise_start"] || 0) +
      (features.interactionCounts["quiz_start"] || 0);

    if (practiceEvents > (videoEvents + readingEvents) * 0.7) {
      return "kinesthetic";
    }

    // Check for social learner traits
    const collaborationEvents =
      (features.interactionCounts["comment"] || 0) + (features.interactionCounts["share"] || 0);

    if (collaborationEvents > features.eventCount * 0.15) {
      return "social";
    }

    // Check for auditory learner traits (if we have data on audio content)
    const audioEvents = features.interactionCounts["audio_play"] || 0;

    if (audioEvents > videoEvents * 0.8) {
      return "auditory";
    }

    // Check time patterns for different learning styles
    if (features.timeOfDayDistribution.night > 0.4) {
      return "night-owl";
    }

    if (features.timeOfDayDistribution.morning > 0.4) {
      return "early-bird";
    }

    // Default to balanced
    return "balanced";
  }

  /**
   * Calculate Euclidean distance between two vectors
   * @param {Array} v1 - First vector
   * @param {Array} v2 - Second vector
   * @returns {number} - Euclidean distance
   */
  euclideanDistance(v1, v2) {
    if (v1.length !== v2.length) {
      throw new Error("Vectors must have the same dimensions");
    }

    return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
  }

  /**
   * Identify user strengths and weaknesses
   * @param {Object} learningPatterns - User learning patterns
   * @returns {Object} - Identified strengths and weaknesses
   */
  identifyStrengthsAndWeaknesses(learningPatterns) {
    const topics = Object.entries(learningPatterns);

    // Sort topics by strength score
    const sortedByStrength = [...topics].sort((a, b) => b[1].strength - a[1].strength);

    // Get top 3 strengths
    const strengths = sortedByStrength.slice(0, 3).map(([topic, data]) => ({
      topic,
      strength: data.strength,
      confidence: this.calculateConfidenceScore(data),
    }));

    // Identify weaknesses based on low strength or many mistakes
    const weaknesses = topics
      .filter(([_, data]) => {
        return (
          data.strength < 0.4 ||
          (data.mistakes && data.mistakes.length > 5) ||
          (data.completions > 0 && data.timeSpent / data.completions > 30 * 60 * 1000)
        ); // Takes more than 30 minutes per completion
      })
      .map(([topic, data]) => ({
        topic,
        strength: data.strength,
        issues: this.identifyWeaknessIssues(data),
        confidence: this.calculateConfidenceScore(data),
      }))
      .slice(0, 3); // Limit to top 3 weaknesses

    return { strengths, weaknesses };
  }

  /**
   * Calculate confidence score for a topic
   * @param {Object} topicData - Topic learning pattern data
   * @returns {number} - Confidence score between 0 and 1
   */
  calculateConfidenceScore(topicData) {
    // Base confidence on number of completions and recency
    const completionConfidence = Math.min(1, topicData.completions / 5); // Max out at 5 completions

    // Recency factor - higher confidence for recent interactions
    const daysSinceLastInteraction =
      (Date.now() - topicData.lastInteraction) / (24 * 60 * 60 * 1000);
    const recencyConfidence = Math.max(0, 1 - daysSinceLastInteraction / 30); // Decay over 30 days

    // Combine factors with weights
    return completionConfidence * 0.7 + recencyConfidence * 0.3;
  }

  /**
   * Identify specific issues in a weak topic
   * @param {Object} topicData - Topic learning pattern data
   * @returns {Array} - Identified issues
   */
  identifyWeaknessIssues(topicData) {
    const issues = [];

    // Check for common mistake patterns
    if (topicData.mistakes && topicData.mistakes.length > 0) {
      // Group similar mistakes
      const mistakeGroups = this.groupSimilarMistakes(topicData.mistakes);

      // Add top mistake groups as issues
      Object.entries(mistakeGroups)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 2)
        .forEach(([type, data]) => {
          issues.push({
            type: "mistake_pattern",
            description: `Repeated mistakes with ${type}`,
            examples: data.examples.slice(0, 3),
            count: data.count,
          });
        });
    }

    // Check for time spent issues
    if (topicData.completions > 0) {
      const avgTimePerCompletion = topicData.timeSpent / topicData.completions;

      if (avgTimePerCompletion > 30 * 60 * 1000) {
        // More than 30 minutes
        issues.push({
          type: "time_efficiency",
          description: "Takes longer than average to complete",
          value: avgTimePerCompletion,
        });
      }
    }

    // Check for low engagement
    if (topicData.strength < 0.3) {
      issues.push({
        type: "low_engagement",
        description: "Low engagement with this topic",
        value: topicData.strength,
      });
    }

    return issues;
  }

  /**
   * Group similar mistakes to identify patterns
   * @param {Array} mistakes - List of mistakes
   * @returns {Object} - Grouped mistakes by type
   */
  groupSimilarMistakes(mistakes) {
    const groups = {};

    mistakes.forEach((mistake) => {
      // Extract type from mistake object or use default
      const type = mistake.type || "general";

      if (!groups[type]) {
        groups[type] = {
          count: 0,
          examples: [],
        };
      }

      groups[type].count += 1;

      // Add example if it's unique
      const exampleText = mistake.description || mistake.text || JSON.stringify(mistake);
      if (!groups[type].examples.includes(exampleText)) {
        groups[type].examples.push(exampleText);
      }
    });

    return groups;
  }

  /**
   * Generate topic recommendations based on learning patterns
   * @param {Object} learningPatterns - User learning patterns
   * @param {Array} strengths - Identified strengths
   * @param {Array} weaknesses - Identified weaknesses
   * @param {string} learningStyle - User learning style
   * @returns {Array} - Recommended topics
   */
  generateTopicRecommendations(learningPatterns, strengths, weaknesses, learningStyle) {
    const recommendations = [];

    // First, recommend addressing weaknesses
    weaknesses.forEach((weakness) => {
      recommendations.push({
        topic: weakness.topic,
        reason: "Needs improvement",
        confidence: weakness.confidence,
        contentSuggestions: this.suggestContentForTopic(
          weakness.topic,
          learningPatterns,
          learningStyle,
          "weakness",
        ),
      });
    });

    // Then, recommend building on strengths
    strengths.forEach((strength) => {
      // Only include strengths that aren't already in recommendations
      if (!recommendations.some((r) => r.topic === strength.topic)) {
        recommendations.push({
          topic: strength.topic,
          reason: "Build on strength",
          confidence: strength.confidence,
          contentSuggestions: this.suggestContentForTopic(
            strength.topic,
            learningPatterns,
            learningStyle,
            "strength",
          ),
        });
      }
    });

    // Finally, recommend exploring new related topics
    const existingTopics = new Set([
      ...recommendations.map((r) => r.topic),
      ...Object.keys(learningPatterns),
    ]);

    // Simulated related topics (in a real system, this would use curriculum metadata)
    const relatedTopics = this.findRelatedTopics(Array.from(existingTopics));

    relatedTopics.forEach((topic) => {
      if (!existingTopics.has(topic)) {
        recommendations.push({
          topic,
          reason: "Suggested new topic",
          confidence: 0.7, // Medium confidence for suggestions
          contentSuggestions: this.suggestContentForTopic(
            topic,
            learningPatterns,
            learningStyle,
            "new",
          ),
        });
      }
    });

    // Sort by confidence and limit to top 5
    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  /**
   * Suggest content for a specific topic based on learning style
   * @param {string} topic - The topic
   * @param {Object} learningPatterns - User learning patterns
   * @param {string} learningStyle - User learning style
   * @param {string} context - Context of recommendation (weakness, strength, new)
   * @returns {Array} - Content suggestions
   */
  suggestContentForTopic(topic, learningPatterns, learningStyle, context) {
    const suggestions = [];
    const _topicData = learningPatterns[topic] || {};

    // Determine preferred content types based on learning style
    const stylePreferences = {
      visual: ["video", "interactive", "infographic"],
      auditory: ["audio", "lecture", "discussion"],
      kinesthetic: ["exercise", "project", "simulation"],
      social: ["discussion", "group_project", "peer_review"],
      "night-owl": ["self_paced", "reading", "exercise"],
      "early-bird": ["lecture", "interactive", "quiz"],
      balanced: ["mixed", "comprehensive", "varied"],
    };

    const preferredTypes = stylePreferences[learningStyle] || ["mixed"];

    // Add content suggestions based on learning style and context
    if (context === "weakness") {
      // For weaknesses, suggest more foundational content
      suggestions.push({
        type: preferredTypes[0],
        title: `${topic} Fundamentals`,
        difficulty: "beginner",
        reason: "Solidify foundations",
      });

      // Also suggest practice exercises
      suggestions.push({
        type: "exercise",
        title: `${topic} Practice Problems`,
        difficulty: "intermediate",
        reason: "Build skills through practice",
      });
    } else if (context === "strength") {
      // For strengths, suggest more advanced content
      suggestions.push({
        type: preferredTypes[0],
        title: `Advanced ${topic}`,
        difficulty: "advanced",
        reason: "Deepen expertise",
      });

      // Also suggest teaching opportunities
      suggestions.push({
        type: "project",
        title: `${topic} Capstone Project`,
        difficulty: "advanced",
        reason: "Apply and cement knowledge",
      });
    } else {
      // For new topics, suggest introductory content
      suggestions.push({
        type: preferredTypes[0],
        title: `Introduction to ${topic}`,
        difficulty: "beginner",
        reason: "Explore new area",
      });

      // Also suggest quick wins
      suggestions.push({
        type: "interactive",
        title: `${topic} Quick Start`,
        difficulty: "beginner",
        reason: "Get quick initial success",
      });
    }

    return suggestions;
  }

  /**
   * Find related topics based on existing topics
   * @param {Array} existingTopics - List of existing topics
   * @returns {Array} - Related topics
   */
  findRelatedTopics(existingTopics) {
    // This is a placeholder implementation
    // In a real system, this would use a topic graph or recommendation model

    // Simulated topic relationships
    const topicRelationships = {
      javascript: ["typescript", "react", "node.js"],
      python: ["data science", "machine learning", "django"],
      html: ["css", "javascript", "web design"],
      css: ["html", "sass", "ui design"],
      react: ["redux", "javascript", "frontend"],
      "node.js": ["express", "javascript", "backend"],
      "data science": ["python", "statistics", "machine learning"],
      "machine learning": ["deep learning", "data science", "neural networks"],
      algorithms: ["data structures", "problem solving", "computer science"],
      "data structures": ["algorithms", "computer science", "software engineering"],
    };

    // Collect related topics
    const relatedSet = new Set();

    existingTopics.forEach((topic) => {
      const related = topicRelationships[topic.toLowerCase()] || [];
      related.forEach((rt) => relatedSet.add(rt));
    });

    // Remove existing topics from related set
    existingTopics.forEach((topic) => {
      relatedSet.delete(topic.toLowerCase());
    });

    return Array.from(relatedSet);
  }

  /**
   * Generate optimization suggestions for learning experience
   * @param {Object} features - User features
   * @param {string} learningStyle - User learning style
   * @returns {Array} - Optimization suggestions
   */
  generateOptimizationSuggestions(features, learningStyle) {
    const suggestions = [];

    // Check session duration patterns
    if (features.avgSessionDuration > 2 * 60 * 60 * 1000) {
      // Over 2 hours
      suggestions.push({
        type: "session_length",
        title: "Consider shorter, more frequent sessions",
        reason:
          "Your sessions average over 2 hours, which can lead to fatigue. Research shows 25-45 minute focused sessions can be more effective.",
        confidence: 0.8,
      });
    } else if (features.avgSessionDuration < 15 * 60 * 1000) {
      // Under 15 minutes
      suggestions.push({
        type: "session_length",
        title: "Try longer, more focused sessions",
        reason:
          "Your sessions are quite short. Consider setting aside 30-45 minutes of uninterrupted time for deeper learning.",
        confidence: 0.7,
      });
    }

    // Suggest content types based on learning style
    if (learningStyle === "visual") {
      suggestions.push({
        type: "content_format",
        title: "Prioritize visual learning resources",
        reason:
          "Your learning patterns suggest you learn best with visual content. Try more videos, diagrams, and infographics.",
        confidence: 0.85,
      });
    } else if (learningStyle === "kinesthetic") {
      suggestions.push({
        type: "content_format",
        title: "Focus on hands-on practice",
        reason:
          "You appear to learn best by doing. Prioritize interactive exercises, projects, and coding challenges.",
        confidence: 0.85,
      });
    } else if (learningStyle === "social") {
      suggestions.push({
        type: "content_format",
        title: "Try more collaborative learning",
        reason:
          "Your engagement is highest with social elements. Consider study groups, discussion forums, or pair programming.",
        confidence: 0.8,
      });
    }

    // Check time of day patterns
    const preferredTimeOfDay = Object.entries(features.timeOfDayDistribution).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    suggestions.push({
      type: "scheduling",
      title: `Schedule learning during the ${preferredTimeOfDay}`,
      reason: `You show ${Math.round(features.timeOfDayDistribution[preferredTimeOfDay] * 100)}% higher engagement during the ${preferredTimeOfDay}.`,
      confidence: features.timeOfDayDistribution[preferredTimeOfDay] > 0.4 ? 0.9 : 0.7,
    });

    // Check for topic diversity
    const topicCount = Object.keys(features.topicTimeSpent).length;
    if (topicCount < 3 && features.sessionCount > 5) {
      suggestions.push({
        type: "topic_diversity",
        title: "Explore more diverse topics",
        reason:
          "You've focused on a narrow set of topics. Broadening your knowledge can help with connections and retention.",
        confidence: 0.75,
      });
    } else if (topicCount > 10 && features.avgCompletionScore < 70) {
      suggestions.push({
        type: "topic_focus",
        title: "Consider more focused learning",
        reason:
          "You're exploring many topics but your completion scores suggest you might benefit from deeper focus on fewer areas.",
        confidence: 0.75,
      });
    }

    return suggestions;
  }

  /**
   * Update model parameters based on new data
   * @param {Array} userData - Array of user data for retraining
   * @returns {Promise<void>}
   */
  async updateModel(userData) {
    if (!this.initialized || !userData || userData.length === 0) return;

    try {
      // Calculate new weights based on correlation with learning outcomes
      // This is a simplified implementation
      const newWeights = { ...this.weights };
      const _learningOutcomes = userData.map((user) => user.outcomes || {});

      // Update feature importance based on correlation with outcomes
      const newFeatureImportance = { ...this.featureImportance };

      // Perform k-means clustering to identify learning styles
      // This is simplified - real implementation would use proper ML methods
      const newClusterCenters = this.runKMeansClustering(userData, 5);

      // Update model parameters
      this.weights = newWeights;
      this.featureImportance = newFeatureImportance;
      this.clusterCenters = newClusterCenters;

      // Save updated model to Firestore
      const modelRef = doc(firestore, "models", "learningModel");
      await setDoc(modelRef, {
        weights: this.weights,
        featureImportance: this.featureImportance,
        clusterCenters: this.clusterCenters,
        lastUpdated: Date.now(),
      });

      console.log("Learning model updated successfully");
    } catch (error) {
      console.error("Error updating learning model:", error);
    }
  }

  /**
   * Run k-means clustering algorithm on user data
   * @param {Array} userData - Array of user data
   * @param {number} k - Number of clusters
   * @returns {Array} - Cluster centers with labels
   */
  runKMeansClustering(userData, _k) {
    // This is a simplified implementation
    // In a real system, this would use a proper ML library

    // Extract feature vectors from user data
    const _featureVectors = userData.map((user) => {
      // Extract relevant features
      const features = this.extractFeatures(user.events || [], user.learningPatterns || {});

      // Convert to feature vector for clustering
      return [
        features.avgSessionDuration / (60 * 60 * 1000), // Normalize to hours
        features.completionRate,
        features.avgEngagementScore / 10, // Normalize to 0-1 scale
        features.eventCount > 100 ? 1 : features.eventCount / 100, // Normalize to 0-1 scale
        Object.keys(features.topicTimeSpent).length / 10, // Normalize to 0-1 scale
      ];
    });

    // Simplified cluster centers (would normally be computed via k-means)
    // These are placeholder values
    const clusterCenters = [
      {
        vector: [0.8, 0.9, 0.7, 0.6, 0.3],
        label: "visual",
      },
      {
        vector: [0.5, 0.7, 0.8, 0.9, 0.6],
        label: "kinesthetic",
      },
      {
        vector: [1.2, 0.6, 0.5, 0.3, 0.8],
        label: "auditory",
      },
      {
        vector: [0.7, 0.5, 0.9, 0.8, 0.7],
        label: "social",
      },
      {
        vector: [0.6, 0.6, 0.6, 0.6, 0.6],
        label: "balanced",
      },
    ];

    return clusterCenters;
  }
}

export default LearningModel;
