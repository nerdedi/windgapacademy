import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaBrain,
  FaClock,
  FaRegLightbulb,
  FaGamepad,
  FaRegCalendarAlt,
  FaRegListAlt,
  FaRegStickyNote,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaRedo,
  FaQuestion,
} from "react-icons/fa";

import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";

/**
 * NeurodivergentLearningSettings Component
 *
 * A comprehensive settings panel for neurodivergent learners to customize their
 * learning experience based on their specific needs and preferences.
 *
 * Key features:
 * - Learning style preferences
 * - Executive function support options
 * - Sensory accommodations
 * - Interest-based learning preferences
 * - Work style accommodations
 * - Communication preferences
 */
const NeurodivergentLearningSettings = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { preferences, updatePreference, resetPreferences } = useLearningPreferences();

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    learningStyles: true,
    executiveFunction: false,
    sensory: false,
    interests: false,
    workStyle: false,
    communication: false,
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle learning style strength change
  const handleLearningStyleChange = (style, value) => {
    updatePreference(`learningStyles.${style}`, parseInt(value));
  };

  // Handle executive function preference change
  const handleExecFunctionChange = (preference, value) => {
    updatePreference(`executiveFunction.${preference}`, value);
  };

  // Handle content delivery preference change
  const handleContentDeliveryChange = (preference, value) => {
    updatePreference(`contentDelivery.${preference}`, value);
  };

  // Handle engagement pattern change
  const handleEngagementChange = (pattern, value) => {
    updatePreference(`engagementPatterns.${pattern}`, value);
  };

  // Handle accessibility setting change
  const handleAccessibilityChange = (setting, value) => {
    updateSetting(setting, value);
  };

  // Reset all settings
  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      resetSettings();
      resetPreferences();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
      className="neurodivergent-settings bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Neurodivergent Learning Settings
        </h1>
        <p className="text-gray-600">
          Customize your learning experience to match your unique learning style and needs
        </p>
      </motion.div>

      {/* Learning Styles Section */}
      <motion.div
        variants={itemVariants}
        className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
      >
        <div
          className="flex justify-between items-center p-4 bg-indigo-50 cursor-pointer"
          onClick={() => toggleSection("learningStyles")}
        >
          <div className="flex items-center">
            <FaBrain className="text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Learning Style Preferences</h2>
          </div>
          <div>{expandedSections.learningStyles ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        {expandedSections.learningStyles && (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Adjust the sliders to indicate your learning style strengths (1 = less preferred, 5 =
              highly preferred)
            </p>

            <div className="space-y-6">
              {/* Visual Learning */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700 font-medium">Visual Learning</label>
                  <span className="text-indigo-600 font-medium">
                    {preferences.learningStyles.visual}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.learningStyles.visual}
                  onChange={(e) => handleLearningStyleChange("visual", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Learning through images, diagrams, videos, and spatial relationships
                </p>
              </div>

              {/* Auditory Learning */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700 font-medium">Auditory Learning</label>
                  <span className="text-indigo-600 font-medium">
                    {preferences.learningStyles.auditory}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.learningStyles.auditory}
                  onChange={(e) => handleLearningStyleChange("auditory", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Learning through listening, discussions, and verbal explanations
                </p>
              </div>

              {/* Kinesthetic Learning */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700 font-medium">Kinesthetic Learning</label>
                  <span className="text-indigo-600 font-medium">
                    {preferences.learningStyles.kinesthetic}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.learningStyles.kinesthetic}
                  onChange={(e) => handleLearningStyleChange("kinesthetic", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Learning through hands-on activities, movement, and physical interaction
                </p>
              </div>

              {/* Reading/Writing Learning */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700 font-medium">Reading/Writing</label>
                  <span className="text-indigo-600 font-medium">
                    {preferences.learningStyles.readingWriting}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.learningStyles.readingWriting}
                  onChange={(e) => handleLearningStyleChange("readingWriting", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Learning through reading text and writing notes or summaries
                </p>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 p-3 rounded-lg">
              <h3 className="text-sm font-semibold text-indigo-700 mb-2">
                Content Delivery Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferGameBasedLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferGameBasedLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Game-Based Learning</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferInteractiveLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferInteractiveLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Interactive Activities</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferVideoLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferVideoLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Video Content</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferTextLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferTextLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Text-Based Content</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferAudioLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferAudioLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Audio Content</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.contentDelivery.preferSocialLearning}
                    onChange={(e) =>
                      handleContentDeliveryChange("preferSocialLearning", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Social/Group Learning</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Executive Function Support Section */}
      <motion.div
        variants={itemVariants}
        className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
      >
        <div
          className="flex justify-between items-center p-4 bg-indigo-50 cursor-pointer"
          onClick={() => toggleSection("executiveFunction")}
        >
          <div className="flex items-center">
            <FaRegListAlt className="text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Executive Function Support</h2>
          </div>
          <div>{expandedSections.executiveFunction ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        {expandedSections.executiveFunction && (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Select the executive function supports that help you stay organized and complete tasks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={preferences.executiveFunction.needsTaskBreakdown}
                  onChange={(e) => handleExecFunctionChange("needsTaskBreakdown", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Task Breakdown</span>
                  <span className="block text-xs text-gray-500">
                    Break complex tasks into smaller, manageable steps
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={preferences.executiveFunction.needsTimeManagement}
                  onChange={(e) =>
                    handleExecFunctionChange("needsTimeManagement", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Time Management</span>
                  <span className="block text-xs text-gray-500">
                    Timers, reminders, and focus/break scheduling
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={preferences.executiveFunction.needsOrganizationalSupport}
                  onChange={(e) =>
                    handleExecFunctionChange("needsOrganizationalSupport", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Organizational Support</span>
                  <span className="block text-xs text-gray-500">
                    Checklists, organizers, and progress tracking
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={preferences.executiveFunction.needsStarterTemplates}
                  onChange={(e) =>
                    handleExecFunctionChange("needsStarterTemplates", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Starter Templates</span>
                  <span className="block text-xs text-gray-500">
                    Templates and prompts to help with task initiation
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={preferences.executiveFunction.needsVisualSchedules}
                  onChange={(e) =>
                    handleExecFunctionChange("needsVisualSchedules", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Visual Schedules</span>
                  <span className="block text-xs text-gray-500">
                    Visual representation of tasks and schedules
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.provideMemorySupports}
                  onChange={(e) =>
                    handleAccessibilityChange("provideMemorySupports", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Working Memory Support</span>
                  <span className="block text-xs text-gray-500">
                    Visual reminders and reference guides
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <label className="text-gray-700 font-medium">Attention Span</label>
                <span className="text-indigo-600 font-medium capitalize">
                  {preferences.engagementPatterns.attentionSpan}
                </span>
              </div>
              <select
                value={preferences.engagementPatterns.attentionSpan}
                onChange={(e) => handleEngagementChange("attentionSpan", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="short">Short (frequent breaks needed)</option>
                <option value="moderate">Moderate (occasional breaks)</option>
                <option value="long">Long (can focus for extended periods)</option>
                <option value="variable">Variable (depends on interest level)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This helps us adjust content length and break frequency
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <label className="text-gray-700 font-medium">Preferred Session Duration</label>
                <span className="text-indigo-600 font-medium">
                  {preferences.engagementPatterns.preferredSessionDuration} minutes
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={preferences.engagementPatterns.preferredSessionDuration}
                onChange={(e) =>
                  handleEngagementChange("preferredSessionDuration", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ideal length of focused learning sessions before taking a break
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sensory Accommodations Section */}
      <motion.div
        variants={itemVariants}
        className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
      >
        <div
          className="flex justify-between items-center p-4 bg-indigo-50 cursor-pointer"
          onClick={() => toggleSection("sensory")}
        >
          <div className="flex items-center">
            <FaRegLightbulb className="text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Sensory Accommodations</h2>
          </div>
          <div>{expandedSections.sensory ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        {expandedSections.sensory && (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Adjust the visual and sensory aspects of your learning environment
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.reduceBrightness}
                  onChange={(e) => handleAccessibilityChange("reduceBrightness", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Reduce Brightness</span>
                  <span className="block text-xs text-gray-500">
                    Lower screen brightness and contrast
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => handleAccessibilityChange("reduceMotion", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Reduce Motion</span>
                  <span className="block text-xs text-gray-500">
                    Minimize animations and movement
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.allowAudioControl}
                  onChange={(e) => handleAccessibilityChange("allowAudioControl", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Audio Controls</span>
                  <span className="block text-xs text-gray-500">
                    Control volume and audio settings for media
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.reduceVisualClutter}
                  onChange={(e) =>
                    handleAccessibilityChange("reduceVisualClutter", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Reduce Visual Clutter</span>
                  <span className="block text-xs text-gray-500">
                    Simplified, clean interface with fewer distractions
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.provideStimBreaks}
                  onChange={(e) => handleAccessibilityChange("provideStimBreaks", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Stimming Breaks</span>
                  <span className="block text-xs text-gray-500">
                    Scheduled breaks for self-regulation
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.allowHyperfocusMode}
                  onChange={(e) =>
                    handleAccessibilityChange("allowHyperfocusMode", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Hyperfocus Mode</span>
                  <span className="block text-xs text-gray-500">
                    Distraction-free environment for deep focus
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <label className="text-gray-700 font-medium">Visual Mode</label>
              </div>
              <select
                value={settings.visualMode}
                onChange={(e) => handleAccessibilityChange("visualMode", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="standard">Standard</option>
                <option value="high-contrast">High Contrast</option>
                <option value="reduced-colors">Reduced Colors</option>
                <option value="dyslexia-friendly">Dyslexia Friendly</option>
                <option value="autism-friendly">Autism Friendly</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Adjusts color schemes and visual presentation
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <label className="text-gray-700 font-medium">Font Type</label>
              </div>
              <select
                value={settings.fontType}
                onChange={(e) => handleAccessibilityChange("fontType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="default">Default</option>
                <option value="open-dyslexic">OpenDyslexic</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Font choice can improve readability</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Interest-Based Learning Section */}
      <motion.div
        variants={itemVariants}
        className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
      >
        <div
          className="flex justify-between items-center p-4 bg-indigo-50 cursor-pointer"
          onClick={() => toggleSection("interests")}
        >
          <div className="flex items-center">
            <FaGamepad className="text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Interest-Based Learning</h2>
          </div>
          <div>{expandedSections.interests ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>

        {expandedSections.interests && (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Configure how your interests can be integrated into learning materials
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.allowInterestConnections}
                  onChange={(e) =>
                    handleAccessibilityChange("allowInterestConnections", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Connect to Interests</span>
                  <span className="block text-xs text-gray-500">
                    Link learning materials to your special interests
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.gamifyContent}
                  onChange={(e) => handleAccessibilityChange("gamifyContent", e.target.checked)}
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Gamify Content</span>
                  <span className="block text-xs text-gray-500">
                    Add game mechanics and elements to learning
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.showRealWorldApplications}
                  onChange={(e) =>
                    handleAccessibilityChange("showRealWorldApplications", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Real-World Applications</span>
                  <span className="block text-xs text-gray-500">
                    Show how content applies to real-life situations
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.allowPersonalization}
                  onChange={(e) =>
                    handleAccessibilityChange("allowPersonalization", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Personalize Examples</span>
                  <span className="block text-xs text-gray-500">
                    Customize examples based on your interests
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.useSpecialInterests}
                  onChange={(e) =>
                    handleAccessibilityChange("useSpecialInterests", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">
                    Special Interest Integration
                  </span>
                  <span className="block text-xs text-gray-500">
                    Incorporate special interests into content
                  </span>
                </div>
              </label>

              <label className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.celebrateSmallWins}
                  onChange={(e) =>
                    handleAccessibilityChange("celebrateSmallWins", e.target.checked)
                  }
                  className="h-4 w-4 accent-indigo-600 mt-1"
                />
                <div className="ml-3">
                  <span className="block text-gray-700 font-medium">Celebrate Small Wins</span>
                  <span className="block text-xs text-gray-500">
                    Acknowledge and celebrate progress along the way
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <label className="text-gray-700 font-medium">Preferred Reward Type</label>
              </div>
              <select
                value={preferences.engagementPatterns.preferredRewardType}
                onChange={(e) => handleEngagementChange("preferredRewardType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="achievement">Achievements</option>
                <option value="points">Points</option>
                <option value="badges">Badges</option>
                <option value="social">Social Recognition</option>
                <option value="content">Content Unlocks</option>
                <option value="none">No Rewards Needed</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                What type of rewards most motivate you to continue learning
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Save and Reset Buttons */}
      <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleResetAll}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <FaRedo className="mr-2" />
          Reset All
        </button>

        <button className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <FaSave className="mr-2" />
          Save Preferences
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
      >
        <div className="flex items-start">
          <FaQuestion className="text-blue-600 mt-1 mr-3" />
          <div>
            <h3 className="text-blue-800 font-medium">Why these settings matter</h3>
            <p className="text-sm text-blue-700 mt-1">
              These settings help customize your learning experience to match your neurodivergent
              learning style. Research shows that personalized learning environments can
              significantly improve engagement, retention, and overall learning outcomes for
              neurodivergent learners.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NeurodivergentLearningSettings;
