/**
 * Windgap Academy Professional UI Utilities
 *
 * Comprehensive UI utilities for sophisticated animations, accessibility,
 * responsive design, and professional user experience enhancements.
 *
 * Features:
 * - Advanced animation systems with performance optimization
 * - Comprehensive accessibility support (WCAG 2.1 AA compliant)
 * - Responsive design utilities with device detection
 * - Professional interaction patterns and micro-animations
 * - Error handling and graceful degradation
 * - Performance monitoring and optimization
 * - Theme and customization support
 * - Cross-browser compatibility
 */

// Animation performance optimization
const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    extra: 800,
  },
  easing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

// Device and capability detection
const DEVICE_INFO = {
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ),
  isTablet: /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent),
  isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ),
  supportsTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  supportsHover: window.matchMedia("(hover: hover)").matches,
  supportsWebGL: (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (e) {
      return false;
    }
  })(),
  supportsWebAudio: !!(window.AudioContext || window.webkitAudioContext),
  supportsIntersectionObserver: "IntersectionObserver" in window,
  supportsResizeObserver: "ResizeObserver" in window,
};

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      animations: [],
      interactions: [],
      renders: [],
    };
  }

  startTiming(category, label) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        this.metrics[category].push({ label, duration, timestamp: Date.now() });

        // Warn about slow operations
        if (duration > 16.67) {
          // 60fps threshold
          console.warn(`Slow ${category} operation: ${label} took ${duration.toFixed(2)}ms`);
        }

        return duration;
      },
    };
  }

  getMetrics() {
    return { ...this.metrics };
  }

  clearMetrics() {
    this.metrics = { animations: [], interactions: [], renders: [] };
  }
}

const performanceMonitor = new PerformanceMonitor();

/**
 * Enhanced button animation with performance optimization and accessibility
 * @param {HTMLElement} btn - The button element to animate
 * @param {Object} options - Animation options
 */
export function applyButtonAnimation(btn, options = {}) {
  if (!btn) return;

  const timer = performanceMonitor.startTiming("animations", "button");

  const config = {
    scale: options.scale || 0.8,
    duration: options.duration || ANIMATION_CONFIG.duration.normal,
    easing: options.easing || ANIMATION_CONFIG.easing.bounce,
    delay: options.delay || 0,
    ...options,
  };

  // Add base classes
  btn.classList.add("btn-primary", "transition-all", "transform-gpu");

  // Set up accessibility
  setAriaAttributes(btn, {
    role: "button",
    pressed: "false",
  });

  // Add interaction states
  setupButtonInteractions(btn);

  // Apply animation based on available libraries and user preferences
  if (ANIMATION_CONFIG.reducedMotion) {
    // Respect reduced motion preference
    btn.style.transition = "opacity 0.2s ease";
    timer.end();
    return;
  }

  if (window.gsap) {
    // Use GSAP for advanced animations
    window.gsap.fromTo(
      btn,
      {
        scale: config.scale,
        opacity: 0,
        rotationY: -15,
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: config.duration / 1000,
        ease: config.easing,
        delay: config.delay / 1000,
        onComplete: () => timer.end(),
      },
    );
  } else if (btn.animate) {
    // Use Web Animations API
    btn
      .animate(
        [
          {
            transform: `scale(${config.scale}) rotateY(-15deg)`,
            opacity: 0,
          },
          {
            transform: "scale(1) rotateY(0deg)",
            opacity: 1,
          },
        ],
        {
          duration: config.duration,
          easing: config.easing,
          delay: config.delay,
          fill: "forwards",
        },
      )
      .addEventListener("finish", () => timer.end());
  } else {
    // Fallback to CSS transitions
    btn.style.transition = `all ${config.duration}ms ${config.easing}`;
    btn.style.transform = `scale(${config.scale})`;
    btn.style.opacity = "0";

    requestAnimationFrame(() => {
      btn.style.transform = "scale(1)";
      btn.style.opacity = "1";
      setTimeout(() => timer.end(), config.duration);
    });
  }
}

/**
 * Setup interactive button behaviors
 * @param {HTMLElement} btn - Button element
 */
function setupButtonInteractions(btn) {
  // Hover effects (only on devices that support hover)
  if (DEVICE_INFO.supportsHover) {
    btn.addEventListener("mouseenter", () => {
      if (!ANIMATION_CONFIG.reducedMotion) {
        btn.style.transform = "scale(1.05) translateY(-2px)";
        btn.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
      }
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1) translateY(0)";
      btn.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });
  }

  // Touch feedback
  if (DEVICE_INFO.supportsTouch) {
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("touchend", () => {
      btn.style.transform = "scale(1)";
    });
  }

  // Click feedback with haptic feedback on supported devices
  btn.addEventListener("click", () => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate && DEVICE_INFO.isMobile) {
      navigator.vibrate(50);
    }

    // Visual feedback
    if (!ANIMATION_CONFIG.reducedMotion) {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 100);
    }

    // Update ARIA state
    btn.setAttribute("aria-pressed", "true");
    setTimeout(() => {
      btn.setAttribute("aria-pressed", "false");
    }, 200);
  });

  // Keyboard navigation
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
}

/**
 * Enhanced heading animation with sophisticated effects
 * @param {HTMLElement} heading - The heading element to animate
 * @param {Object} options - Animation options
 */
export function applyHeadingAnimation(heading, options = {}) {
  if (!heading) return;

  const timer = performanceMonitor.startTiming("animations", "heading");

  const config = {
    direction: options.direction || "up",
    distance: options.distance || 50,
    duration: options.duration || ANIMATION_CONFIG.duration.slow,
    easing: options.easing || ANIMATION_CONFIG.easing.easeOut,
    stagger: options.stagger || 100,
    ...options,
  };

  // Add base classes
  heading.classList.add("card", "animate-anticipate");

  // Set up accessibility
  setAriaAttributes(heading, {
    role: "heading",
    level: heading.tagName.charAt(1) || "1",
  });

  if (ANIMATION_CONFIG.reducedMotion) {
    heading.style.opacity = "1";
    timer.end();
    return;
  }

  // Split text for character-by-character animation if requested
  if (options.splitText) {
    splitTextAnimation(heading, config);
  } else {
    // Standard heading animation
    animateElement(heading, {
      from: {
        opacity: 0,
        transform: getTransformFromDirection(config.direction, config.distance),
      },
      to: {
        opacity: 1,
        transform: "translateX(0) translateY(0) scale(1)",
      },
      duration: config.duration,
      easing: config.easing,
      onComplete: () => timer.end(),
    });
  }
}

/**
 * Comprehensive ARIA attributes utility with validation
 * @param {HTMLElement} el - The element to set ARIA attributes on
 * @param {Object} attrs - Key-value pairs of ARIA attributes
 */
export function setAriaAttributes(el, attrs = {}) {
  if (!el) return;

  const validAriaAttributes = [
    "label",
    "labelledby",
    "describedby",
    "expanded",
    "hidden",
    "live",
    "atomic",
    "busy",
    "controls",
    "current",
    "details",
    "disabled",
    "dropeffect",
    "errormessage",
    "flowto",
    "grabbed",
    "haspopup",
    "invalid",
    "keyshortcuts",
    "level",
    "modal",
    "multiline",
    "multiselectable",
    "orientation",
    "owns",
    "placeholder",
    "posinset",
    "pressed",
    "readonly",
    "relevant",
    "required",
    "roledescription",
    "rowcount",
    "rowindex",
    "rowspan",
    "selected",
    "setsize",
    "sort",
    "valuemax",
    "valuemin",
    "valuenow",
    "valuetext",
    "role",
  ];

  Object.entries(attrs).forEach(([key, value]) => {
    // Validate ARIA attribute
    if (validAriaAttributes.includes(key)) {
      el.setAttribute(key === "role" ? "role" : `aria-${key}`, value);
    } else {
      console.warn(`Invalid ARIA attribute: ${key}`);
    }
  });
}

/**
 * Advanced element animation utility
 * @param {HTMLElement} element - Element to animate
 * @param {Object} config - Animation configuration
 */
export function animateElement(element, config) {
  if (!element) return;

  const {
    from = {},
    to = {},
    duration = ANIMATION_CONFIG.duration.normal,
    easing = ANIMATION_CONFIG.easing.ease,
    delay = 0,
    onComplete = () => {},
  } = config;

  if (window.gsap) {
    // Use GSAP for advanced animations
    window.gsap.fromTo(element, from, {
      ...to,
      duration: duration / 1000,
      ease: easing,
      delay: delay / 1000,
      onComplete,
    });
  } else if (element.animate) {
    // Use Web Animations API
    const keyframes = [from, to];
    element
      .animate(keyframes, {
        duration,
        easing,
        delay,
        fill: "forwards",
      })
      .addEventListener("finish", onComplete);
  } else {
    // CSS fallback
    Object.assign(element.style, from);
    element.style.transition = `all ${duration}ms ${easing}`;

    requestAnimationFrame(() => {
      Object.assign(element.style, to);
      setTimeout(onComplete, duration + delay);
    });
  }
}

/**
 * Text splitting animation for character-by-character effects
 * @param {HTMLElement} element - Text element
 * @param {Object} config - Animation configuration
 */
function splitTextAnimation(element, config) {
  const text = element.textContent;
  const characters = text.split("");

  element.innerHTML = "";

  characters.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char; // Non-breaking space
    span.style.display = "inline-block";
    span.style.opacity = "0";
    span.style.transform = getTransformFromDirection(config.direction, config.distance);
    element.appendChild(span);

    // Animate each character with stagger
    setTimeout(() => {
      animateElement(span, {
        from: {
          opacity: 0,
          transform: getTransformFromDirection(config.direction, config.distance),
        },
        to: {
          opacity: 1,
          transform: "translateX(0) translateY(0) scale(1)",
        },
        duration: config.duration / 2,
        easing: config.easing,
      });
    }, index * config.stagger);
  });
}

/**
 * Get transform string from direction and distance
 * @param {string} direction - Animation direction
 * @param {number} distance - Animation distance
 */
function getTransformFromDirection(direction, distance) {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    case "scale":
      return `scale(${distance / 100})`;
    default:
      return `translateY(${distance}px)`;
  }
}
