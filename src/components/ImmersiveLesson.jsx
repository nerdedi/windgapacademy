import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Maximize2,
  Play,
  Award,
  MessageCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { useGamification } from "../contexts/GamificationContext";

import HybridScene from "./HybridScene";

const ImmersiveLesson = ({
  lessonId,
  lessonTitle = "Introduction to Fractions",
  subject = "Mathematics",
  grade = "4th Grade",
  duration = "25 minutes",
  characterModel = "/models/winnie-mascot.glb",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [characterMessage, setCharacterMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const lessonContainerRef = useRef(null);
  const gamification = useGamification();

  // Mock lesson content - would normally come from an API/database
  const lessonSteps = [
    {
      type: "introduction",
      title: "Understanding Fractions",
      content:
        "Fractions represent parts of a whole. Today we'll learn how to identify, compare, and work with fractions in everyday life.",
      characterPrompt:
        "Hi there! I'm Winnie, and I'll be helping you learn about fractions today. Are you ready to begin our adventure?",
    },
    {
      type: "concept",
      title: "Parts of a Fraction",
      content:
        "A fraction has two parts: the numerator (top) and denominator (bottom). The numerator tells us how many parts we have, while the denominator tells us the total number of equal parts in the whole.",
      visual: "/assets/images/fraction-parts.svg",
      characterPrompt:
        "Think of a pizza cut into 8 equal slices. If you eat 3 slices, you've eaten 3/8 of the pizza!",
    },
    {
      type: "interactive",
      title: "Identify the Fraction",
      content: "Look at each image and select the fraction that represents the shaded portion.",
      interaction: {
        type: "multiple-choice",
        question: "What fraction of the circle is shaded blue?",
        image: "/assets/images/fraction-circle-3-4.svg",
        options: ["1/4", "2/4", "3/4", "4/4"],
        correctAnswer: "3/4",
      },
      characterPrompt:
        "Count the total parts, then count how many are shaded. That will give you your fraction!",
    },
    {
      type: "exploration",
      title: "Fractions in Real Life",
      content:
        "Fractions are all around us! We use them in cooking (1/2 cup of sugar), telling time (quarter past), and sharing things equally.",
      threeDInteractive: true,
      characterPrompt:
        "I've got some real-world examples to show you. Click on me to see a pizza being divided into fractions!",
    },
    {
      type: "practice",
      title: "Comparing Fractions",
      content:
        "When fractions have the same denominator, the one with the larger numerator is greater.",
      interaction: {
        type: "drag-and-drop",
        question: "Arrange these fractions from smallest to largest.",
        items: ["3/8", "7/8", "1/8", "5/8"],
        correctOrder: ["1/8", "3/8", "5/8", "7/8"],
      },
      characterPrompt:
        "When comparing fractions with the same denominator, just look at the top number!",
    },
    {
      type: "quiz",
      title: "Check Your Understanding",
      content: "Let's see what you've learned about fractions!",
      questions: [
        {
          question: "In the fraction 3/4, which number is the denominator?",
          options: ["3", "4", "Both", "Neither"],
          correctAnswer: "4",
        },
        {
          question: "Which fraction is larger: 2/5 or 3/5?",
          options: ["2/5", "3/5", "They are equal", "Can't be determined"],
          correctAnswer: "3/5",
        },
      ],
      characterPrompt: "You've learned so much already! Give these questions your best try.",
    },
    {
      type: "conclusion",
      title: "Great Job!",
      content:
        "You've completed the introduction to fractions! You now understand what fractions are, how to identify them, and how to compare fractions with the same denominator.",
      characterPrompt:
        "Wonderful work today! You've earned your Fraction Fundamentals badge. What would you like to learn next?",
    },
  ];

  const step = lessonSteps[currentStep];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lessonContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Show character message on step change
    if (step.characterPrompt) {
      setCharacterMessage(step.characterPrompt);

      // Hide message after a delay
      const timer = setTimeout(() => {
        setCharacterMessage(null);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, step]);

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Award XP for progress
      gamification.addXP(10, "lesson progress");
    } else {
      // Lesson complete
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (answer, correct) => {
    if (correct) {
      // Show success animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Award XP for correct answer
      gamification.addXP(15, "correct answer");

      // Auto-advance after correct answer
      setTimeout(handleNext, 1500);
    } else {
      // Provide hint via character
      setCharacterMessage("That's not quite right. Try again!");
      setTimeout(() => setCharacterMessage(null), 3000);
    }
  };

  const handleComplete = () => {
    // Award badge and XP for completion
    gamification.addXP(50, "lesson completion");
    gamification.awardBadge(
      `lesson_${lessonId}`,
      "Fraction Master",
      "Completed the Introduction to Fractions lesson",
    );

    // Show completion celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleCharacterClick = () => {
    // Show a random tip or encouragement
    const messages = [
      "You're doing great! Keep it up!",
      "Need help? Try looking at the examples again.",
      "Remember, the denominator shows how many equal parts are in the whole.",
      "Learning fractions is important for cooking, sharing, and many other daily activities!",
    ];

    setCharacterMessage(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => setCharacterMessage(null), 3000);
  };

  return (
    <div
      ref={lessonContainerRef}
      className={`flex flex-col ${isFullscreen ? "h-screen" : "min-h-[600px] h-full"} bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="text-indigo-600 mr-2" size={20} />
          <div>
            <h2 className="text-lg font-bold text-gray-800">{lessonTitle}</h2>
            <div className="flex text-xs text-gray-500">
              <span className="mr-3">{subject}</span>
              <span className="mr-3">{grade}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Lesson content - 2D side */}
        <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col"
            >
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <div className="h-1 bg-indigo-600 flex-grow ml-2 rounded-full">
                    <div
                      className="h-full bg-indigo-300 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / lessonSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.content}</p>
              </div>

              {/* Step-specific content */}
              {step.visual && (
                <div className="mb-6">
                  <img
                    src={step.visual}
                    alt={step.title}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  />
                </div>
              )}

              {step.interaction?.type === "multiple-choice" && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4">{step.interaction.question}</h4>

                  {step.interaction.image && (
                    <img
                      src={step.interaction.image}
                      alt="Question visual"
                      className="max-w-[200px] h-auto mb-6 mx-auto"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {step.interaction.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleAnswer(option, option === step.interaction.correctAnswer)
                        }
                        className="p-3 border-2 border-indigo-200 rounded-lg text-center hover:bg-indigo-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step.interaction?.type === "drag-and-drop" && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4">{step.interaction.question}</h4>

                  {/* Simple representation of drag and drop */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {step.interaction.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-indigo-100 rounded-lg cursor-move" draggable>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        className="h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
                      >
                        Drop here
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleAnswer(null, true)} // Simplified for demo
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>
              )}

              {step.type === "quiz" && (
                <div className="space-y-6">
                  {step.questions.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
                      <h4 className="font-bold text-lg mb-4">
                        Question {idx + 1}: {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswer(option, option === q.correctAnswer)}
                            className="w-full p-3 text-left border rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
                          >
                            <div className="w-6 h-6 rounded-full border-2 border-indigo-400 mr-3 flex-shrink-0"></div>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step.type === "conclusion" && (
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                    <Award className="text-indigo-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Lesson Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    You've earned 50 XP and the Fraction Fundamentals badge!
                  </p>

                  <div className="flex justify-center">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Continue to Next Lesson
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <ChevronLeft size={18} className="mr-1" /> Previous
            </button>

            {currentStep < lessonSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete <Play size={18} className="ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* 3D Character side */}
        <div className="md:w-2/5 bg-gradient-to-br from-indigo-50 to-blue-100 p-4 flex flex-col relative">
          {/* 3D Scene */}
          <div className="flex-grow">
            <HybridScene
              characterModel={characterModel}
              backgroundColor="transparent"
              interactive={true}
              onCharacterClick={handleCharacterClick}
              height="100%"
            />
          </div>

          {/* Character message bubble */}
          <AnimatePresence>
            {characterMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute left-4 bottom-16 max-w-[90%] bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45"></div>
                <div className="flex items-start">
                  <MessageCircle className="text-indigo-600 mr-2 flex-shrink-0 mt-1" size={18} />
                  <p className="text-gray-800">{characterMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confetti celebration overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="confetti-container">
            {/* These would be animated confetti elements */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: ["#FF9933", "#66CC66", "#6699FF", "#FFCC00", "#FF6666"][
                    Math.floor(Math.random() * 5)
                  ],
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animation: `fall ${Math.random() * 3 + 2}s linear forwards, sway ${Math.random() * 4 + 3}s ease-in-out infinite alternate`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmersiveLesson;
