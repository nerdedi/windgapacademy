// Portions of this file were generated with the assistance of GitHub Copilot

import React, { createContext, useContext, useState, useEffect } from 'react';
import analyticsService from './AnalyticsService';
import LearningModel from './LearningModel';

// Create the context
const AnalyticsContext = createContext();

/**
 * Analytics Provider - Context provider for analytics functionality
 * 
 * This component provides analytics functions and data to the entire application,
 * including tracking, insights, and personalization features.
 */
export const AnalyticsProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [learningModel, setLearningModel] = useState(null);
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(
    localStorage.getItem('analyticsPrivacy') === 'enabled'
  );

  // Initialize analytics service and learning model
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Skip initialization if privacy mode is enabled
        if (isPrivacyEnabled) {
          analyticsService.disable();
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // Initialize the analytics service
        await analyticsService.initialize({
          disabled: isPrivacyEnabled,
          bufferSize: 5,
          bufferTimeout: 10000
        });

        // Initialize the learning model
        const model = new LearningModel();
        await model.initialize();
        setLearningModel(model);

        // Set initialized flag
        setIsInitialized(true);
        setIsLoading(false);

        // Load initial insights and recommendations
        refreshInsightsAndRecommendations();

        // Set up event listeners for tracking page views
        setupPageViewTracking();
      } catch (error) {
        console.error('Error initializing analytics:', error);
        setIsLoading(false);
      }
    };

    initializeAnalytics();

    // Cleanup function
    return () => {
      if (isInitialized && !isPrivacyEnabled) {
        analyticsService.dispose();
      }
    };
  }, [isPrivacyEnabled]);

  // Setup page view tracking
  const setupPageViewTracking = () => {
    // Track initial page view
    trackPageView();

    // Set up history change listener for SPA navigation
    const handleRouteChange = () => {
      trackPageView();
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    // Clean up listener
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  };

  // Track page view
  const trackPageView = () => {
    if (!isInitialized || isPrivacyEnabled) return;

    analyticsService.trackEvent('page_view', {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer
    });
  };

  // Track general event
  const trackEvent = (eventName, eventData = {}) => {
    if (!isInitialized || isPrivacyEnabled) return;
    analyticsService.trackEvent(eventName, eventData);
  };

  // Track lesson event
  const trackLesson = (action, lessonData) => {
    if (!isInitialized || isPrivacyEnabled) return;

    const eventName = `lesson_${action}`;
    analyticsService.trackEvent(eventName, {
      ...lessonData,
      timestamp: Date.now()
    });
  };

  // Track quiz event
  const trackQuiz = (action, quizData) => {
    if (!isInitialized || isPrivacyEnabled) return;

    const eventName = `quiz_${action}`;
    analyticsService.trackEvent(eventName, {
      ...quizData,
      timestamp: Date.now()
    });
  };

  // Track exercise event
  const trackExercise = (action, exerciseData) => {
    if (!isInitialized || isPrivacyEnabled) return;

    const eventName = `exercise_${action}`;
    analyticsService.trackEvent(eventName, {
      ...exerciseData,
      timestamp: Date.now()
    });
  };

  // Track media event
  const trackMedia = (action, mediaData) => {
    if (!isInitialized || isPrivacyEnabled) return;

    const eventName = `media_${action}`;
    analyticsService.trackEvent(eventName, {
      ...mediaData,
      timestamp: Date.now()
    });
  };

  // Track user interaction
  const trackInteraction = (interactionType, interactionData) => {
    if (!isInitialized || isPrivacyEnabled) return;

    analyticsService.trackEvent(interactionType, {
      ...interactionData,
      timestamp: Date.now()
    });
  };

  // Refresh insights and recommendations
  const refreshInsightsAndRecommendations = () => {
    if (!isInitialized || isPrivacyEnabled) return;

    setIsLoading(true);

    try {
      // Get insights from analytics service
      const insightsData = analyticsService.getInsights();
      setInsights(insightsData);

      // Get recommendations from analytics service
      const recommendationsData = analyticsService.getRecommendations();
      setRecommendations(recommendationsData);

      // If learning model is available, process with ML
      if (learningModel) {
        const enhancedInsights = learningModel.processUserData(
          analyticsService.events,
          analyticsService.learningPatterns
        );

        // Merge model insights with standard insights
        setInsights(prevInsights => ({
          ...prevInsights,
          learningStyle: enhancedInsights.learningStyle,
          mlEnhanced: true,
          enhancedStrengths: enhancedInsights.strengths,
          enhancedWeaknesses: enhancedInsights.weaknesses
        }));
      }
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle privacy mode
  const togglePrivacyMode = () => {
    const newPrivacyState = !isPrivacyEnabled;
    setIsPrivacyEnabled(newPrivacyState);

    if (newPrivacyState) {
      analyticsService.disable();
      localStorage.setItem('analyticsPrivacy', 'enabled');
    } else {
      analyticsService.enable();
      localStorage.setItem('analyticsPrivacy', 'disabled');
      
      // Re-initialize if needed
      if (isInitialized) {
        refreshInsightsAndRecommendations();
      }
    }
  };

  // Get personalized learning content
  const getPersonalizedContent = (availableContent, topic) => {
    if (!isInitialized || isPrivacyEnabled || !insights) {
      // Return default content when analytics is disabled or no insights
      return availableContent;
    }

    try {
      // Get user's preferred content types
      const preferredTypes = Object.entries(insights.preferredContentTypes || {})
        .sort((a, b) => b[1] - a[1])
        .map(([type]) => type);
      
      // If no preferences, return original content
      if (preferredTypes.length === 0) {
        return availableContent;
      }
      
      // Check if topic is a strength or weakness
      const isStrength = insights.strengths.includes(topic);
      const isWeakness = insights.weaknesses.includes(topic);
      
      // Sort content based on preferences and topic status
      return [...availableContent].sort((a, b) => {
        // Calculate preference score for item A
        let scoreA = preferredTypes.includes(a.type) ? 
          preferredTypes.indexOf(a.type) * -1 + preferredTypes.length : 0;
          
        // Adjust score based on topic status and content difficulty
        if (isWeakness && a.difficulty === 'beginner') scoreA += 3;
        if (isStrength && a.difficulty === 'advanced') scoreA += 3;
        
        // Calculate preference score for item B
        let scoreB = preferredTypes.includes(b.type) ? 
          preferredTypes.indexOf(b.type) * -1 + preferredTypes.length : 0;
          
        // Adjust score based on topic status and content difficulty
        if (isWeakness && b.difficulty === 'beginner') scoreB += 3;
        if (isStrength && b.difficulty === 'advanced') scoreB += 3;
        
        return scoreB - scoreA;
      });
    } catch (error) {
      console.error('Error personalizing content:', error);
      return availableContent;
    }
  };

  // Generate a personalized learning path
  const generatePersonalizedPath = (topics, contentTypes) => {
    if (!isInitialized || isPrivacyEnabled || !recommendations) {
      // Return default path when analytics is disabled or no recommendations
      return topics.map(topic => ({
        topic,
        contentType: contentTypes[0],
        reason: 'Default path'
      }));
    }

    try {
      // Use existing recommendations if available
      if (recommendations.recommendedLearningPath && 
          recommendations.recommendedLearningPath.length > 0) {
        return recommendations.recommendedLearningPath;
      }
      
      // Otherwise, create a simple path with preferred content types
      const preferredTypes = recommendations.effectiveContentTypes || [contentTypes[0]];
      
      // Prioritize weak topics first, then new topics, then strong topics
      const weakTopics = recommendations.topicsToReinforce || [];
      const existingTopics = new Set([...weakTopics, ...topics]);
      const strongTopics = topics.filter(topic => !weakTopics.includes(topic));
      
      // Build the path
      const path = [];
      
      // Add weak topics first
      weakTopics.forEach((topic, index) => {
        path.push({
          topic,
          contentType: preferredTypes[index % preferredTypes.length],
          reason: 'Topic needs reinforcement'
        });
      });
      
      // Add strong topics next
      strongTopics.forEach((topic, index) => {
        path.push({
          topic,
          contentType: preferredTypes[(index + weakTopics.length) % preferredTypes.length],
          reason: 'Topic to build upon'
        });
      });
      
      return path;
    } catch (error) {
      console.error('Error generating personalized path:', error);
      return topics.map(topic => ({
        topic,
        contentType: contentTypes[0],
        reason: 'Default path (error recovery)'
      }));
    }
  };

  // Context value
  const contextValue = {
    isInitialized,
    isLoading,
    insights,
    recommendations,
    isPrivacyEnabled,
    trackEvent,
    trackLesson,
    trackQuiz,
    trackExercise,
    trackMedia,
    trackInteraction,
    refreshInsightsAndRecommendations,
    togglePrivacyMode,
    getPersonalizedContent,
    generatePersonalizedPath
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook for using analytics
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;