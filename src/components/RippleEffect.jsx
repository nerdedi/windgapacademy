import React, { useEffect, useRef, useState } from "react";
import { createRippleEffect } from "../utils/RippleEffectUtils";
import PropTypes from "prop-types";

/**
 * RippleEffect component that adds interactive ripple animations to any UI element
 *
 * @component
 * @example
 * <RippleEffect
 *   color="#4f46e5"
 *   duration={1000}
 *   rippleOpacity={0.3}
 *   expandSize={2.5}
 * >
 *   <button>Click me for ripple effect</button>
 * </RippleEffect>
 */
const RippleEffect = ({
  children,
  color = "#4f46e5",
  duration = 800,
  rippleOpacity = 0.3,
  expandSize = 2.5,
  disabled = false,
  disabledColor = "#9ca3af",
  className = "",
  centerRipple = false,
  multiTouch = true,
  onAnimationComplete = null,
}) => {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const nextKey = useRef(0);

  // Effect to clean up ripples after animation completes
  useEffect(() => {
    const timers = ripples.map((ripple) => {
      return setTimeout(() => {
        setRipples((prevRipples) => prevRipples.filter((r) => r.key !== ripple.key));
        if (onAnimationComplete) onAnimationComplete(ripple.key);
      }, duration);
    });

    // Cleanup timers on unmount
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [ripples, duration, onAnimationComplete]);

  const createRipple = (event) => {
    if (disabled) return;

    // Skip if not primary mouse button (left click)
    if (event.type === "mousedown" && event.button !== 0) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Get position for ripple
    let x, y;

    if (centerRipple) {
      x = rect.width / 2;
      y = rect.height / 2;
    } else {
      const isTouchEvent = event.touches;
      const pageX = isTouchEvent ? event.touches[event.touches.length - 1].pageX : event.pageX;
      const pageY = isTouchEvent ? event.touches[event.touches.length - 1].pageY : event.pageY;

      x = pageX - rect.left;
      y = pageY - rect.top;
    }

    // Calculate ripple size
    const size = Math.max(rect.width, rect.height) * expandSize;

    // Create new ripple
    const newRipple = {
      key: nextKey.current,
      x,
      y,
      size,
    };

    nextKey.current += 1;

    // Add ripple to state (either replace all or add to existing)
    if (!multiTouch && ripples.length > 0) {
      setRipples([newRipple]);
    } else {
      setRipples((prevRipples) => [...prevRipples, newRipple]);
    }
  };

  // Handle mouse and touch events
  const handleMouseDown = (event) => {
    createRipple(event);
  };

  const handleTouchStart = (event) => {
    createRipple(event);
  };

  return (
    <div
      ref={containerRef}
      className={`ripple-effect-container ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-block",
        userSelect: "none",
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          style={{
            position: "absolute",
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: "50%",
            backgroundColor: disabled ? disabledColor : color,
            opacity: rippleOpacity,
            transform: "scale(0)",
            animation: `ripple-animation ${duration}ms ease-out`,
            pointerEvents: "none",
          }}
        />
      ))}
      {children}

      <style jsx>{`
        @keyframes ripple-animation {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }

        .ripple-effect-container {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

RippleEffect.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  duration: PropTypes.number,
  rippleOpacity: PropTypes.number,
  expandSize: PropTypes.number,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.string,
  className: PropTypes.string,
  centerRipple: PropTypes.bool,
  multiTouch: PropTypes.bool,
  onAnimationComplete: PropTypes.func,
};

export default RippleEffect;
