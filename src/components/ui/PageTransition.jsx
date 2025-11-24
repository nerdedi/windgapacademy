/**
 * PageTransition Component
 *
 * Provides smooth transitions between pages in the Windgap Academy platform.
 *
 * Features:
 * - Customizable transition effects
 * - Staggered content reveals
 * - Support for different transition types
 * - Optimized for performance
 */

import { motion } from "framer-motion";
import React from "react";

// Animation variants for different page transition styles
const pageVariants = {
  // Fade transition (default)
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  },

  // Slide up transition
  slideUp: {
    initial: { opacity: 0, y: 20 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  },

  // Slide from right transition (for next page)
  slideRight: {
    initial: { opacity: 0, x: 30 },
    enter: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },

  // Slide from left transition (for previous page)
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    enter: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },

  // Scale transition
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

// Staggered children animation variants
const childVariants = {
  initial: { opacity: 0, y: 20 },
  enter: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PageTransition = ({
  children,
  transitionType = "fade",
  enableStaggering = true,
  reduceMotion = false,
  className = "",
  ...props
}) => {
  const motionType = reduceMotion ? "fade" : transitionType;
  const variants = pageVariants[motionType] || pageVariants.fade;

  return (
    <motion.div
      className={`page-transition ${className}`}
      style={{ willChange: "opacity, transform", contain: "layout paint" }}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      {...props}
    >
      {enableStaggering
        ? React.Children.map(children, (child, i) => {
            const delay = reduceMotion ? 0 : i * 0.1;
            if (!React.isValidElement(child)) return child;
            return (
              <motion.div
                variants={childVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                custom={delay}
                className="staggered-element"
              >
                {child}
              </motion.div>
            );
          })
        : children}
    </motion.div>
  );
};

PageTransition.Group = ({ children, delay = 0, className = "" }) => (
  <motion.div
    variants={childVariants}
    initial="initial"
    animate="enter"
    exit="exit"
    custom={delay}
    className={`transition-group ${className}`}
  >
    {children}
  </motion.div>
);

PageTransition.Group.displayName = "PageTransitionGroup";

export default PageTransition;
