import AdditionWithinFive from "./AdditionWithinFive";
import BasicMultiplication from "./BasicMultiplication";
import SubtractionWithinTen from "./SubtractionWithinTen";

// Export individual exercises
export { AdditionWithinFive, BasicMultiplication, SubtractionWithinTen };

// Export all exercises as a collection for easy access
const exercises = {
  "addition-within-five": {
    component: AdditionWithinFive,
    title: "Addition Within 5",
    category: "math-basics",
    level: 1,
    description: "Practice adding numbers that sum to 5 or less.",
    icon: "➕",
  },
  "subtraction-within-ten": {
    component: SubtractionWithinTen,
    title: "Subtraction Within 10",
    category: "math-basics",
    level: 1,
    description: "Practice subtracting numbers within 10.",
    icon: "➖",
  },
  "basic-multiplication": {
    component: BasicMultiplication,
    title: "Basic Multiplication",
    category: "math-basics",
    level: 2,
    description: "Practice basic multiplication facts with visual supports.",
    icon: "✖️",
  },
};

export default exercises;
