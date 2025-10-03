import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "../analytics";
import exercises from "../components/exercises";
import { MicroInteraction } from "../components/MicroInteractions";
import { useAuth } from "../contexts/AuthContext";

/**
 * MathExercisesPage component
 * Displays all available math exercises and allows users to select and practice them
 */
const MathExercisesPage = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  // Filter exercises by category
  const exercisesByCategory = Object.entries(exercises).reduce((acc, [id, exercise]) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push({ id, ...exercise });
    return acc;
  }, {});

  // Select an exercise
  const handleSelectExercise = (exerciseId) => {
    setSelectedExercise(exerciseId);

    trackEvent("exercise_selected", {
      exercise_id: exerciseId,
      category: exercises[exerciseId].category,
      level: exercises[exerciseId].level,
    });
  };

  // Handle exercise completion
  const handleExerciseComplete = (result) => {
    // Update completed exercises
    setCompletedExercises((prev) => ({
      ...prev,
      [result.exerciseId]: {
        completed: true,
        attempts: result.attempts,
        timeTaken: result.timeTaken,
        difficulty: result.difficulty,
        timestamp: Date.now(),
      },
    }));

    // Show feedback message
    setFeedbackMessage(`Great job! You've completed ${exercises[result.exerciseId].title}.`);
    setShowFeedback(true);

    // Hide feedback after a delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);

    // Track completion
    trackEvent("exercise_completed", {
      exercise_id: result.exerciseId,
      category: exercises[result.exerciseId].category,
      level: exercises[result.exerciseId].level,
      attempts: result.attempts,
      time_taken: result.timeTaken,
      difficulty: result.difficulty,
    });
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Render the selected exercise
  const renderExercise = () => {
    if (!selectedExercise) return null;

    const exercise = exercises[selectedExercise];
    const ExerciseComponent = exercise.component;

    return (
      <div className="selected-exercise">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedExercise(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
          >
            <span className="text-xl">←</span>
            Back to Exercise List
          </button>
          <h2 className="text-2xl font-bold">{exercise.title}</h2>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <ExerciseComponent onComplete={handleExerciseComplete} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <h1 className="text-3xl font-bold text-gray-800">🧮 Math Exercises</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {showFeedback && <MicroInteraction type="success" message={feedbackMessage} />}

        {selectedExercise ? (
          renderExercise()
        ) : (
          <>
            {/* Introduction */}
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Math Learning Modules</h2>
              <p className="text-gray-600 mb-6">
                Welcome to the Math Exercises page! Here you'll find interactive exercises to help
                you practice and master various math concepts. Select an exercise below to get
                started.
              </p>

              {user && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-medium text-blue-800">
                    Hi {user.name || "there"}! Your progress is being tracked. Keep practicing to
                    improve your skills!
                  </p>
                </div>
              )}
            </div>

            {/* Exercise Categories */}
            {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {formatCategoryName(category)}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryExercises.map((exercise) => {
                    const isCompleted = completedExercises[exercise.id]?.completed;

                    return (
                      <button
                        key={exercise.id}
                        onClick={() => handleSelectExercise(exercise.id)}
                        className={`text-left p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200"
                            : "bg-white border border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{exercise.icon}</span>
                          {isCompleted && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                              Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{exercise.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="bg-blue-100 text-blue-800 text-xs rounded px-2 py-1">
                            Level {exercise.level}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MathExercisesPage;
