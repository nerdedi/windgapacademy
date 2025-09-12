/**
 * Magnetic Button Component - Figma-level sophistication
 *
 * Features:
 * - Magnetic hover effects that follow cursor
 * - Smooth spring animations
 * - Advanced cursor interactions
 * - Professional micro-interactions
 */

import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const MagneticButton = ({
  children,
  onClick,
  onHover,
  className = "",
  magneticStrength = 0.3,
  ...props
}) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      if (!isHovered) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;

      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      onHover?.(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      onHover?.(false);
      x.set(0);
      y.set(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered, magneticStrength, onHover, x, y]);

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        animate={{
          scale: isHovered ? [1, 1.5] : 1,
          opacity: isHovered ? [0, 0.1, 0] : 0,
        }}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.button>
  );
};
