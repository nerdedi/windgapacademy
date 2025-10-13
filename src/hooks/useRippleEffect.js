import { useCallback, useEffect, useRef, useState } from "react";
import { createCanvasRippleEffect } from "../utils/RippleEffectUtils";

/**
 * A React hook that adds interactive ripple effects to any element.
 *
 * @param {Object} options - Configuration options for the ripple effect
 * @param {string} options.color - The color of the ripple (default: '#ffffff')
 * @param {number} options.opacity - The opacity of the ripple (default: 0.6)
 * @param {number} options.speed - The speed of the ripple expansion (default: 2)
 * @param {number} options.fadeSpeed - How quickly the ripple fades out (default: 0.96)
 * @param {number} options.lineWidth - The width of the ripple circle line (default: 2)
 * @param {boolean} options.autoCleanup - Whether to automatically remove ripples when they fade out (default: true)
 * @returns {Object} - Object containing ref to attach to the target element and methods to control the ripple
 *
 * @example
 * function MyButton() {
 *   const { ref, triggerRipple } = useRippleEffect({
 *     color: '#4f46e5',
 *     opacity: 0.5
 *   });
 *
 *   return (
 *     <button
 *       ref={ref}
 *       onClick={(e) => triggerRipple(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 */
export function useRippleEffect(options = {}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const effectRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize ripple effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas for the effect if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1";

      // Make sure container has position
      const containerStyle = window.getComputedStyle(container);
      if (containerStyle.position === "static") {
        container.style.position = "relative";
      }

      container.appendChild(canvas);
      canvasRef.current = canvas;
    }

    // Initialize the ripple effect
    effectRef.current = createCanvasRippleEffect(canvasRef.current, {
      color: options.color || "#ffffff",
      rippleOpacity: options.opacity || 0.6,
      rippleSpeed: options.speed || 2,
      fadeSpeed: options.fadeSpeed || 0.96,
      lineWidth: options.lineWidth || 2,
    });

    setIsReady(true);

    // Clean up effect
    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
      }

      const canvas = canvasRef.current;
      if (canvas && container && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [options.color, options.opacity, options.speed, options.fadeSpeed, options.lineWidth]);

  /**
   * Trigger a ripple effect at the specified coordinates
   *
   * @param {number} x - X coordinate relative to the container
   * @param {number} y - Y coordinate relative to the container
   * @param {string} [customColor] - Optional custom color for this specific ripple
   */
  const triggerRipple = useCallback(
    (x, y, customColor) => {
      if (isReady && effectRef.current) {
        effectRef.current.addRipple(x, y, customColor);
      }
    },
    [isReady],
  );

  /**
   * Trigger a ripple effect from a mouse or touch event
   *
   * @param {MouseEvent|TouchEvent} event - The event that triggered the ripple
   * @param {string} [customColor] - Optional custom color for this specific ripple
   */
  const triggerRippleFromEvent = useCallback(
    (event, customColor) => {
      if (!isReady || !effectRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      let x, y;
      if (event.touches) {
        // Touch event
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        // Mouse event
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      effectRef.current.addRipple(x, y, customColor);
    },
    [isReady],
  );

  /**
   * Clear all active ripples
   */
  const clearRipples = useCallback(() => {
    if (isReady && effectRef.current) {
      effectRef.current.clear();
    }
  }, [isReady]);

  /**
   * Update ripple effect options
   *
   * @param {Object} newOptions - New options to update
   */
  const updateOptions = useCallback(
    (newOptions) => {
      if (isReady && effectRef.current) {
        effectRef.current.updateOptions(newOptions);
      }
    },
    [isReady],
  );

  return {
    ref: containerRef,
    triggerRipple,
    triggerRippleFromEvent,
    clearRipples,
    updateOptions,
    isReady,
  };
}

/**
 * A React hook that creates an interactive ripple background
 *
 * @param {Object} options - Configuration options
 * @param {string[]} options.colors - Array of ripple colors
 * @param {number} options.autoInterval - Interval for automatic ripples (0 to disable)
 * @param {boolean} options.interactive - Whether to respond to user interactions
 * @returns {Object} - Object containing ref and control methods
 *
 * @example
 * function Background() {
 *   const { ref } = useRippleBackground({
 *     colors: ['rgba(79, 70, 229, 0.3)'],
 *     autoInterval: 3000
 *   });
 *
 *   return <div ref={ref} className="background" />;
 * }
 */
export function useRippleBackground(options = {}) {
  const ripple = useRippleEffect({
    color: options.colors?.[0] || "rgba(79, 70, 229, 0.3)",
    opacity: options.opacity || 0.6,
    speed: options.speed || 2,
  });

  const timerRef = useRef(null);
  const colorsRef = useRef(options.colors || ["rgba(79, 70, 229, 0.3)"]);

  // Setup auto ripples
  useEffect(() => {
    const autoInterval = options.autoInterval || 0;
    if (autoInterval <= 0 || !ripple.isReady) return;

    // Store references for closure to avoid stale values
    const currentRipple = ripple;
    const currentColors = colorsRef.current;

    function createRandomRipple() {
      if (!currentRipple.ref.current) return;

      const rect = currentRipple.ref.current.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      // Random color from array
      const colorIndex = Math.floor(Math.random() * currentColors.length);
      currentRipple.triggerRipple(x, y, currentColors[colorIndex]);
    }

    timerRef.current = setInterval(createRandomRipple, autoInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [options.autoInterval, ripple]);

  // Setup interaction handlers
  useEffect(() => {
    if (!ripple.isReady || !ripple.ref.current || options.interactive === false) return;

    const element = ripple.ref.current;
    const currentColors = colorsRef.current;
    const currentRipple = ripple;

    const handleInteraction = (event) => {
      // Random color from array
      const colorIndex = Math.floor(Math.random() * currentColors.length);
      currentRipple.triggerRippleFromEvent(event, currentColors[colorIndex]);
    };

    element.addEventListener("mousedown", handleInteraction);
    element.addEventListener("touchstart", handleInteraction);

    return () => {
      element.removeEventListener("mousedown", handleInteraction);
      element.removeEventListener("touchstart", handleInteraction);
    };
  }, [options.interactive, ripple]);

  return {
    ...ripple,
    setColors: (newColors) => {
      colorsRef.current = newColors;
    },
    setAutoInterval: (interval) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (interval > 0 && ripple.isReady) {
        function createRandomRipple() {
          if (!ripple.ref.current) return;

          const rect = ripple.ref.current.getBoundingClientRect();
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height;

          // Random color from array
          const colorIndex = Math.floor(Math.random() * colorsRef.current.length);
          ripple.triggerRipple(x, y, colorsRef.current[colorIndex]);
        }

        timerRef.current = setInterval(createRandomRipple, interval);
      }
    },
  };
}

export default useRippleEffect;
