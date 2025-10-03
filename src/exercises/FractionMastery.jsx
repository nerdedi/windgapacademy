/**
 * FractionMastery - Adaptive Exercise
 *
 * This is an adaptive math exercise focusing on fractions.
 * It demonstrates how to create custom exercises for the adaptive learning system.
 */

import { useState } from "react";
import AdaptiveMathExercise from "../components/AdaptiveMathExercise";

/**
 * Generate exercises for Fraction Mastery
 */
const generateFractionMasteryExercise = ({ difficulty, exerciseType, weakAreas }) => {
  // Base exercise configuration
  const baseExercise = {
    question: "",
    answer: null,
    hint: "",
    learningObjective: "Practice fraction skills",
    icon: "🧩",
  };

  // Create difficulty-appropriate exercise
  switch (difficulty) {
    case "very_easy":
      return generateFractionIdentification(baseExercise);

    case "easy":
      return generateSimpleFractionAddition(baseExercise);

    case "medium":
      return generateFractionComparison(baseExercise);

    case "hard":
      return generateMixedNumberAddition(baseExercise);

    case "very_hard":
      return generateFractionMultiplication(baseExercise);

    default:
      return generateSimpleFractionAddition(baseExercise);
  }
};

/**
 * Generate a fraction identification exercise (very easy)
 */
const generateFractionIdentification = (baseExercise) => {
  const denominator = Math.floor(Math.random() * 5) + 2;
  const numerator = Math.floor(Math.random() * denominator) + 1;

  const question = `What fraction of the shape is shaded? (Answer as a fraction, e.g., 1/4)`;
  const answer = `${numerator}/${denominator}`;
  const hint = "Count the total number of parts and how many are shaded.";

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>

        {/* Visual representation of fraction */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-{denominator} gap-1 w-64 h-16">
            {Array.from({ length: denominator }).map((_, index) => (
              <div
                key={index}
                className={`border border-gray-400 ${index < numerator ? "bg-blue-500" : "bg-white"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded text-center text-xl w-32"
            placeholder="Your answer"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Check
          </button>
        </div>
      </div>
    ),
  };
};

/**
 * Generate a simple fraction addition exercise (easy)
 */
const generateSimpleFractionAddition = (baseExercise) => {
  const denom = Math.floor(Math.random() * 8) + 2;
  const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
  const num2 = Math.floor(Math.random() * (denom - num1)) + 1;

  const question = `What is ${num1}/${denom} + ${num2}/${denom}?`;
  const answer = `${num1 + num2}/${denom}`;
  const hint = "When adding fractions with the same denominator, just add the numerators.";

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded text-center text-xl w-32"
            placeholder="Your answer"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Check
          </button>
        </div>
      </div>
    ),
  };
};

/**
 * Generate a fraction comparison exercise (medium)
 */
const generateFractionComparison = (baseExercise) => {
  const denom1 = Math.floor(Math.random() * 6) + 2;
  const denom2 = Math.floor(Math.random() * 6) + 2;
  const num_1 = Math.floor(Math.random() * (denom1 - 1)) + 1;
  const num_2 = Math.floor(Math.random() * (denom2 - 1)) + 1;

  const question = `Which is larger: ${num_1}/${denom1} or ${num_2}/${denom2}?`;
  const frac1 = num_1 / denom1;
  const frac2 = num_2 / denom2;
  const answer = frac1 > frac2 ? `${num_1}/${denom1}` : `${num_2}/${denom2}`;
  const hint = "Find a common denominator or convert to decimal to compare.";

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 transition-colors">
            {num_1}/{denom1}
          </button>
          <button className="px-4 py-2 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 transition-colors">
            {num_2}/{denom2}
          </button>
        </div>
      </div>
    ),
  };
};

/**
 * Generate a mixed number addition exercise (hard)
 */
const generateMixedNumberAddition = (baseExercise) => {
  const whole1 = Math.floor(Math.random() * 5) + 1;
  const whole2 = Math.floor(Math.random() * 3) + 1;
  const den = Math.floor(Math.random() * 8) + 2;
  const n1 = Math.floor(Math.random() * (den - 1)) + 1;
  const n2 = Math.floor(Math.random() * (den - 1)) + 1;

  const question = `What is ${whole1} ${n1}/${den} + ${whole2} ${n2}/${den}?`;

  // Calculate result
  const totalNum = whole1 * den + n1 + (whole2 * den + n2);
  const resultWhole = Math.floor(totalNum / den);
  const resultNum = totalNum % den;

  const answer = resultNum === 0 ? `${resultWhole}` : `${resultWhole} ${resultNum}/${den}`;
  const hint = "Convert mixed numbers to improper fractions, then add and simplify.";

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded text-center text-xl w-32"
            placeholder="Your answer"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Check
          </button>
        </div>
      </div>
    ),
  };
};

/**
 * Generate a fraction multiplication exercise (very hard)
 */
const generateFractionMultiplication = (baseExercise) => {
  const d1 = Math.floor(Math.random() * 10) + 2;
  const d2 = Math.floor(Math.random() * 10) + 2;
  const n_1 = Math.floor(Math.random() * (d1 - 1)) + 1;
  const n_2 = Math.floor(Math.random() * (d2 - 1)) + 1;

  const question = `What is ${n_1}/${d1} × ${n_2}/${d2}? (Simplify your answer)`;

  // Calculate result and simplify
  let resultNumerator = n_1 * n_2;
  let resultDenominator = d1 * d2;

  // Find GCD for simplification
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const divisor = gcd(resultNumerator, resultDenominator);

  resultNumerator /= divisor;
  resultDenominator /= divisor;

  const answer = `${resultNumerator}/${resultDenominator}`;
  const hint = "Multiply the numerators together and the denominators together, then simplify.";

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded text-center text-xl w-32"
            placeholder="Your answer"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Check
          </button>
        </div>
      </div>
    ),
  };
};

/**
 * FractionMastery component
 */
const FractionMastery = () => {
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  // Handle exercise completion
  const handleExerciseComplete = (result) => {
    console.log("Exercise completed:", result);
    setExerciseCompleted(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fraction Mastery</h1>

      {!exerciseCompleted ? (
        <AdaptiveMathExercise
          userId="guest"
          conceptId="fractions"
          conceptName="Fraction Operations"
          knowledgeArea="fractions"
          exerciseGenerator={generateFractionMasteryExercise}
          maxExercises={5}
          initialDifficulty="medium"
          saveProgress={false}
          onComplete={handleExerciseComplete}
        />
      ) : (
        <div className="bg-green-100 p-4 rounded-md">
          <p className="text-green-800">Fraction exercises completed! Great job!</p>
          <button
            onClick={() => setExerciseCompleted(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FractionMastery;
