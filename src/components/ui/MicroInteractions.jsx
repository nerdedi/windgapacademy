/**
 * MicroInteractions Component
 *
 * A utility component for creating subtle, delightful animations
 * throughout the Windgap Academy platform.
 *
 * Features:
 * - Configurable animation presets
 * - Optimized performance with requestAnimationFrame
 * - Accessibility considerations (respects reduced motion settings)
 * - Consistent animation language across the platform
 */

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useCallback } from "react";

// Animation presets for consistent experiences
export const animationPresets = {
  // Button animations
  buttonHover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  buttonTap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeInOut" },
  },

  // Card animations
  cardEntrance: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  cardHover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },

  // List item animations
  listItemEntrance: (index) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, delay: index * 0.05, ease: "easeOut" },
  }),

  // Page transitions
  pageEntrance: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  },

  // Feedback animations
  success: {
    scale: [1, 1.1, 1],
    backgroundColor: ["#ffffff", "#c6f6d5", "#ffffff"],
    transition: { duration: 0.5, times: [0, 0.5, 1] },
  },
  error: {
    x: [0, -10, 10, -10, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },

  // Character animations
  characterEntrance: (position) => ({
    initial: {
      opacity: 0,
      x: position === "left" ? -100 : position === "right" ? 100 : 0,
      y: position === "top" ? -100 : position === "bottom" ? 100 : 0,
    },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { type: "spring", bounce: 0.4, duration: 0.6 },
  }),

  // Educational element animations
  highlight: {
    backgroundColor: ["rgba(255,255,0,0)", "rgba(255,255,0,0.3)", "rgba(255,255,0,0)"],
    transition: { duration: 1, times: [0, 0.5, 1] },
  },
  celebrate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.8 },
  },
};

// Check if user prefers reduced motion
const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export const MicroInteractions = ({
  children,
  type,
  isActive = true,
  customAnimation = {},
  index = 0,
  position = "center",
  className = "",
  ...props
}) => {
  const controls = useAnimation();

  // Get the appropriate animation preset
  const getAnimationPreset = useCallback(() => {
    if (!isActive || prefersReducedMotion) {
      return {};
    }

    switch (type) {
      case "buttonHover":
        return animationPresets.buttonHover;
      case "buttonTap":
        return animationPresets.buttonTap;
      case "cardEntrance":
        return animationPresets.cardEntrance;
      case "cardHover":
        return animationPresets.cardHover;
      case "listItemEntrance":
        return animationPresets.listItemEntrance(index);
      case "pageEntrance":
        return animationPresets.pageEntrance;
      case "success":
        return animationPresets.success;
      case "error":
        return animationPresets.error;
      case "characterEntrance":
        return animationPresets.characterEntrance(position);
      case "highlight":
        return animationPresets.highlight;
      case "celebrate":
        return animationPresets.celebrate;
      case "custom":
        return customAnimation;
      default:
        return {};
    }
  }, [type, isActive, index, position, customAnimation]);

  // Apply animation
  useEffect(() => {
    if (isActive && !prefersReducedMotion) {
      const preset = getAnimationPreset();
      if (preset.animate) {
        controls.start(preset.animate);
      }
    }
  }, [isActive, controls, getAnimationPreset]);

  // Handle initial animation
  const getInitialState = () => {
    const preset = getAnimationPreset();
    return preset.initial || {};
  };

  // Handle exit animation
  const getExitState = () => {
    const preset = getAnimationPreset();
    return preset.exit || {};
  };

  // For page transitions and conditionally rendered elements
  if (type === "pageEntrance") {
    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            className={className}
            initial={getInitialState()}
            animate={controls}
            exit={getExitState()}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // For all other animations
  return (
    <motion.div
      className={className}
      initial={getInitialState()}
      animate={controls}
      whileHover={type === "buttonHover" || type === "cardHover" ? getAnimationPreset() : undefined}
      whileTap={type === "buttonTap" ? getAnimationPreset() : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specialized hooks for animations
export const useEntryAnimation = (elements, options = {}) => {
  const observerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: options.root || null,
      rootMargin: options.rootMargin || "0px",
      threshold: options.threshold || 0.1,
    };

    // Create intersection observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply entrance animation
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          // Stop observing after animation
          observerRef.current.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Setup initial styles and observe elements
    elementsRef.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  // Return a function to get refs for elements
  return (index) => (el) => {
    elementsRef.current[index] = el;
  };
};

export default MicroInteractions;
