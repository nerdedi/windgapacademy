/**
 * Character Animations Component - Featuring Andy, Daisy, Natalie, and Winnie
 *
 * Features:
 * - Sophisticated character animations
 * - Interactive character behaviors
 * - Smooth transitions and micro-interactions
 * - Character-specific personalities
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CharacterAnimations = ({ isVisible = true, onCharacterClick }) => {
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [animationPhase, setAnimationPhase] = useState("idle");

  const characters = [
    {
      id: "andy",
      name: "Andy",
      position: "left",
      color: "#4ade80",
      personality: "energetic",
      description: "The enthusiastic math explorer",
      greeting: "Hi! I'm Andy! Let's solve some amazing math puzzles together! 🔢",
      animation: "bounce",
    },
    {
      id: "daisy",
      name: "Daisy",
      position: "center-left",
      color: "#f472b6",
      personality: "creative",
      description: "The artistic storyteller",
      greeting: "Hello! I'm Daisy! Want to create beautiful stories and art? 🎨",
      animation: "float",
    },
    {
      id: "natalie",
      name: "Natalie",
      position: "center-right",
      color: "#a78bfa",
      personality: "curious",
      description: "The science investigator",
      greeting: "Hey there! I'm Natalie! Let's discover the wonders of science! 🧪",
      animation: "pulse",
    },
    {
      id: "winnie",
      name: "Winnie",
      position: "right",
      color: "#60a5fa",
      personality: "wise",
      description: "The helpful cloud guide",
      greeting: "Welcome! I'm Winnie! I'm here to guide you on your learning journey! ☁️",
      animation: "drift",
    },
  ];

  useEffect(() => {
    // Cycle through different animation phases
    const interval = setInterval(() => {
      setAnimationPhase((prev) => {
        const phases = ["idle", "wave", "excited", "thinking"];
        const currentIndex = phases.indexOf(prev);
        return phases[(currentIndex + 1) % phases.length];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCharacterPosition = (position) => {
    const positions = {
      left: "left-[10%]",
      "center-left": "left-[30%]",
      "center-right": "right-[30%]",
      right: "right-[10%]",
    };
    return positions[position] || "left-[10%]";
  };

  const getAnimationVariants = (character) => {
    const baseVariants = {
      idle: {
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0],
        scale: 1,
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
      wave: {
        rotate: [0, 15, -15, 15, 0],
        y: [0, -5, 0],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
        },
      },
      excited: {
        y: [0, -20, 0, -15, 0],
        scale: [1, 1.1, 1, 1.05, 1],
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      },
      thinking: {
        rotate: [0, -10, 10, 0],
        y: [0, -5, 0],
        transition: {
          duration: 2.5,
          ease: "easeInOut",
        },
      },
    };

    // Character-specific animation modifications
    switch (character.animation) {
      case "bounce":
        return {
          ...baseVariants,
          idle: {
            ...baseVariants.idle,
            y: [0, -15, 0],
            transition: { ...baseVariants.idle.transition, duration: 2 },
          },
        };
      case "float":
        return {
          ...baseVariants,
          idle: {
            ...baseVariants.idle,
            y: [0, -8, 0],
            x: [0, 5, 0],
            transition: { ...baseVariants.idle.transition, duration: 4 },
          },
        };
      case "pulse":
        return {
          ...baseVariants,
          idle: {
            ...baseVariants.idle,
            scale: [1, 1.05, 1],
            transition: { ...baseVariants.idle.transition, duration: 2.5 },
          },
        };
      case "drift":
        return {
          ...baseVariants,
          idle: {
            ...baseVariants.idle,
            x: [0, 10, -10, 0],
            y: [0, -5, 0],
            transition: { ...baseVariants.idle.transition, duration: 5 },
          },
        };
      default:
        return baseVariants;
    }
  };

  const handleCharacterClick = (character) => {
    setActiveCharacter(character);
    onCharacterClick?.(character);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-30">
      {/* Character Container */}
      <div className="relative w-full h-full">
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            className={`absolute bottom-8 ${getCharacterPosition(character.position)} pointer-events-auto cursor-pointer`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            onClick={() => handleCharacterClick(character)}
          >
            {/* Character Body */}
            <motion.div
              className="relative"
              variants={getAnimationVariants(character)}
              animate={animationPhase}
            >
              {/* Character Avatar */}
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white"
                style={{ backgroundColor: character.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {character.id === "winnie" ? "☁️" : "👤"}
              </motion.div>

              {/* Character Name */}
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-sm font-semibold text-gray-800">{character.name}</span>
              </motion.div>

              {/* Floating Particles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: character.color }}
                    animate={{
                      y: [0, -30, -60],
                      x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
                      opacity: [1, 0.5, 0],
                      scale: [0.5, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3 + index * 0.2,
                    }}
                    style={{
                      left: `${20 + i * 20}%`,
                      top: "10%",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Character Dialog */}
      <AnimatePresence>
        {activeCharacter && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCharacter(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl border-4 border-white shadow-lg"
                  style={{ backgroundColor: activeCharacter.color }}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeCharacter.id === "winnie" ? "☁️" : "👤"}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeCharacter.name}</h3>

                <p className="text-gray-600 mb-4">{activeCharacter.description}</p>

                <motion.div
                  className="bg-gray-50 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-gray-700 italic">"{activeCharacter.greeting}"</p>
                </motion.div>

                <motion.button
                  onClick={() => setActiveCharacter(null)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Thanks, {activeCharacter.name}!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
