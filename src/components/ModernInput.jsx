import { gsap } from "gsap";
import React, { useState, useRef, useEffect } from "react";

/**
 * ModernInput - A sophisticated animated input component
 *
 * Features:
 * - Animated label with floating effect
 * - Focus and hover states with subtle animations
 * - Error state handling with validation
 * - Dark and light mode variants
 * - GSAP-powered animations for smooth interactions
 */
const ModernInput = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  darkMode = true,
  error = "",
  required = false,
  className = "",
  autoComplete = "off",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const labelRef = useRef(null);
  const borderRef = useRef(null);

  // Handle input focus animation
  const handleFocus = () => {
    setIsFocused(true);

    // Animate label and border with GSAP
    gsap.to(labelRef.current, {
      y: -25,
      scale: 0.85,
      color: darkMode ? "#2997FF" : "#2997FF",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(borderRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // Handle input blur animation
  const handleBlur = () => {
    setIsFocused(false);

    // Only animate back if there's no value
    if (!value) {
      gsap.to(labelRef.current, {
        y: 0,
        scale: 1,
        color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
    }

    gsap.to(borderRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // Set initial label position based on value
  useEffect(() => {
    if (value) {
      gsap.set(labelRef.current, {
        y: -25,
        scale: 0.85,
        color: darkMode ? "#2997FF" : "#2997FF",
      });
    }
  }, [value, darkMode]);

  // Base style classes based on dark mode and error state
  const containerClasses = darkMode
    ? "bg-zinc-900/30 border border-zinc-800/50"
    : "bg-white/80 border border-gray-300";

  const labelClasses = darkMode ? "text-gray-400" : "text-gray-600";

  const inputClasses = darkMode ? "bg-transparent text-white" : "bg-transparent text-black";

  // Error classes
  const errorClasses = error ? (darkMode ? "border-red-500/50" : "border-red-500") : "";

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative rounded-lg ${containerClasses} ${errorClasses}
          transition-colors duration-200
        `}
      >
        <div className="relative z-0 w-full">
          <input
            id={id}
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              block w-full px-4 pt-6 pb-2 rounded-lg
              outline-none ${inputClasses} 
              transition-all duration-200
            `}
            placeholder=" "
            autoComplete={autoComplete}
            required={required}
            {...props}
          />

          <label
            ref={labelRef}
            htmlFor={id}
            className={`
              absolute top-1/2 left-4 -translate-y-1/2
              origin-[0] pointer-events-none
              ${labelClasses}
              transition-all duration-200
            `}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {/* Animated focus border */}
          <div
            ref={borderRef}
            className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 scale-x-0 origin-left"
          />
        </div>
      </div>

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>}
    </div>
  );
};

export default ModernInput;
