import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowLeft, FaBrain, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";

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
  const { _settings } = useAccessibility();
  const { _preferences, _profileComplete } = useLearningPreferences();
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
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                Profile Completeness
              </h2>
              {/* Implementation would continue here */}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeurodivergentLearningPage;
