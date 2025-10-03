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

  // Create difficulty-appropriate exercise
  switch (difficulty) {
    case 'very_easy':
      // TODO: Implement very easy exercise generation
      return {
        ...baseExercise,
        question: "Very easy ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a hint for beginners",
      };

    case 'easy':
      // TODO: Implement easy exercise generation
      return {
        ...baseExercise,
        question: "Easy ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a hint for novice learners",
      };

    case 'medium':
      // TODO: Implement medium difficulty exercise generation
      return {
        ...baseExercise,
        question: "Medium ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a hint for intermediate learners",
      };

    case 'hard':
      // TODO: Implement hard exercise generation
      return {
        ...baseExercise,
        question: "Hard ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a hint for advanced learners",
      };

    case 'very_hard':
      // TODO: Implement very hard exercise generation
      return {
        ...baseExercise,
        question: "Very hard ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a hint for expert learners",
      };

    default:
      return {
        ...baseExercise,
        question: "Default ${conceptName.toLowerCase()} question",
        answer: "Answer",
        hint: "This is a default hint",
      };
  }
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
