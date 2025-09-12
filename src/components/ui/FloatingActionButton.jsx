/**
 * Floating Action Button Component - Figma-level sophistication
 *
 * Features:
 * - Smooth floating animations
 * - Contextual actions and tooltips
 * - Advanced hover effects
 * - Professional micro-interactions
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingActionButton = ({ onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const actions = [
    {
      id: "dashboard",
      icon: "📊",
      label: "Dashboard",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "games",
      icon: "🎮",
      label: "Games",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "help",
      icon: "❓",
      label: "Help",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-all duration-200 ${action.color}`}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onClick(action.id);
                  setIsExpanded(false);
                }}
                onMouseEnter={() => setShowTooltip(action.id)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="text-lg">{action.icon}</span>

                {/* Tooltip */}
                <AnimatePresence>
                  {showTooltip === action.id && (
                    <motion.div
                      className="absolute right-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {action.label}
                      <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isExpanded ? 45 : 0,
        }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{
            rotate: isExpanded ? 45 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </motion.svg>
      </motion.button>

      {/* Floating Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
