import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

/**
 * ModernBackground - A sophisticated animated background component
 *
 * Features:
 * - Animated gradient background with configurable colors
 * - Optional noise texture overlay
 * - Subtle animation with mouse interaction
 * - Optimized performance with useRef and requestAnimationFrame
 */
const ModernBackground = ({
  children,
  primaryColor = "#2997FF",
  secondaryColor = "#101010",
  hasNoise = true,
  interactive = true,
  className = "",
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize gradient animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Handle mouse movement
    const handleMouseMove = (event) => {
      if (!interactive) return;

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Convert hex to rgba
    const hexToRgba = (hex, alpha = 1) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Create smooth mouse following
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createRadialGradient(
        targetX || canvas.width / 2,
        targetY || canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8,
      );

      gradient.addColorStop(0, hexToRgba(primaryColor, 0.3));
      gradient.addColorStop(0.5, hexToRgba(secondaryColor, 0.15));
      gradient.addColorStop(1, "rgba(10, 10, 10, 0.1)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Clean up event listeners and animation frame
    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [primaryColor, secondaryColor, interactive]);

  // Apply GSAP animation on mount
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      canvasRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" },
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />
      {hasNoise && (
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20 -z-5"></div>
      )}
      {children}
    </div>
  );
};

export default ModernBackground;
