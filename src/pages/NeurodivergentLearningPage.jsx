import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import NeurodivergentLearningSettings from "../components/NeurodivergentLearningSettings";
import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";
import {
  FaBrain,
  FaArrowLeft,
  FaInfoCircle,
  FaRegLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQuestion,
  FaTimes,
} from "react-icons/fa";

/**
 * NeurodivergentLearningPage
 *
 * A page dedicated to helping neurodivergent learners configure their learning
 * experience and understand how the platform accommodates different learning styles.
 *
 * This page includes:
 * - Information about neurodivergent learning styles
 * - Settings panel to customize learning preferences
 * - Explanations of how different features support neurodivergent needs
 * - Links to neurodivergent-friendly resources
 */
const NeurodivergentLearningPage = () => {
  const { settings } = useAccessibility();
  const { preferences, profileComplete } = useLearningPreferences();
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Container variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="neurodivergent-learning-page min-h-screen bg-gray-50 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header className="bg-indigo-700 text-white py-6 px-4 md:px-8" variants={itemVariants}>
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center text-white hover:text-indigo-100 mb-4">
            <FaArrowLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                <FaBrain className="mr-3" />
                <span>Neurodivergent Learning Preferences</span>
              </h1>
              <p className="mt-2 text-indigo-200 max-w-2xl">
                Customize your learning experience to match your unique cognitive style, sensory
                preferences, and executive function needs
              </p>
            </div>

            <button
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium"
              onClick={() => setShowInfoPanel(!showInfoPanel)}
            >
              <FaInfoCircle className="mr-2" />
              {showInfoPanel ? "Hide Information" : "About Neurodivergent Learning"}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Information */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            {/* Profile Completeness Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Status</h2>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaBrain className="text-indigo-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">Learning Preferences</h3>
                  <p className="text-sm text-gray-500">
                    {profileComplete ? "Profile is complete" : "Profile needs more information"}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Profile completeness</span>
                  <span>{profileComplete ? "100%" : "60%"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                      profileComplete ? "bg-green-500" : "bg-amber-500"
                    }`}
                    style={{ width: profileComplete ? "100%" : "60%" }}
                  ></div>
                </div>
              </div>

              {!profileComplete && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p>
                      Complete your learning preferences to get a fully personalized experience. Add
                      more details about your learning style and interests.
                    </p>
                  </div>
                </div>
              )}

              {profileComplete && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p>
                      Your learning profile is complete! Your experience will be personalized based
                      on your preferences.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Access Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access Tools</h2>

              <div className="space-y-3">
                <Link
                  to="/executive-function-demo"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaRegLightbulb className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">Executive Function Tools</h3>
                      <p className="text-sm text-gray-500">
                        Task breakdown, timers, and organization tools
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/sensory-settings"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaRegLightbulb className="text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">Sensory Settings</h3>
                      <p className="text-sm text-gray-500">
                        Visual, audio, and sensory accommodations
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/interest-profiler"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaRegLightbulb className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">Interest Profiler</h3>
                      <p className="text-sm text-gray-500">
                        Connect learning to your special interests
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Settings */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            {/* Information Panel (conditionally rendered) */}
            {showInfoPanel && (
              <motion.div
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    About Neurodivergent Learning
                  </h2>
                  <button
                    onClick={() => setShowInfoPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="prose max-w-none">
                  <p>
                    Neurodivergent learning styles encompass a range of cognitive approaches that
                    differ from traditional or "neurotypical" learning patterns. These include
                    learning differences associated with ADHD, autism spectrum, dyslexia,
                    dyscalculia, and other neurological variations.
                  </p>

                  <h3>Key Characteristics of Neurodivergent Learning:</h3>

                  <ul>
                    <li>
                      <strong>Interest-Based Learning:</strong> Many neurodivergent learners excel
                      when content connects to their areas of high interest or hyperfixation.
                    </li>
                    <li>
                      <strong>Executive Function Challenges:</strong> Difficulties with
                      organization, time management, task initiation, and working memory may require
                      additional supports.
                    </li>
                    <li>
                      <strong>Sensory Processing Differences:</strong> Sensory sensitivities can
                      affect learning environment preferences and comfort.
                    </li>
                    <li>
                      <strong>Non-Linear Thinking:</strong> Pattern recognition, big-picture
                      thinking, and creative connections often characterize neurodivergent thought
                      processes.
                    </li>
                    <li>
                      <strong>Asynchronous Development:</strong> Skills may develop unevenly, with
                      strengths in some areas and challenges in others.
                    </li>
                  </ul>

                  <p>
                    The settings on this page allow you to customize your learning environment to
                    match your unique cognitive style, providing the supports that enhance your
                    learning while minimizing barriers to engagement and comprehension.
                  </p>
                </div>

                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                  <div className="flex items-start">
                    <FaQuestion className="text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-indigo-700">
                      Still have questions about how these settings can help? Contact our support
                      team at
                      <a href="mailto:support@windgapacademy.org" className="underline ml-1">
                        support@windgapacademy.org
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Component */}
            <NeurodivergentLearningSettings />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeurodivergentLearningPage;
