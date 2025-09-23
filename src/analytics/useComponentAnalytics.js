// Portions of this file were generated with the assistance of GitHub Copilot

import { useEffect, useRef } from "react";

import { useAnalytics } from "./AnalyticsContext";

/**
 * useComponentAnalytics - Custom hook for tracking component analytics
 *
 * This hook provides easy integration of analytics tracking for any component.
 * It automatically tracks component mount, unmount, and interaction events.
 *
 * @param {string} componentName - Name of the component for tracking
 * @param {Object} options - Configuration options
 * @param {boolean} options.trackMountUnmount - Whether to track mount/unmount events
 * @param {boolean} options.trackVisibility - Whether to track visibility changes
 * @param {boolean} options.trackInteractions - Whether to track interactions
 * @param {Object} componentData - Additional data to include with events
 * @returns {Object} - Analytics tracking functions
 */
const useComponentAnalytics = (
  componentName,
  options = {
    trackMountUnmount: true,
    trackVisibility: false,
    trackInteractions: true,
  },
  componentData = {},
) => {
  const { trackEvent, isInitialized, isPrivacyEnabled } = useAnalytics();
  const mountTimeRef = useRef(Date.now());
  const visibilityObserverRef = useRef(null);
  const componentRef = useRef(null);
  const interactionsRef = useRef({
    clicks: 0,
    keyPresses: 0,
    hovers: 0,
    scrolls: 0,
    lastInteractionTime: Date.now(),
  });

  // Track component mount and setup observers
  useEffect(() => {
    if (!isInitialized || isPrivacyEnabled) return;

    // Track component mount
    if (options.trackMountUnmount) {
      trackEvent("component_mount", {
        componentName,
        timestamp: Date.now(),
        ...componentData,
      });
    }

    // Setup visibility observer
    if (options.trackVisibility && componentRef.current) {
      setupVisibilityTracking();
    }

    // Track component unmount and cleanup
    return () => {
      if (options.trackMountUnmount) {
        const mountDuration = Date.now() - mountTimeRef.current;

        trackEvent("component_unmount", {
          componentName,
          mountDuration,
          timestamp: Date.now(),
          interactions: { ...interactionsRef.current },
          ...componentData,
        });
      }

      // Clean up visibility observer
      if (visibilityObserverRef.current) {
        visibilityObserverRef.current.disconnect();
      }
    };
  }, [componentName, isInitialized, isPrivacyEnabled]);

  // Setup visibility tracking with Intersection Observer
  const setupVisibilityTracking = () => {
    if (!("IntersectionObserver" in window)) return;

    visibilityObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent("component_visible", {
              componentName,
              timestamp: Date.now(),
              ...componentData,
            });
          } else {
            trackEvent("component_hidden", {
              componentName,
              timestamp: Date.now(),
              visibleDuration: Date.now() - mountTimeRef.current,
              ...componentData,
            });
          }
        });
      },
      { threshold: 0.1 }, // 10% visibility threshold
    );

    visibilityObserverRef.current.observe(componentRef.current);
  };

  // Track component interaction
  const trackInteraction = (interactionType, interactionData = {}) => {
    if (!isInitialized || isPrivacyEnabled) return;

    // Update interaction counts
    const now = Date.now();
    const timeSinceLastInteraction = now - interactionsRef.current.lastInteractionTime;
    interactionsRef.current.lastInteractionTime = now;

    if (interactionType === "click") {
      interactionsRef.current.clicks++;
    } else if (interactionType === "key") {
      interactionsRef.current.keyPresses++;
    } else if (interactionType === "hover") {
      interactionsRef.current.hovers++;
    } else if (interactionType === "scroll") {
      interactionsRef.current.scrolls++;
    }

    // Track the event
    trackEvent(`component_${interactionType}`, {
      componentName,
      timestamp: now,
      timeSinceLastInteraction,
      interactionCounts: { ...interactionsRef.current },
      ...componentData,
      ...interactionData,
    });
  };

  // Track click interaction
  const trackClick = (elementId, extraData = {}) => {
    if (!options.trackInteractions) return;
    trackInteraction("click", { elementId, ...extraData });
  };

  // Track key interaction
  const trackKey = (key, extraData = {}) => {
    if (!options.trackInteractions) return;
    trackInteraction("key", { key, ...extraData });
  };

  // Track hover interaction
  const trackHover = (elementId, extraData = {}) => {
    if (!options.trackInteractions) return;
    trackInteraction("hover", { elementId, ...extraData });
  };

  // Track scroll interaction
  const trackScroll = (scrollData, extraData = {}) => {
    if (!options.trackInteractions) return;
    trackInteraction("scroll", { ...scrollData, ...extraData });
  };

  // Track custom component event
  const trackComponentEvent = (eventName, eventData = {}) => {
    if (!isInitialized || isPrivacyEnabled) return;

    trackEvent(`component_${eventName}`, {
      componentName,
      timestamp: Date.now(),
      ...componentData,
      ...eventData,
    });
  };

  // Create event handlers that can be spread onto elements
  const getClickHandler = (elementId, handler, extraData = {}) => {
    return (event) => {
      if (options.trackInteractions) {
        trackClick(elementId, extraData);
      }
      if (handler) {
        handler(event);
      }
    };
  };

  const getHoverHandlers = (elementId, handlers = {}, extraData = {}) => {
    return {
      onMouseEnter: (event) => {
        if (options.trackInteractions) {
          trackHover(elementId, { state: "enter", ...extraData });
        }
        if (handlers.onMouseEnter) {
          handlers.onMouseEnter(event);
        }
      },
      onMouseLeave: (event) => {
        if (options.trackInteractions) {
          trackHover(elementId, { state: "leave", ...extraData });
        }
        if (handlers.onMouseLeave) {
          handlers.onMouseLeave(event);
        }
      },
    };
  };

  // Return the hook API
  return {
    componentRef,
    trackClick,
    trackKey,
    trackHover,
    trackScroll,
    trackComponentEvent,
    getClickHandler,
    getHoverHandlers,
  };
};

export default useComponentAnalytics;
