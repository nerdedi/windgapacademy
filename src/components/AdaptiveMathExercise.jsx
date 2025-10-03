/**
 * AdaptiveMathExercise component
 *
 * A component that adapts exercise difficulty based on user performance,
 * tracks learning progress, and provides personalized feedback.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MathExerciseWrapper from "./MathExerciseWrapper";

// Import Firebase services for storing user progress
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "../firebase";

// Concept mastery thresholds
const MASTERY_LEVELS = {
  NOVICE: "novice", // 0-25%
  DEVELOPING: "developing", // 25-50%
  PROFICIENT: "proficient", // 50-75%
  ADVANCED: "advanced", // 75-90%
  EXPERT: "expert", // 90-100%
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  VERY_EASY: "very_easy",
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  VERY_HARD: "very_hard",
};

// Knowledge areas for math
const KNOWLEDGE_AREAS = {
  NUMBER_SENSE: "number_sense",
  ARITHMETIC: "arithmetic",
  FRACTIONS: "fractions",
  ALGEBRA: "algebra",
  GEOMETRY: "geometry",
  STATISTICS: "statistics",
  PROBLEM_SOLVING: "problem_solving",
};

/**
 * Adaptive Math Exercise component with personalized learning path
 */
export const AdaptiveMathExercise = ({
  userId,
  initialDifficulty = DIFFICULTY_LEVELS.MEDIUM,
  conceptId,
  conceptName,
  knowledgeArea,
  exerciseGenerator,
  maxExercises = 5,
  targetMastery = 0.8, // 80% mastery required to "pass" the concept
  adaptationRules = "standard", // can be 'standard', 'aggressive', or 'conservative'
  saveProgress = true,
  questMode = false,
  onComplete,
  questData = null,
}) => {
  // Core state
  const [userProfile, setUserProfile] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [exerciseType, setExerciseType] = useState("standard"); // standard, remedial, challenge
  const [showingProgress, setShowingProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questProgress, setQuestProgress] = useState(0);

  // Firebase reference for user progress data
  const db = getFirestore();
  const userProgressRef = useRef(null);

  // On mount, load user profile and generate first exercise
  useEffect(() => {
    if (userId && saveProgress) {
      userProgressRef.current = doc(db, "user_progress", userId);
      loadUserProfile();
    } else {
      // Create a blank profile for non-persistent mode
      setUserProfile({
        concepts: {},
        weakAreas: [],
        strengths: [],
      });
    }

    generateExercise();
  }, [userId, conceptId]);

  /**
   * Load user profile from Firestore
   */
  const loadUserProfile = async () => {
    try {
      const docSnap = await getDoc(userProgressRef.current);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data());

        // Check if we have history for this concept
        const conceptData = docSnap.data().concepts?.[conceptId];
        if (conceptData) {
          setMasteryLevel(conceptData.masteryLevel || 0);
          setWeakAreas(conceptData.weakAreas || []);
          setStrengths(conceptData.strengths || []);

          // Adjust initial difficulty based on past performance
          if (conceptData.recommendedDifficulty) {
            setCurrentDifficulty(conceptData.recommendedDifficulty);
          }

          // Set exercise type based on mastery
          if (conceptData.masteryLevel < 0.3) {
            setExerciseType("remedial");
          } else if (conceptData.masteryLevel > 0.85) {
            setExerciseType("challenge");
          }
        }
      } else {
        // Create new user profile
        const newProfile = {
          userId,
          concepts: {},
          overallMastery: 0,
          weakAreas: [],
          strengths: [],
        };
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  /**
   * Generate a new exercise based on current state
   */
  const generateExercise = () => {
    if (!exerciseGenerator) return;

    try {
      // Call the exercise generator with parameters
      const generatedExercise = exerciseGenerator({
        difficulty: currentDifficulty,
        exerciseType,
        weakAreas,
        knowledgeArea,
        previousPerformance: performanceHistory,
        userProfile,
      });

      setCurrentExercise(generatedExercise);
    } catch (error) {
      console.error("Error generating exercise:", error);
      // Fallback to a default exercise
      setCurrentExercise({
        question: "Something went wrong with exercise generation. Please try again.",
        answer: null,
        options: [],
        type: "error",
      });
    }
  };

  /**
   * Handle exercise completion
   */
  const handleExerciseComplete = (result) => {
    const newPerformanceHistory = [...performanceHistory];
    newPerformanceHistory.push({
      exerciseIndex: currentExerciseIndex,
      difficulty: currentDifficulty,
      attempts: result.attempts,
      timeTaken: result.timeTaken,
      stars: result.stars,
      timestamp: Date.now(),
    });

    setPerformanceHistory(newPerformanceHistory);
    setExercisesCompleted((prev) => prev + 1);

    // Update mastery level
    const newMasteryLevel = calculateMastery(newPerformanceHistory);
    setMasteryLevel(newMasteryLevel);

    // Generate personalized feedback
    const feedbackData = generateFeedback(newPerformanceHistory, newMasteryLevel);
    setFeedback(feedbackData);

    // Adapt difficulty for next exercise
    const nextDifficulty = adaptDifficulty(newPerformanceHistory, currentDifficulty);
    setCurrentDifficulty(nextDifficulty);

    // Update quest progress if in quest mode
    if (questMode && questData) {
      const newProgress = Math.min((exercisesCompleted + 1) / maxExercises, 1);
      setQuestProgress(newProgress);
    }

    // Check if we've completed all exercises
    if (exercisesCompleted + 1 >= maxExercises) {
      handleAllExercisesCompleted(newMasteryLevel, newPerformanceHistory);
    } else {
      // Show progress briefly
      setShowingProgress(true);
      setTimeout(() => {
        setShowingProgress(false);
        setCurrentExerciseIndex((prev) => prev + 1);
        generateExercise(); // Generate next exercise
      }, 3000);
    }
  };

  /**
   * Calculate mastery level based on performance history
   */
  const calculateMastery = (history) => {
    if (!history.length) return 0;

    // Calculate weighted score based on:
    // - Difficulty (higher difficulty = higher weight)
    // - Attempts (fewer attempts = higher score)
    // - Stars earned
    // - Time taken relative to expected time

    let totalScore = 0;
    let totalWeight = 0;

    history.forEach((entry) => {
      let exerciseScore = 0;
      let weight = 0;

      // Base weight by difficulty
      switch (entry.difficulty) {
        case DIFFICULTY_LEVELS.VERY_EASY:
          weight = 1;
          break;
        case DIFFICULTY_LEVELS.EASY:
          weight = 2;
          break;
        case DIFFICULTY_LEVELS.MEDIUM:
          weight = 3;
          break;
        case DIFFICULTY_LEVELS.HARD:
          weight = 4;
          break;
        case DIFFICULTY_LEVELS.VERY_HARD:
          weight = 5;
          break;
        default:
          weight = 3;
      }

      // Calculate score from 0-1
      exerciseScore = (entry.stars / 3) * ((3 - Math.min(entry.attempts, 3)) / 3);

      // Add to totals
      totalScore += exerciseScore * weight;
      totalWeight += weight;
    });

    // Calculate final mastery (0-1)
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };

  /**
   * Generate personalized feedback based on performance
   */
  const generateFeedback = (history, mastery) => {
    // Analyze most recent performance
    const recent = history.slice(-3);
    const latestExercise = history[history.length - 1];

    // Extract insights
    const recentMastery = calculateMastery(recent);
    const improving = recentMastery > mastery;
    const perfectLatest = latestExercise.stars === 3 && latestExercise.attempts === 0;
    const struggling = recent.every((ex) => ex.attempts > 1);

    // Generate feedback message
    let message = "";
    let type = "info";
    let suggestions = [];

    if (perfectLatest) {
      message = "Excellent work! You're mastering this concept.";
      type = "success";
      suggestions = ["Ready for more challenging problems!"];
    } else if (improving) {
      message = "You're making good progress! Keep it up.";
      type = "success";
      suggestions = ["Practice similar problems to build confidence."];
    } else if (struggling) {
      message = "This concept seems challenging. Let's break it down.";
      type = "warning";
      suggestions = [
        "Review the fundamental rules for this topic.",
        "Try practicing with simpler problems first.",
        "Look at example problems step-by-step.",
      ];
    } else {
      message = "You're working through these problems well.";
      type = "info";
      suggestions = ["Focus on accuracy before speed."];
    }

    // Return structured feedback
    return {
      message,
      type,
      suggestions,
      mastery,
      masteryLevel: getMasteryLevelLabel(mastery),
    };
  };

  /**
   * Adapt difficulty based on performance
   */
  const adaptDifficulty = (history, currentDifficulty) => {
    // Get recent performance
    const recent = history.slice(-2);
    if (recent.length < 2) return currentDifficulty;

    const recentMastery = calculateMastery(recent);

    // Determine how aggressively to adapt
    const adaptSpeed =
      adaptationRules === "aggressive" ? 1.5 : adaptationRules === "conservative" ? 0.5 : 1;

    // Adjust difficulty based on recent performance
    if (recentMastery > 0.9 * adaptSpeed) {
      // Performing very well, increase difficulty
      return incrementDifficulty(currentDifficulty);
    } else if (recentMastery < 0.4 * adaptSpeed) {
      // Struggling, decrease difficulty
      return decrementDifficulty(currentDifficulty);
    }

    // Keep same difficulty
    return currentDifficulty;
  };

  /**
   * Increment difficulty level
   */
  const incrementDifficulty = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.VERY_EASY:
        return DIFFICULTY_LEVELS.EASY;
      case DIFFICULTY_LEVELS.EASY:
        return DIFFICULTY_LEVELS.MEDIUM;
      case DIFFICULTY_LEVELS.MEDIUM:
        return DIFFICULTY_LEVELS.HARD;
      case DIFFICULTY_LEVELS.HARD:
        return DIFFICULTY_LEVELS.VERY_HARD;
      default:
        return difficulty;
    }
  };

  /**
   * Decrement difficulty level
   */
  const decrementDifficulty = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.VERY_HARD:
        return DIFFICULTY_LEVELS.HARD;
      case DIFFICULTY_LEVELS.HARD:
        return DIFFICULTY_LEVELS.MEDIUM;
      case DIFFICULTY_LEVELS.MEDIUM:
        return DIFFICULTY_LEVELS.EASY;
      case DIFFICULTY_LEVELS.EASY:
        return DIFFICULTY_LEVELS.VERY_EASY;
      default:
        return difficulty;
    }
  };

  /**
   * Convert numeric mastery to level label
   */
  const getMasteryLevelLabel = (mastery) => {
    if (mastery >= 0.9) return MASTERY_LEVELS.EXPERT;
    if (mastery >= 0.75) return MASTERY_LEVELS.ADVANCED;
    if (mastery >= 0.5) return MASTERY_LEVELS.PROFICIENT;
    if (mastery >= 0.25) return MASTERY_LEVELS.DEVELOPING;
    return MASTERY_LEVELS.NOVICE;
  };

  /**
   * Handle completion of all exercises
   */
  const handleAllExercisesCompleted = async (finalMastery, history) => {
    setIsCompleted(true);

    // Analyze performance to identify strengths and weaknesses
    const updatedWeakAreas = analyzeWeakAreas(history);
    const updatedStrengths = analyzeStrengths(history);

    setWeakAreas(updatedWeakAreas);
    setStrengths(updatedStrengths);

    // Determine recommended next difficulty
    const recommendedDifficulty =
      finalMastery > 0.8
        ? incrementDifficulty(currentDifficulty)
        : finalMastery < 0.4
          ? decrementDifficulty(currentDifficulty)
          : currentDifficulty;

    // Save progress to Firebase if enabled
    if (saveProgress && userId && userProgressRef.current) {
      try {
        await updateDoc(userProgressRef.current, {
          [`concepts.${conceptId}`]: {
            conceptName,
            knowledgeArea,
            masteryLevel: finalMastery,
            lastPracticed: Date.now(),
            recommendedDifficulty,
            weakAreas: updatedWeakAreas,
            strengths: updatedStrengths,
            history: arrayUnion(...history),
          },
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }

    // Notify parent component
    if (onComplete) {
      onComplete({
        conceptId,
        masteryLevel: finalMastery,
        masteryLabel: getMasteryLevelLabel(finalMastery),
        history,
        recommendedNextSteps: generateNextSteps(finalMastery, updatedWeakAreas),
        passed: finalMastery >= targetMastery,
        weakAreas: updatedWeakAreas,
        strengths: updatedStrengths,
      });
    }
  };

  /**
   * Analyze exercise history to identify weak areas
   */
  const analyzeWeakAreas = (history) => {
    // This would normally analyze the specific skills involved in each exercise
    // For demonstration, we'll use a simplified approach
    const areas = [];

    // Check for consistent issues with exercise types
    const lowScoreExercises = history.filter((ex) => ex.stars <= 1 || ex.attempts >= 2);

    if (lowScoreExercises.length >= Math.ceil(history.length * 0.3)) {
      areas.push(knowledgeArea);
    }

    return areas;
  };

  /**
   * Analyze exercise history to identify strengths
   */
  const analyzeStrengths = (history) => {
    // Similarly simplified for demonstration
    const areas = [];

    // Check for consistently high performance
    const highScoreExercises = history.filter((ex) => ex.stars === 3 && ex.attempts === 0);

    if (highScoreExercises.length >= Math.ceil(history.length * 0.5)) {
      areas.push(knowledgeArea);
    }

    return areas;
  };

  /**
   * Generate recommended next steps based on performance
   */
  const generateNextSteps = (mastery, weakAreas) => {
    if (mastery >= 0.9) {
      return [
        "Move on to more advanced concepts",
        "Try challenge problems for this topic",
        "Help explain this concept to others",
      ];
    } else if (mastery >= 0.75) {
      return [
        "Continue practicing at this level",
        "Review specific areas that were challenging",
        "Try more word problems with this concept",
      ];
    } else if (mastery >= 0.5) {
      return [
        "Practice more problems at this difficulty",
        "Review the fundamental rules",
        "Try a different approach to this concept",
      ];
    } else {
      return [
        "Focus on building foundational skills first",
        "Watch tutorial videos on this concept",
        "Practice with simpler problems before advancing",
      ];
    }
  };

  // If we don't have an exercise yet, show loading
  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render completion summary if all exercises are done
  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
        <div className="text-center mb-6">
          <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
            <span className="text-4xl">{masteryLevel >= targetMastery ? "🏆" : "📚"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Concept Review Complete!</h2>
          <p className="text-gray-600 mt-1">{conceptName}</p>
        </div>

        {/* Mastery meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Mastery Level</span>
            <span className="text-sm font-medium text-blue-600 capitalize">
              {getMasteryLevelLabel(masteryLevel)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                masteryLevel >= targetMastery
                  ? "bg-green-500"
                  : masteryLevel >= 0.5
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${Math.min(masteryLevel * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Exercises Completed</h3>
            <p className="text-2xl font-bold">{exercisesCompleted}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Average Score</h3>
            <p className="text-2xl font-bold">
              {(
                performanceHistory.reduce((sum, item) => sum + item.stars, 0) /
                performanceHistory.length
              ).toFixed(1)}
              <span className="text-lg ml-1">/ 3</span>
            </p>
          </div>
        </div>

        {/* Next steps */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">Recommended Next Steps</h3>
          <ul className="space-y-2">
            {generateNextSteps(masteryLevel, weakAreas).map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for improvement */}
        {weakAreas.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((area, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Your Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((area, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              // Reset for new session (normally would navigate elsewhere)
              setIsCompleted(false);
              setCurrentExerciseIndex(0);
              setExercisesCompleted(0);
              setPerformanceHistory([]);
              generateExercise();
            }}
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  // Render the exercise with progress indicator
  return (
    <div>
      {/* Progress bar and exercise counter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Exercise {currentExerciseIndex + 1} of {maxExercises}
          </span>
          {questMode && (
            <span className="text-sm font-medium text-purple-700">
              Quest Progress: {Math.round(questProgress * 100)}%
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(currentExerciseIndex / maxExercises) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quest context if in quest mode */}
      {questMode && questData && (
        <div className="mb-4 bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <span className="text-2xl">{questData.icon || "🧩"}</span>
            </div>
            <div>
              <h3 className="font-bold text-purple-800">{questData.name || "Math Quest"}</h3>
              <p className="text-purple-700 text-sm">
                {questData.description || "Complete the exercises to advance in your quest!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show feedback if available */}
      <AnimatePresence>
        {feedback && showingProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div
              className={`p-4 rounded-lg ${
                feedback.type === "success"
                  ? "bg-green-50 border border-green-100"
                  : feedback.type === "warning"
                    ? "bg-yellow-50 border border-yellow-100"
                    : "bg-blue-50 border border-blue-100"
              }`}
            >
              <p
                className={`font-medium ${
                  feedback.type === "success"
                    ? "text-green-800"
                    : feedback.type === "warning"
                      ? "text-yellow-800"
                      : "text-blue-800"
                }`}
              >
                {feedback.message}
              </p>
              {feedback.suggestions.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current exercise */}
      <MathExerciseWrapper
        title={`${conceptName} - ${currentDifficulty.replace("_", " ").toUpperCase()}`}
        difficulty={currentDifficulty}
        level={currentExerciseIndex + 1}
        category={knowledgeArea}
        learningObjective={currentExercise.learningObjective || `Practice ${conceptName} skills`}
        onComplete={handleExerciseComplete}
        icon={currentExercise.icon || "🧮"}
      >
        {/* This is where the actual exercise content would be rendered */}
        {/* Pass the exercise content to the MathExerciseWrapper as children */}
        <div className="math-exercise">
          <div className="question">{currentExercise.question}</div>

          {/* Exercise content would be here - could be multiple choice, numeric input, etc. */}
          {/* For this example, we'll assume a placeholder structure */}
          <div className="answer-area mt-4">{currentExercise.content}</div>

          {/* The hint prop will be used by MathExerciseWrapper */}
          <div className="hidden">{currentExercise.hint}</div>
        </div>
      </MathExerciseWrapper>

      {/* This component would contain the actual exercise UI based on type */}
      {/* But we're keeping it abstract in this example */}
    </div>
  );
};

export default AdaptiveMathExercise;
