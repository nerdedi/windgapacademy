import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 3D Kitchen Simulation with immersive cooking experience
function KitchenSimulation() {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState("scrambled-eggs");
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [cookingMode, setCookingMode] = useState("prep"); // prep, cooking, serving
  const [playerStats, setPlayerStats] = useState({
    recipesCompleted: 5,
    skillLevel: "Beginner Chef",
    cookingTime: "12:34",
    nutritionScore: 85,
  });
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const recipes = [
    {
      id: "scrambled-eggs",
      name: "Perfect Scrambled Eggs",
      emoji: "🍳",
      difficulty: "Beginner",
      time: "5 minutes",
      servings: 2,
      nutrition: { calories: 180, protein: "12g", carbs: "2g", fat: "14g" },
      ingredients: [
        { name: "Eggs", amount: "3 large", emoji: "🥚" },
        { name: "Butter", amount: "1 tbsp", emoji: "🧈" },
        { name: "Milk", amount: "2 tbsp", emoji: "🥛" },
        { name: "Salt", amount: "pinch", emoji: "🧂" },
        { name: "Pepper", amount: "pinch", emoji: "🌶️" },
      ],
      steps: [
        "Crack eggs into a bowl and whisk gently",
        "Add milk, salt, and pepper to the eggs",
        "Heat butter in a non-stick pan over medium-low heat",
        "Pour egg mixture into the pan",
        "Gently stir with a spatula, creating soft curds",
        "Remove from heat when eggs are still slightly wet",
        "Serve immediately while hot and creamy",
      ],
      tips: [
        "Low heat is key for creamy scrambled eggs",
        "Don't overcook - eggs continue cooking off heat",
        "Fresh herbs like chives make a great garnish",
      ],
    },
    {
      id: "pancakes",
      name: "Fluffy Pancakes",
      emoji: "🥞",
      difficulty: "Intermediate",
      time: "15 minutes",
      servings: 4,
      nutrition: { calories: 220, protein: "6g", carbs: "28g", fat: "8g" },
      ingredients: [
        { name: "Flour", amount: "1 cup", emoji: "🌾" },
        { name: "Milk", amount: "1 cup", emoji: "🥛" },
        { name: "Egg", amount: "1 large", emoji: "🥚" },
        { name: "Sugar", amount: "2 tbsp", emoji: "🍯" },
        { name: "Baking Powder", amount: "2 tsp", emoji: "🥄" },
        { name: "Salt", amount: "1/2 tsp", emoji: "🧂" },
        { name: "Butter", amount: "2 tbsp melted", emoji: "🧈" },
      ],
      steps: [
        "Mix dry ingredients in a large bowl",
        "Whisk wet ingredients in separate bowl",
        "Combine wet and dry ingredients gently",
        "Don't overmix - lumps are okay!",
        "Heat griddle or pan to medium heat",
        "Pour 1/4 cup batter per pancake",
        "Flip when bubbles form and edges look set",
        "Cook until golden brown on both sides",
      ],
      tips: [
        "Don't overmix the batter for fluffy pancakes",
        "Test griddle temperature with a drop of water",
        "Keep cooked pancakes warm in a 200°F oven",
      ],
    },
  ];

  const currentRecipe = recipes.find((r) => r.id === selectedRecipe);
  const currentRecipeStep = currentRecipe?.steps[currentStep] || "";

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Game Functions
  const startCooking = () => {
    setCookingMode("cooking");
    setCurrentStep(0);
    setTimer(0);
    setIsTimerRunning(true);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Let's start cooking ${currentRecipe.name}! Follow the steps carefully.`,
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextStep = () => {
    if (currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setPlayerStats((prev) => ({
        ...prev,
        cookingTime: formatTime(timer),
      }));

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(currentRecipe.steps[currentStep + 1]);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      completeCooking();
    }
  };

  const completeCooking = () => {
    setCookingMode("serving");
    setIsTimerRunning(false);
    setPlayerStats((prev) => ({
      ...prev,
      recipesCompleted: prev.recipesCompleted + 1,
      cookingTime: formatTime(timer),
    }));

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Congratulations! You've completed ${currentRecipe.name}! It looks delicious!`,
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient.name)) {
      setIngredients((prev) => [...prev, ingredient.name]);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Added ${ingredient.name} to your ingredients.`,
        );
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Kitchen Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-red-900/20"></div>

        {/* Steam particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `steam ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              👨‍🍳 MASTER CHEF KITCHEN
            </h1>
            <p className="text-gray-300 mt-2">Learn cooking skills in a realistic 3D kitchen</p>
          </div>
          <button
            onClick={() => navigate("/games")}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            ← Back to Games
          </button>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Recipes Completed", value: playerStats.recipesCompleted, icon: "🍽️" },
            { label: "Skill Level", value: playerStats.skillLevel, icon: "👨‍🍳" },
            { label: "Best Time", value: playerStats.cookingTime, icon: "⏱️" },
            { label: "Nutrition Score", value: `${playerStats.nutritionScore}%`, icon: "🥗" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recipe Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🍳 Choose Your Recipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 cursor-pointer ${
                  selectedRecipe === recipe.id
                    ? "ring-2 ring-orange-400 scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => setSelectedRecipe(recipe.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{recipe.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{recipe.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
                    <div>Difficulty: {recipe.difficulty}</div>
                    <div>Time: {recipe.time}</div>
                    <div>Servings: {recipe.servings}</div>
                    <div>Calories: {recipe.nutrition.calories}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecipeDetails(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Interface */}
        {currentRecipe && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">
                {currentRecipe.emoji} {currentRecipe.name}
              </h3>
              <div className="flex justify-center items-center gap-4 text-gray-300">
                <span>
                  Step {currentStep + 1} of {currentRecipe.steps.length}
                </span>
                <span>•</span>
                <span>Timer: {formatTime(timer)}</span>
                <span>•</span>
                <span>Mode: {cookingMode}</span>
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6 text-center">
              <h4 className="text-xl font-bold text-white mb-4">Current Step:</h4>
              <p className="text-lg text-gray-200 leading-relaxed">{currentRecipeStep}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {cookingMode === "prep" && (
                <button
                  onClick={startCooking}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                >
                  🍳 Start Cooking
                </button>
              )}

              {cookingMode === "cooking" && (
                <button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                >
                  {currentStep < currentRecipe.steps.length - 1
                    ? "Next Step →"
                    : "Complete Recipe 🎉"}
                </button>
              )}

              {cookingMode === "serving" && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h4 className="text-2xl font-bold text-white mb-4">Recipe Complete!</h4>
                  <button
                    onClick={() => {
                      setCookingMode("prep");
                      setCurrentStep(0);
                      setTimer(0);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                  >
                    Cook Another Recipe
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes steam {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-60px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default KitchenSimulation;
