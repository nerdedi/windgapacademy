// Portions of this file were generated with the assistance of GitHub Copilot

import { auth, firestore } from '../../firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * AnalyticsService - Sophisticated analytics system with machine learning capabilities
 * 
 * This service captures, processes, and analyzes user interaction data to provide
 * insights for curriculum improvement and personalization.
 */
class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.userId = null;
    this.sessionId = null;
    this.events = [];
    this.eventBuffer = [];
    this.bufferSize = 10; // Flush after 10 events
    this.bufferTimeout = 5000; // Flush after 5 seconds
    this.bufferTimer = null;
    this.modelVersion = '1.0.0';
    this.learningPatterns = {};
    this.engagementScore = 0;
    this.lastActivityTimestamp = Date.now();
    this.analyticsDisabled = false;
    this.storageRef = null;
  }

  /**
   * Initialize the analytics service
   * @param {Object} options - Configuration options
   * @returns {Promise<void>}
   */
  async initialize(options = {}) {
    if (this.initialized) return;

    // Initialize with default or provided options
    this.bufferSize = options.bufferSize || this.bufferSize;
    this.bufferTimeout = options.bufferTimeout || this.bufferTimeout;
    this.analyticsDisabled = options.disabled || false;
    
    // Set up Firebase storage reference for model data
    const storage = getStorage();
    this.storageRef = ref(storage, 'analytics');
    
    // Try to get current user from Firebase Auth
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.userId = currentUser.uid;
      
      // Load user's learning patterns from Firestore
      await this.loadLearningPatterns();
    }
    
    // Create a new session ID
    this.sessionId = this.generateSessionId();
    
    // Set up event buffer flushing on interval
    this.startBufferTimer();
    
    // Listen for page visibility changes to track engagement
    this.setupVisibilityTracking();
    
    // Track window focus/blur for engagement metrics
    this.setupFocusTracking();
    
    // Set up unload handler to ensure events are sent before user leaves
    window.addEventListener('beforeunload', this.handleUnload.bind(this));
    
    this.initialized = true;
    
    // Record session start
    this.trackEvent('session_start', {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: Date.now()
    });
    
    // Initial model loading
    this.loadAnalyticsModel();
  }

  /**
   * Generate a unique session ID
   * @returns {string} - Unique session ID
   */
  generateSessionId() {
    return 'sess_' + 
      Date.now().toString(36) + 
      Math.random().toString(36).substring(2, 15);
  }

  /**
   * Track an analytics event
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data payload
   */
  trackEvent(eventName, eventData = {}) {
    if (!this.initialized || this.analyticsDisabled) return;
    
    const timestamp = Date.now();
    const timeSinceLastActivity = timestamp - this.lastActivityTimestamp;
    this.lastActivityTimestamp = timestamp;
    
    // Create the event object
    const event = {
      eventName,
      eventData,
      timestamp,
      sessionId: this.sessionId,
      userId: this.userId,
      timeSinceLastActivity,
      engagementScore: this.calculateEventEngagementScore(eventName, eventData, timeSinceLastActivity)
    };
    
    // Add to buffer and to the full events array
    this.eventBuffer.push(event);
    this.events.push(event);
    
    // Update overall engagement score
    this.updateEngagementScore(event);
    
    // Process the event for learning patterns
    this.processEventForLearningPatterns(event);
    
    // Flush buffer if it reaches the threshold
    if (this.eventBuffer.length >= this.bufferSize) {
      this.flushEventBuffer();
    }
  }

  /**
   * Calculate engagement score for an individual event
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data payload
   * @param {number} timeSinceLastActivity - Time in ms since last activity
   * @returns {number} - Engagement score for this event
   */
  calculateEventEngagementScore(eventName, eventData, timeSinceLastActivity) {
    // Base engagement values for different event types
    const eventScores = {
      'page_view': 1,
      'lesson_start': 5,
      'lesson_complete': 10,
      'quiz_start': 3,
      'quiz_complete': 8,
      'exercise_start': 4,
      'exercise_complete': 7,
      'video_play': 2,
      'video_complete': 6,
      'click': 0.5,
      'scroll': 0.2
    };
    
    // Base score from event type
    let score = eventScores[eventName] || 1;
    
    // Adjust for time since last activity
    // If time between events is too long, reduce score (user was likely away)
    if (timeSinceLastActivity > 300000) { // 5 minutes
      score *= 0.5;
    } else if (timeSinceLastActivity < 500) { // Very quick actions get bonus
      score *= 1.2;
    }
    
    // Adjust based on event-specific data
    if (eventData.timeSpent) {
      // More time spent = higher engagement, with diminishing returns
      score *= Math.min(2, 1 + (eventData.timeSpent / 60000)); // Cap at 2x for 1 minute
    }
    
    if (eventData.completionPercentage) {
      // Higher completion percentage = higher engagement
      score *= (0.5 + (eventData.completionPercentage / 200)); // 100% completion = 1.5x multiplier
    }
    
    return score;
  }

  /**
   * Update the overall user engagement score
   * @param {Object} event - The event object
   */
  updateEngagementScore(event) {
    // Exponential moving average to update engagement score
    // Recent events have more impact than older ones
    const alpha = 0.3; // Smoothing factor
    this.engagementScore = (alpha * event.engagementScore) + ((1 - alpha) * this.engagementScore);
  }

  /**
   * Process event data to extract learning patterns
   * @param {Object} event - The event object
   */
  processEventForLearningPatterns(event) {
    const { eventName, eventData } = event;
    
    // Only process certain types of events for learning patterns
    if (!['lesson_complete', 'quiz_complete', 'exercise_complete', 'video_complete'].includes(eventName)) {
      return;
    }
    
    // Extract topic information
    const topic = eventData.topic || eventData.category || 'unknown';
    
    // Initialize pattern data for this topic if it doesn't exist
    if (!this.learningPatterns[topic]) {
      this.learningPatterns[topic] = {
        strength: 0,
        timeSpent: 0,
        completions: 0,
        lastInteraction: Date.now(),
        preferredContentTypes: {},
        difficultyLevels: {},
        mistakes: []
      };
    }
    
    // Update pattern data
    const pattern = this.learningPatterns[topic];
    pattern.completions += 1;
    pattern.lastInteraction = Date.now();
    
    if (eventData.timeSpent) {
      pattern.timeSpent += eventData.timeSpent;
    }
    
    if (eventData.contentType) {
      pattern.preferredContentTypes[eventData.contentType] = 
        (pattern.preferredContentTypes[eventData.contentType] || 0) + 1;
    }
    
    if (eventData.difficultyLevel) {
      pattern.difficultyLevels[eventData.difficultyLevel] = 
        (pattern.difficultyLevels[eventData.difficultyLevel] || 0) + 1;
    }
    
    if (eventData.mistakes && Array.isArray(eventData.mistakes)) {
      pattern.mistakes = [...pattern.mistakes, ...eventData.mistakes];
    }
    
    // Calculate strength based on completions, recency, and performance
    const recencyFactor = Math.exp(-((Date.now() - pattern.lastInteraction) / (7 * 24 * 60 * 60 * 1000))); // Decay over a week
    const completionFactor = Math.min(1, pattern.completions / 10); // Cap at 10 completions
    const performanceFactor = eventData.score ? eventData.score / 100 : 0.5; // Default to 0.5 if no score
    
    pattern.strength = (0.4 * recencyFactor) + (0.3 * completionFactor) + (0.3 * performanceFactor);
    
    // Save updated patterns
    this.saveLearningPatterns();
  }

  /**
   * Save learning patterns to Firestore
   */
  async saveLearningPatterns() {
    if (!this.initialized || !this.userId) return;
    
    try {
      const userAnalyticsRef = doc(firestore, 'userAnalytics', this.userId);
      await setDoc(userAnalyticsRef, {
        learningPatterns: this.learningPatterns,
        engagementScore: this.engagementScore,
        lastUpdated: Date.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving learning patterns:', error);
    }
  }

  /**
   * Load learning patterns from Firestore
   */
  async loadLearningPatterns() {
    if (!this.userId) return;
    
    try {
      const userAnalyticsRef = doc(firestore, 'userAnalytics', this.userId);
      const docSnap = await getDocs(userAnalyticsRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.learningPatterns = data.learningPatterns || {};
        this.engagementScore = data.engagementScore || 0;
      }
    } catch (error) {
      console.error('Error loading learning patterns:', error);
    }
  }

  /**
   * Flush the event buffer to Firestore
   */
  async flushEventBuffer() {
    if (!this.initialized || this.eventBuffer.length === 0) return;
    
    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];
    
    try {
      // Group events by user for more efficient storage
      const batch = [];
      if (this.userId) {
        // Authenticated user - store in user's collection
        const userEventsRef = collection(firestore, 'userEvents', this.userId, 'events');
        for (const event of eventsToSend) {
          batch.push(addDoc(userEventsRef, event));
        }
      } else {
        // Anonymous user - store in anonymous events collection
        const anonEventsRef = collection(firestore, 'anonymousEvents');
        for (const event of eventsToSend) {
          batch.push(addDoc(anonEventsRef, event));
        }
      }
      
      // Execute all writes
      await Promise.all(batch);
      
      // Also send to aggregate analytics for real-time processing
      await this.sendToAggregateAnalytics(eventsToSend);
      
    } catch (error) {
      console.error('Error flushing event buffer:', error);
      // Put events back in buffer to try again later
      this.eventBuffer = [...eventsToSend, ...this.eventBuffer];
    }
  }

  /**
   * Send events to aggregate analytics collection for real-time processing
   * @param {Array} events - Events to send
   */
  async sendToAggregateAnalytics(events) {
    try {
      const aggregateRef = collection(firestore, 'aggregateAnalytics');
      
      // Compute some basic aggregate metrics
      const eventCounts = events.reduce((acc, event) => {
        acc[event.eventName] = (acc[event.eventName] || 0) + 1;
        return acc;
      }, {});
      
      const avgEngagement = events.reduce((sum, event) => sum + event.engagementScore, 0) / events.length;
      
      // Add to aggregate collection
      await addDoc(aggregateRef, {
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        eventCounts,
        totalEvents: events.length,
        avgEngagement
      });
    } catch (error) {
      console.error('Error sending to aggregate analytics:', error);
    }
  }

  /**
   * Start the buffer timer to periodically flush events
   */
  startBufferTimer() {
    this.bufferTimer = setInterval(() => {
      if (this.eventBuffer.length > 0) {
        this.flushEventBuffer();
      }
    }, this.bufferTimeout);
  }

  /**
   * Handle page visibility changes
   */
  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // User left the page, record time spent and flush events
        this.trackEvent('page_hidden', {
          timeSpent: Date.now() - this.lastActivityTimestamp
        });
        this.flushEventBuffer();
      } else {
        // User returned to the page
        this.trackEvent('page_visible', {
          timeSinceHidden: Date.now() - this.lastActivityTimestamp
        });
      }
    });
  }

  /**
   * Track window focus/blur for engagement metrics
   */
  setupFocusTracking() {
    window.addEventListener('focus', () => {
      this.trackEvent('window_focus');
    });
    
    window.addEventListener('blur', () => {
      this.trackEvent('window_blur');
    });
  }

  /**
   * Handle page unload
   */
  async handleUnload() {
    // Record session end
    this.trackEvent('session_end', {
      sessionDuration: Date.now() - this.events.find(e => e.eventName === 'session_start')?.timestamp,
      totalEvents: this.events.length,
      engagementScore: this.engagementScore
    });
    
    // Flush any remaining events
    await this.flushEventBuffer();
    
    // Clear interval
    clearInterval(this.bufferTimer);
  }

  /**
   * Get insights from the collected analytics data
   * @returns {Object} - Analytics insights
   */
  getInsights() {
    if (!this.initialized) return {};
    
    // Calculate time spent by topic
    const timeByTopic = Object.entries(this.learningPatterns).reduce((acc, [topic, data]) => {
      acc[topic] = data.timeSpent;
      return acc;
    }, {});
    
    // Find strengths (topics with highest strength scores)
    const strengths = Object.entries(this.learningPatterns)
      .sort((a, b) => b[1].strength - a[1].strength)
      .slice(0, 3)
      .map(([topic]) => topic);
    
    // Find weaknesses (topics with recent mistakes or low strength)
    const weaknesses = Object.entries(this.learningPatterns)
      .filter(([_, data]) => data.mistakes.length > 0 || data.strength < 0.3)
      .map(([topic]) => topic);
    
    // Calculate preferred content types across all topics
    const preferredContentTypes = Object.values(this.learningPatterns).reduce((acc, data) => {
      Object.entries(data.preferredContentTypes || {}).forEach(([type, count]) => {
        acc[type] = (acc[type] || 0) + count;
      });
      return acc;
    }, {});
    
    // Find optimal learning pace
    const completions = this.events.filter(e => e.eventName.includes('complete'));
    let learningPace = 'moderate';
    if (completions.length >= 2) {
      const avgTimeBetweenCompletions = completions
        .slice(1)
        .reduce((sum, event, i) => sum + (event.timestamp - completions[i].timestamp), 0) / (completions.length - 1);
      
      if (avgTimeBetweenCompletions < 300000) { // < 5 minutes
        learningPace = 'fast';
      } else if (avgTimeBetweenCompletions > 1800000) { // > 30 minutes
        learningPace = 'slow';
      }
    }
    
    return {
      engagementScore: this.engagementScore,
      timeByTopic,
      strengths,
      weaknesses,
      preferredContentTypes,
      learningPace,
      totalTimeSpent: this.events.reduce((sum, event) => sum + (event.eventData.timeSpent || 0), 0),
      lastActive: this.lastActivityTimestamp
    };
  }

  /**
   * Get recommendations based on the user's learning patterns
   * @returns {Object} - Personalized recommendations
   */
  getRecommendations() {
    if (!this.initialized) return {};
    
    // Find topics that need reinforcement (low strength or not visited recently)
    const topicsToReinforce = Object.entries(this.learningPatterns)
      .filter(([_, data]) => {
        const daysSinceLastInteraction = (Date.now() - data.lastInteraction) / (24 * 60 * 60 * 1000);
        return data.strength < 0.5 || daysSinceLastInteraction > 7;
      })
      .map(([topic]) => topic);
    
    // Find most effective content types based on engagement
    const effectiveContentTypes = Object.entries(
      Object.values(this.learningPatterns).reduce((acc, data) => {
        Object.entries(data.preferredContentTypes || {}).forEach(([type, count]) => {
          acc[type] = (acc[type] || 0) + count;
        });
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);
    
    // Determine optimal difficulty level
    const difficultyLevels = Object.values(this.learningPatterns).reduce((acc, data) => {
      Object.entries(data.difficultyLevels || {}).forEach(([level, count]) => {
        acc[level] = (acc[level] || 0) + count;
      });
      return acc;
    }, {});
    
    const optimalDifficulty = Object.entries(difficultyLevels)
      .sort((a, b) => b[1] - a[1])
      .map(([level]) => level)[0] || 'intermediate';
    
    // Determine if user needs a break based on recent activity and engagement
    const needsBreak = this.events.length > 20 && 
      this.events.slice(-5).every(e => e.engagementScore < this.engagementScore * 0.7);
    
    return {
      topicsToReinforce,
      effectiveContentTypes,
      optimalDifficulty,
      needsBreak,
      recommendedTimePerSession: this.calculateRecommendedSessionTime(),
      recommendedLearningPath: this.generateLearningPathRecommendation()
    };
  }

  /**
   * Calculate recommended session time based on user patterns
   * @returns {number} - Recommended session time in minutes
   */
  calculateRecommendedSessionTime() {
    // Default is 30 minutes
    if (this.events.length < 10) return 30;
    
    // Calculate average session duration from past sessions
    const sessionStarts = this.events.filter(e => e.eventName === 'session_start');
    const sessionEnds = this.events.filter(e => e.eventName === 'session_end');
    
    if (sessionStarts.length > 1 && sessionEnds.length > 0) {
      const durations = [];
      for (let i = 0; i < Math.min(sessionStarts.length - 1, sessionEnds.length); i++) {
        durations.push(sessionEnds[i].timestamp - sessionStarts[i].timestamp);
      }
      
      const avgDurationMs = durations.reduce((sum, dur) => sum + dur, 0) / durations.length;
      const avgMinutes = Math.round(avgDurationMs / (60 * 1000));
      
      // Adjust based on engagement score trend
      const engagementTrend = this.calculateEngagementTrend();
      
      if (engagementTrend > 0.1) {
        // Engagement increasing - suggest slightly longer sessions
        return Math.min(60, avgMinutes * 1.2);
      } else if (engagementTrend < -0.1) {
        // Engagement decreasing - suggest shorter sessions
        return Math.max(15, avgMinutes * 0.8);
      }
      
      return avgMinutes;
    }
    
    return 30; // Default
  }

  /**
   * Calculate the trend in engagement score
   * @returns {number} - Trend coefficient (-1 to 1)
   */
  calculateEngagementTrend() {
    if (this.events.length < 10) return 0;
    
    // Get engagement scores from the last 10 events
    const recentScores = this.events.slice(-10).map(e => e.engagementScore);
    
    // Simple linear regression
    const n = recentScores.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = recentScores;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + (xi * y[i]), 0);
    const sumXX = x.reduce((sum, xi) => sum + (xi * xi), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Normalize to -1 to 1 range
    return Math.max(-1, Math.min(1, slope));
  }

  /**
   * Generate a personalized learning path recommendation
   * @returns {Array} - Recommended learning path steps
   */
  generateLearningPathRecommendation() {
    if (Object.keys(this.learningPatterns).length === 0) {
      return []; // Not enough data
    }
    
    // Get topics sorted by strength (ascending, so weakest first)
    const sortedTopics = Object.entries(this.learningPatterns)
      .sort((a, b) => a[1].strength - b[1].strength)
      .map(([topic]) => topic);
    
    // Get preferred content types
    const contentPreferences = Object.values(this.learningPatterns).reduce((acc, data) => {
      Object.entries(data.preferredContentTypes || {}).forEach(([type, count]) => {
        acc[type] = (acc[type] || 0) + count;
      });
      return acc;
    }, {});
    
    const preferredTypes = Object.entries(contentPreferences)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
    
    // Build learning path (focus on weak topics first, then move to stronger ones)
    const path = [];
    
    // Add weak topics with preferred content types
    for (let i = 0; i < Math.min(3, sortedTopics.length); i++) {
      const topic = sortedTopics[i];
      const contentType = preferredTypes[i % preferredTypes.length];
      
      path.push({
        topic,
        contentType,
        reason: `This is one of your weaker areas (strength: ${this.learningPatterns[topic].strength.toFixed(2)}).`
      });
    }
    
    // Add some stronger topics for reinforcement
    for (let i = Math.max(0, sortedTopics.length - 2); i < sortedTopics.length; i++) {
      const topic = sortedTopics[i];
      const contentType = preferredTypes[(i + 1) % preferredTypes.length];
      
      path.push({
        topic,
        contentType,
        reason: `Reinforcing one of your stronger areas (strength: ${this.learningPatterns[topic].strength.toFixed(2)}).`
      });
    }
    
    return path;
  }

  /**
   * Load the analytics ML model from Firebase Storage
   */
  async loadAnalyticsModel() {
    try {
      const modelRef = ref(this.storageRef, `models/analytics_model_${this.modelVersion}.json`);
      const modelUrl = await getDownloadURL(modelRef);
      
      const response = await fetch(modelUrl);
      const modelData = await response.json();
      
      // Initialize model (in a real app, this would be a ML model)
      console.log('Analytics model loaded:', modelData.version);
    } catch (error) {
      console.warn('Could not load analytics model, using default behavior:', error);
    }
  }

  /**
   * Disable analytics collection
   */
  disable() {
    this.analyticsDisabled = true;
  }

  /**
   * Enable analytics collection
   */
  enable() {
    this.analyticsDisabled = false;
  }

  /**
   * Clean up and release resources
   */
  dispose() {
    // Flush any pending events
    this.flushEventBuffer();
    
    // Clear timer
    clearInterval(this.bufferTimer);
    
    // Remove event listeners
    window.removeEventListener('beforeunload', this.handleUnload.bind(this));
    
    this.initialized = false;
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;