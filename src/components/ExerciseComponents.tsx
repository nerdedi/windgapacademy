/**
 * Exercise Components - Interactive components for mathematical exercises
 *
 * Adapted from Khan Academy's exercise components to work with modern React.
 */

import React, { useEffect, useRef, useState } from "react";
import * as ExpressionParser from "../utils/expressionParser";
import { InlineMath, Math } from "./MathComponents";

/**
 * InputStyle interface
 */
interface InputStyle {
  width?: string;
  height?: string;
  fontSize?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
}

/**
 * Basic text input for exercise answers
 */
export const TextInput: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: InputStyle;
}> = ({ value = "", onChange, placeholder = "", className = "", style = {} }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`windgap-text-input ${className}`}
      style={{
        width: style.width || "200px",
        height: style.height || "36px",
        fontSize: style.fontSize || "16px",
        backgroundColor: style.backgroundColor || "white",
        border: style.border || "1px solid #ccc",
        borderRadius: style.borderRadius || "4px",
        padding: style.padding || "8px 12px",
      }}
    />
  );
};

/**
 * Math expression input for exercise answers
 */
export const MathInput: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  onParse?: (parsed: any) => void;
  placeholder?: string;
  className?: string;
  style?: InputStyle;
  showPreview?: boolean;
}> = ({
  value = "",
  onChange,
  onParse,
  placeholder = "",
  className = "",
  style = {},
  showPreview = true,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [previewTeX, setPreviewTeX] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    try {
      // Try to parse and convert to LaTeX
      const parsed = ExpressionParser.parse(internalValue);
      const tex = ExpressionParser.expressionToLaTeX(parsed);
      setPreviewTeX(tex);
      setIsValid(true);

      if (onParse) {
        onParse(parsed);
      }
    } catch (e) {
      setPreviewTeX("");
      setIsValid(false);
    }
  }, [internalValue, onParse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`windgap-math-input-container ${className}`}>
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`windgap-math-input ${isValid ? "" : "invalid"}`}
        style={{
          width: style.width || "200px",
          height: style.height || "36px",
          fontSize: style.fontSize || "16px",
          backgroundColor: style.backgroundColor || "white",
          border: style.border || (isValid ? "1px solid #ccc" : "1px solid #f44336"),
          borderRadius: style.borderRadius || "4px",
          padding: style.padding || "8px 12px",
        }}
      />
      {showPreview && previewTeX && (
        <div className="windgap-math-preview mt-2">
          <InlineMath math={previewTeX} />
        </div>
      )}
    </div>
  );
};

/**
 * Multiple choice component
 */
export const MultipleChoice: React.FC<{
  choices: string[];
  correctIndex?: number;
  onSelect?: (index: number) => void;
  showFeedback?: boolean;
  className?: string;
  mathMode?: boolean;
}> = ({
  choices,
  correctIndex,
  onSelect,
  showFeedback = false,
  className = "",
  mathMode = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    if (onSelect) {
      onSelect(index);
    }
  };

  const getChoiceFeedbackClass = (index: number) => {
    if (!showFeedback || selectedIndex !== index) return "";
    return index === correctIndex ? "correct" : "incorrect";
  };

  return (
    <div className={`windgap-multiple-choice ${className}`}>
      {choices.map((choice, index) => (
        <div
          key={index}
          className={`windgap-choice-item ${selectedIndex === index ? "selected" : ""} ${getChoiceFeedbackClass(index)}`}
          onClick={() => handleSelect(index)}
        >
          <div className="windgap-choice-marker">{String.fromCharCode(65 + index)}</div>
          <div className="windgap-choice-content">
            {mathMode ? <InlineMath math={choice} /> : choice}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * NumberLine input component
 */
export const NumberLineInput: React.FC<{
  min: number;
  max: number;
  initialValues?: number[];
  onChange?: (values: number[]) => void;
  width?: number;
  height?: number;
  tickStep?: number;
  labelStep?: number;
  className?: string;
}> = ({
  min,
  max,
  initialValues = [],
  onChange,
  width = 500,
  height = 80,
  tickStep = 1,
  labelStep = 1,
  className = "",
}) => {
  const [points, setPoints] = useState<number[]>(initialValues);
  const svgRef = useRef<SVGSVGElement>(null);

  const scaleFactor = width / (max - min);

  const addPoint = (x: number) => {
    // Convert screen coordinate to number line value
    const value = min + x / scaleFactor;
    // Round to the nearest tickStep
    const roundedValue = Math.round(value / tickStep) * tickStep;

    if (roundedValue >= min && roundedValue <= max) {
      const newPoints = [...points, roundedValue].sort((a, b) => a - b);
      setPoints(newPoints);

      if (onChange) {
        onChange(newPoints);
      }
    }
  };

  const removePoint = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);

    if (onChange) {
      onChange(newPoints);
    }
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;

    addPoint(x);
  };

  // Create ticks and labels
  const ticks = [];
  const labels = [];

  for (let value = min; value <= max; value += tickStep) {
    const x = (value - min) * scaleFactor;

    // Add tick
    ticks.push(
      <line
        key={`tick-${value}`}
        x1={x}
        y1={height / 2 - 10}
        x2={x}
        y2={height / 2 + 10}
        stroke="#000"
        strokeWidth={1}
      />,
    );

    // Add label if it's at a label step
    if (value % labelStep === 0) {
      labels.push(
        <text key={`label-${value}`} x={x} y={height / 2 + 25} textAnchor="middle" fontSize="12">
          {value}
        </text>,
      );
    }
  }

  // Create point markers
  const pointMarkers = points.map((value, index) => {
    const x = (value - min) * scaleFactor;

    return (
      <g key={`point-${index}`}>
        <circle
          cx={x}
          cy={height / 2}
          r={8}
          fill="#6495ED"
          stroke="#000"
          strokeWidth={1}
          onClick={(e) => {
            e.stopPropagation();
            removePoint(index);
          }}
          style={{ cursor: "pointer" }}
        />
      </g>
    );
  });

  return (
    <div className={`windgap-numberline-input ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: "crosshair" }}
      >
        {/* Main line */}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#000" strokeWidth={2} />

        {/* Arrow at the end */}
        <polygon
          points={`${width},${height / 2} ${width - 10},${height / 2 - 5} ${width - 10},${height / 2 + 5}`}
          fill="#000"
        />

        {/* Ticks */}
        <g className="ticks">{ticks}</g>

        {/* Labels */}
        <g className="labels">{labels}</g>

        {/* Points */}
        <g className="points">{pointMarkers}</g>
      </svg>

      <div className="windgap-numberline-instructions text-sm text-gray-600 mt-2">
        Click on the line to add points. Click on a point to remove it.
      </div>
    </div>
  );
};

/**
 * Fractions input component
 */
export const FractionInput: React.FC<{
  value?: { numerator: string; denominator: string };
  onChange?: (value: { numerator: string; denominator: string }) => void;
  className?: string;
  style?: InputStyle;
}> = ({ value = { numerator: "", denominator: "" }, onChange, className = "", style = {} }) => {
  const [numerator, setNumerator] = useState(value.numerator);
  const [denominator, setDenominator] = useState(value.denominator);

  useEffect(() => {
    setNumerator(value.numerator);
    setDenominator(value.denominator);
  }, [value]);

  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumerator = e.target.value.replace(/[^0-9-]/g, "");
    setNumerator(newNumerator);

    if (onChange) {
      onChange({ numerator: newNumerator, denominator });
    }
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDenominator = e.target.value.replace(/[^0-9]/g, "");
    setDenominator(newDenominator);

    if (onChange) {
      onChange({ numerator, denominator: newDenominator });
    }
  };

  return (
    <div className={`windgap-fraction-input ${className} flex flex-col items-center`}>
      <input
        type="text"
        value={numerator}
        onChange={handleNumeratorChange}
        className="windgap-fraction-numerator text-center"
        style={{
          width: style.width || "80px",
          height: style.height || "36px",
          fontSize: style.fontSize || "16px",
          backgroundColor: style.backgroundColor || "white",
          border: style.border || "1px solid #ccc",
          borderRadius: style.borderRadius || "4px",
          padding: style.padding || "4px",
        }}
      />

      <div
        className="windgap-fraction-line my-1"
        style={{
          width: style.width || "80px",
          height: "2px",
          backgroundColor: "#000",
        }}
      />

      <input
        type="text"
        value={denominator}
        onChange={handleDenominatorChange}
        className="windgap-fraction-denominator text-center"
        style={{
          width: style.width || "80px",
          height: style.height || "36px",
          fontSize: style.fontSize || "16px",
          backgroundColor: style.backgroundColor || "white",
          border: style.border || "1px solid #ccc",
          borderRadius: style.borderRadius || "4px",
          padding: style.padding || "4px",
        }}
      />
    </div>
  );
};

/**
 * Exercise component that wraps exercise content
 */
export const Exercise: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({ children, title, className = "" }) => {
  return (
    <div className={`windgap-exercise p-6 border border-gray-300 rounded-lg ${className}`}>
      {title && <h2 className="windgap-exercise-title text-xl font-bold mb-4">{title}</h2>}
      <div className="windgap-exercise-content">{children}</div>
    </div>
  );
};

/**
 * Hint component for providing hints in exercises
 */
export const Hint: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`windgap-hint mt-4 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="windgap-hint-button px-4 py-2 bg-blue-100 text-blue-800 rounded-md flex items-center"
      >
        <span className="mr-2">{isOpen ? "−" : "+"}</span>
        <span>{isOpen ? "Hide Hint" : "Show Hint"}</span>
      </button>

      {isOpen && (
        <div className="windgap-hint-content mt-2 p-4 bg-blue-50 rounded-md">{children}</div>
      )}
    </div>
  );
};

/**
 * Feedback component for providing answer feedback
 */
export const Feedback: React.FC<{
  isCorrect?: boolean | null;
  correctMessage?: string;
  incorrectMessage?: string;
  className?: string;
}> = ({
  isCorrect = null,
  correctMessage = "Correct!",
  incorrectMessage = "Try again.",
  className = "",
}) => {
  if (isCorrect === null) return null;

  return (
    <div
      className={`windgap-feedback mt-4 p-4 rounded-md ${
        isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      } ${className}`}
    >
      <div className="flex items-center">
        <span className="mr-2 text-xl">{isCorrect ? "✓" : "✗"}</span>
        <span>{isCorrect ? correctMessage : incorrectMessage}</span>
      </div>
    </div>
  );
};

/**
 * Timer component for timed exercises
 */
export const Timer: React.FC<{
  duration: number; // in seconds
  onComplete?: () => void;
  className?: string;
}> = ({ duration, onComplete, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          if (onComplete) onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100;

  return (
    <div className={`windgap-timer ${className}`}>
      <div className="flex items-center">
        <div className="windgap-timer-clock text-lg font-mono">{formattedTime}</div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="ml-3 px-2 py-1 text-xs rounded bg-gray-200"
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="windgap-timer-progress mt-2 w-full bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

/**
 * Answer checker utility
 */
export const checkAnswer = {
  /**
   * Check if a numeric answer is correct within a given tolerance
   */
  numeric: (userAnswer: string, correctAnswer: number, tolerance = 0.001): boolean => {
    const userNumber = parseFloat(userAnswer);
    if (isNaN(userNumber)) return false;
    return Math.abs(userNumber - correctAnswer) <= tolerance;
  },

  /**
   * Check if an expression is equivalent to the correct answer
   */
  expression: (userExpression: string, correctExpression: string): boolean => {
    try {
      const userParsed = ExpressionParser.parse(userExpression);
      const correctParsed = ExpressionParser.parse(correctExpression);
      return ExpressionParser.expressionsEqual(userParsed, correctParsed);
    } catch (e) {
      return false;
    }
  },

  /**
   * Check if a fraction is equivalent to the correct answer
   */
  fraction: (
    userFraction: { numerator: string; denominator: string },
    correctFraction: { numerator: number; denominator: number },
  ): boolean => {
    const userNum = parseInt(userFraction.numerator, 10);
    const userDenom = parseInt(userFraction.denominator, 10);

    if (isNaN(userNum) || isNaN(userDenom) || userDenom === 0) {
      return false;
    }

    // Check if fractions are equivalent
    return userNum * correctFraction.denominator === userDenom * correctFraction.numerator;
  },
};
