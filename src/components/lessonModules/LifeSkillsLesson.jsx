import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TravelTrainingActivity() {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const routes = [
    {
      name: "Home to Shops",
      steps: [
        "🏠 Start at home",
        "🚶 Walk to bus stop",
        "🚌 Take Bus 123",
        "🛑 Get off at Main Street",
        "🚶 Walk 2 blocks to shops",
        "🛒 Arrive at shopping center",
      ],
    },
    {
      name: "Home to Library",
      steps: [
        "🏠 Start at home",
        "🚶 Walk to train station",
        "🚊 Take Blue Line train",
        "🛑 Get off at City Station",
        "🚶 Walk 1 block north",
        "📚 Arrive at library",
      ],
    },
  ];

  const selectRoute = (route) => {
    setSelectedRoute(route.name);
    setSteps(route.steps);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🚌 Travel Training</h3>

      {!selectedRoute ? (
        <div>
          <p className="text-lg text-gray-600 mb-6">Choose a route to practice:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {routes.map((route, index) => (
              <button
                key={index}
                onClick={() => selectRoute(route)}
                className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h4>
                <p className="text-gray-600">{route.steps.length} steps</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-gray-800">{selectedRoute}</h4>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">{steps[currentStep]?.split(" ")[0]}</div>
              <div className="text-2xl font-bold text-gray-800">
                {steps[currentStep]?.substring(2)}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
            >
              ← Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={() => {
                  setSelectedRoute("");
                  setSteps([]);
                  setCurrentStep(0);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                🎉 Complete Route
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CookingActivity() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const recipes = [
    {
      name: "Simple Sandwich",
      emoji: "🥪",
      ingredients: ["2 slices bread", "Butter", "Ham", "Cheese", "Lettuce"],
      steps: [
        "Wash your hands",
        "Get all ingredients",
        "Butter the bread slices",
        "Add ham and cheese",
        "Add lettuce",
        "Put slices together",
        "Cut in half",
        "Enjoy your sandwich!",
      ],
    },
    {
      name: "Fruit Salad",
      emoji: "🥗",
      ingredients: ["1 apple", "1 banana", "1 orange", "Grapes", "Bowl"],
      steps: [
        "Wash your hands",
        "Wash all fruit",
        "Cut apple into pieces",
        "Peel and slice banana",
        "Peel and segment orange",
        "Add grapes to bowl",
        "Mix all fruit together",
        "Serve and enjoy!",
      ],
    },
  ];

  const toggleStep = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter((i) => i !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">👨‍🍳 Cooking Skills</h3>

      {!selectedRecipe ? (
        <div>
          <p className="text-lg text-gray-600 mb-6">Choose a recipe to cook:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {recipes.map((recipe, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setCompletedSteps([]);
                }}
                className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105"
              >
                <div className="text-4xl mb-2">{recipe.emoji}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h4>
                <p className="text-gray-600">{recipe.steps.length} steps</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {selectedRecipe.emoji} {selectedRecipe.name}
            </h4>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              ← Back
            </button>
          </div>

          <div className="mb-6">
            <h5 className="font-semibold mb-3">Ingredients:</h5>
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-semibold">Steps:</h5>
              <span className="text-sm text-gray-600">
                {completedSteps.length}/{selectedRecipe.steps.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / selectedRecipe.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {selectedRecipe.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => toggleStep(index)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  completedSteps.includes(index)
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      completedSteps.includes(index)
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {completedSteps.includes(index) ? "✓" : index + 1}
                  </div>
                  <span className="flex-1 font-medium">{step}</span>
                </div>
              </button>
            ))}
          </div>

          {completedSteps.length === selectedRecipe.steps.length && (
            <div className="mt-6 bg-green-500 text-white p-4 rounded-xl text-center font-bold animate-bounce">
              🎉 Recipe completed! Great cooking!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LifeSkillsLesson() {
  const navigate = useNavigate();

  const objectives = [
    "Practice travel training routes",
    "Learn basic cooking skills",
    "Understand hygiene routines",
    "Practice shopping skills",
    "Develop independence",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
            >
              <span className="text-xl">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">🏠 Life Skills</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Learning Objectives */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Learning Objectives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-700">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Activities */}
        <TravelTrainingActivity />
        <CookingActivity />

        {/* Completion Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-orange-600 hover:from-blue-600 hover:to-orange-700 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
          >
            🎉 Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
