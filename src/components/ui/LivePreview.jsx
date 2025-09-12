/**
 * Live Preview Component - Figma-level sophistication
 *
 * Features:
 * - Interactive demo of platform capabilities
 * - Real-time animations and transitions
 * - Sophisticated visual effects
 * - Character integration ready
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LivePreview = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demos = [
    {
      title: "AI-Powered Learning",
      description: "Watch as our AI adapts to learning patterns",
      component: <AILearningDemo />,
    },
    {
      title: "3D Game Environments",
      description: "Explore immersive educational games",
      component: <GameEnvironmentDemo />,
    },
    {
      title: "Real-time Analytics",
      description: "Track progress with live data visualization",
      component: <AnalyticsDemo />,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, demos.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Demo Container */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-600">Windgap Academy Demo</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>
        </div>

        {/* Demo Content */}
        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-purple-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 p-8"
            >
              {demos[activeDemo].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Demo Info */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{demos[activeDemo].title}</h3>
          <p className="text-gray-600">{demos[activeDemo].description}</p>
        </div>

        {/* Demo Indicators */}
        <div className="flex justify-center space-x-2 p-4">
          {demos.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveDemo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeDemo ? "bg-blue-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full"
        animate={{
          y: [0, 10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// AI Learning Demo Component
const AILearningDemo = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <motion.div
      className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="text-4xl">🧠</span>
    </motion.div>

    <div className="text-center">
      <motion.div
        className="text-lg font-semibold text-gray-800 mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing Learning Pattern...
      </motion.div>

      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-8 bg-blue-400 rounded"
            animate={{
              height: [8, 32, 8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Game Environment Demo Component
const GameEnvironmentDemo = () => (
  <div className="relative h-full bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden">
    {/* Background elements */}
    <motion.div
      className="absolute top-4 left-4 w-8 h-8 bg-yellow-300 rounded-full"
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />

    {/* Floating platforms */}
    <motion.div
      className="absolute bottom-20 left-8 w-16 h-4 bg-green-400 rounded"
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <motion.div
      className="absolute bottom-32 right-12 w-12 h-4 bg-green-400 rounded"
      animate={{
        y: [0, 15, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Character placeholder (will be replaced with actual characters) */}
    <motion.div
      className="absolute bottom-24 left-12 w-8 h-12 bg-blue-500 rounded-lg"
      animate={{
        x: [0, 100, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <div className="absolute top-4 right-4 text-sm font-medium text-gray-700">
      Math Quest Level 1
    </div>
  </div>
);

// Analytics Demo Component
const AnalyticsDemo = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-full max-w-sm">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-white p-4 rounded-lg shadow"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-2xl font-bold text-blue-600">85%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="text-2xl font-bold text-green-600">A+</div>
          <div className="text-sm text-gray-600">Average Grade</div>
        </motion.div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-700 mb-2">Progress This Week</div>
        <div className="flex space-x-1">
          {[40, 65, 80, 45, 90, 75, 85].map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-blue-400 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
