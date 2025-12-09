import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft as ChevronLeft,
  FaChevronRight as ChevronRight,
  FaExpand as Maximize2,
  FaCompress as Minimize2,
} from "react-icons/fa";

import WebGLEffects from "../utils/WebGLEffects";

import VirtualCharacters from "./VirtualCharacters";

/**
 * LearningEnvironment Component
 *
 * A complete learning environment that integrates:
 * 1. Three.js 3D characters (replacing Unity)
 * 2. Interactive lesson content
 * 3. WebGL effects
 * 4. CSS animations
 */
const LearningEnvironment = ({
  lessonId,
  title = "Interactive Lesson",
  description = "Explore concepts with our virtual academy characters",
  characters = ["winnie"],
  environment = "classroom",
  content = [],
  onComplete,
  onProgress,
}) => {
  // Component state
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [characterMessages, setCharacterMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  // References
  const containerRef = useRef(null);
  const charactersRef = useRef(null);
  const effectsRef = useRef({});

  // Parse and prepare lesson content
  const lessonContent =
    content.length > 0
      ? content
      : [
          {
            id: "intro",
            title: "Welcome to the Lesson",
            content: "This is an interactive lesson with 3D characters.",
            characterAnimation: { character: "winnie", animation: "teaching" },
          },
          {
            id: "step1",
            title: "Learning Concept 1",
            content: "Let&apos;s explore the first concept together.",
            characterAnimation: { character: "winnie", animation: "teaching" },
          },
          {
            id: "step2",
            title: "Interactive Example",
            content: "Try this interactive example to understand better.",
            interactive: true,
            interactiveComponent: "SimpleQuiz",
            characterAnimation: { character: "winnie", animation: "encourage" },
          },
          {
            id: "conclusion",
            title: "Great Job!",
            content: "You&apos;ve completed this lesson successfully.",
            characterAnimation: { character: "winnie", animation: "celebrate" },
          },
        ];

  // Get current lesson step
  const currentContent = lessonContent[currentStep] || lessonContent[0];

  // Handle character messages
  const handleCharacterMessage = (message) => {
    setCharacterMessages((prev) => [...prev, { text: message, timestamp: Date.now() }]);
  };

  // Navigate through lesson steps
  const goToNextStep = () => {
    if (currentStep < lessonContent.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      // Apply transition effect
      applyStepTransitionEffect();

      // Navigate to next step
      setCurrentStep(currentStep + 1);

      // Report progress
      if (onProgress) {
        onProgress({
          lessonId,
          currentStep: currentStep + 1,
          totalSteps: lessonContent.length,
          percentComplete: ((currentStep + 1) / lessonContent.length) * 100,
        });
      }
    } else {
      // Complete the lesson
      if (onComplete) {
        onComplete({
          lessonId,
          completed: true,
          score: (completedSteps.length / lessonContent.length) * 100,
        });
      }

      // Show celebration effects
      showCelebrationEffects();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // Apply transition effect
      applyStepTransitionEffect();

      // Navigate to previous step
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Apply animations and effects when step changes
  useEffect(() => {
    if (currentContent?.characterAnimation) {
      const { character, animation } = currentContent.characterAnimation;

      // Delay animation slightly to sync with content transition
      setTimeout(() => {
        if (charactersRef.current) {
          charactersRef.current.playAnimation(character, animation);
        }
      }, 500);
    }

    // Apply step-specific effects
    applyStepEffects(currentContent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Apply visual effects for step transition
  const applyStepTransitionEffect = () => {
    // Create container for transition effect
    const effectsContainer = document.createElement("div");
    effectsContainer.id = `transition-effect-${Date.now()}`;
    effectsContainer.style.position = "absolute";
    effectsContainer.style.top = "0";
    effectsContainer.style.left = "0";
    effectsContainer.style.width = "100%";
    effectsContainer.style.height = "100%";
    effectsContainer.style.pointerEvents = "none";
    effectsContainer.style.zIndex = "10";

    if (containerRef.current) {
      containerRef.current.appendChild(effectsContainer);

      // Apply ripple effect
      const rippleEffect = WebGLEffects.createWaterRipple(effectsContainer.id, {
        color: 0x3b82f6,
        rippleSpeed: 0.03,
        duration: 1.5,
      });

      // Store effect reference for cleanup
      effectsRef.current.transition = rippleEffect;

      // Clean up effect container after animation
      setTimeout(() => {
        if (containerRef.current && containerRef.current.contains(effectsContainer)) {
          containerRef.current.removeChild(effectsContainer);
          delete effectsRef.current.transition;
        }
      }, 1600);
    }
  };

  // Apply step-specific visual effects
  const applyStepEffects = (step) => {
    if (!step || !containerRef.current) return;

    // Clean up any existing step effects
    if (effectsRef.current.step) {
      effectsRef.current.step.cleanup();
      delete effectsRef.current.step;
    }

    // Create effects based on step type
    if (step.interactive) {
      // Interactive steps get a subtle glow effect
      const effectsContainer = document.createElement("div");
      effectsContainer.id = `step-effect-${Date.now()}`;
      effectsContainer.style.position = "absolute";
      effectsContainer.style.top = "0";
      effectsContainer.style.left = "0";
      effectsContainer.style.width = "100%";
      effectsContainer.style.height = "100%";
      effectsContainer.style.pointerEvents = "none";
      effectsContainer.style.zIndex = "1";

      containerRef.current.appendChild(effectsContainer);

      // Apply glow effect to interactive content
      setTimeout(() => {
        const interactiveElement = containerRef.current.querySelector(".interactive-content");
        if (interactiveElement) {
          const glowEffect = WebGLEffects.createGlowEffect(
            interactiveElement.id || effectsContainer.id,
            {
              color: "#6366f1",
              intensity: 0.3,
              pulseSpeed: 1,
              duration: -1, // Permanent until cleaned up
            },
          );

          // Store effect reference for cleanup
          effectsRef.current.step = glowEffect;
        }
      }, 500);
    }
  };

  // Show celebration effects when lesson completes
  const showCelebrationEffects = () => {
    if (!containerRef.current) return;

    // Create container for celebration effects
    const effectsContainer = document.createElement("div");
    effectsContainer.id = `celebration-effect-${Date.now()}`;
    effectsContainer.style.position = "absolute";
    effectsContainer.style.top = "0";
    effectsContainer.style.left = "0";
    effectsContainer.style.width = "100%";
    effectsContainer.style.height = "100%";
    effectsContainer.style.pointerEvents = "none";
    effectsContainer.style.zIndex = "20";

    containerRef.current.appendChild(effectsContainer);

    // Apply confetti particle effect
    const confettiEffect = WebGLEffects.initParticleSystem(effectsContainer.id, {
      particleCount: 400,
      particleSize: 0.15,
      particleColors: [0xff9933, 0x66cc66, 0x6699ff, 0xffcc00, 0xff6666, 0xff33cc],
      speed: 0.03,
      spread: 200,
      animationDuration: 5,
    });

    // Store effect reference for cleanup
    effectsRef.current.celebration = confettiEffect;

    // Trigger character celebration animations
    if (charactersRef.current) {
      characters.forEach((character) => {
        charactersRef.current.playAnimation(character, "celebrate");
      });
    }

    // Clean up effect container after animation
    setTimeout(() => {
      if (containerRef.current && containerRef.current.contains(effectsContainer)) {
        containerRef.current.removeChild(effectsContainer);
        delete effectsRef.current.celebration;
      }
    }, 5100);
  };

  // Cleanup effects on unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining effects
      Object.values(effectsRef.current).forEach((effect) => {
        if (effect && typeof effect.cleanup === "function") {
          effect.cleanup();
        }
      });
    };
  }, []);

  // Render the interactive component based on type
  const renderInteractiveComponent = (type) => {
    switch (type) {
      case "SimpleQuiz":
        return (
          <div id="simple-quiz" className="interactive-component">
            <h3>Quick Quiz</h3>
            <div className="quiz-question">
              <p>Which of the following is true about WebGL?</p>
              <div className="quiz-options">
                <button className="quiz-option correct" onClick={() => handleQuizAnswer(true)}>
                  It&apos;s a JavaScript API for rendering graphics
                </button>
                <button className="quiz-option" onClick={() => handleQuizAnswer(false)}>
                  It&apos;s a server-side rendering technology
                </button>
                <button className="quiz-option" onClick={() => handleQuizAnswer(false)}>
                  It requires Unity to function
                </button>
              </div>
            </div>
          </div>
        );

      case "DragAndDrop":
        return (
          <div id="drag-drop" className="interactive-component">
            <h3>Arrange in Order</h3>
            <p>Drag the items into the correct sequence</p>
            <div className="drag-items">
              {/* Simplified drag and drop for illustration */}
              <div className="drag-item">Initialize Three.js Scene</div>
              <div className="drag-item">Load 3D Models</div>
              <div className="drag-item">Add Lighting</div>
              <div className="drag-item">Set Up Animation Loop</div>
            </div>
          </div>
        );

      default:
        return (
          <div id="default-interactive" className="interactive-component">
            <h3>Interactive Element</h3>
            <p>This is a placeholder for an interactive component.</p>
            <button className="action-button" onClick={goToNextStep}>
              Continue
            </button>
          </div>
        );
    }
  };

  // Handle quiz answers
  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) {
      // Show success effect
      if (charactersRef.current) {
        characters.forEach((character) => {
          charactersRef.current.playAnimation(character, "celebrate");
        });
      }

      // Add success message
      setCharacterMessages((prev) => [
        ...prev,
        { text: "That&apos;s correct! Great job!", timestamp: Date.now() },
      ]);

      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      // Continue to next step after delay
      setTimeout(goToNextStep, 2000);
    } else {
      // Show encouraging message
      if (charactersRef.current) {
        characters.forEach((character) => {
          charactersRef.current.playAnimation(character, "encourage");
        });
      }

      // Add encouragement message
      setCharacterMessages((prev) => [
        ...prev,
        { text: "Not quite right. Try again!", timestamp: Date.now() },
      ]);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / lessonContent.length) * 100;

  return (
    <div ref={containerRef} className={`learning-environment ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Header section */}
      <div className="learning-header">
        <h2>{title}</h2>
        <div className="controls">
          <button className="fullscreen-button" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
      </div>

      {/* Main content area */}
      <div className="learning-content">
        {/* 3D character area */}
        <div className="character-view">
          <VirtualCharacters
            ref={charactersRef}
            containerId={`characters-${lessonId}`}
            selectedCharacters={characters}
            environment={environment}
            onMessage={handleCharacterMessage}
            height="100%"
            interactionEnabled={false}
          />
        </div>

        {/* Lesson content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStep}`}
            className="lesson-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{currentContent.title}</h3>
            <div className="content-text">
              <p>{currentContent.content}</p>
            </div>

            {/* Interactive content if present */}
            {currentContent.interactive && (
              <div id={`interactive-${currentStep}`} className="interactive-content">
                {renderInteractiveComponent(currentContent.interactiveComponent)}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="navigation-buttons">
              <button
                className="nav-button prev"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {!currentContent.interactive && (
                <button
                  className="nav-button next"
                  onClick={goToNextStep}
                  disabled={
                    currentStep === lessonContent.length - 1 && completedSteps.includes(currentStep)
                  }
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Character messages area */}
      <div className="character-messages">
        <AnimatePresence>
          {characterMessages.slice(-3).map((msg, index) => (
            <motion.div
              key={`msg-${msg.timestamp}`}
              className="character-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearningEnvironment;
