import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAnalytics } from "../../analytics";
import { MicroInteraction } from "../../components/MicroInteractions";
import { useLearningPreferences } from "../../context/LearningPreferencesContext";

/**
 * Base Exercise component for all learning exercises
 * Handles common functionality like tracking attempts, showing hints, etc.
 */
const Exercise = ({
  id,
  title,
  category,
  level = 1,
  children,
  generateProblem,
  checkAnswer,
  hints = [],
  successMessage = "Great job! That's correct!",
  maxAttempts = 3,
  timeLimit = 0, // 0 means no time limit
  onComplete = () => {},
  difficultyAdjustment = false,
}) => {
  // State
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [difficulty, setDifficulty] = useState(level);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hooks
  const { trackEvent } = useAnalytics();
  const { preferences } = useLearningPreferences();

  // Initialize exercise
  useEffect(() => {
    generateNewProblem();

    // Track exercise start
    trackEvent("exercise_started", {
      exercise_id: id,
      category,
      difficulty: level,
    });

    // Set up timer if there's a time limit
    if (timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  // Generate a new problem
  const generateNewProblem = () => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setUserAnswer("");
    setAttempts(0);
    setIsCorrect(false);
    setShowHint(false);
    setCurrentHintIndex(0);
    setErrorMessage("");
  };

  // Handle user submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (exerciseComplete) return;

    const result = checkAnswer(problem, userAnswer);
    const correct = result.correct;

    if (correct) {
      setIsCorrect(true);

      // Track successful attempt
      trackEvent("exercise_correct", {
        exercise_id: id,
        attempts,
        time_taken: timeLimit - timeLeft,
        difficulty,
      });

      // Complete exercise after a delay
      setTimeout(() => {
        if (difficultyAdjustment) {
          setDifficulty((prev) => Math.min(prev + 1, 5)); // Max difficulty 5
        }

        setExerciseComplete(true);
        onComplete({
          exerciseId: id,
          success: true,
          attempts: attempts + 1,
          timeTaken: timeLimit - timeLeft,
          difficulty,
        });
      }, 1500);
    } else {
      // Track failed attempt
      trackEvent("exercise_attempt", {
        exercise_id: id,
        attempts: attempts + 1,
        difficulty,
      });

      setAttempts((prev) => prev + 1);
      setErrorMessage(result.message || "That's not quite right. Try again!");

      // Auto-show hint after multiple attempts
      if (attempts + 1 >= 2 && !showHint && hints.length > 0) {
        setShowHint(true);
      }

      // Check if max attempts reached
      if (attempts + 1 >= maxAttempts) {
        trackEvent("exercise_failed", {
          exercise_id: id,
          attempts: attempts + 1,
          difficulty,
        });

        setTimeout(() => {
          if (difficultyAdjustment) {
            setDifficulty((prev) => Math.max(prev - 1, 1)); // Min difficulty 1
          }

          generateNewProblem();
        }, 2000);
      }
    }
  };

  // Handle timeout
  const handleTimeout = () => {
    trackEvent("exercise_timeout", {
      exercise_id: id,
      attempts,
      difficulty,
    });

    setErrorMessage("Time's up! Let's try again.");
    generateNewProblem();
  };

  // Show next hint
  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  // Try another exercise
  const handleTryAnother = () => {
    if (difficultyAdjustment) {
      // If they got it correct, keep difficulty, otherwise decrease
      if (!isCorrect) {
        setDifficulty((prev) => Math.max(prev - 1, 1));
      }
    }

    setExerciseComplete(false);
    generateNewProblem();
  };

  // Render adaptations based on user preferences
  const renderAdaptations = () => {
    if (!preferences) return null;

    return (
      <div className="adaptations">
        {preferences.visualSupport && (
          <div className="visual-support">
            {/* Visual support elements based on problem type */}
          </div>
        )}
        {preferences.audioSupport && (
          <button
            className="audio-support-btn"
            onClick={() => {
              // Text-to-speech for problem text
              const speech = new SpeechSynthesisUtterance(
                `${problem?.question || ""} ${showHint ? hints[currentHintIndex] : ""}`,
              );
              window.speechSynthesis.speak(speech);
            }}
          >
            🔊 Read Aloud
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="exercise-container bg-white rounded-3xl shadow-xl p-6 mb-8">
      <div className="exercise-header mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        {timeLimit > 0 && <div className="time-remaining">Time: {timeLeft}s</div>}
      </div>

      {!exerciseComplete ? (
        <form onSubmit={handleSubmit}>
          <div className="exercise-content mb-6">
            {problem &&
              children({
                problem,
                userAnswer,
                setUserAnswer,
                isCorrect,
                attempts,
              })}

            {renderAdaptations()}

            {showHint && hints.length > 0 && (
              <div className="hint-container bg-blue-50 p-4 rounded-xl mt-4">
                <p className="font-medium">💡 Hint: {hints[currentHintIndex]}</p>
                {currentHintIndex < hints.length - 1 && (
                  <button
                    type="button"
                    onClick={showNextHint}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    Need more help?
                  </button>
                )}
              </div>
            )}

            {errorMessage && <div className="error-message text-red-600 mt-4">{errorMessage}</div>}
          </div>

          <div className="exercise-actions flex items-center gap-4">
            <button
              type="submit"
              disabled={isCorrect || !userAnswer}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                isCorrect
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : userAnswer
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "Check Answer"}
            </button>

            {!showHint && hints.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-blue-600 hover:underline"
              >
                Need a hint?
              </button>
            )}

            <div className="attempts text-sm text-gray-500 ml-auto">
              Attempts: {attempts}/{maxAttempts}
            </div>
          </div>
        </form>
      ) : (
        <div className="success-container">
          <MicroInteraction type="success" message={successMessage} />

          <button
            onClick={handleTryAnother}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
          >
            Try Another
          </button>
        </div>
      )}
    </div>
  );
};

Exercise.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  level: PropTypes.number,
  children: PropTypes.func.isRequired,
  generateProblem: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  hints: PropTypes.arrayOf(PropTypes.string),
  successMessage: PropTypes.string,
  maxAttempts: PropTypes.number,
  timeLimit: PropTypes.number,
  onComplete: PropTypes.func,
  difficultyAdjustment: PropTypes.bool,
};

export default Exercise;
