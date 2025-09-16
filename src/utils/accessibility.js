/**
 * Accessibility utilities for Windgap Academy
 *
 * This module provides utilities to ensure that the platform
 * respects user accessibility preferences and provides an inclusive experience.
 */

// Check if the user prefers reduced motion
export const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

// Check if the user prefers high contrast
export const prefersHighContrast =
  typeof window !== "undefined" ? window.matchMedia("(prefers-contrast: more)").matches : false;

// Listen for changes in user preferences
export const setupAccessibilityListeners = (callback) => {
  if (typeof window === "undefined") return () => {};

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const highContrastQuery = window.matchMedia("(prefers-contrast: more)");

  const handleReducedMotionChange = (e) => {
    callback({ type: "motion", value: e.matches });
  };

  const handleHighContrastChange = (e) => {
    callback({ type: "contrast", value: e.matches });
  };

  // Modern API
  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    highContrastQuery.addEventListener("change", handleHighContrastChange);
  }
  // Legacy API
  else if (reducedMotionQuery.addListener) {
    reducedMotionQuery.addListener(handleReducedMotionChange);
    highContrastQuery.addListener(handleHighContrastChange);
  }

  // Return cleanup function
  return () => {
    if (reducedMotionQuery.removeEventListener) {
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
    } else if (reducedMotionQuery.removeListener) {
      reducedMotionQuery.removeListener(handleReducedMotionChange);
      highContrastQuery.removeListener(handleHighContrastChange);
    }
  };
};

// Adjust animation durations based on user preferences
export const getAccessibleAnimationDuration = (baseDuration) => {
  if (prefersReducedMotion) {
    return baseDuration * 0.5; // 50% faster for reduced motion
  }
  return baseDuration;
};

// Create accessible announcement for screen readers
export const announceForScreenReader = (message) => {
  if (typeof document === "undefined") return;

  // Create or get an existing announcement element
  let announcer = document.getElementById("a11y-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "a11y-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";
    document.body.appendChild(announcer);
  }

  // Set the message
  announcer.textContent = message;
};
