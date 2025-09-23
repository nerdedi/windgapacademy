// Portions of this file were generated with the assistance of GitHub Copilot

import React, { useEffect, useRef } from "react";

import { useAnalytics } from "../analytics";

import { useAdaptiveUI } from "./AdaptiveUIContext";

/**
 * AdaptiveUISystem - Core system that applies global UI adaptations
 *
 * This component monitors user behavior and applies global UI adaptations
 * based on user patterns, device capabilities, and accessibility needs.
 * It applies:
 * - Theme adaptations (color scheme, contrast)
 * - Layout adaptations (spacing, organization)
 * - Motion adaptations (animation reduction)
 * - Complexity adaptations (UI density, feature visibility)
 * - Learning style adaptations (visual, auditory, etc.)
 */
const AdaptiveUISystem = () => {
  // Get adaptive UI context
  const {
    adaptationsEnabled,
    userPatterns,
    deviceCapabilities,
    motionReduced,
    colorScheme,
    uiComplexity,
    setColorScheme,
    setMotionReduced,
    setUIComplexity,
    setFocusMode,
    setPrefersLargeText,
    setContrastMode,
    setContentPriority,
  } = useAdaptiveUI();

  // Get analytics for measuring user behavior
  const { getUserInsights } = useAnalytics();

  // Track time spent in application
  const sessionStartRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());
  const adaptationAppliedRef = useRef({});

  // Apply initial adaptations based on system preferences
  useEffect(() => {
    if (!adaptationsEnabled) return;

    // Check system preferences
    if (window.matchMedia) {
      // Check for color scheme preference
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDarkScheme) {
        setColorScheme("dark");
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setMotionReduced(true);
      }

      // Check for contrast preference
      const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
      if (prefersHighContrast) {
        setContrastMode("high");
      }

      // Check for large text preference
      const prefersLargeText = window.matchMedia("(prefers-larger-text)").matches;
      if (prefersLargeText) {
        setPrefersLargeText(true);
      }
    }

    // Set initial UI complexity based on device
    if (deviceCapabilities.isSmallScreen || deviceCapabilities.isLowPower) {
      setUIComplexity("simple");
    } else if (deviceCapabilities.isHighPerformance) {
      setUIComplexity("advanced");
    }
  }, [
    adaptationsEnabled,
    deviceCapabilities,
    setColorScheme,
    setMotionReduced,
    setUIComplexity,
    setContrastMode,
    setPrefersLargeText,
  ]);

  // Track user activity
  useEffect(() => {
    if (!adaptationsEnabled) return;

    const trackActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Add activity tracking events
    window.addEventListener("mousemove", trackActivity);
    window.addEventListener("keydown", trackActivity);
    window.addEventListener("touchstart", trackActivity);
    window.addEventListener("click", trackActivity);

    // Set up interval to check for inactivity
    const checkInactivityInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current;

      // If inactive for more than 5 minutes, consider this a focus opportunity
      if (inactiveTime > 5 * 60 * 1000) {
        setFocusMode(true);
      } else {
        setFocusMode(false);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      // Clean up event listeners
      window.removeEventListener("mousemove", trackActivity);
      window.removeEventListener("keydown", trackActivity);
      window.removeEventListener("touchstart", trackActivity);
      window.removeEventListener("click", trackActivity);

      clearInterval(checkInactivityInterval);
    };
  }, [adaptationsEnabled, setFocusMode]);

  // Apply adaptations based on user insights and patterns
  useEffect(() => {
    if (!adaptationsEnabled) return;

    // Function to apply adaptations based on insights
    const applyAdaptations = async () => {
      try {
        // Get user insights from analytics
        const insights = await getUserInsights();

        if (!insights) return;

        // Apply adaptations based on session length
        const sessionLength = insights.averageSessionDuration;
        if (sessionLength && !adaptationAppliedRef.current.sessionLength) {
          // For longer sessions, prioritize readability and focus
          if (sessionLength > 30 * 60 * 1000) {
            // 30 minutes
            setUIComplexity("focused");
            adaptationAppliedRef.current.sessionLength = true;
          }
        }

        // Apply adaptations based on time of day
        const hour = new Date().getHours();
        if (!adaptationAppliedRef.current.timeOfDay) {
          // Evening hours (after 6pm) - switch to dark mode
          if (hour >= 18 || hour < 6) {
            setColorScheme("dark");
            adaptationAppliedRef.current.timeOfDay = true;
          }
        }

        // Apply adaptations based on learning style
        const learningStyle = insights.learningStyle;
        if (learningStyle && !adaptationAppliedRef.current.learningStyle) {
          switch (learningStyle) {
            case "visual":
              setContentPriority(["diagrams", "images", "videos", "text"]);
              break;
            case "auditory":
              setContentPriority(["audio", "videos", "text", "diagrams"]);
              break;
            case "reading":
              setContentPriority(["text", "diagrams", "images", "videos"]);
              break;
            case "kinesthetic":
              setContentPriority(["interactive", "videos", "diagrams", "text"]);
              break;
            default:
              // Default balanced approach
              setContentPriority(["mixed"]);
              break;
          }
          adaptationAppliedRef.current.learningStyle = true;
        }

        // Apply adaptations based on error rates
        if (insights.errorRate > 0.2 && !adaptationAppliedRef.current.errorRate) {
          // If high error rate, simplify the UI
          setUIComplexity("simple");
          adaptationAppliedRef.current.errorRate = true;
        }

        // Apply adaptations based on page visit frequency
        if (
          insights.visitFrequency === "returning" &&
          !adaptationAppliedRef.current.visitFrequency
        ) {
          // For regular users, enable more advanced features
          setUIComplexity("advanced");
          adaptationAppliedRef.current.visitFrequency = true;
        }

        // Apply adaptations based on scroll behavior
        if (insights.scrollBehavior === "fast" && !adaptationAppliedRef.current.scrollBehavior) {
          // For fast scrollers, reduce animations and increase density
          setMotionReduced(true);
          setUIComplexity("dense");
          adaptationAppliedRef.current.scrollBehavior = true;
        }
      } catch (error) {
        console.error("Error applying adaptive UI insights:", error);
      }
    };

    // Initial application of adaptations
    applyAdaptations();

    // Set up interval to reapply adaptations periodically
    const adaptationInterval = setInterval(applyAdaptations, 15 * 60 * 1000); // Every 15 minutes

    return () => {
      clearInterval(adaptationInterval);
    };
  }, [
    adaptationsEnabled,
    getUserInsights,
    setColorScheme,
    setMotionReduced,
    setUIComplexity,
    setContentPriority,
  ]);

  // Add CSS variables based on current adaptations
  useEffect(() => {
    if (!adaptationsEnabled) return;

    const root = document.documentElement;

    // Apply color scheme
    if (colorScheme === "dark") {
      root.style.setProperty("--adaptive-bg-primary", "var(--color-dark-bg)");
      root.style.setProperty("--adaptive-text-primary", "var(--color-dark-text)");
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
    } else {
      root.style.setProperty("--adaptive-bg-primary", "var(--color-light-bg)");
      root.style.setProperty("--adaptive-text-primary", "var(--color-light-text)");
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    }

    // Apply motion settings
    if (motionReduced) {
      root.style.setProperty("--adaptive-transition-speed", "0s");
      root.style.setProperty("--adaptive-animation-play-state", "paused");
      root.classList.add("reduced-motion");
    } else {
      root.style.setProperty("--adaptive-transition-speed", "var(--transition-normal)");
      root.style.setProperty("--adaptive-animation-play-state", "running");
      root.classList.remove("reduced-motion");
    }

    // Apply UI complexity
    root.setAttribute("data-ui-complexity", uiComplexity);

    switch (uiComplexity) {
      case "simple":
        root.style.setProperty("--adaptive-spacing", "var(--spacing-loose)");
        root.style.setProperty("--adaptive-ui-density", "0.8");
        break;
      case "focused":
        root.style.setProperty("--adaptive-spacing", "var(--spacing-normal)");
        root.style.setProperty("--adaptive-ui-density", "0.9");
        break;
      case "dense":
        root.style.setProperty("--adaptive-spacing", "var(--spacing-tight)");
        root.style.setProperty("--adaptive-ui-density", "1.2");
        break;
      case "advanced":
        root.style.setProperty("--adaptive-spacing", "var(--spacing-tight)");
        root.style.setProperty("--adaptive-ui-density", "1.1");
        break;
      default: // balanced
        root.style.setProperty("--adaptive-spacing", "var(--spacing-normal)");
        root.style.setProperty("--adaptive-ui-density", "1");
        break;
    }
  }, [adaptationsEnabled, colorScheme, motionReduced, uiComplexity]);

  // Render nothing - this is a behavior-only component
  return null;
};

export default AdaptiveUISystem;
