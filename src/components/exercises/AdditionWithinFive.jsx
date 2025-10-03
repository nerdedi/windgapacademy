import { useState } from "react";
import Exercise from "./Exercise";

/**
 * Addition exercise for numbers within 5
 * Based on Khan Academy's addition_1.html
 */
const AdditionWithinFive = ({ onComplete = () => {} }) => {
  // We'll keep a small internal state for this specific exercise
  const [visualMode, setVisualMode] = useState("dots"); // 'dots', 'fingers', 'blocks'

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
        maxNum = 20;
        break;
      case 4:
        maxNum = 50;
        break;
      case 5:
        maxNum = 100;
        break;
      default:
        maxNum = 5;
    }

    // Generate two random numbers for addition
    const a = Math.floor(Math.random() * (maxNum - 1)) + 1;
    const b = Math.floor(Math.random() * (maxNum - a)) + 1; // Ensure sum doesn't exceed maxNum

    // Create equation as either "a + b = ?" or "? = a + b"
    const equationFormat = Math.random() < 0.5 ? "standard" : "reversed";

    return {
      a,
      b,
      answer: a + b,
      equationFormat,
      question: equationFormat === "standard" ? `What is ${a} + ${b}?` : `${a} + ${b} = ?`,
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
    "Try counting the dots to find the total.",
    "Count all objects one by one.",
    `You can count forward from the first number. Start with the larger number and count forward by the smaller number.`,
  ];

  // Draw dots to visualize the addition
  const drawDots = (count, color) => {
    return (
      <div className="flex flex-wrap gap-2 my-4 justify-center">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  // Draw fingers to visualize the addition
  const drawFingers = (count) => {
    // Simple finger visualization (could be improved with actual finger images)
    return (
      <div className="flex flex-wrap gap-1 my-4 justify-center">
        {[...Array(Math.min(count, 10))].map((_, i) => (
          <div key={i} className="w-6 text-3xl">
            👆
          </div>
        ))}
      </div>
    );
  };

  // Draw blocks to visualize the addition
  const drawBlocks = (count, color) => {
    return (
      <div className="flex flex-wrap gap-1 my-4 justify-center">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 ${color} flex items-center justify-center text-white font-bold`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Exercise
      id="addition-within-five"
      title="Addition Within 5"
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
                  {problem.a} + {problem.b} = ?
                </span>
              ) : (
                <span>
                  ? = {problem.a} + {problem.b}
                </span>
              )}
            </p>

            {/* Visual Mode Selector */}
            <div className="visual-mode-selector flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setVisualMode("dots")}
                className={`px-3 py-1 rounded ${visualMode === "dots" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Dots
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("fingers")}
                className={`px-3 py-1 rounded ${visualMode === "fingers" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Fingers
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("blocks")}
                className={`px-3 py-1 rounded ${visualMode === "blocks" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Blocks
              </button>
            </div>

            {/* Visual Aids based on selected mode */}
            <div className="visual-aids flex flex-col md:flex-row justify-center items-center gap-4">
              <div>
                {visualMode === "dots" && drawDots(problem.a, "bg-blue-500")}
                {visualMode === "fingers" && drawFingers(problem.a)}
                {visualMode === "blocks" && drawBlocks(problem.a, "bg-blue-500")}
                <p className="text-blue-700 font-bold text-xl">{problem.a}</p>
              </div>

              <div className="text-3xl">+</div>

              <div>
                {visualMode === "dots" && drawDots(problem.b, "bg-green-500")}
                {visualMode === "fingers" && drawFingers(problem.b)}
                {visualMode === "blocks" && drawBlocks(problem.b, "bg-green-500")}
                <p className="text-green-700 font-bold text-xl">{problem.b}</p>
              </div>
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

export default AdditionWithinFive;
