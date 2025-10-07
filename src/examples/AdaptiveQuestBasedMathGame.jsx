/**
 * AdaptiveQuestBasedMathGame component
 *
 * This component demonstrates the integration of adaptive learning and quest-based
 * approaches for math education, inspired by Antura's gamification model.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdaptiveMathExercise from "../components/AdaptiveMathExercise";
import QuestBasedLearning from "../components/QuestBasedLearning";

// Import Firebase services
import { auth } from "../../firebase";

/**
 * Generate exercises based on concept and difficulty
 * In a real app, this would be more sophisticated
 */
const generateMathExercise = ({ difficulty, exerciseType, weakAreas, knowledgeArea }) => {
  // Generate appropriate exercise based on inputs
  switch (knowledgeArea) {
    case "addition":
      return generateAdditionExercise(difficulty);
    case "subtraction":
      return generateSubtractionExercise(difficulty);
    case "multiplication":
      return generateMultiplicationExercise(difficulty);
    case "division":
      return generateDivisionExercise(difficulty);
    case "fractions":
      return generateFractionExercise(difficulty);
    default:
      return generateAdditionExercise(difficulty);
  }
};

/**
 * Generate an addition exercise
 */
const generateAdditionExercise = (difficulty) => {
  let num1, num2, question, answer, hint;

  switch (difficulty) {
    case "very_easy":
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      hint = "Count the total objects from both groups.";
      break;
    case "easy":
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 20);
      hint = "Try adding the ones digit first, then the tens digit.";
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 50) + 50;
      num2 = Math.floor(Math.random() * 50) + 20;
      hint = "Line up the numbers by place value before adding.";
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 100) + 100;
      num2 = Math.floor(Math.random() * 100) + 50;
      hint = "Remember to carry when the sum in a place value exceeds 9.";
      break;
    case "very_hard":
      num1 = Math.floor(Math.random() * 1000) + 500;
      num2 = Math.floor(Math.random() * 500) + 100;
      hint = "Break the addition into steps by place value.";
      break;
    default:
      num1 = Math.floor(Math.random() * 20);
      num2 = Math.floor(Math.random() * 20);
      hint = "Try counting up from the larger number.";
  }

  answer = num1 + num2;
  question = `What is ${num1} + ${num2}?`;

  return {
    question,
    answer,
    hint,
    learningObjective: "Practice addition skills",
    icon: "➕",
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="number"
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
 * Generate a subtraction exercise
 */
const generateSubtractionExercise = (difficulty) => {
  let num1, num2, question, answer, hint;

  switch (difficulty) {
    case "very_easy":
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * num1);
      hint = "Count backward from the larger number.";
      break;
    case "easy":
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10);
      hint = "Subtract the ones digit first.";
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 50) + 50;
      num2 = Math.floor(Math.random() * 40) + 10;
      hint = "Line up the numbers by place value before subtracting.";
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 100) + 100;
      num2 = Math.floor(Math.random() * 90) + 10;
      hint = "You may need to borrow from the tens place.";
      break;
    case "very_hard":
      num1 = Math.floor(Math.random() * 1000) + 500;
      num2 = Math.floor(Math.random() * 400) + 100;
      hint = "Break the subtraction into steps by place value.";
      break;
    default:
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10);
      hint =
        "Think of it as: how many more do you need to add to get from the smaller to the larger number?";
  }

  answer = num1 - num2;
  question = `What is ${num1} - ${num2}?`;

  return {
    question,
    answer,
    hint,
    learningObjective: "Practice subtraction skills",
    icon: "➖",
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="number"
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
 * Generate a multiplication exercise
 */
const generateMultiplicationExercise = (difficulty) => {
  let num1, num2, question, answer, hint;

  switch (difficulty) {
    case "very_easy":
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      hint = "Think of multiplication as repeated addition.";
      break;
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      hint = "Use your multiplication tables or count by the smaller number.";
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      hint = "Break down the multiplication into smaller parts if needed.";
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * 10) + 5;
      hint = "Use the distributive property to break down the multiplication.";
      break;
    case "very_hard":
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 15) + 5;
      hint = "Try using the standard algorithm for multi-digit multiplication.";
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      hint =
        "Multiplication is repeated addition. Think of it as adding the first number to itself the second number of times.";
  }

  answer = num1 * num2;
  question = `What is ${num1} × ${num2}?`;

  return {
    question,
    answer,
    hint,
    learningObjective: "Practice multiplication skills",
    icon: "✖️",
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="number"
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
 * Generate a division exercise
 */
const generateDivisionExercise = (difficulty) => {
  let num1, num2, product, question, answer, hint;

  switch (difficulty) {
    case "very_easy":
      num2 = Math.floor(Math.random() * 5) + 1;
      num1 = Math.floor(Math.random() * 5) + 1;
      product = num1 * num2;
      hint = "Think of division as sharing equally among groups.";
      question = `What is ${product} ÷ ${num2}?`;
      answer = num1;
      break;
    case "easy":
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = Math.floor(Math.random() * 5) + 1;
      product = num1 * num2;
      hint = "Use the relationship between multiplication and division.";
      question = `What is ${product} ÷ ${num2}?`;
      answer = num1;
      break;
    case "medium":
      num2 = Math.floor(Math.random() * 12) + 1;
      num1 = Math.floor(Math.random() * 12) + 1;
      product = num1 * num2;
      hint = "Think of what number multiplied by the divisor gives the dividend.";
      question = `What is ${product} ÷ ${num2}?`;
      answer = num1;
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 100) + 20;
      num2 = Math.floor(Math.random() * 10) + 2;
      hint = "Use long division to solve step by step.";
      question = `What is ${num1} ÷ ${num2}? (Round to 1 decimal place if needed)`;
      answer = (num1 / num2).toFixed(1);
      break;
    case "very_hard":
      num1 = Math.floor(Math.random() * 1000) + 100;
      num2 = Math.floor(Math.random() * 20) + 5;
      hint = "Use long division and keep track of each step carefully.";
      question = `What is ${num1} ÷ ${num2}? (Round to 1 decimal place if needed)`;
      answer = (num1 / num2).toFixed(1);
      break;
    default:
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = Math.floor(Math.random() * 10) + 1;
      product = num1 * num2;
      hint =
        "Division is the inverse of multiplication. Ask yourself: what number multiplied by the divisor equals the dividend?";
      question = `What is ${product} ÷ ${num2}?`;
      answer = num1;
  }

  return {
    question,
    answer,
    hint,
    learningObjective: "Practice division skills",
    icon: "➗",
    content: (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-xl font-bold text-center mb-4">{question}</p>
        <div className="flex justify-center items-center">
          <input
            type="number"
            className="p-2 border border-gray-300 rounded text-center text-xl w-32"
            placeholder="Your answer"
            step="0.1"
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
 * Generate a fraction exercise
 */
const generateFractionExercise = (difficulty) => {
  let question, answer, hint;

  switch (difficulty) {
    case "very_easy":
      // Simple fraction identification
      const denominator = Math.floor(Math.random() * 5) + 2;
      const numerator = Math.floor(Math.random() * denominator) + 1;
      question = `What fraction of the shape is shaded? (Answer as a fraction, e.g., 1/4)`;
      answer = `${numerator}/${denominator}`;
      hint = "Count the total number of parts and how many are shaded.";
      break;
    case "easy":
      // Simple fraction addition with same denominator
      const denom = Math.floor(Math.random() * 8) + 2;
      const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
      const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
      question = `What is ${num1}/${denom} + ${num2}/${denom}?`;
      answer = `${num1 + num2}/${denom}`;
      hint = "When adding fractions with the same denominator, just add the numerators.";
      break;
    case "medium":
      // Comparing fractions
      const denom1 = Math.floor(Math.random() * 6) + 2;
      const denom2 = Math.floor(Math.random() * 6) + 2;
      const num_1 = Math.floor(Math.random() * (denom1 - 1)) + 1;
      const num_2 = Math.floor(Math.random() * (denom2 - 1)) + 1;
      question = `Which is larger: ${num_1}/${denom1} or ${num_2}/${denom2}?`;
      const frac1 = num_1 / denom1;
      const frac2 = num_2 / denom2;
      answer = frac1 > frac2 ? `${num_1}/${denom1}` : `${num_2}/${denom2}`;
      hint = "Find a common denominator or convert to decimal to compare.";
      break;
    case "hard":
      // Mixed number addition
      const whole1 = Math.floor(Math.random() * 5) + 1;
      const whole2 = Math.floor(Math.random() * 3) + 1;
      const den = Math.floor(Math.random() * 8) + 2;
      const n1 = Math.floor(Math.random() * (den - 1)) + 1;
      const n2 = Math.floor(Math.random() * (den - 1)) + 1;
      question = `What is ${whole1} ${n1}/${den} + ${whole2} ${n2}/${den}?`;

      // Calculate result
      const totalNum = whole1 * den + n1 + (whole2 * den + n2);
      const resultWhole = Math.floor(totalNum / den);
      const resultNum = totalNum % den;

      answer = resultNum === 0 ? `${resultWhole}` : `${resultWhole} ${resultNum}/${den}`;
      hint = "Convert mixed numbers to improper fractions, then add and simplify.";
      break;
    case "very_hard":
      // Fraction multiplication
      const d1 = Math.floor(Math.random() * 10) + 2;
      const d2 = Math.floor(Math.random() * 10) + 2;
      const n_1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      const n_2 = Math.floor(Math.random() * (d2 - 1)) + 1;

      question = `What is ${n_1}/${d1} × ${n_2}/${d2}? (Simplify your answer)`;

      // Calculate result and simplify
      let resultNumerator = n_1 * n_2;
      let resultDenominator = d1 * d2;

      // Find GCD for simplification
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const divisor = gcd(resultNumerator, resultDenominator);

      resultNumerator /= divisor;
      resultDenominator /= divisor;

      answer = `${resultNumerator}/${resultDenominator}`;
      hint = "Multiply the numerators together and the denominators together, then simplify.";
      break;
    default:
      question = "What is 1/4 + 1/4?";
      answer = "1/2";
      hint = "Add the numerators when the denominators are the same.";
  }

  return {
    question,
    answer,
    hint,
    learningObjective: "Practice fraction skills",
    icon: "🧩",
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
 * AdaptiveQuestBasedMathGame component
 */
const AdaptiveQuestBasedMathGame = () => {
  const [userId, setUserId] = useState(null);
  const [worldId, setWorldId] = useState("math_kingdom");
  const [activeQuestId, setActiveQuestId] = useState(null);
  const [exerciseGenerator, setExerciseGenerator] = useState(() => generateMathExercise);
  const [showingAdaptiveExercise, setShowingAdaptiveExercise] = useState(false);
  const [currentConcept, setCurrentConcept] = useState(null);
  const [currentQuestData, setCurrentQuestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { conceptId } = useParams();

  // On mount, check auth and concept
  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;

      if (user) {
        setUserId(user.uid);
      } else {
        // For demo, use a guest ID
        setUserId("guest_user_123");
      }

      setIsLoading(false);
    };

    checkAuth();

    // If we have a specific concept ID in the URL, set it up
    if (conceptId) {
      setupConceptExercise(conceptId);
    }
  }, [conceptId]);

  /**
   * Setup exercise for specific concept
   */
  const setupConceptExercise = (concept) => {
    // Configure exercise based on concept
    switch (concept) {
      case "addition":
        setCurrentConcept({
          id: "addition",
          name: "Addition",
          knowledgeArea: "addition",
        });
        break;
      case "subtraction":
        setCurrentConcept({
          id: "subtraction",
          name: "Subtraction",
          knowledgeArea: "subtraction",
        });
        break;
      case "multiplication":
        setCurrentConcept({
          id: "multiplication",
          name: "Multiplication",
          knowledgeArea: "multiplication",
        });
        break;
      case "division":
        setCurrentConcept({
          id: "division",
          name: "Division",
          knowledgeArea: "division",
        });
        break;
      case "fractions":
        setCurrentConcept({
          id: "fractions",
          name: "Fractions",
          knowledgeArea: "fractions",
        });
        break;
      default:
        setCurrentConcept({
          id: "general_math",
          name: "Math Practice",
          knowledgeArea: "addition",
        });
    }

    // Show adaptive exercise directly
    setShowingAdaptiveExercise(true);
  };

  /**
   * Create quest generators
   */
  const getQuestGenerators = () => {
    // In a real app, this would be much more sophisticated
    return {
      // Main quest handler - Chapter 1
      main_math_kingdom_1: (quest) => {
        setCurrentConcept({
          id: "addition",
          name: "Addition",
          knowledgeArea: "addition",
        });
        setCurrentQuestData(quest);
        setShowingAdaptiveExercise(true);
        setActiveQuestId(quest.id);
      },

      // Main quest handler - Chapter 2
      main_math_kingdom_2: (quest) => {
        setCurrentConcept({
          id: "subtraction",
          name: "Subtraction",
          knowledgeArea: "subtraction",
        });
        setCurrentQuestData(quest);
        setShowingAdaptiveExercise(true);
        setActiveQuestId(quest.id);
      },

      // Side quest handlers
      side_math_kingdom_1_1: (quest) => {
        setCurrentConcept({
          id: "addition_basic",
          name: "Basic Addition",
          knowledgeArea: "addition",
        });
        setCurrentQuestData(quest);
        setShowingAdaptiveExercise(true);
        setActiveQuestId(quest.id);
      },

      side_math_kingdom_1_2: (quest) => {
        setCurrentConcept({
          id: "addition_advanced",
          name: "Advanced Addition",
          knowledgeArea: "addition",
        });
        setCurrentQuestData(quest);
        setShowingAdaptiveExercise(true);
        setActiveQuestId(quest.id);
      },

      // Challenge quest handler
      challenge_math_kingdom_2: (quest) => {
        setCurrentConcept({
          id: "mixed_operations",
          name: "Mixed Operations",
          knowledgeArea: "mixed",
        });
        setCurrentQuestData(quest);
        setShowingAdaptiveExercise(true);
        setActiveQuestId(quest.id);
      },
    };
  };

  /**
   * Handle completion of adaptive exercise
   */
  const handleAdaptiveExerciseComplete = (result) => {
    // Update Firebase or local storage with results
    console.log("Exercise complete:", result);

    // If this was part of a quest, mark it complete
    if (activeQuestId) {
      // In a real app, this would call completeQuest on the quest component
      console.log(`Quest ${activeQuestId} complete!`);
    }

    setShowingAdaptiveExercise(false);
    setCurrentQuestData(null);
    setActiveQuestId(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show adaptive exercise if active
  if (showingAdaptiveExercise && currentConcept) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => {
              setShowingAdaptiveExercise(false);
              setCurrentConcept(null);
              setCurrentQuestData(null);
              setActiveQuestId(null);
            }}
          >
            Back to Map
          </button>
        </div>

        <AdaptiveMathExercise
          userId={userId}
          conceptId={currentConcept.id}
          conceptName={currentConcept.name}
          knowledgeArea={currentConcept.knowledgeArea}
          exerciseGenerator={exerciseGenerator}
          maxExercises={5}
          initialDifficulty="medium"
          saveProgress={true}
          questMode={Boolean(currentQuestData)}
          questData={currentQuestData}
          onComplete={handleAdaptiveExerciseComplete}
        />
      </div>
    );
  }

  // Show quest map
  return (
    <div className="max-w-4xl mx-auto p-4">
      <QuestBasedLearning
        userId={userId}
        worldId={worldId}
        worldName="Math Kingdom"
        initialLevel={1}
        questGenerators={getQuestGenerators()}
        saveProgress={true}
      />
    </div>
  );
};

export default AdaptiveQuestBasedMathGame;
