import { useEffect, useRef, useState } from "react";
import { useEngagementSensors, useLearningPathControls } from "../stores/automationStore";

// A hook that provides easy access to the automation system for learning paths
export const useLearningAutomation = (options = {}) => {
  const {
    autoStart = false,
    initialSpeed = 1.0,
    initialModules = [],
    trackEngagement = true,
    engagementCheckInterval = 5000, // 5 seconds
    customThresholds = {},
  } = options;

  // Get our store selectors
  const pathControls = useLearningPathControls();
  const engagementSystem = useEngagementSensors();

  // Local state for tracking interactions within this component
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [interactionCount, setInteractionCount] = useState(0);
  const interactionTimer = useRef(null);
  const engagementTimer = useRef(null);

  // Initialize the learning path
  useEffect(() => {
    // Set initial modules if provided
    if (initialModules && initialModules.length > 0) {
      pathControls.addToModuleQueue(initialModules);
    }

    // Set initial speed
    if (initialSpeed !== 1.0) {
      pathControls.setLearningPathSpeed(initialSpeed);
    }

    // Set custom engagement thresholds if provided
    if (Object.keys(customThresholds).length > 0) {
      engagementSystem.setSensorThresholds(customThresholds);
    }

    // Auto-start if enabled
    if (autoStart && initialModules && initialModules.length > 0) {
      pathControls.startLearningPath();
    }

    // Start tracking engagement if enabled
    if (trackEngagement) {
      startEngagementTracking();
    }

    // Cleanup timers on unmount
    return () => {
      if (interactionTimer.current) {
        clearInterval(interactionTimer.current);
      }

      if (engagementTimer.current) {
        clearInterval(engagementTimer.current);
      }
    };
  }, []);

  // Start engagement tracking
  const startEngagementTracking = () => {
    // Set up timer to check user engagement
    engagementTimer.current = setInterval(() => {
      const now = Date.now();
      const secondsSinceLastInteraction = (now - lastInteraction) / 1000;

      // Calculate interactions per minute
      const interactionsPerMinute = interactionCount / (secondsSinceLastInteraction / 60);

      // Update the engagement sensors
      engagementSystem.updateEngagementSensors({
        interactionFrequency: interactionsPerMinute,
        timeOnContent: secondsSinceLastInteraction,
        // Note: attentionLevel would typically come from eye tracking or other metrics
        // For demo purposes, we'll estimate it based on interaction frequency
        attentionLevel: Math.max(0, 100 - secondsSinceLastInteraction * 2),
      });

      // Reset interaction count periodically
      if (secondsSinceLastInteraction > 60) {
        setInteractionCount(0);
        setLastInteraction(now);
      }
    }, engagementCheckInterval);
  };

  // Function to track user interactions with content
  const trackInteraction = (interactionType = "click", metadata = {}) => {
    setLastInteraction(Date.now());
    setInteractionCount((prev) => prev + 1);

    // This could be extended to track different types of interactions
    // and their impact on engagement levels

    return {
      type: interactionType,
      timestamp: Date.now(),
      ...metadata,
    };
  };

  // Simplified function to get current status
  const getStatus = () => {
    return {
      isActive: pathControls.learningPathActive,
      currentSpeed: pathControls.learningPathSpeed,
      queueLength: pathControls.currentModuleQueue.length,
      engagementLevel: engagementSystem.engagementSensors.attentionLevel,
    };
  };

  // Return the enhanced learning path controls with engagement tracking
  return {
    // Pass through the core controls
    startLearningPath: pathControls.startLearningPath,
    stopLearningPath: pathControls.stopLearningPath,
    adjustSpeed: pathControls.setLearningPathSpeed,
    addModules: pathControls.addToModuleQueue,
    clearModules: pathControls.clearModuleQueue,

    // Enhanced controls with engagement tracking
    trackInteraction,
    getStatus,

    // Direct access to state
    isActive: pathControls.learningPathActive,
    currentSpeed: pathControls.learningPathSpeed,
    moduleQueue: pathControls.currentModuleQueue,
    engagementMetrics: engagementSystem.engagementSensors,
  };
};

export default useLearningAutomation;
