/**
 * createAdaptiveExercise.js - Helper utility to create new adaptive exercises
 *
 * This script provides a simple way for educators and developers to create
 * custom adaptive exercises for the Windgap Academy platform.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Template for a new adaptive exercise
const exerciseTemplate = (name, conceptName, knowledgeArea, difficulty) => `/**
 * ${name} - Adaptive Exercise
 *
 * This is an adaptive math exercise focusing on ${conceptName.toLowerCase()}.
 * Generated with the Windgap Academy exercise creator.
 */

import React, { useState } from 'react';
import AdaptiveMathExercise from '../components/AdaptiveMathExercise';

/**
 * Generate exercises for ${conceptName}
 */
const generate${name.replace(/\s+/g, "")}Exercise = ({ difficulty, exerciseType, weakAreas }) => {
  // Base exercise configuration
  const baseExercise = {
    question: "",
    answer: null,
    hint: "",
    learningObjective: "Practice ${conceptName.toLowerCase()} skills",
    icon: "🧮",
  };

  // Helper functions for exercise generation
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // Determine concept type for specialized generation
  const conceptType = '${knowledgeArea.toLowerCase().replace(/\s+/g, "_")}';

  // Create difficulty-appropriate exercise based on concept type
  if (conceptType.includes('addition')) {
    return generateAdditionExercise(difficulty, baseExercise);
  } else if (conceptType.includes('subtraction')) {
    return generateSubtractionExercise(difficulty, baseExercise);
  } else if (conceptType.includes('multiplication')) {
    return generateMultiplicationExercise(difficulty, baseExercise);
  } else if (conceptType.includes('division')) {
    return generateDivisionExercise(difficulty, baseExercise);
  } else if (conceptType.includes('fraction')) {
    return generateFractionExercise(difficulty, baseExercise);
  } else if (conceptType.includes('geometry')) {
    return generateGeometryExercise(difficulty, baseExercise);
  } else if (conceptType.includes('algebra')) {
    return generateAlgebraExercise(difficulty, baseExercise);
  } else if (conceptType.includes('measurement')) {
    return generateMeasurementExercise(difficulty, baseExercise);
  } else if (conceptType.includes('probability')) {
    return generateProbabilityExercise(difficulty, baseExercise);
  } else if (conceptType.includes('statistics')) {
    return generateStatisticsExercise(difficulty, baseExercise);
  } else {
    // Default to general math exercises
    switch (difficulty) {
      case 'very_easy':
        return generateGeneralExercise('very_easy', baseExercise);
      case 'easy':
        return generateGeneralExercise('easy', baseExercise);
      case 'medium':
        return generateGeneralExercise('medium', baseExercise);
      case 'hard':
        return generateGeneralExercise('hard', baseExercise);
      case 'very_hard':
        return generateGeneralExercise('very_hard', baseExercise);
      default:
        return generateGeneralExercise('medium', baseExercise);
    }
  }
};

/**
 * Generate general math exercises
 */
const generateGeneralExercise = (difficulty, baseExercise) => {
  switch (difficulty) {
    case 'very_easy':
      return {
        ...baseExercise,
        question: "What is 5 + 3?",
        answer: "8",
        hint: "Count 5 and then count 3 more.",
        icon: "🔢"
      };
    case 'easy':
      return {
        ...baseExercise,
        question: "What is 12 - 7?",
        answer: "5",
        hint: "Start at 12 and count back 7.",
        icon: "🔢"
      };
    case 'medium':
      return {
        ...baseExercise,
        question: "What is 6 × 7?",
        answer: "42",
        hint: "Use the multiplication table or add 7 six times.",
        icon: "🔢"
      };
    case 'hard':
      return {
        ...baseExercise,
        question: "What is 3/4 + 2/3?",
        answer: "17/12",
        hint: "Find a common denominator first.",
        icon: "🔢"
      };
    case 'very_hard':
      return {
        ...baseExercise,
        question: "Solve for x: 2x + 5 = 13",
        answer: "4",
        hint: "Subtract 5 from both sides, then divide by 2.",
        icon: "🔢"
      };
    default:
      return {
        ...baseExercise,
        question: "What is 10 + 15?",
        answer: "25",
        hint: "Add the ones digit first, then the tens digit.",
        icon: "🔢"
      };
  }
};

/**
 * Generate addition exercises based on difficulty
 */
const generateAdditionExercise = (difficulty, baseExercise) => {
  let num1, num2, question, answer, hint;
  const icon = "➕";

  switch (difficulty) {
    case 'very_easy':
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Count the total objects from both groups.";
      break;
    case 'easy':
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 20);
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Try adding the ones digit first, then the tens digit.";
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 50;
      num2 = Math.floor(Math.random() * 50) + 20;
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Line up the numbers by place value before adding.";
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 100;
      num2 = Math.floor(Math.random() * 100) + 50;
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Remember to carry when the sum in a place value exceeds 9.";
      break;
    case 'very_hard':
      num1 = Math.floor(Math.random() * 1000) + 500;
      num2 = Math.floor(Math.random() * 500) + 100;
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Break the addition into steps by place value.";
      break;
    default:
      num1 = Math.floor(Math.random() * 20);
      num2 = Math.floor(Math.random() * 20);
      question = \`What is \${num1} + \${num2}?\`;
      hint = "Try counting up from the larger number.";
  }

  answer = num1 + num2;

  return {
    ...baseExercise,
    question,
    answer: answer.toString(),
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="number" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate subtraction exercises based on difficulty
 */
const generateSubtractionExercise = (difficulty, baseExercise) => {
  let num1, num2, question, answer, hint;
  const icon = "➖";

  switch (difficulty) {
    case 'very_easy':
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * num1);
      question = \`What is \${num1} - \${num2}?\`;
      hint = "Count backward from the larger number.";
      break;
    case 'easy':
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10);
      question = \`What is \${num1} - \${num2}?\`;
      hint = "Subtract the ones digit first.";
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 50;
      num2 = Math.floor(Math.random() * 40) + 10;
      question = \`What is \${num1} - \${num2}?\`;
      hint = "Line up the numbers by place value before subtracting.";
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 100;
      num2 = Math.floor(Math.random() * 90) + 10;
      question = \`What is \${num1} - \${num2}?\`;
      hint = "You may need to borrow from the tens place.";
      break;
    case 'very_hard':
      num1 = Math.floor(Math.random() * 1000) + 500;
      num2 = Math.floor(Math.random() * 400) + 100;
      question = \`What is \${num1} - \${num2}?\`;
      hint = "Break the subtraction into steps by place value.";
      break;
    default:
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10);
      question = \`What is \${num1} - \${num2}?\`;
      hint = "Think of it as: how many more do you need to add to get from the smaller to the larger number?";
  }

  answer = num1 - num2;

  return {
    ...baseExercise,
    question,
    answer: answer.toString(),
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="number" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate multiplication exercises based on difficulty
 */
const generateMultiplicationExercise = (difficulty, baseExercise) => {
  let num1, num2, question, answer, hint;
  const icon = "✖️";

  switch (difficulty) {
    case 'very_easy':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Think of multiplication as repeated addition.";
      break;
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Use your multiplication tables or count by the smaller number.";
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Break down the multiplication into smaller parts if needed.";
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * 10) + 5;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Use the distributive property to break down the multiplication.";
      break;
    case 'very_hard':
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 15) + 5;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Try using the standard algorithm for multi-digit multiplication.";
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      question = \`What is \${num1} × \${num2}?\`;
      hint = "Multiplication is repeated addition. Think of it as adding the first number to itself the second number of times.";
  }

  answer = num1 * num2;

  return {
    ...baseExercise,
    question,
    answer: answer.toString(),
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="number" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate division exercises based on difficulty
 */
const generateDivisionExercise = (difficulty, baseExercise) => {
  let num1, num2, product, question, answer, hint;
  const icon = "➗";

  switch (difficulty) {
    case 'very_easy':
      num2 = Math.floor(Math.random() * 5) + 1;
      num1 = Math.floor(Math.random() * 5) + 1;
      product = num1 * num2;
      hint = "Think of division as sharing equally among groups.";
      question = \`What is \${product} ÷ \${num2}?\`;
      answer = num1;
      break;
    case 'easy':
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = Math.floor(Math.random() * 5) + 1;
      product = num1 * num2;
      hint = "Use the relationship between multiplication and division.";
      question = \`What is \${product} ÷ \${num2}?\`;
      answer = num1;
      break;
    case 'medium':
      num2 = Math.floor(Math.random() * 12) + 1;
      num1 = Math.floor(Math.random() * 12) + 1;
      product = num1 * num2;
      hint = "Think of what number multiplied by the divisor gives the dividend.";
      question = \`What is \${product} ÷ \${num2}?\`;
      answer = num1;
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 20;
      num2 = Math.floor(Math.random() * 10) + 2;
      hint = "Use long division to solve step by step.";
      question = \`What is \${num1} ÷ \${num2}? (Round to 1 decimal place if needed)\`;
      answer = (num1 / num2).toFixed(1).replace(/[.]0$/, '');
      break;
    case 'very_hard':
      num1 = Math.floor(Math.random() * 1000) + 100;
      num2 = Math.floor(Math.random() * 20) + 5;
      hint = "Use long division and keep track of each step carefully.";
      question = \`What is \${num1} ÷ \${num2}? (Round to 1 decimal place if needed)\`;
      answer = (num1 / num2).toFixed(1).replace(/[.]0$/, '');
      break;
    default:
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = Math.floor(Math.random() * 10) + 1;
      product = num1 * num2;
      hint = "Division is the inverse of multiplication. Ask yourself: what number multiplied by the divisor equals the dividend?";
      question = \`What is \${product} ÷ \${num2}?\`;
      answer = num1;
  }

  return {
    ...baseExercise,
    question,
    answer: answer.toString(),
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate fraction exercises based on difficulty
 */
const generateFractionExercise = (difficulty, baseExercise) => {
  const icon = "🧩";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Simple fraction identification
      const denominator = Math.floor(Math.random() * 5) + 2;
      const numerator = Math.floor(Math.random() * denominator) + 1;
      question = \`What fraction of the shape is shaded? (Answer as a fraction, e.g., 1/4)\`;
      answer = \`\${numerator}/\${denominator}\`;
      hint = "Count the total number of parts and how many are shaded.";

      return {
        ...baseExercise,
        question,
        answer,
        hint,
        icon,
        content: \`<div class="p-4 bg-white rounded-lg shadow">
          <p class="text-xl font-bold text-center mb-4">\${question}</p>
          <div class="flex justify-center mb-6">
            <div class="grid grid-cols-\${denominator} gap-1 w-64 h-16">
              \${Array(denominator).fill(0).map((_, i) =>
                \`<div class="border border-gray-400 \${i < numerator ? "bg-blue-500" : "bg-white"}"></div>\`
              ).join('')}
            </div>
          </div>
          <div class="flex justify-center items-center">
            <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
            <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
          </div>
        </div>\`,
      };
    }
    case 'easy': {
      // Simple fraction addition with same denominator
      const denom = Math.floor(Math.random() * 8) + 2;
      const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
      const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
      question = \`What is \${num1}/\${denom} + \${num2}/\${denom}?\`;
      answer = \`\${num1 + num2}/\${denom}\`;
      hint = "When adding fractions with the same denominator, just add the numerators.";
      break;
    }
    case 'medium': {
      // Comparing fractions
      const denom1 = Math.floor(Math.random() * 6) + 2;
      const denom2 = Math.floor(Math.random() * 6) + 2;
      const num_1 = Math.floor(Math.random() * (denom1 - 1)) + 1;
      const num_2 = Math.floor(Math.random() * (denom2 - 1)) + 1;
      question = \`Which is larger: \${num_1}/\${denom1} or \${num_2}/\${denom2}?\`;
      const frac1 = num_1 / denom1;
      const frac2 = num_2 / denom2;
      answer = frac1 > frac2 ? \`\${num_1}/\${denom1}\` : \`\${num_2}/\${denom2}\`;
      hint = "Find a common denominator or convert to decimal to compare.";
      break;
    }
    case 'hard': {
      // Mixed number addition
      const whole1 = Math.floor(Math.random() * 5) + 1;
      const whole2 = Math.floor(Math.random() * 3) + 1;
      const den = Math.floor(Math.random() * 8) + 2;
      const n1 = Math.floor(Math.random() * (den - 1)) + 1;
      const n2 = Math.floor(Math.random() * (den - 1)) + 1;
      question = \`What is \${whole1} \${n1}/\${den} + \${whole2} \${n2}/\${den}?\`;

      // Calculate result
      const totalNum = whole1 * den + n1 + (whole2 * den + n2);
      const resultWhole = Math.floor(totalNum / den);
      const resultNum = totalNum % den;

      answer = resultNum === 0 ? \`\${resultWhole}\` : \`\${resultWhole} \${resultNum}/\${den}\`;
      hint = "Convert mixed numbers to improper fractions, then add and simplify.";
      break;
    }
    case 'very_hard': {
      // Fraction multiplication with simplification
      const d1 = Math.floor(Math.random() * 10) + 2;
      const d2 = Math.floor(Math.random() * 10) + 2;
      const n_1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      const n_2 = Math.floor(Math.random() * (d2 - 1)) + 1;

      question = \`What is \${n_1}/\${d1} × \${n_2}/\${d2}? (Simplify your answer)\`;

      // Calculate result and simplify
      let resultNumerator = n_1 * n_2;
      let resultDenominator = d1 * d2;

      // Find GCD for simplification
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const divisor = gcd(resultNumerator, resultDenominator);

      resultNumerator /= divisor;
      resultDenominator /= divisor;

      answer = \`\${resultNumerator}/\${resultDenominator}\`;
      hint = "Multiply the numerators together and the denominators together, then simplify.";
      break;
    }
    default: {
      question = "What is 1/4 + 1/4?";
      answer = "1/2";
      hint = "Add the numerators when the denominators are the same.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate geometry exercises based on difficulty
 */
const generateGeometryExercise = (difficulty, baseExercise) => {
  const icon = "📐";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Basic shape identification
      const shapes = [
        { name: "circle", description: "a round shape with all points equidistant from the center" },
        { name: "square", description: "a shape with four equal sides and four right angles" },
        { name: "triangle", description: "a shape with three sides and three angles" },
        { name: "rectangle", description: "a shape with four right angles and opposite sides equal" }
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      question = \`What shape is described as \${shape.description}?\`;
      answer = shape.name;
      hint = "Think about the defining characteristics of basic shapes.";
      break;
    }
    case 'easy': {
      // Perimeter calculations
      const side = Math.floor(Math.random() * 10) + 1;
      question = \`What is the perimeter of a square with side length \${side} units?\`;
      answer = (4 * side).toString();
      hint = "The perimeter is the sum of all sides.";
      break;
    }
    case 'medium': {
      // Area calculations
      const length = Math.floor(Math.random() * 10) + 1;
      const width = Math.floor(Math.random() * 10) + 1;
      question = \`What is the area of a rectangle with length \${length} units and width \${width} units?\`;
      answer = (length * width).toString();
      hint = "The area of a rectangle is length × width.";
      break;
    }
    case 'hard': {
      // Volume calculations
      const length = Math.floor(Math.random() * 5) + 2;
      const width = Math.floor(Math.random() * 5) + 2;
      const height = Math.floor(Math.random() * 5) + 2;
      question = \`What is the volume of a rectangular prism with length \${length} units, width \${width} units, and height \${height} units?\`;
      answer = (length * width * height).toString();
      hint = "The volume of a rectangular prism is length × width × height.";
      break;
    }
    case 'very_hard': {
      // Pythagorean theorem
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = Math.sqrt(a*a + b*b);
      question = \`In a right triangle, if the two shorter sides are \${a} units and \${b} units long, what is the length of the hypotenuse? (Round to 2 decimal places)\`;
      answer = c.toFixed(2).toString();
      hint = "Use the Pythagorean theorem: a² + b² = c²";
      break;
    }
    default: {
      question = "What is the area of a square with side length 4 units?";
      answer = "16";
      hint = "The area of a square is side length squared.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate algebra exercises based on difficulty
 */
const generateAlgebraExercise = (difficulty, baseExercise) => {
  const icon = "🔢";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Simple equation with one operation
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const sum = a + b;
      question = \`If x + \${b} = \${sum}, what is x?\`;
      answer = a.toString();
      hint = "Subtract the known value from both sides of the equation.";
      break;
    }
    case 'easy': {
      // Simple equation with two operations
      const x = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = Math.floor(Math.random() * 10) + 1;
      const result = 2 * x + b;
      question = \`If 2x + \${b} = \${result}, what is x?\`;
      answer = x.toString();
      hint = "First subtract the constant from both sides, then divide by the coefficient.";
      break;
    }
    case 'medium': {
      // Two-step equation
      const x = Math.floor(Math.random() * 10) + 1;
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      const result = a * x + b;
      question = \`Solve for x: \${a}x + \${b} = \${result}\`;
      answer = x.toString();
      hint = "Subtract the constant term from both sides, then divide by the coefficient of x.";
      break;
    }
    case 'hard': {
      // System of equations
      const x = Math.floor(Math.random() * 10) - 5;
      const y = Math.floor(Math.random() * 10) - 5;
      const a1 = Math.floor(Math.random() * 5) + 1;
      const b1 = Math.floor(Math.random() * 5) + 1;
      const c1 = a1 * x + b1 * y;
      const a2 = Math.floor(Math.random() * 5) + 1;
      const b2 = Math.floor(Math.random() * 5) + 1;
      const c2 = a2 * x + b2 * y;

      question = \`Solve the system of equations:
\${a1}x + \${b1}y = \${c1}
\${a2}x + \${b2}y = \${c2}
What is x?\`;
      answer = x.toString();
      hint = "Use elimination or substitution method to solve the system.";
      break;
    }
    case 'very_hard': {
      // Quadratic equation
      let a, b, c, x1, x2;
      // Ensure integer solutions
      do {
        x1 = Math.floor(Math.random() * 10) - 5;
        x2 = Math.floor(Math.random() * 10) - 5;
        a = 1;
        b = -(x1 + x2);
        c = x1 * x2;
      } while (b === 0 || c === 0);

      question = \`Solve the quadratic equation: \${a}x² + \${b}x + \${c} = 0. If there are two solutions, write the smaller one.\`;
      answer = Math.min(x1, x2).toString();
      hint = "Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a";
      break;
    }
    default: {
      question = "Solve for x: 2x + 3 = 7";
      answer = "2";
      hint = "Subtract 3 from both sides, then divide by 2.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate measurement exercises based on difficulty
 */
const generateMeasurementExercise = (difficulty, baseExercise) => {
  const icon = "📏";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Basic unit identification
      const units = [
        { measure: "length", unit: "meter" },
        { measure: "weight", unit: "gram" },
        { measure: "volume", unit: "liter" },
        { measure: "time", unit: "second" }
      ];
      const unit = units[Math.floor(Math.random() * units.length)];
      question = \`What is the standard unit for measuring \${unit.measure}?\`;
      answer = unit.unit;
      hint = "Think about the base units in the metric system.";
      break;
    }
    case 'easy': {
      // Simple conversions
      const value = Math.floor(Math.random() * 10) + 1;
      question = \`Convert \${value} meters to centimeters.\`;
      answer = (value * 100).toString();
      hint = "1 meter = 100 centimeters.";
      break;
    }
    case 'medium': {
      // Multi-step conversions
      const value = Math.floor(Math.random() * 100) + 1;
      question = \`Convert \${value} centimeters to meters.\`;
      answer = (value / 100).toString();
      hint = "Divide by 100 to convert from centimeters to meters.";
      break;
    }
    case 'hard': {
      // Area conversions
      const value = Math.floor(Math.random() * 10) + 1;
      question = \`Convert \${value} square meters to square centimeters.\`;
      answer = (value * 10000).toString();
      hint = "Since 1 m = 100 cm, 1 m² = 100² cm² = 10,000 cm².";
      break;
    }
    case 'very_hard': {
      // Volume and mass conversions
      const density = Math.floor(Math.random() * 5) + 1;
      const volume = Math.floor(Math.random() * 10) + 1;
      question = \`If an object has a density of \${density} g/cm³ and a volume of \${volume} cm³, what is its mass in grams?\`;
      answer = (density * volume).toString();
      hint = "Mass = Density × Volume.";
      break;
    }
    default: {
      question = "How many millimeters are in 1 meter?";
      answer = "1000";
      hint = "1 meter = 1000 millimeters.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate probability exercises based on difficulty
 */
const generateProbabilityExercise = (difficulty, baseExercise) => {
  const icon = "🎲";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Simple probability with dice or coins
      question = "What is the probability of rolling a 6 on a standard six-sided die?";
      answer = "1/6";
      hint = "Count the number of favorable outcomes divided by the total number of possible outcomes.";
      break;
    }
    case 'easy': {
      // Probability of multiple events
      const sides = Math.floor(Math.random() * 6) + 6;  // 6 to 11 sides
      const target = Math.floor(Math.random() * 3) + 1; // 1 to 3 target numbers
      question = \`What is the probability of rolling one of these numbers: \${Array.from({length: target}, (_, i) => i + 1).join(", ")} on a \${sides}-sided die?\`;
      answer = \`\${target}/\${sides}\`;
      hint = "Count the number of favorable outcomes divided by the total number of possible outcomes.";
      break;
    }
    case 'medium': {
      // Card probability
      const suits = ["hearts", "diamonds", "clubs", "spades"];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      question = \`What is the probability of drawing a \${suit} from a standard deck of 52 playing cards?\`;
      answer = "13/52";
      hint = "Count how many cards of that suit are in the deck, and divide by the total number of cards.";
      break;
    }
    case 'hard': {
      // Compound probability
      const event1 = Math.floor(Math.random() * 5) + 1;
      const total1 = Math.floor(Math.random() * 5) + 5;
      const event2 = Math.floor(Math.random() * 5) + 1;
      const total2 = Math.floor(Math.random() * 5) + 5;

      question = \`If the probability of event A is \${event1}/\${total1} and the probability of event B is \${event2}/\${total2}, what is the probability of both events A and B occurring? (Assume the events are independent.)\`;

      // Calculate the answer as a simplified fraction
      const numerator = event1 * event2;
      const denominator = total1 * total2;

      // Find GCD for simplification
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const divisor = gcd(numerator, denominator);

      const simplifiedNum = numerator / divisor;
      const simplifiedDenom = denominator / divisor;

      answer = \`\${simplifiedNum}/\${simplifiedDenom}\`;
      hint = "For independent events, multiply the probabilities.";
      break;
    }
    case 'very_hard': {
      // Conditional probability
      question = "In a class of 30 students, 15 play soccer, 12 play basketball, and 5 play both sports. If a student is selected at random and is known to play soccer, what is the probability that they also play basketball?";
      answer = "5/15";
      hint = "Use conditional probability: P(B|A) = P(A and B) / P(A)";
      break;
    }
    default: {
      question = "What is the probability of flipping a coin and getting heads?";
      answer = "1/2";
      hint = "A coin has two possible outcomes, one of which is heads.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};

/**
 * Generate statistics exercises based on difficulty
 */
const generateStatisticsExercise = (difficulty, baseExercise) => {
  const icon = "📊";
  let question, answer, hint;

  switch (difficulty) {
    case 'very_easy': {
      // Calculate mean
      const numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1);
      const sum = numbers.reduce((a, b) => a + b, 0);
      const mean = sum / numbers.length;

      question = \`Find the mean (average) of the following numbers: \${numbers.join(", ")}.\`;
      answer = mean.toString();
      hint = "Add all the numbers together, then divide by how many numbers there are.";
      break;
    }
    case 'easy': {
      // Calculate median
      let numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
      numbers.sort((a, b) => a - b);
      const median = numbers[Math.floor(numbers.length / 2)];

      question = \`Find the median of the following numbers: \${numbers.join(", ")}.\`;
      answer = median.toString();
      hint = "Arrange the numbers in order, then find the middle value.";
      break;
    }
    case 'medium': {
      // Calculate mode
      const mode = Math.floor(Math.random() * 10) + 1;
      let numbers = [
        mode, mode, mode,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 10) + 1
      ];
      numbers = numbers.sort(() => Math.random() - 0.5);  // Shuffle

      question = \`Find the mode of the following numbers: \${numbers.join(", ")}.\`;
      answer = mode.toString();
      hint = "The mode is the value that appears most frequently in the dataset.";
      break;
    }
    case 'hard': {
      // Calculate range and standard deviation
      const numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1);
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const range = max - min;

      question = \`Find the range of the following data set: \${numbers.join(", ")}.\`;
      answer = range.toString();
      hint = "The range is the difference between the maximum and minimum values.";
      break;
    }
    case 'very_hard': {
      // Probability distribution
      const totalTrials = 10;
      const probability = 0.3;
      const successfulTrials = 3;

      question = \`In a binomial distribution with n = \${totalTrials} trials and probability of success p = \${probability}, what is the probability of exactly \${successfulTrials} successes? (Round to 3 decimal places)\`;

      // Calculate binomial probability
      const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
      const combination = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));
      const binomialProbability = combination(totalTrials, successfulTrials) *
                                 Math.pow(probability, successfulTrials) *
                                 Math.pow(1 - probability, totalTrials - successfulTrials);

      answer = binomialProbability.toFixed(3);
      hint = "Use the binomial probability formula: P(X=k) = nCk × p^k × (1-p)^(n-k)";
      break;
    }
    default: {
      const numbers = [2, 4, 6, 8, 10];
      question = \`Find the mean (average) of the following numbers: \${numbers.join(", ")}.\`;
      answer = "6";
      hint = "Add all the numbers together, then divide by how many numbers there are.";
    }
  }

  return {
    ...baseExercise,
    question,
    answer,
    hint,
    icon,
    content: \`<div class="p-4 bg-white rounded-lg shadow">
      <p class="text-xl font-bold text-center mb-4">\${question}</p>
      <div class="flex justify-center items-center">
        <input type="text" class="p-2 border border-gray-300 rounded text-center text-xl w-32" placeholder="Your answer" />
        <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Check</button>
      </div>
    </div>\`,
  };
};
};
};

/**
 * ${name} component
 */
const ${name.replace(/\s+/g, "")} = () => {
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  // Handle exercise completion
  const handleExerciseComplete = (result) => {
    console.log('Exercise completed:', result);
    setExerciseCompleted(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">${name}</h1>

      {!exerciseCompleted ? (
        <AdaptiveMathExercise
          userId="guest"
          conceptId="${knowledgeArea.toLowerCase().replace(/\s+/g, "_")}"
          conceptName="${conceptName}"
          knowledgeArea="${knowledgeArea.toLowerCase().replace(/\s+/g, "_")}"
          exerciseGenerator={generate${name.replace(/\s+/g, "")}Exercise}
          maxExercises={5}
          initialDifficulty="${difficulty}"
          saveProgress={false}
          onComplete={handleExerciseComplete}
        />
      ) : (
        <div className="bg-green-100 p-4 rounded-md">
          <p className="text-green-800">
            Exercise completed! Great job!
          </p>
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

export default ${name.replace(/\s+/g, "")};
`;

// Function to create a new exercise file
function createExerciseFile(name, conceptName, knowledgeArea, difficulty) {
  const fileName = `${name.replace(/\s+/g, "")}.jsx`;
  const filePath = path.join(__dirname, "src", "exercises", fileName);

  // Create exercises directory if it doesn't exist
  const dirPath = path.join(__dirname, "src", "exercises");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: src/exercises`);
  }

  // Create the file with the template
  fs.writeFileSync(filePath, exerciseTemplate(name, conceptName, knowledgeArea, difficulty));

  console.log(`\n✅ Created new adaptive exercise: ${filePath}`);
  console.log(`\nNext steps:`);
  console.log(`1. Implement the exercise generation logic for each difficulty level`);
  console.log(`2. Add the exercise to a route in App.jsx or import it into another component`);
  console.log(`3. Test your exercise by running 'npm run dev' and navigating to your new route`);
}

// Interactive prompt for exercise creation
function promptForExerciseDetails() {
  console.log("\n🧮 Windgap Academy - Adaptive Exercise Creator 🧮\n");

  rl.question("Exercise name (e.g. FractionAddition): ", (name) => {
    rl.question("Concept name (e.g. Fraction Addition): ", (conceptName) => {
      rl.question("Knowledge area (e.g. fractions): ", (knowledgeArea) => {
        rl.question(
          "Initial difficulty (very_easy, easy, medium, hard, very_hard): ",
          (difficulty) => {
            // Validate difficulty
            const validDifficulties = ["very_easy", "easy", "medium", "hard", "very_hard"];
            if (!validDifficulties.includes(difficulty)) {
              console.log(`Invalid difficulty. Using 'medium' as default.`);
              difficulty = "medium";
            }

            // Create the file
            createExerciseFile(name, conceptName, knowledgeArea, difficulty);
            rl.close();
          },
        );
      });
    });
  });
}

// Start the prompt
promptForExerciseDetails();
