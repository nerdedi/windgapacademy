/**
 * MicroInteractions.jsx - Advanced animation system for consistent UI animations
 *
 * Features:
 * - Configurable animation presets for common UI interactions
 * - Context provider for global animation settings
 * - Hooks for easy animation integration
 * - Performance monitoring and adaptive throttling
 * - Orchestrated animation sequences
 * - Animation variants for different device capabilities
 * - Gesture-based animations with haptic feedback
 * - Accessibility-aware animations with reduced motion support
 */

import {
  motion,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useMedia } from "react-use";

// Animation presets for consistent look and feel
const animationPresets = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
  slideInRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },

  // Exit animations
  fadeOut: {
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeIn" },
  },
  scaleOut: {
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: "easeIn" },
  },
  slideOutDown: {
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.2, ease: "easeIn" },
  },

  // Button animations
  buttonTap: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1, ease: "easeInOut" },
  },
  buttonPop: {
    whileHover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
    whileTap: { scale: 0.97, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
    transition: { duration: 0.1, ease: [0.23, 1, 0.32, 1] },
  },

  // UI Feedback animations
  success: {
    animate: { scale: [1, 1.2, 1], borderColor: ["#ccc", "#4CAF50", "#ccc"] },
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  error: {
    animate: { x: [0, -10, 10, -5, 5, 0], borderColor: ["#ccc", "#F44336", "#ccc"] },
    transition: { duration: 0.5, ease: "easeInOut" },
  },

  // Card animations
  cardHover: {
    whileHover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },

  // Menu animations
  menuExpand: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  },

  // Tooltip animations
  tooltip: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2 },
  },

  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
    },
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },

  bounce: {
    animate: {
      y: [0, -15, 0],
    },
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },

  // Advanced animation effects
  springy: {
    animate: { scale: 1, opacity: 1 },
    initial: { scale: 0.6, opacity: 0 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },

  stagger: (staggerChildren = 0.05, delayChildren = 0) => ({
    animate: { transition: { staggerChildren, delayChildren } },
  }),

  // 3D effects
  tiltOnHover: {
    whileHover: {
      rotateX: 5,
      rotateY: 5,
      z: 10,
    },
    transition: { duration: 0.2 },
  },
};

// Animation duration multipliers for different themes
const durationThemes = {
  default: 1, // Normal speed
  swift: 0.7, // 30% faster
  deliberate: 1.3, // 30% slower
  energetic: 0.8, // 20% faster with more bounce
  calm: 1.5, // 50% slower with gentler easing
};

// Animation variants for different device capabilities
const deviceVariants = {
  highEnd: {
    // Full animations
    useComplexAnimations: true,
    useParallaxEffects: true,
    use3DEffects: true,
  },
  midRange: {
    // Simplified animations, fewer particles
    useComplexAnimations: true,
    useParallaxEffects: true,
    use3DEffects: false,
  },
  lowEnd: {
    // Basic animations only
    useComplexAnimations: false,
    useParallaxEffects: false,
    use3DEffects: false,
  },
};

// Create Animation Context
const MicroInteractionsContext = createContext({
  presets: animationPresets,
  theme: "default",
  shouldReduceMotion: false,
  deviceCapability: "highEnd",
  setTheme: () => {},
  getDuration: () => 1,
  getPreset: () => ({}),
  applyPreset: () => ({}),
  createSequence: () => ({ play: () => {} }),
  performance: { fps: 60 },
});

/**
 * Animation Context Provider
 */
export const MicroInteractionsProvider = ({ children, initialTheme = "default" }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [deviceCapability, setDeviceCapability] = useState("highEnd");
  const [performance, setPerformance] = useState({ fps: 60, lastUpdate: Date.now() });
  const frameCounter = useRef({ count: 0, lastCheck: Date.now() });

  // Detect if user has requested reduced motion
  const shouldReduceMotion = useMedia("(prefers-reduced-motion: reduce)", false);

  // Animation reference for sequences
  const animationRef = useRef(new Map());

  // FPS Monitoring
  useEffect(() => {
    let animationFrameId;

    const updateFPS = () => {
      const now = Date.now();
      frameCounter.current.count++;

      // Update FPS every second
      if (now - frameCounter.current.lastCheck >= 1000) {
        const fps = Math.round(
          (frameCounter.current.count * 1000) / (now - frameCounter.current.lastCheck),
        );
        setPerformance({ fps, lastUpdate: now });

        // Determine device capability based on FPS
        if (fps >= 55) {
          setDeviceCapability("highEnd");
        } else if (fps >= 30) {
          setDeviceCapability("midRange");
        } else {
          setDeviceCapability("lowEnd");
        }

        frameCounter.current.count = 0;
        frameCounter.current.lastCheck = now;
      }

      animationFrameId = requestAnimationFrame(updateFPS);
    };

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Get appropriate duration multiplier based on theme and reduced motion preference
  const getDuration = useCallback(() => {
    if (shouldReduceMotion) return 0.5;
    return durationThemes[theme] || durationThemes.default;
  }, [theme, shouldReduceMotion]);

  // Get animation preset, adjusted for current theme
  const getPreset = useCallback(
    (presetName) => {
      const preset = animationPresets[presetName];
      if (!preset) return {};

      // Create a deep copy we can modify
      const adjustedPreset = JSON.parse(JSON.stringify(preset));

      // Adjust transitions for the current theme
      const adjustDuration = (transition) => {
        if (!transition) return;

        if (transition.duration) {
          transition.duration *= getDuration();
        }

        // Adjust stiffness and damping for spring animations
        if (transition.type === "spring") {
          if (theme === "energetic") {
            transition.stiffness = (transition.stiffness || 300) * 1.2;
            transition.damping = (transition.damping || 20) * 0.8;
          } else if (theme === "calm") {
            transition.stiffness = (transition.stiffness || 300) * 0.8;
            transition.damping = (transition.damping || 20) * 1.2;
          }
        }
      };

      // Process all transitions in the preset
      if (adjustedPreset.transition) {
        adjustDuration(adjustedPreset.transition);
      }

      ["initial", "animate", "exit", "whileHover", "whileTap"].forEach((key) => {
        if (adjustedPreset[key] && adjustedPreset[key].transition) {
          adjustDuration(adjustedPreset[key].transition);
        }
      });

      // If reduced motion is preferred, simplify animations
      if (shouldReduceMotion) {
        // Remove scaling and position animations, keep only opacity
        ["initial", "animate", "exit", "whileHover", "whileTap"].forEach((key) => {
          if (adjustedPreset[key]) {
            const state = adjustedPreset[key];

            // Remove transform properties
            ["x", "y", "z", "rotate", "rotateX", "rotateY", "rotateZ", "scale"].forEach((prop) => {
              if (state[prop] !== undefined) delete state[prop];
            });

            // Simplify complex animations
            if (Array.isArray(state.scale)) state.scale = 1;
            if (Array.isArray(state.opacity)) {
              // Keep only the final value for opacity arrays
              state.opacity = state.opacity[state.opacity.length - 1];
            }
          }
        });
      }

      return adjustedPreset;
    },
    [theme, getDuration, shouldReduceMotion],
  );

  // Apply preset to component props
  const applyPreset = useCallback(
    (presetName, customProps = {}) => {
      const preset = getPreset(presetName);
      return { ...preset, ...customProps };
    },
    [getPreset],
  );

  // Create and manage animation sequences
  const createSequence = useCallback((sequenceId) => {
    // Create a unique id if not provided
    const id = sequenceId || `sequence-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create a new sequence controller
    const controls = {
      animations: [],

      // Add animation to sequence
      add(animationId, controlsInstance, config = {}) {
        this.animations.push({
          id: animationId,
          controls: controlsInstance,
          config,
        });

        // Store reference to animation
        animationRef.current.set(animationId, controlsInstance);

        return this;
      },

      // Play entire sequence
      async play() {
        for (const anim of this.animations) {
          const { controls, config } = anim;

          // Apply animation
          if (config.keyframes) {
            await controls.start(config.keyframes, config.options);
          } else {
            await controls.start(config);
          }

          // Pause if specified
          if (config.pauseAfter) {
            await new Promise((resolve) => setTimeout(resolve, config.pauseAfter));
          }
        }
      },

      // Play sequence with staggered timing
      async stagger(staggerDelay = 0.1) {
        const promises = this.animations.map((anim, index) => {
          const { controls, config } = anim;

          return new Promise((resolve) => {
            // Start after delay based on index
            setTimeout(
              async () => {
                if (config.keyframes) {
                  await controls.start(config.keyframes, config.options);
                } else {
                  await controls.start(config);
                }
                resolve();
              },
              index * staggerDelay * 1000,
            );
          });
        });

        await Promise.all(promises);
      },

      // Stop all animations in sequence
      stop() {
        this.animations.forEach((anim) => {
          anim.controls.stop();
        });
      },
    };

    return controls;
  }, []);

  const contextValue = {
    presets: animationPresets,
    theme,
    setTheme,
    shouldReduceMotion,
    deviceCapability,
    getDuration,
    getPreset,
    applyPreset,
    createSequence,
    performance,
  };

  return (
    <MicroInteractionsContext.Provider value={contextValue}>
      {children}
    </MicroInteractionsContext.Provider>
  );
};

/**
 * Hook to access animation context
 */
export const useMicroInteractions = () => {
  const context = useContext(MicroInteractionsContext);
  if (!context) {
    throw new Error("useMicroInteractions must be used within a MicroInteractionsProvider");
  }
  return context;
};

/**
 * Animated component with common animation presets
 */
export const Animated = ({
  children,
  preset,
  customAnimation = {},
  as = motion.div,
  inView = false,
  triggerOnce = true,
  threshold = 0.1,
  ...props
}) => {
  const { getPreset, shouldReduceMotion } = useMicroInteractions();
  const controls = useAnimation();
  const Component = as;

  // Use intersection observer if inView is true
  const [ref, inViewStatus] = useInView({
    triggerOnce,
    threshold,
  });

  // Get animation properties from preset
  const animationProps = preset ? getPreset(preset) : {};

  // Merge with custom animation properties
  const mergedAnimation = {
    ...animationProps,
    ...customAnimation,
  };

  // Trigger animation when component comes into view
  useEffect(() => {
    if (inView && inViewStatus) {
      controls.start(mergedAnimation.animate || "animate");
    }
  }, [inView, inViewStatus, controls, mergedAnimation]);

  // Disable animations completely if necessary
  if (shouldReduceMotion === true && props.disableForReducedMotion) {
    return <div {...props}>{children}</div>;
  }

  // Apply animation controls if using inView
  const finalProps = inView
    ? {
        ...props,
        ...mergedAnimation,
        animate: controls,
        ref: ref,
      }
    : {
        ...props,
        ...mergedAnimation,
      };

  return <Component {...finalProps}>{children}</Component>;
};

/**
 * Hook for creating staggered animations for lists
 */
export const useStaggeredAnimation = (itemCount, staggerDelay = 0.05, delayStart = 0) => {
  const { shouldReduceMotion } = useMicroInteractions();

  // Reduce stagger delay if reduced motion is preferred
  const finalStaggerDelay = shouldReduceMotion ? staggerDelay * 0.5 : staggerDelay;

  return {
    container: {
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      variants: {
        visible: {
          transition: {
            staggerChildren: finalStaggerDelay,
            delayChildren: delayStart,
          },
        },
        exit: {
          transition: {
            staggerChildren: finalStaggerDelay / 2,
            staggerDirection: -1,
          },
        },
      },
    },

    // Generate array of item delays
    itemDelays: Array(itemCount)
      .fill(0)
      .map((_, i) => i * finalStaggerDelay + delayStart),
  };
};

/**
 * Hook for creating animated values
 */
export const useAnimatedValue = (initialValue, config = {}) => {
  const { shouldReduceMotion } = useMicroInteractions();

  // Set up configuration
  const springConfig = shouldReduceMotion
    ? { damping: 50, stiffness: 500 } // Faster, less bouncy springs for reduced motion
    : { damping: config.damping || 30, stiffness: config.stiffness || 300 };

  // Create motion value
  const motionValue = useMotionValue(initialValue);

  // Create spring (for smoother animation)
  const springValue = useSpring(motionValue, springConfig);

  // Set new value with optional animation
  const setValue = useCallback(
    (newValue, animate = true) => {
      if (animate) {
        motionValue.set(newValue);
      } else {
        // Immediate change without animation
        motionValue.set(newValue);
        springValue.set(newValue);
      }
    },
    [motionValue, springValue],
  );

  return [springValue, setValue, motionValue];
};

/**
 * Hook for parallax effects
 */
export const useParallax = (sensitivity = 10, clamp = true) => {
  const { deviceCapability } = useMicroInteractions();
  const [ref, setRef] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Disable parallax for low-end devices
  const enabled = deviceVariants[deviceCapability]?.useParallaxEffects !== false;

  useEffect(() => {
    if (!ref || !enabled) return;

    const handleMouseMove = (e) => {
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (-1 to 1)
      let x = (e.clientX - centerX) / (rect.width / 2);
      let y = (e.clientY - centerY) / (rect.height / 2);

      // Clamp values between -1 and 1
      if (clamp) {
        x = Math.max(-1, Math.min(1, x));
        y = Math.max(-1, Math.min(1, y));
      }

      // Apply sensitivity
      x = x * sensitivity;
      y = y * sensitivity;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref, sensitivity, clamp, enabled]);

  // Create motion values for use in transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Update motion values when position changes
  useEffect(() => {
    if (enabled) {
      x.set(position.x);
      y.set(position.y);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [position, x, y, enabled]);

  return { ref: setRef, x, y };
};

/**
 * Button with animation presets
 */
export const AnimatedButton = ({
  children,
  preset = "buttonTap",
  variant = "default",
  disabled = false,
  ...props
}) => {
  const { getPreset, shouldReduceMotion } = useMicroInteractions();
  const buttonPreset = getPreset(preset);

  // Different variants for the button
  const variants = {
    default: {
      backgroundColor: "#f0f0f0",
      color: "#333",
      border: "none",
      borderRadius: "4px",
      padding: "8px 16px",
      cursor: "pointer",
    },
    primary: {
      backgroundColor: "#4C6FFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "8px 16px",
      cursor: "pointer",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "#4C6FFF",
      border: "1px solid #4C6FFF",
      borderRadius: "4px",
      padding: "8px 16px",
      cursor: "pointer",
    },
    text: {
      backgroundColor: "transparent",
      color: "#4C6FFF",
      border: "none",
      padding: "8px 16px",
      cursor: "pointer",
    },
  };

  // Disabled state styling
  const disabledStyle = {
    opacity: 0.6,
    cursor: "not-allowed",
    pointerEvents: "none",
  };

  return (
    <motion.button
      {...buttonPreset}
      {...props}
      style={{
        ...variants[variant],
        ...(disabled ? disabledStyle : {}),
        ...props.style,
      }}
      animate={buttonPreset.animate}
      disabled={disabled}
      whileHover={!disabled && !shouldReduceMotion ? buttonPreset.whileHover : undefined}
      whileTap={!disabled && !shouldReduceMotion ? buttonPreset.whileTap : undefined}
    >
      {children}
    </motion.button>
  );
};

/**
 * Animated modal component
 */
export const AnimatedModal = ({
  isOpen,
  onClose,
  children,
  preset = "scaleIn",
  overlayClose = true,
  ...props
}) => {
  const { getPreset } = useMicroInteractions();
  const modalPreset = getPreset(preset);

  // Handle click on overlay
  const handleOverlayClick = (e) => {
    if (overlayClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            ...props.overlayStyle,
          }}
          onClick={handleOverlayClick}
        >
          <motion.div
            {...modalPreset}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
              position: "relative",
              ...props.style,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Animated list component with staggered animations
 */
export const AnimatedList = ({
  items,
  renderItem,
  keyExtractor,
  preset = "listItem",
  staggerDelay = 0.05,
  ...props
}) => {
  const { getPreset } = useMicroInteractions();
  const { container } = useStaggeredAnimation(items.length, staggerDelay);
  const itemPreset = getPreset(preset);

  return (
    <motion.ul
      {...container}
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        ...props.style,
      }}
      {...props}
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.li
            key={keyExtractor ? keyExtractor(item) : index}
            variants={itemPreset}
            style={{
              margin: "4px 0",
              ...props.itemStyle,
            }}
          >
            {renderItem({ item, index })}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

/**
 * Loading spinner with animations
 */
export const AnimatedSpinner = ({ size = 40, color = "#4C6FFF", preset = "pulse", ...props }) => {
  const { getPreset } = useMicroInteractions();
  const spinnerPreset = getPreset(preset);

  return (
    <motion.div
      {...spinnerPreset}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        borderTopColor: "transparent",
        ...props.style,
      }}
      animate={{
        rotate: 360,
        ...spinnerPreset.animate,
      }}
      transition={{
        rotate: {
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        },
        ...spinnerPreset.transition,
      }}
      {...props}
    />
  );
};

/**
 * Page transition component
 */
export const PageTransition = ({ children, preset = "pageTransition", ...props }) => {
  const { getPreset } = useMicroInteractions();
  const pagePreset = getPreset(preset);

  return (
    <motion.div {...pagePreset} {...props}>
      {children}
    </motion.div>
  );
};

// Export all components and hooks
export default {
  MicroInteractionsProvider,
  useMicroInteractions,
  Animated,
  AnimatedButton,
  AnimatedModal,
  AnimatedList,
  AnimatedSpinner,
  PageTransition,
  useStaggeredAnimation,
  useAnimatedValue,
  useParallax,
};
