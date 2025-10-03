import { useState } from "react";
import Exercise from "./Exercise";

/**
 * Subtraction exercise for numbers within 10
 * Based on Khan Academy's subtraction exercises
 */
const SubtractionWithinTen = ({ onComplete = () => {} }) => {
  // We'll keep a small internal state for this specific exercise
  const [visualMode, setVisualMode] = useState("counter"); // 'counter', 'number-line', 'objects'

  // Generate a problem with parameters based on difficulty level
  const generateProblem = (difficulty = 1) => {
    let maxNum;

    // Adjust problem difficulty (max numbers)
    switch (difficulty) {
      case 1:
        maxNum = 10;
        break;
      case 2:
        maxNum = 20;
        break;
      case 3:
        maxNum = 50;
        break;
      case 4:
        maxNum = 100;
        break;
      case 5:
        maxNum = 1000;
        break;
      default:
        maxNum = 10;
    }

    // Generate two numbers for subtraction
    const b = Math.floor(Math.random() * (maxNum / 2)) + 1;
    const a = b + Math.floor(Math.random() * (maxNum / 2)) + 1;

    // Create equation as either "a - b = ?" or "? = a - b"
    const equationFormat = Math.random() < 0.5 ? "standard" : "reversed";

    return {
      a,
      b,
      answer: a - b,
      equationFormat,
      question: equationFormat === "standard" ? `What is ${a} - ${b}?` : `${a} - ${b} = ?`,
    };
  };

  // Check if the user's answer is correct
  const checkAnswer = (problem, userAnswer) => {
    const parsedAnswer = parseInt(userAnswer, 10);

    if (isNaN(parsedAnswer)) {
      return {
        correct: false,
        message: "Please enter a number.",
      };
    }

    return {
      correct: parsedAnswer === problem.answer,
      message: parsedAnswer === problem.answer ? null : "That's not the correct answer. Try again!",
    };
  };

  // Hints for this exercise
  const hints = [
    "Start with the larger number and count backwards.",
    "You can use the visual aid to help you count.",
    "Subtraction means taking away. Start with the first number and take away the second number.",
  ];

  // Render a visual counter representation
  const renderCounter = (a, b) => {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* First number (a) */}
        <div className="counter-row">
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(a)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${i >= a - b ? "bg-red-500 line-through" : "bg-blue-500"}
                  flex items-center justify-center text-white font-bold transition-all duration-300`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-lg mt-2">Start with {a} items</p>
        </div>

        {/* Arrow down */}
        <div className="text-3xl">↓</div>

        {/* Result after subtraction */}
        <div className="counter-row">
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(a - b)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-lg mt-2">Take away {b} items</p>
        </div>
      </div>
    );
  };

  // Render a number line representation
  const renderNumberLine = (a, b) => {
    const answer = a - b;
    const points = [...Array(a + 1)].map((_, i) => i);

    return (
      <div className="number-line my-6">
        <div className="relative h-16">
          {/* Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-400"></div>

          {/* Points */}
          {points.map((point) => (
            <div
              key={point}
              className={`absolute top-8 w-1 h-4 bg-gray-700 transform -translate-x-1/2`}
              style={{ left: `${(point / a) * 100}%` }}
            >
              <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs">{point}</div>
            </div>
          ))}

          {/* Starting point */}
          <div
            className="absolute top-4 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"
            style={{ left: `${(a / a) * 100}%` }}
          >
            <div className="absolute -top-6 transform -translate-x-1/2 text-blue-700 font-bold">
              Start: {a}
            </div>
          </div>

          {/* Ending point */}
          <div
            className="absolute top-4 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2"
            style={{ left: `${(answer / a) * 100}%` }}
          >
            <div className="absolute -top-6 transform -translate-x-1/2 text-green-700 font-bold">
              End: {answer}
            </div>
          </div>

          {/* Arrow showing movement */}
          <svg
            className="absolute top-2 h-6"
            style={{
              left: `${(answer / a) * 100}%`,
              width: `${(b / a) * 100}%`,
              transform: "scaleX(-1)",
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
            </defs>
            <line
              x1="0"
              y1="10"
              x2="100%"
              y2="10"
              stroke="#ef4444"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          {/* Jump amount text */}
          <div
            className="absolute -top-8 text-red-500 font-bold"
            style={{
              left: `${((a - b / 2) / a) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            Jump back {b}
          </div>
        </div>
      </div>
    );
  };

  // Render objects to take away
  const renderObjects = (a, b) => {
    // Use emojis as objects
    const emojis = ["🍎", "🍌", "🍒", "🍓", "🍊"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    return (
      <div className="flex flex-col items-center gap-6">
        {/* First set of objects */}
        <div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {[...Array(a)].map((_, i) => (
              <div key={i} className={`text-3xl ${i >= a - b ? "opacity-40 line-through" : ""}`}>
                {randomEmoji}
              </div>
            ))}
          </div>
          <p className="text-lg text-center">
            Starting with {a} {randomEmoji}
          </p>
        </div>

        {/* Take away message */}
        <div className="bg-red-100 px-4 py-2 rounded-lg">
          <p className="text-lg text-red-700">
            Take away {b} {randomEmoji}
          </p>
        </div>

        {/* Remaining objects */}
        <div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {[...Array(a - b)].map((_, i) => (
              <div key={i} className="text-3xl">
                {randomEmoji}
              </div>
            ))}
          </div>
          <p className="text-lg text-center">How many {randomEmoji} are left?</p>
        </div>
      </div>
    );
  };

  return (
    <Exercise
      id="subtraction-within-ten"
      title="Subtraction Within 10"
      category="math-basics"
      level={1}
      generateProblem={generateProblem}
      checkAnswer={checkAnswer}
      hints={hints}
      maxAttempts={3}
      difficultyAdjustment={true}
      onComplete={onComplete}
    >
      {({ problem, userAnswer, setUserAnswer }) => (
        <div className="exercise-content">
          {/* Problem Display */}
          <div className="problem-display text-center mb-6">
            <p className="text-3xl font-bold mb-4">
              {problem.equationFormat === "standard" ? (
                <span>
                  {problem.a} - {problem.b} = ?
                </span>
              ) : (
                <span>
                  ? = {problem.a} - {problem.b}
                </span>
              )}
            </p>

            {/* Visual Mode Selector */}
            <div className="visual-mode-selector flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setVisualMode("counter")}
                className={`px-3 py-1 rounded ${visualMode === "counter" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Counter
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("number-line")}
                className={`px-3 py-1 rounded ${visualMode === "number-line" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Number Line
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("objects")}
                className={`px-3 py-1 rounded ${visualMode === "objects" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Objects
              </button>
            </div>

            {/* Visual Aids based on selected mode */}
            <div className="visual-aids mt-6">
              {visualMode === "counter" && renderCounter(problem.a, problem.b)}
              {visualMode === "number-line" && renderNumberLine(problem.a, problem.b)}
              {visualMode === "objects" && renderObjects(problem.a, problem.b)}
            </div>
          </div>

          {/* Answer Input */}
          <div className="answer-input text-center">
            <label htmlFor="answer" className="block text-lg font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <input
              id="answer"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-24 text-center text-2xl px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="?"
            />
          </div>
        </div>
      )}
    </Exercise>
  );
};

export default SubtractionWithinTen;
