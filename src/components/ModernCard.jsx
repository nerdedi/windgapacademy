import React from "react";

/**
 * ModernCard - A sleek glass-morphism card component
 *
 * Features:
 * - Glassmorphism effect with customizable appearance
 * - Optional hover animations and glow effects
 * - Dark and light mode variants
 * - Customizable border radius and padding
 */
const ModernCard = ({
  children,
  className = "",
  darkMode = true,
  withHover = true,
  withGlow = false,
  padding = "p-6",
  rounded = "rounded-2xl",
}) => {
  // Determine base style classes based on dark mode
  const baseClasses = darkMode
    ? "modern-glass-dark border border-zinc-800/30"
    : "modern-glass border border-white/30";

  // Add hover animation classes if enabled
  const hoverClasses = withHover
    ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    : "";

  // Add glow animation if enabled
  const glowClasses = withGlow ? "animate-glow" : "";

  return (
    <div
      className={`
        ${baseClasses}
        ${padding}
        ${rounded}
        ${hoverClasses}
        ${glowClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * ModernCardHeader - Styled header section for ModernCard
 */
const ModernCardHeader = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

/**
 * ModernCardBody - Styled body section for ModernCard
 */
const ModernCardBody = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};

/**
 * ModernCardFooter - Styled footer section for ModernCard
 */
const ModernCardFooter = ({ children, className = "" }) => {
  return <div className={`mt-4 pt-4 border-t border-zinc-800/30 ${className}`}>{children}</div>;
};

// Export all components
export { ModernCard, ModernCardHeader, ModernCardBody, ModernCardFooter };
export default ModernCard;
