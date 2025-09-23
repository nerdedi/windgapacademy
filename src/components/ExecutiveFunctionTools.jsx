import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaClock, FaList } from "react-icons/fa";

import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";

/**
 * ExecutiveFunctionTools Component
 *
 * A collection of tools designed to support executive function needs for neurodivergent learners:
 * - TaskBreakdown: Visual breakdown of complex tasks into smaller steps
 * - PomodoroTimer: Time management with focus/break periods
 * - VisualSchedule: Visual representation of daily/weekly schedule
 * - StartingStrategies: Templates and prompts to overcome initiation difficulties
 * - WorkingMemorySupport: Visual reminders and notes to support working memory
 */

// Shared animations
const _containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

// Shared animations for items
const _itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: { opacity: 0, y: -20 },
};

/**
 * TaskBreakdown Component
 *
 * Breaks down complex tasks into manageable steps with visual progress tracking.
 * Designed to support executive function difficulties with task initiation and completion.
 */
export const TaskBreakdown = ({
  taskTitle = "Complete Task",
  steps = [],
  onComplete = () => {},
  estimatedTime = 30, // minutes
}) => {
  const { settings } = useAccessibility();
  const { preferences: _preferences } = useLearningPreferences();

  const [taskSteps, setTaskSteps] = useState(
    steps.map((step) => ({
      id: step.id || Math.random().toString(36).substring(2, 9),
      text: step.text || step,
      completed: step.completed || false,
      estimatedTime: step.estimatedTime || Math.round(estimatedTime / steps.length),
    })),
  );
  const [newStep, setNewStep] = useState("");
  const [expanded, setExpanded] = useState(true);

  // Calculate progress
  const completedSteps = taskSteps.filter((step) => step.completed).length;
  const progress = taskSteps.length > 0 ? Math.round((completedSteps / taskSteps.length) * 100) : 0;

  // Time remaining calculation
  const remainingTime = taskSteps
    .filter((step) => !step.completed)
    .reduce((total, step) => total + (step.estimatedTime || 0), 0);

  // Toggle step completion
  const _toggleStep = (id) => {
    setTaskSteps((prevSteps) =>
      prevSteps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step)),
    );
  };

  // Add a custom step
  const _addStep = () => {
    if (newStep.trim() === "") return;

    setTaskSteps((prevSteps) => [
      ...prevSteps,
      {
        id: Math.random().toString(36).substring(2, 9),
        text: newStep,
        completed: false,
        estimatedTime: Math.round(estimatedTime / (prevSteps.length + 1)),
      },
    ]);
    setNewStep("");
  };

  // Handle complete button
  const _handleComplete = () => {
    onComplete(taskSteps);
  };

  // Check if all steps are completed
  useEffect(() => {
    if (taskSteps.length > 0 && taskSteps.every((step) => step.completed)) {
      onComplete(taskSteps);
    }
  }, [taskSteps, onComplete]);

  return (
    <motion.div
      className="task-breakdown bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="task-breakdown-header bg-blue-50 p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <FaList className="text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">{taskTitle}</h3>
        </div>
        <div className="flex items-center">
          {settings.showTimeEstimates && (
            <div className="time-estimate mr-4 text-sm text-gray-500 flex items-center">
              <FaClock className="mr-1" />
              <span>{remainingTime} min left</span>
            </div>
          )}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    {completedSteps} of {taskSteps.length} steps completed
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps list */}
              <ul className="space-y-2">
                {taskSteps.map((step, index) => (
                  <motion.li
                    key={step.id}
                    className={`task-breakdown-item p-3 border rounded-md flex items-start ${
                      step.completed ? "border-green-200 bg-green-50" : "border-gray-200"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Rest of the component would go here */}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
