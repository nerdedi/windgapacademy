/**
 * Math rendering components
 *
 * These components render mathematical expressions using KaTeX.
 * Adapted from Khan Academy's approach to math rendering.
 */

import katex from "katex";
import "katex/dist/katex.min.css";
import React, { useEffect, useState } from "react";
import { cleanMath, expressionToLaTeX } from "../utils/expressionParser";

interface MathProps {
  /**
   * The math expression to render
   */
  expression: string;

  /**
   * Whether to render the math in display mode (centered, larger)
   */
  display?: boolean;

  /**
   * Whether to automatically convert the expression to LaTeX format
   */
  autoConvert?: boolean;

  /**
   * Error message to display if rendering fails
   */
  errorMessage?: string;

  /**
   * Additional class name for the math container
   */
  className?: string;

  /**
   * Color for the math expression
   */
  color?: string;
}

/**
 * Component to render a mathematical expression using KaTeX
 */
export const Math: React.FC<MathProps> = ({
  expression,
  display = false,
  autoConvert = true,
  errorMessage = "Error rendering math",
  className = "",
  color,
}) => {
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Clean the expression and convert to LaTeX if needed
      let texExpression = autoConvert ? expressionToLaTeX(expression) : expression;
      texExpression = cleanMath(texExpression);

      // Add color if specified
      if (color) {
        texExpression = `\\color{${color}}{${texExpression}}`;
      }

      const html = katex.renderToString(texExpression, {
        displayMode: display,
        throwOnError: true,
        trust: true,
      });

      setHtml(html);
      setError(null);
    } catch (err) {
      console.error("Error rendering math:", err);
      setError(errorMessage);
    }
  }, [expression, display, autoConvert, errorMessage, color]);

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return (
    <span
      className={`math-container ${display ? "block" : "inline-block"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface InlineMathProps extends Omit<MathProps, "display"> {}

/**
 * Inline math expression component
 */
export const InlineMath: React.FC<InlineMathProps> = (props) => {
  return <Math {...props} display={false} />;
};

interface BlockMathProps extends Omit<MathProps, "display"> {}

/**
 * Block (display) math expression component
 */
export const BlockMath: React.FC<BlockMathProps> = (props) => {
  return <Math {...props} display={true} />;
};

interface ColoredMathProps extends Omit<MathProps, "color"> {
  color: string;
}

/**
 * Colored math expression component
 */
export const ColoredMath: React.FC<ColoredMathProps> = ({ color, ...props }) => {
  return <Math {...props} color={color} />;
};

// Predefined colored math components
export const BlueMath: React.FC<InlineMathProps> = (props) => {
  return <Math {...props} color="#6495ED" />;
};

export const RedMath: React.FC<InlineMathProps> = (props) => {
  return <Math {...props} color="#DF0030" />;
};

export const GreenMath: React.FC<InlineMathProps> = (props) => {
  return <Math {...props} color="#28AE7B" />;
};

export const OrangeMath: React.FC<InlineMathProps> = (props) => {
  return <Math {...props} color="#FFA500" />;
};

interface MathSelectorProps extends MathProps {
  /**
   * Children to render inside the math expression
   */
  children?: React.ReactNode;
}

/**
 * Component that renders either a passed expression or its children
 */
export const MathSelector: React.FC<MathSelectorProps> = ({ expression, children, ...props }) => {
  // Use either the expression prop or the children as content
  const content = expression || (typeof children === "string" ? children : "");

  if (!content) {
    return null;
  }

  return <Math expression={content} {...props} />;
};

interface DynamicMathProps extends Omit<MathProps, "expression"> {
  /**
   * Template string with placeholders for variables
   */
  template: string;

  /**
   * Variables to substitute into the template
   */
  variables: Record<string, any>;
}

/**
 * Component for dynamically generating math from a template and variables
 */
export const DynamicMath: React.FC<DynamicMathProps> = ({ template, variables, ...props }) => {
  const [expression, setExpression] = useState<string>("");

  useEffect(() => {
    // Replace variables in template
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      result = result.replace(regex, String(value));
    }

    setExpression(result);
  }, [template, variables]);

  return <Math expression={expression} {...props} />;
};
