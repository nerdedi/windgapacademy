// Portions of this file were generated with the assistance of GitHub Copilot

import { useEffect, useState, useRef, useCallback } from "react";

import { useAnalytics } from "../analytics";

import { useAdaptiveUI } from "./AdaptiveUIContext";

/**
 * useComponentAdaptive - A hook for component-level UI adaptations
 *
 * This hook enables individual components to adapt based on user behavior,
 * current context, and component-specific usage patterns.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.componentId - Unique identifier for the component
 * @param {string} options.componentType - Type of component (e.g., "navigation", "content", "interactive")
 * @param {Object} options.defaultSettings - Default settings for the component
 * @param {boolean} options.trackUsage - Whether to track usage of this component
 * @returns {Object} Adaptive properties and functions for the component
 */
export const useComponentAdaptive = ({
  componentId,
  componentType = "generic",
  defaultSettings = {},
  trackUsage = true,
}) => {
  // Get global adaptive UI context
  const {
    adaptationsEnabled,
    userPatterns,
    deviceCapabilities,
    motionReduced,
    focusMode,
    uiComplexity,
    colorScheme,
    getAdaptiveClasses,
    getAdaptedComponents,
  } = useAdaptiveUI();

  // Get analytics for tracking component usage
  const { trackEvent, getUserComponentInsights } = useAnalytics();

  // Component-specific state
  const [componentSettings, setComponentSettings] = useState(defaultSettings);
  const [usagePatterns, setUsagePatterns] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(null);
  const [adaptiveProps, setAdaptiveProps] = useState({});
  const [hasAdapted, setHasAdapted] = useState(false);

  // Refs
  const componentRef = useRef(null);
  const interactionTimeoutRef = useRef(null);

  // Track visibility using Intersection Observer
  useEffect(() => {
    if (!componentRef.current || !trackUsage) return;

    const currentElement = componentRef.current;
    let startVisibleTime = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            startVisibleTime = Date.now();

            // Track component viewed event
            trackEvent({
              category: "component_interaction",
              action: "view",
              label: componentId,
              componentType,
            });
          } else {
            setIsVisible(false);

            // If we have a start time, calculate view duration
            if (startVisibleTime) {
              const viewDuration = Date.now() - startVisibleTime;

              // Track view duration
              trackEvent({
                category: "component_interaction",
                action: "view_duration",
                label: componentId,
                value: viewDuration,
                componentType,
              });

              startVisibleTime = null;
            }
          }
        });
      },
      { threshold: 0.1 }, // Consider visible when 10% is in viewport
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [componentRef.current, trackUsage, trackEvent, componentId, componentType]);

  // Load component insights on mount
  useEffect(() => {
    if (!trackUsage || !componentId) return;

    const loadInsights = async () => {
      const insights = await getUserComponentInsights(componentId);
      if (insights) {
        setUsagePatterns(insights);
      }
    };

    loadInsights();
  }, [trackUsage, componentId, getUserComponentInsights]);

  // Adapt component based on user patterns and component insights
  useEffect(() => {
    if (!adaptationsEnabled || !componentType) return;

    // Skip adaptation if already adapted and no new data
    if (hasAdapted && !usagePatterns.lastUpdated) return;

    try {
      // Get adapted component
      const adaptation = getAdaptedComponents(componentType, defaultSettings);

      // Base adaptive properties
      let adaptProps = {
        variant: adaptation.component,
        ...adaptation.props,
      };

      // Add device-specific adaptations
      if (deviceCapabilities.isTouch) {
        adaptProps.touchOptimized = true;
        adaptProps.interactionMode = "touch";
      }

      if (deviceCapabilities.isSmallScreen) {
        adaptProps.compactLayout = true;
      }

      // Adapt based on component usage patterns
      if (usagePatterns) {
        // If user rarely interacts with this component
        if (usagePatterns.interactionFrequency === "low") {
          adaptProps.prominence = "higher";
          adaptProps.helpIndicators = true;
        }

        // If user frequently interacts with this component
        if (usagePatterns.interactionFrequency === "high") {
          adaptProps.prominence = "standard";
          adaptProps.shortcuts = true;
          adaptProps.advanced = true;
        }

        // If user has difficulty with this component
        if (usagePatterns.errorRate > 0.3) {
          // 30% error rate
          adaptProps.simplifyInteraction = true;
          adaptProps.enhancedGuidance = true;
          adaptProps.errorPrevention = true;
        }
      }

      // Apply focus mode adaptations
      if (focusMode) {
        adaptProps.minimizeDistraction = true;
        adaptProps.emphasizeContent = true;
      }

      // Apply complexity adaptations
      adaptProps.complexity = uiComplexity;

      // Reduce motion if needed
      if (motionReduced) {
        adaptProps.animations = "minimal";
      }

      // Apply adaptations based on learning style
      const learningStyle = userPatterns?.learningStyle || "balanced";
      adaptProps.learningStyle = learningStyle;

      switch (learningStyle) {
        case "visual":
          adaptProps.visualEmphasis = true;
          break;
        case "auditory":
          adaptProps.auditoryEmphasis = true;
          break;
        case "kinesthetic":
          adaptProps.interactivityEmphasis = true;
          break;
        case "social":
          adaptProps.collaborationEmphasis = true;
          break;
      }

      // Update the adaptive props
      setAdaptiveProps(adaptProps);
      setHasAdapted(true);
    } catch (error) {
      console.error(`Error adapting component ${componentId}:`, error);
      // Fallback to default settings
      setAdaptiveProps({});
    }
  }, [
    adaptationsEnabled,
    componentType,
    defaultSettings,
    deviceCapabilities,
    focusMode,
    getAdaptedComponents,
    hasAdapted,
    motionReduced,
    uiComplexity,
    userPatterns,
    usagePatterns,
  ]);

  // Track interactions with the component
  const trackInteraction = useCallback(
    (action, data = {}) => {
      if (!trackUsage) return;

      // Update interaction count
      setInteractionCount((prev) => prev + 1);
      setLastInteraction({
        action,
        timestamp: Date.now(),
        data,
      });

      // Track the event
      trackEvent({
        category: "component_interaction",
        action,
        label: componentId,
        componentType,
        ...data,
      });

      // Clear existing timeout
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      // Set a timeout to track interaction session end
      interactionTimeoutRef.current = setTimeout(() => {
        trackEvent({
          category: "component_interaction",
          action: "session_end",
          label: componentId,
          value: interactionCount,
          componentType,
        });
      }, 5000); // 5 second timeout for session end
    },
    [trackUsage, componentId, componentType, interactionCount, trackEvent],
  );

  // Get classes for this component
  const getComponentClasses = useCallback(
    (baseClass = "") => {
      const adaptiveClass = getAdaptiveClasses(baseClass);

      // Add component-specific classes
      const classes = [adaptiveClass];

      if (focusMode) {
        classes.push(`${baseClass}-focus-mode`);
      }

      if (adaptiveProps.variant && adaptiveProps.variant !== "default") {
        classes.push(`${baseClass}-${adaptiveProps.variant}`);
      }

      if (adaptiveProps.learningStyle) {
        classes.push(`${baseClass}-${adaptiveProps.learningStyle}`);
      }

      if (adaptiveProps.complexity) {
        classes.push(`${baseClass}-${adaptiveProps.complexity}`);
      }

      return classes.filter(Boolean).join(" ");
    },
    [
      getAdaptiveClasses,
      focusMode,
      adaptiveProps.variant,
      adaptiveProps.learningStyle,
      adaptiveProps.complexity,
    ],
  );

  // Update component settings
  const updateComponentSetting = useCallback(
    (setting, value) => {
      setComponentSettings((prev) => ({
        ...prev,
        [setting]: value,
      }));

      // Track setting change
      if (trackUsage) {
        trackEvent({
          category: "component_setting",
          action: "update",
          label: `${componentId}-${setting}`,
          value: JSON.stringify(value),
          componentType,
        });
      }
    },
    [componentId, componentType, trackUsage, trackEvent],
  );

  return {
    // Refs
    componentRef,

    // State
    componentSettings,
    isVisible,
    interactionCount,
    lastInteraction,
    usagePatterns,
    adaptiveProps,

    // Functions
    trackInteraction,
    updateComponentSetting,
    getComponentClasses,

    // Context values passed through
    colorScheme,
    motionReduced,
    focusMode,
    deviceCapabilities,
  };
};

export default useComponentAdaptive;
