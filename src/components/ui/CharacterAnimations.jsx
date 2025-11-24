/**
 * Character Animations Component - Featuring Andy, Daisy, Natalie, and Winnie
 *
 * Features:
 * - Sophisticated character animations
 * - Interactive character behaviors
 * - Smooth transitions and micro-interactions
 * - Character-specific personalities
 * - Adaptive animations based on content and user interactions
 * - Accessible design with motion preferences support
 *
 * @ts-nocheck - This is a JSX file with some TypeScript validation issues
 */

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

import { prefersReducedMotion } from "../../utils/accessibility.js";

import MicroInteractions from "./MicroInteractions.jsx";

export const CharacterAnimations = ({
  isVisible = true,
  onCharacterClick,
  initialCharacter = null,
  triggerAnimation = null,
  showDialog = false,
  dialogText = "",
  onAnimationComplete = () => {},
  size = "medium",
  position = "center",
}) => {
  const [activeCharacter, setActiveCharacter] = useState(initialCharacter);
  const [animationPhase, setAnimationPhase] = useState("idle");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const animationTimeoutRef = useRef(null);
  const controls = useAnimation();

  const playAnimation = (animationName) => {
    setAnimationPhase(animationName);
    controls.start(animationName);
    if (onAnimationComplete) {
      setTimeout(() => onAnimationComplete(animationName), 1000); // Mock duration
    }
  };

  // Size presets
  const sizePresets = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 },
  };

  // Character definitions with personality traits and animations
  const characters = [
    {
      id: "andy",
      name: "Andy",
      position: "left",
      color: "#4ade80",
      personality: "energetic",
      description: "The enthusiastic math explorer",
      greeting: "Hi! I&apos;m Andy! Let&apos;s solve some amazing math puzzles together! 🔢",
      animation: "bounce",
      idleAnimations: ["sway", "blink", "breathe"],
      interactionAnimations: ["jump", "spin", "wave"],
      celebrationAnimations: ["backflip", "dance", "cheer"],
      expressions: ["happy", "thinking", "excited", "curious"],
    },
    {
      id: "daisy",
      name: "Daisy",
      position: "center-left",
      color: "#f472b6",
      personality: "creative",
      description: "The artistic storyteller",
      greeting: "Hello! I&apos;m Daisy! Want to create beautiful stories and art? 🎨",
      animation: "float",
      idleAnimations: ["float", "blink", "breathe"],
      interactionAnimations: ["dance", "twirl", "giggle"],
      celebrationAnimations: ["cartwheel", "paint", "cheer"],
      expressions: ["creative", "dreamy", "happy", "inspired"],
    },
    {
      id: "natalie",
      name: "Natalie",
      position: "center-right",
      color: "#a78bfa",
      personality: "curious",
      description: "The science investigator",
      greeting: "Hey there! I&apos;m Natalie! Let&apos;s discover the wonders of science! 🧪",
      animation: "pulse",
      idleAnimations: ["pulse", "look", "think"],
      interactionAnimations: ["magnify", "analyze", "discover"],
      celebrationAnimations: ["eureka", "experiment", "congratulate"],
      expressions: ["curious", "thinking", "excited", "inspired"],
    },
    {
      id: "winnie",
      name: "Winnie",
      position: "right",
      color: "#60a5fa",
      personality: "wise",
      description: "The helpful cloud guide",
      greeting: "Welcome! I&apos;m Winnie! I&apos;m here to guide you on your learning journey! ☁️",
      animation: "drift",
      idleAnimations: ["drift", "glow", "float"],
      interactionAnimations: ["approach", "highlight", "guide"],
      celebrationAnimations: ["rainbow", "raindance", "sparkle"],
      expressions: ["wise", "happy", "encouraging", "proud"],
    },
  ];

  useEffect(() => {
    // Initialize with the specified character if provided
    if (initialCharacter && !activeCharacter) {
      const character = characters.find((c) => c.id === initialCharacter);
      if (character) {
        setActiveCharacter(character);
      }
    }

    // Handle triggered animations
    if (triggerAnimation && activeCharacter) {
      playAnimation(triggerAnimation);
    }

    // Handle dialog visibility
    setBubbleVisible(showDialog);

    // Clean up any animation timeouts
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [initialCharacter, triggerAnimation, showDialog, activeCharacter]);

  // Random idle animations to keep characters engaging
  useEffect(() => {
    if (!prefersReducedMotion && activeCharacter && animationPhase === "idle") {
      const randomIdleAnimation = () => {
        const idleAnimations = activeCharacter.idleAnimations || ["breathe", "sway", "blink"];
        const randomIndex = Math.floor(Math.random() * idleAnimations.length);
        playAnimation(idleAnimations[randomIndex]);

        // Schedule next idle animation
        const nextAnimationDelay = 3000 + Math.random() * 5000; // 3-8 seconds
        animationTimeoutRef.current = setTimeout(randomIdleAnimation, nextAnimationDelay);
      };

      // Start idle animations
      randomIdleAnimation();
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [activeCharacter, animationPhase]);

  const getCharacterPosition = (characterPosition) => {
    // Adjust based on both the character&apos;s natural position and the prop position
    const positions = {
      left: "left-[10%]",
      "center-left": "left-[30%]",
      center: "left-1/2 -translate-x-1/2",
      "center-right": "right-[30%]",
      right: "right-[10%]",
    };

    // Override with prop position if specified
    if (position !== "center") {
      return positions[position] || positions.center;
    }

    return positions[characterPosition] || positions.center;
  };

  const getAnimationVariants = (character) => {
    // Base animation variants that apply to all characters
    const baseVariants = {
      idle: {
        y: [0, -5, 0],
        rotate: [0, 1, -1, 0],
        scale: 1,
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
      // Interactive animations
      wave: {
        rotate: [0, 15, -5, 15, 0],
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
          duration: 1.5,
          ease: "easeInOut",
        },
      },
      thinking: {
        rotate: [0, -10, 0],
        y: [0, -5, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      },
      // Idle animations
      breathe: {
        scale: [1, 1.03, 1],
        transition: {
          duration: 2.5,
          repeat: 3,
          ease: "easeInOut",
        },
      },
      sway: {
        rotate: [0, 2, -2, 0],
        transition: {
          duration: 2,
          repeat: 2,
          ease: "easeInOut",
        },
      },
      blink: {
        opacity: [1, 0.9, 1, 0.9, 1],
        transition: {
          duration: 1,
          times: [0, 0.2, 0.3, 0.5, 0.6],
          repeat: 2,
        },
      },
      // Interactive animations
      jump: {
        y: [0, -30, 0],
        transition: {
          duration: 0.8,
          ease: "circOut",
        },
      },
      spin: {
        rotate: [0, 360],
        transition: {
          duration: 1,
          ease: "circInOut",
        },
      },
      dance: {
        y: [0, -10, 0, -10, 0],
        x: [0, 10, -10, 10, 0],
        rotate: [0, 10, -10, 10, 0],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
        },
      },
      // Celebration animations
      celebrate: {
        scale: [1, 1.2, 1],
        y: [0, -20, 0],
        rotate: [0, 10, -10, 10, 0],
        transition: {
          duration: 1.5,
          ease: "easeOut",
        },
      },
      rainbow: {
        scale: [1, 1.1, 1],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      },
    };

    // Character-specific animation modifications
    const personalityAnimations = {
      energetic: {
        idle: {
          ...baseVariants.idle,
          y: [0, -15, 0],
          rotate: [0, 3, -3, 0],
          transition: { ...baseVariants.idle.transition, duration: 2 },
        },
        jump: {
          ...baseVariants.jump,
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        },
      },
      creative: {
        idle: {
          ...baseVariants.idle,
          y: [0, -8, 0],
          x: [0, 5, 0],
          rotate: [0, 2, -2, 0],
          transition: { ...baseVariants.idle.transition, duration: 4 },
        },
        dance: {
          ...baseVariants.dance,
          rotate: [0, 15, -15, 15, 0],
          scale: [1, 1.1, 0.95, 1.1, 1],
        },
      },
      curious: {
        idle: {
          ...baseVariants.idle,
          scale: [1, 1.03, 1],
          rotate: [0, 1, -1, 0],
          transition: { ...baseVariants.idle.transition, duration: 2.5 },
        },
        thinking: {
          ...baseVariants.thinking,
          rotate: [0, -15, 0],
          y: [0, -8, 0],
        },
      },
      wise: {
        idle: {
          ...baseVariants.idle,
          x: [0, 5, -5, 0],
          y: [0, -3, 0],
          transition: { ...baseVariants.idle.transition, duration: 5 },
        },
        rainbow: {
          ...baseVariants.rainbow,
          scale: [1, 1.15, 1],
          filter: ["brightness(1)", "brightness(1.8)", "brightness(1)"],
        },
      },
    };

    // Combine base variants with personality-specific variants
    const combinedVariants = {
      ...baseVariants,
      ...(personalityAnimations[character.personality] || {}),
    };

    return combinedVariants;
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
                    style={{
                      backgroundColor: character.color,
                      left: `${20 + i * 20}%`,
                      top: "10%",
                    }}
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
