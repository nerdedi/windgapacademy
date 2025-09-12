import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({
  message = "Loading Windgap Academy...",
  progress = 0,
  showProgress = true,
  tips = [],
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  const defaultTips = [
    "🎓 Windgap Academy uses AI to personalize your learning experience",
    "🎮 Complete games to unlock new features and achievements",
    "🌟 Track your progress across all subjects in your dashboard",
    "🎨 Use the Creative Studio to express your artistic side",
    "🧪 Conduct virtual experiments in the Science Lab",
    "📚 Explore interactive stories in Reading Realm",
    "🔢 Master mathematics with visual problem-solving in MathQuest",
    "🏆 Earn badges and compete with friends in challenges",
    "🎵 Create music and soundscapes with our audio tools",
    "🌍 Join a global community of learners and educators",
  ];

  const loadingTips = tips.length > 0 ? tips : defaultTips;

  // Animate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.1) return progress;
        return prev + diff * 0.1;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [progress]);

  // Cycle through tips
  useEffect(() => {
    if (loadingTips.length <= 1) return;

    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(tipTimer);
  }, [loadingTips.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center text-white max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 1,
          }}
        >
          <div className="text-8xl mb-4">🎓</div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Windgap Academy
          </motion.h1>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xl mb-4">{message}</p>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${displayedProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm opacity-80">{Math.round(displayedProgress)}% Complete</p>
          </motion.div>
        )}

        {/* Loading Tips */}
        {loadingTips.length > 0 && (
          <motion.div
            className="min-h-[60px] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              key={currentTip}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                <p className="text-sm opacity-90">
                  💡 <strong>Tip:</strong> {loadingTips[currentTip]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Loading States */}
        <motion.div
          className="mt-8 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="mt-8 text-xs opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
        >
          <p>
            Version {window.WindgapPlatform?.version || "2.0.0"} | Professional Learning Platform
          </p>
        </motion.div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {message} {showProgress && `${Math.round(displayedProgress)}% complete`}
      </div>
    </div>
  );
};

// Enhanced Loading Screen with different states
export const LoadingStates = {
  INITIALIZING: {
    message: "Initializing Windgap Academy...",
    progress: 10,
  },
  LOADING_ASSETS: {
    message: "Loading educational content...",
    progress: 30,
  },
  SETTING_UP_AI: {
    message: "Preparing AI systems...",
    progress: 50,
  },
  LOADING_GAMES: {
    message: "Setting up interactive games...",
    progress: 70,
  },
  FINALIZING: {
    message: "Almost ready...",
    progress: 90,
  },
  COMPLETE: {
    message: "Welcome to Windgap Academy!",
    progress: 100,
  },
};

// Loading Screen with automatic state progression
export const ProgressiveLoadingScreen = ({ onComplete, duration = 5000 }) => {
  const [currentState, setCurrentState] = useState(0);
  const states = Object.values(LoadingStates);

  useEffect(() => {
    const stateInterval = duration / states.length;

    const timer = setInterval(() => {
      setCurrentState((prev) => {
        const next = prev + 1;
        if (next >= states.length) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return prev;
        }
        return next;
      });
    }, stateInterval);

    return () => clearInterval(timer);
  }, [duration, states.length, onComplete]);

  return <LoadingScreen {...states[currentState]} />;
};

export default LoadingScreen;
