import { useState } from "react";
import Exercise from "./Exercise";

/**
 * Multiplication exercise for basic multiplication facts
 * Based on Khan Academy's multiplication exercises
 */
const BasicMultiplication = ({ onComplete = () => {} }) => {
  // We'll keep a small internal state for this specific exercise
  const [visualMode, setVisualMode] = useState("grid"); // 'grid', 'groups', 'number-line'

  // Generate a problem with parameters based on difficulty level
  const generateProblem = (difficulty = 1) => {
    let maxNum;

    // Adjust problem difficulty (max numbers)
    switch (difficulty) {
      case 1:
        maxNum = 5;
        break;
      case 2:
        maxNum = 10;
        break;
      case 3:
        maxNum = 12;
        break;
      case 4:
        maxNum = 15;
        break;
      case 5:
        maxNum = 20;
        break;
      default:
        maxNum = 5;
    }

    // Generate two numbers for multiplication
    const a = Math.floor(Math.random() * (maxNum - 1)) + 1;
    const b = Math.floor(Math.random() * (maxNum - 1)) + 1;

    // Create equation as either "a × b = ?" or "? = a × b"
    const equationFormat = Math.random() < 0.5 ? "standard" : "reversed";

    return {
      a,
      b,
      answer: a * b,
      equationFormat,
      question: equationFormat === "standard" ? `What is ${a} × ${b}?` : `${a} × ${b} = ?`,
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
    "Multiplication is repeated addition. Add the first number to itself the second number of times.",
    "Count the total number of dots in the grid.",
    "Try thinking of it as equal groups. How many items in each group, and how many groups?",
  ];

  // Render a grid visualization for multiplication
  const renderGrid = (a, b) => {
    return (
      <div className="grid-visualization my-6">
        <div className="grid-dimensions text-center mb-4">
          <span className="inline-block px-4 py-2 bg-blue-100 rounded-lg text-blue-800 font-semibold mr-2">
            {a} rows
          </span>
          <span className="inline-block px-4 py-2 bg-green-100 rounded-lg text-green-800 font-semibold">
            {b} columns
          </span>
        </div>

        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))`,
            maxWidth: `${b * 40}px`,
          }}
        >
          {[...Array(a * b)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="grid-labels flex justify-center items-center gap-4 mt-4">
          <div className="label flex items-center">
            <div className="w-6 h-12 bg-blue-500"></div>
            <span className="ml-2 font-medium">{a} rows</span>
          </div>
          <div className="label flex flex-col items-center">
            <div className="w-12 h-6 bg-green-500"></div>
            <span className="mt-2 font-medium">{b} columns</span>
          </div>
        </div>
      </div>
    );
  };

  // Render equal groups visualization for multiplication
  const renderGroups = (a, b) => {
    // We'll show 'a' groups, each containing 'b' items
    const groups = Array(a)
      .fill()
      .map((_, i) => i);

    return (
      <div className="groups-visualization my-6">
        <p className="text-center mb-4 font-medium">
          {a} groups of {b} items each
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {groups.map((group) => (
            <div key={group} className="group">
              <div className="border-2 border-blue-500 rounded-lg p-2 mb-1">
                <div className="flex flex-wrap gap-1 justify-center">
                  {[...Array(b)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                    >
                      ★
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-sm font-medium">Group {group + 1}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="font-medium">
            {a} groups × {b} items = ? total items
          </p>
        </div>
      </div>
    );
  };

  // Render number line visualization for multiplication
  const renderNumberLine = (a, b) => {
    // We'll show multiplication as repeated addition on a number line
    const jumps = Array(a)
      .fill()
      .map((_, i) => i);
    const answer = a * b;

    return (
      <div className="number-line-visualization my-6">
        <p className="text-center mb-4 font-medium">
          {a} jumps of {b} units each
        </p>

        <div className="relative h-16">
          {/* Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-400"></div>

          {/* Points */}
          {[...Array(answer + 1)].map((_, point) => (
            <div
              key={point}
              className={`absolute top-8 w-1 h-4 bg-gray-700 transform -translate-x-1/2`}
              style={{ left: `${(point / answer) * 95}%` }}
            >
              <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs">{point}</div>
            </div>
          ))}

          {/* Jumps */}
          {jumps.map((jump) => {
            const startPoint = jump * b;
            const endPoint = (jump + 1) * b;

            return (
              <div
                key={jump}
                className="absolute top-4"
                style={{
                  left: `${(startPoint / answer) * 95}%`,
                  width: `${(b / answer) * 95}%`,
                }}
              >
                {/* Arrow showing jump */}
                <svg className="w-full h-6">
                  <defs>
                    <marker
                      id={`arrowhead-${jump}`}
                      markerWidth="10"
                      markerHeight="7"
                      refX="0"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <line
                    x1="0"
                    y1="10"
                    x2="95%"
                    y2="10"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${jump})`}
                  />
                </svg>

                {/* Jump label */}
                <div className="absolute -top-6 text-blue-600 font-medium text-xs w-full text-center">
                  +{b}
                </div>
              </div>
            );
          })}

          {/* Starting point */}
          <div
            className="absolute top-4 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2"
            style={{ left: `0%` }}
          >
            <div className="absolute -top-6 transform -translate-x-1/2 text-green-700 font-bold">
              Start
            </div>
          </div>

          {/* Ending point */}
          <div
            className="absolute top-4 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2"
            style={{ left: `${(answer / answer) * 95}%` }}
          >
            <div className="absolute -top-6 transform -translate-x-1/2 text-red-700 font-bold">
              End
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="font-medium">
            {a} jumps of {b} = ? total
          </p>
        </div>
      </div>
    );
  };

  return (
    <Exercise
      id="basic-multiplication"
      title="Basic Multiplication"
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
                  {problem.a} × {problem.b} = ?
                </span>
              ) : (
                <span>
                  ? = {problem.a} × {problem.b}
                </span>
              )}
            </p>

            {/* Visual Mode Selector */}
            <div className="visual-mode-selector flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setVisualMode("grid")}
                className={`px-3 py-1 rounded ${visualMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("groups")}
                className={`px-3 py-1 rounded ${visualMode === "groups" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Groups
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("number-line")}
                className={`px-3 py-1 rounded ${visualMode === "number-line" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Number Line
              </button>
            </div>

            {/* Visual Aids based on selected mode */}
            <div className="visual-aids mt-6">
              {visualMode === "grid" && renderGrid(problem.a, problem.b)}
              {visualMode === "groups" && renderGroups(problem.a, problem.b)}
              {visualMode === "number-line" && renderNumberLine(problem.a, problem.b)}
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

export default BasicMultiplication;
