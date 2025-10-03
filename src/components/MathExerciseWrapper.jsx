/**
 * MathExerciseWrapper component
 *
 * A wrapper component that adds gamification elements to math exercises,
 * inspired by educational games like Antura.
 */

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MicroInteraction } from "../components/MicroInteractions";

// Game elements: stars, achievements, progression
const ACHIEVEMENT_TYPES = {
  SPEED: "speed",
  ACCURACY: "accuracy",
  STREAK: "streak",
  MASTERY: "mastery",
};

/**
 * Component that wraps exercise components and adds gamification elements
 */
export const MathExerciseWrapper = ({
  children,
  title,
  level = 1,
  category = "algebra",
  onComplete,
  maxAttempts = 3,
  difficulty = "medium",
  timeLimit = null, // in seconds, null means no time limit
  icon = "🧮",
  learningObjective = "Practice math skills",
  showRewards = true,
}) => {
  // State management
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [exerciseStartTime, setExerciseStartTime] = useState(Date.now());
  const [isAnimatingReward, setIsAnimatingReward] = useState(false);

  // Timer effect for time-limited exercises
  useEffect(() => {
    let timer;
    if (timeLimit !== null && timeRemaining > 0 && !correct) {
      timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !correct) {
      // Time's up!
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, correct]);

  // Initial setup
  useEffect(() => {
    // Reset exercise state
    setExerciseStartTime(Date.now());
    setAttempts(0);
    setCorrect(false);
    setShowHint(false);
    setTimeRemaining(timeLimit);
  }, [title, level, category]);

  /**
   * Handle when exercise is answered correctly
   */
  const handleCorrect = (result = {}) => {
    if (correct) return; // Already marked correct

    const timeTaken = Math.floor((Date.now() - exerciseStartTime) / 1000);
    const newStars = calculateStars({ attempts, timeTaken });

    setCorrect(true);
    setStars(newStars);
    setStreakCount((prev) => prev + 1);

    // Calculate and display achievements
    const newAchievements = calculateAchievements({
      attempts,
      timeTaken,
      streakCount: streakCount + 1,
    });

    if (newAchievements.length > 0) {
      setAchievements(newAchievements);
      setIsAnimatingReward(true);
    }

    // Show feedback
    setFeedbackMessage(`Great job! ${getRandomEncouragement()}`);
    setShowFeedback(true);

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);

    // Report completion to parent
    if (onComplete) {
      onComplete({
        exerciseId: title,
        attempts,
        timeTaken,
        stars: newStars,
        achievements: newAchievements,
        difficulty,
        category,
      });
    }
  };

  /**
   * Handle incorrect answer attempt
   */
  const handleIncorrect = () => {
    setAttempts((prev) => prev + 1);
    setStreakCount(0);

    if (attempts + 1 >= maxAttempts) {
      // Max attempts reached
      setFeedbackMessage("Don't worry! Let's learn from our mistakes.");
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    } else {
      // Still have attempts left
      setFeedbackMessage("Not quite. Try again!");
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  /**
   * Handle when time runs out
   */
  const handleTimeUp = () => {
    setFeedbackMessage("Time's up! Let's try again.");
    setShowFeedback(true);
    setStreakCount(0);

    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  /**
   * Calculate stars based on performance
   */
  const calculateStars = ({ attempts, timeTaken }) => {
    // Base of 3 stars, deduct for attempts and time
    let stars = 3;

    // Deduct for attempts
    if (attempts === 1) stars = 3;
    else if (attempts === 2) stars = 2;
    else stars = 1;

    // Deduct for time if applicable
    if (timeLimit) {
      const timeRatio = timeTaken / timeLimit;
      if (timeRatio > 0.8) stars = Math.max(stars - 1, 1);
    }

    return stars;
  };

  /**
   * Calculate achievements earned
   */
  const calculateAchievements = ({ attempts, timeTaken, streakCount }) => {
    const newAchievements = [];

    // Speed achievement
    if (timeLimit && timeTaken < timeLimit * 0.5) {
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.SPEED,
        title: "Speed Demon",
        description: "Completed in record time!",
        icon: "⚡",
      });
    }

    // Accuracy achievement
    if (attempts === 0) {
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.ACCURACY,
        title: "Perfect Aim",
        description: "Solved correctly on first try!",
        icon: "🎯",
      });
    }

    // Streak achievement
    if (streakCount >= 3) {
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.STREAK,
        title: "On Fire",
        description: `${streakCount} correct answers in a row!`,
        icon: "🔥",
      });
    }

    return newAchievements;
  };

  /**
   * Get random encouragement message
   */
  const getRandomEncouragement = () => {
    const encouragements = [
      "You're doing amazing!",
      "Fantastic work!",
      "Math superstar!",
      "Brilliant solving!",
      "You're a natural!",
      "Excellent thinking!",
      "Outstanding job!",
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-blue-200">
      {/* Exercise Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{icon}</span>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-400 bg-opacity-30 px-3 py-1 rounded-full text-sm">
              Level {level}
            </span>
            <span className="bg-purple-400 bg-opacity-30 px-3 py-1 rounded-full text-sm capitalize">
              {difficulty}
            </span>
          </div>
        </div>

        {timeLimit !== null && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Time Remaining</span>
              <span className="text-sm font-mono">{timeRemaining}s</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-white transition-all duration-200 ease-linear"
                style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Objective */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Goal:</span> {learningObjective}
        </p>
      </div>

      {/* Exercise Content */}
      <div className="p-6">
        {React.cloneElement(children, {
          onCorrect: handleCorrect,
          onIncorrect: handleIncorrect,
          remainingAttempts: maxAttempts - attempts,
        })}

        {/* Hint Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            onClick={() => setShowHint(!showHint)}
          >
            <span className="mr-1">{showHint ? "🔍" : "💡"}</span>
            {showHint ? "Hide Hint" : "Need a Hint?"}
          </button>
        </div>

        {/* Hint Content */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-4 bg-blue-50 rounded-md overflow-hidden"
            >
              {children.props.hint ||
                "Think carefully about the problem. Break it down into smaller steps."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <MicroInteraction type={correct ? "success" : "info"} message={feedbackMessage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results section - only shown when correct */}
      {correct && showRewards && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-700">Exercise Complete!</h3>
              <p className="text-sm text-gray-600">
                Attempts: {attempts + 1} | Time:{" "}
                {Math.floor((Date.now() - exerciseStartTime) / 1000)}s
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: i <= stars ? 1 : 0.7 }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                  className={i <= stars ? "text-2xl text-yellow-400" : "text-2xl text-gray-300"}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <AnimatePresence>
            {isAnimatingReward && achievements.length > 0 && (
              <motion.div
                className="mt-3 flex flex-wrap gap-2"
                initial="hidden"
                animate="visible"
                onAnimationComplete={() => setIsAnimatingReward(false)}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.type}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                  >
                    <span className="mr-1 text-lg">{achievement.icon}</span>
                    <span className="font-medium text-sm">{achievement.title}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => {
                // Here would go the logic to move to the next exercise
                // For now just resets this exercise
                setExerciseStartTime(Date.now());
                setAttempts(0);
                setCorrect(false);
                setShowHint(false);
                setTimeRemaining(timeLimit);
                setAchievements([]);
              }}
            >
              Continue Learning →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathExerciseWrapper;
