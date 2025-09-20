import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLearningPreferences } from "../context/LearningPreferencesContext";
import { FaPlus, FaTimes, FaStar, FaRegStar, FaArrowRight, FaCheck } from "react-icons/fa";

/**
 * NeuroInterestProfiler Component
 *
 * This component helps identify and track learner interests, preferences, and engagement patterns,
 * specifically designed for neurodivergent learners who may have stronger learning outcomes
 * when content connects to their interests or areas of hyperfixation.
 */
const NeuroInterestProfiler = ({ onComplete }) => {
  const {
    preferences,
    updatePreference,
    addInterestArea,
    removeInterestArea,
    addSpecialInterest,
    removeSpecialInterest,
  } = useLearningPreferences();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [newInterest, setNewInterest] = useState("");
  const [newSpecialInterest, setNewSpecialInterest] = useState("");
  const [learningStrengths, setLearningStrengths] = useState({
    visual: preferences.learningStyles.visual,
    auditory: preferences.learningStyles.auditory,
    kinesthetic: preferences.learningStyles.kinesthetic,
    readingWriting: preferences.learningStyles.readingWriting,
  });
  const [contentPreferences, setContentPreferences] = useState({
    preferGameBasedLearning: preferences.contentDelivery.preferGameBasedLearning,
    preferInteractiveLearning: preferences.contentDelivery.preferInteractiveLearning,
    preferVideoLearning: preferences.contentDelivery.preferVideoLearning,
    preferTextLearning: preferences.contentDelivery.preferTextLearning,
    preferAudioLearning: preferences.contentDelivery.preferAudioLearning,
    preferSocialLearning: preferences.contentDelivery.preferSocialLearning,
  });
  const [executiveFunctionNeeds, setExecutiveFunctionNeeds] = useState({
    needsTaskBreakdown: preferences.executiveFunction.needsTaskBreakdown,
    needsTimeManagement: preferences.executiveFunction.needsTimeManagement,
    needsOrganizationalSupport: preferences.executiveFunction.needsOrganizationalSupport,
    needsStarterTemplates: preferences.executiveFunction.needsStarterTemplates,
    needsVisualSchedules: preferences.executiveFunction.needsVisualSchedules,
  });

  // Common interest areas for suggestions
  const interestSuggestions = [
    "Technology",
    "Science",
    "History",
    "Music",
    "Art",
    "Animals",
    "Space",
    "Gaming",
    "Sports",
    "Literature",
    "Mathematics",
    "Engineering",
    "Nature",
    "Cooking",
    "Fashion",
    "Movies",
    "Travel",
    "Photography",
    "Psychology",
    "Architecture",
  ];

  // Common areas of hyperfixation/special interests
  const specialInterestSuggestions = [
    "Computer Programming",
    "Dinosaurs",
    "Astronomy",
    "Transportation Systems",
    "Video Game Design",
    "Mythology",
    "Marine Biology",
    "Statistics",
    "Collectibles",
    "Musical Instruments",
    "Comics/Manga",
    "Historical Periods",
    "Physics",
    "Language Learning",
    "Chess/Strategy Games",
    "Crafting",
    "Specific Book/Movie Series",
    "Geography",
    "Weather Patterns",
    "Robotics",
  ];

  // Handle form submission for each step
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Save learning strengths
      Object.entries(learningStrengths).forEach(([key, value]) => {
        updatePreference(`learningStyles.${key}`, value);
      });
    } else if (currentStep === 2) {
      // Save content delivery preferences
      Object.entries(contentPreferences).forEach(([key, value]) => {
        updatePreference(`contentDelivery.${key}`, value);
      });
    } else if (currentStep === 3) {
      // Save executive function needs
      Object.entries(executiveFunctionNeeds).forEach(([key, value]) => {
        updatePreference(`executiveFunction.${key}`, value);
      });
    } else if (currentStep === 4) {
      // Final step, call completion handler if provided
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  // Handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !preferences.interestAreas.includes(newInterest.trim())) {
      addInterestArea(newInterest.trim());
      setNewInterest("");
    }
  };

  // Handle adding a suggested interest
  const handleAddSuggestedInterest = (interest) => {
    if (!preferences.interestAreas.includes(interest)) {
      addInterestArea(interest);
    }
  };

  // Handle adding a new special interest
  const handleAddSpecialInterest = () => {
    if (
      newSpecialInterest.trim() &&
      !preferences.specialInterests.includes(newSpecialInterest.trim())
    ) {
      addSpecialInterest(newSpecialInterest.trim());
      setNewSpecialInterest("");
    }
  };

  // Handle adding a suggested special interest
  const handleAddSuggestedSpecialInterest = (interest) => {
    if (!preferences.specialInterests.includes(interest)) {
      addSpecialInterest(interest);
    }
  };

  // Update learning strength
  const handleStrengthChange = (type, value) => {
    setLearningStrengths((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Toggle content preference
  const handleContentPreferenceChange = (preference) => {
    setContentPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  // Toggle executive function need
  const handleExecutiveFunctionChange = (need) => {
    setExecutiveFunctionNeeds((prev) => ({
      ...prev,
      [need]: !prev[need],
    }));
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0 },
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Render a star rating system
  const renderStarRating = (type, value) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={`${type}-${star}`}
            onClick={() => handleStrengthChange(type, star)}
            className="text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label={`Rate ${type} strength as ${star} out of 5`}
          >
            {star <= value ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Preferences Profile</h2>

      {/* Progress Indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step 1: Learning Style Strengths */}
      {currentStep === 1 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold text-gray-700">
            How do you learn best?
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-600 mb-4">
            Rate your learning strengths from 1 (not strong) to 5 (very strong).
          </motion.p>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium text-gray-800">Visual Learning</h4>
                <p className="text-sm text-gray-500">
                  Learning through images, videos, and diagrams
                </p>
              </div>
              {renderStarRating("visual", learningStrengths.visual)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium text-gray-800">Auditory Learning</h4>
                <p className="text-sm text-gray-500">Learning through listening and discussion</p>
              </div>
              {renderStarRating("auditory", learningStrengths.auditory)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium text-gray-800">Kinesthetic Learning</h4>
                <p className="text-sm text-gray-500">
                  Learning through hands-on activities and movement
                </p>
              </div>
              {renderStarRating("kinesthetic", learningStrengths.kinesthetic)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium text-gray-800">Reading/Writing</h4>
                <p className="text-sm text-gray-500">Learning through reading and writing text</p>
              </div>
              {renderStarRating("readingWriting", learningStrengths.readingWriting)}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Step 2: Content Delivery Preferences */}
      {currentStep === 2 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold text-gray-700">
            How would you like content presented?
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-600 mb-4">
            Select the ways you prefer to engage with learning materials.
          </motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferGameBasedLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferGameBasedLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferGameBasedLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferGameBasedLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Game-Based Learning</h4>
                  <p className="text-sm text-gray-500">Learning through games and challenges</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferInteractiveLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferInteractiveLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferInteractiveLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferInteractiveLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Interactive Learning</h4>
                  <p className="text-sm text-gray-500">Learning through interactive activities</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferVideoLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferVideoLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferVideoLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferVideoLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Video Learning</h4>
                  <p className="text-sm text-gray-500">
                    Learning through videos and demonstrations
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferTextLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferTextLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferTextLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferTextLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Text-Based Learning</h4>
                  <p className="text-sm text-gray-500">Learning through reading and writing</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferAudioLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferAudioLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferAudioLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferAudioLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Audio Learning</h4>
                  <p className="text-sm text-gray-500">
                    Learning through podcasts and audio content
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                contentPreferences.preferSocialLearning
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleContentPreferenceChange("preferSocialLearning")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    contentPreferences.preferSocialLearning
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {contentPreferences.preferSocialLearning && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Social Learning</h4>
                  <p className="text-sm text-gray-500">
                    Learning through discussion and group work
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Step 3: Executive Function Support */}
      {currentStep === 3 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold text-gray-700">
            What support would help your learning?
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-600 mb-4">
            Select the tools and supports that would help you succeed.
          </motion.p>

          <motion.div variants={itemVariants} className="space-y-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                executiveFunctionNeeds.needsTaskBreakdown
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleExecutiveFunctionChange("needsTaskBreakdown")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    executiveFunctionNeeds.needsTaskBreakdown
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {executiveFunctionNeeds.needsTaskBreakdown && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Task Breakdown</h4>
                  <p className="text-sm text-gray-500">
                    Breaking complex tasks into smaller, manageable steps
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                executiveFunctionNeeds.needsTimeManagement
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleExecutiveFunctionChange("needsTimeManagement")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    executiveFunctionNeeds.needsTimeManagement
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {executiveFunctionNeeds.needsTimeManagement && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Time Management</h4>
                  <p className="text-sm text-gray-500">Tools to help manage time and deadlines</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                executiveFunctionNeeds.needsOrganizationalSupport
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleExecutiveFunctionChange("needsOrganizationalSupport")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    executiveFunctionNeeds.needsOrganizationalSupport
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {executiveFunctionNeeds.needsOrganizationalSupport && (
                    <FaCheck className="text-xs" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Organizational Support</h4>
                  <p className="text-sm text-gray-500">Help organizing information and materials</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                executiveFunctionNeeds.needsStarterTemplates
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleExecutiveFunctionChange("needsStarterTemplates")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    executiveFunctionNeeds.needsStarterTemplates
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {executiveFunctionNeeds.needsStarterTemplates && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Starter Templates</h4>
                  <p className="text-sm text-gray-500">
                    Templates to help get started on assignments
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                executiveFunctionNeeds.needsVisualSchedules
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleExecutiveFunctionChange("needsVisualSchedules")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    executiveFunctionNeeds.needsVisualSchedules
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {executiveFunctionNeeds.needsVisualSchedules && <FaCheck className="text-xs" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Visual Schedules</h4>
                  <p className="text-sm text-gray-500">
                    Visual representations of schedules and routines
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Step 4: Interests & Special Interests */}
      {currentStep === 4 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold text-gray-700">
            What are your interests?
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-600 mb-4">
            Add your interests and special interests/areas of expertise to personalize your
            learning.
          </motion.p>

          {/* General interests */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-medium text-gray-800">General Interests</h4>
            <p className="text-sm text-gray-500">
              Topics you enjoy learning about or find engaging.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {preferences.interestAreas.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => removeInterestArea(interest)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label={`Remove ${interest} interest`}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddInterest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Add interest"
              >
                <FaPlus />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {interestSuggestions.slice(0, 10).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleAddSuggestedInterest(suggestion)}
                    disabled={preferences.interestAreas.includes(suggestion)}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      preferences.interestAreas.includes(suggestion)
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : "border-blue-300 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Special interests / areas of expertise */}
          <motion.div variants={itemVariants} className="space-y-4 mt-8">
            <h4 className="font-medium text-gray-800">Special Interests or Areas of Expertise</h4>
            <p className="text-sm text-gray-500">
              Topics you're especially passionate about or have deep knowledge in.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {preferences.specialInterests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => removeSpecialInterest(interest)}
                    className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                    aria-label={`Remove ${interest} special interest`}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newSpecialInterest}
                onChange={(e) => setNewSpecialInterest(e.target.value)}
                placeholder="Add a special interest..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleAddSpecialInterest}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                aria-label="Add special interest"
              >
                <FaPlus />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {specialInterestSuggestions.slice(0, 10).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleAddSuggestedSpecialInterest(suggestion)}
                    disabled={preferences.specialInterests.includes(suggestion)}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      preferences.specialInterests.includes(suggestion)
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : "border-purple-300 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
        )}
        {currentStep === 1 && <div></div>}

        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
        >
          {currentStep < 4 ? (
            <>
              Next <FaArrowRight className="ml-2" />
            </>
          ) : (
            "Complete Profile"
          )}
        </button>
      </div>
    </div>
  );
};

export default NeuroInterestProfiler;
