import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaList,
  FaInfoCircle,
  FaRegLightbulb,
  FaRegClock,
  FaCheckSquare,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAccessibility } from "../context/AccessibilityContext";

/**
 * NeuroLessonContainer - A wrapper component for lesson modules that adds neurodiversity accommodations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The lesson content
 * @param {string} props.title - The title of the lesson
 * @param {string} props.description - A description of the lesson
 * @param {number} props.estimatedTime - Estimated time to complete in minutes
 * @param {Array} props.objectives - Array of learning objectives
 * @param {Array} props.steps - Array of lesson steps
 * @param {string} props.nextLessonPath - Path to the next lesson (optional)
 * @param {string} props.backPath - Path to go back to (default: "/dashboard")
 */
function NeuroLessonContainer({
  children,
  title,
  description,
  estimatedTime = 30,
  objectives = [],
  steps = [],
  nextLessonPath,
  backPath = "/dashboard",
}) {
  const navigate = useNavigate();
  const { settings } = useAccessibility();

  const [showPreview, setShowPreview] = useState(settings.showLessonPreviews);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showStructure, setShowStructure] = useState(false);

  // Only show one step at a time if that setting is enabled
  const showStepByStep = settings.showOneStepAtATime;

  // Mark step as completed
  const completeStep = (index) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  // Go to next step
  const nextStep = () => {
    completeStep(currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when switching steps
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when switching steps
      window.scrollTo(0, 0);
    }
  };

  // Start the lesson
  const startLesson = () => {
    setShowPreview(false);
  };

  // Reset preview state if settings change
  useEffect(() => {
    setShowPreview(settings.showLessonPreviews);
  }, [settings.showLessonPreviews]);

  // Lesson preview screen
  const renderPreview = () => (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-600" /> About This Lesson
            </h2>
            <p className="text-gray-700">{description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <FaRegClock className="mr-2 text-blue-600" /> Estimated Time
            </h2>
            <p className="text-gray-700">{estimatedTime} minutes</p>
          </div>

          {objectives.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaRegLightbulb className="mr-2 text-blue-600" /> Learning Objectives
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {steps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaList className="mr-2 text-blue-600" /> Lesson Structure
              </h2>
              <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                {steps.map((step, index) => (
                  <li key={index}>{step.title}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              onClick={startLesson}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Start Lesson
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Lesson structure sidebar
  const renderStructureSidebar = () => (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 ${showStructure ? "translate-x-0" : "translate-x-full"} w-80`}
    >
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="font-semibold">Lesson Structure</h3>
        <button onClick={() => setShowStructure(false)} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FaRegClock className="mr-2 text-blue-600" />
            <span className="text-sm text-gray-600">Estimated time: {estimatedTime} minutes</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (completedSteps.length / steps.length) * 100)}%` }}
            ></div>
          </div>
        </div>

        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg border ${
                currentStep === index
                  ? "border-blue-600 bg-blue-50"
                  : completedSteps.includes(index)
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
              }`}
            >
              <button
                onClick={() => {
                  if (!showStepByStep || completedSteps.includes(index - 1) || index === 0) {
                    setCurrentStep(index);
                    setShowStructure(false);
                  }
                }}
                disabled={showStepByStep && !completedSteps.includes(index - 1) && index !== 0}
                className="w-full text-left flex items-center"
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    completedSteps.includes(index)
                      ? "bg-green-600 text-white"
                      : currentStep === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <FaCheckSquare className="text-xs" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`${
                    completedSteps.includes(index)
                      ? "text-green-700"
                      : currentStep === index
                        ? "text-blue-700 font-medium"
                        : "text-gray-700"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  // Step by step navigation
  const renderStepNavigation = () => (
    <div className="bg-white border-t py-4 px-6 flex justify-between items-center">
      <button
        onClick={prevStep}
        disabled={currentStep === 0}
        className={`px-4 py-2 rounded-lg flex items-center ${
          currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <FaArrowLeft className="mr-2" /> Previous
      </button>

      <div className="text-gray-600 text-sm">
        Step {currentStep + 1} of {steps.length}
      </div>

      <button
        onClick={nextStep}
        disabled={currentStep === steps.length - 1}
        className={`px-4 py-2 rounded-lg ${
          currentStep === steps.length - 1
            ? "text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Next
      </button>
    </div>
  );

  // Render the main content
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(backPath)}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h1 className="text-xl font-bold text-center">{title}</h1>

          <button
            onClick={() => setShowStructure(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaList className="mr-2" /> Structure
          </button>
        </div>
      </nav>

      {/* Lesson content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {showPreview ? (
          renderPreview()
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Step content */}
            {showStepByStep ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: settings.reduceMotion ? 0.1 : 0.3 }}
                  className="p-6"
                >
                  <h2 className="text-2xl font-bold mb-4">{steps[currentStep]?.title}</h2>
                  {React.Children.toArray(children)[currentStep]}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="p-6">
                {React.Children.map(children, (child, index) => (
                  <div
                    id={`step-${index}`}
                    className="mb-12 pb-12 border-b border-gray-200 last:border-0"
                  >
                    <h2 className="text-2xl font-bold mb-4">{steps[index]?.title}</h2>
                    {child}
                    {index < steps.length - 1 && (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => {
                            completeStep(index);
                            document
                              .getElementById(`step-${index + 1}`)
                              .scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Continue to Next Step
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step navigation - only show in step-by-step mode */}
            {showStepByStep && renderStepNavigation()}
          </div>
        )}
      </main>

      {/* Structure sidebar */}
      {renderStructureSidebar()}
    </div>
  );
}

export default NeuroLessonContainer;
