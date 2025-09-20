import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";
import {
  FaClock,
  FaCheck,
  FaPlay,
  FaPause,
  FaRedo,
  FaCheckSquare,
  FaRegSquare,
  FaList,
  FaBrain,
  FaCalendarAlt,
  FaChevronUp,
  FaChevronDown,
  FaRegLightbulb,
} from "react-icons/fa";

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
const containerVariants = {
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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
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
  allowCustomSteps = false,
  estimatedTime = 30, // minutes
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

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
  const toggleStep = (id) => {
    setTaskSteps((prevSteps) =>
      prevSteps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step)),
    );
  };

  // Add a custom step
  const addStep = () => {
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
  const handleComplete = () => {
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
                    className={`task-breakdown-item p-3 border rounded-md flex items-start ${step.completed ? "border-green-200 bg-green-50" : "border-gray-200"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className="flex-shrink-0 mr-3 mt-0.5 cursor-pointer"
                      onClick={() => toggleStep(step.id)}
                    >
                      {step.completed ? (
                        <FaCheckSquare className="text-green-500" />
                      ) : (
                        <FaRegSquare className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p
                        className={`text-gray-800 ${step.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {step.text}
                      </p>
                      {settings.showTimeEstimates && (
                        <span className="text-xs text-gray-500 flex items-center mt-1">
                          <FaClock className="mr-1" />
                          {step.estimatedTime} min
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Add custom step */}
              {allowCustomSteps && (
                <div className="mt-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Add a step..."
                      className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") addStep();
                      }}
                    />
                    <button
                      onClick={addStep}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                      aria-label="Add step"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * PomodoroTimer Component
 *
 * A customizable Pomodoro timer to help with time management and focus.
 * Includes visual and audio cues, and is designed to be accessible.
 */
export const PomodoroTimer = ({
  focusMinutes = 25,
  breakMinutes = 5,
  longBreakMinutes = 15,
  sessionsBeforeLongBreak = 4,
  onSessionComplete = () => {},
  onBreakComplete = () => {},
  customizable = true,
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  // Customize based on executive function needs
  const shortAttentionSpan = preferences.engagementPatterns.attentionSpan === "short";
  const defaultFocusTime = shortAttentionSpan ? 15 : focusMinutes;
  const defaultBreakTime = shortAttentionSpan ? 5 : breakMinutes;

  const [timerMode, setTimerMode] = useState("focus"); // 'focus', 'break', 'longBreak'
  const [minutes, setMinutes] = useState(defaultFocusTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customFocusMinutes, setCustomFocusMinutes] = useState(defaultFocusTime);
  const [customBreakMinutes, setCustomBreakMinutes] = useState(defaultBreakTime);
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio notifications if available
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio("/sounds/timer-complete.mp3");
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current);

            // Play sound notification if enabled and available
            if (settings.allowSounds && audioRef.current) {
              audioRef.current.play().catch((e) => console.error("Error playing sound:", e));
            }

            // Handle session completion
            if (timerMode === "focus") {
              const newSessions = sessions + 1;
              setSessions(newSessions);

              if (newSessions % sessionsBeforeLongBreak === 0) {
                setTimerMode("longBreak");
                setMinutes(longBreakMinutes);
              } else {
                setTimerMode("break");
                setMinutes(customBreakMinutes);
              }

              onSessionComplete(newSessions);
            } else {
              setTimerMode("focus");
              setMinutes(customFocusMinutes);
              onBreakComplete();
            }

            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds, timerMode, sessions, customFocusMinutes, customBreakMinutes]);

  // Handle start/pause button
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);

    if (timerMode === "focus") {
      setMinutes(customFocusMinutes);
    } else if (timerMode === "break") {
      setMinutes(customBreakMinutes);
    } else {
      setMinutes(longBreakMinutes);
    }

    setSeconds(0);
  };

  // Apply custom settings
  const applySettings = () => {
    if (timerMode === "focus") {
      setMinutes(customFocusMinutes);
    } else if (timerMode === "break") {
      setMinutes(customBreakMinutes);
    }
    setSeconds(0);
    setShowSettings(false);
  };

  // Get timer label based on mode
  const getTimerLabel = () => {
    switch (timerMode) {
      case "focus":
        return "Focus Time";
      case "break":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Timer";
    }
  };

  // Get timer color based on mode
  const getTimerColor = () => {
    switch (timerMode) {
      case "focus":
        return "bg-blue-600";
      case "break":
        return "bg-green-500";
      case "longBreak":
        return "bg-purple-500";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <motion.div
      className="pomodoro-timer bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`timer-header p-4 text-white ${getTimerColor()}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <FaClock className="mr-2" />
            {getTimerLabel()}
          </h3>
          <div className="text-sm">
            Session {sessions + 1} / {sessionsBeforeLongBreak}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Timer display */}
        <div className="text-center py-6">
          <div className="text-5xl font-bold text-gray-800">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {timerMode === "focus" ? "Stay focused on your task" : "Take a break and relax"}
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`p-3 rounded-full ${isActive ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 text-gray-600"
            aria-label="Reset timer"
          >
            <FaRedo />
          </button>
        </div>

        {/* Customization */}
        {customizable && (
          <div className="mt-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {showSettings ? "Hide settings" : "Customize timer"}
              {showSettings ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 p-3 bg-gray-50 rounded-md"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Focus time (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={customFocusMinutes}
                        onChange={(e) => setCustomFocusMinutes(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Break time (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={customBreakMinutes}
                        onChange={(e) => setCustomBreakMinutes(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      onClick={applySettings}
                      className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply Settings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * VisualSchedule Component
 *
 * A visual representation of daily or weekly schedules to help with planning
 * and managing time-based activities.
 */
export const VisualSchedule = ({
  events = [],
  date = new Date(),
  onEventClick = () => {},
  view = "daily", // 'daily' or 'weekly'
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  const [selectedDate, setSelectedDate] = useState(date);
  const [activeView, setActiveView] = useState(view);

  // Format time for display (12-hour format with AM/PM)
  const formatTime = (time) => {
    // Time can be a string like "14:30" or a Date object
    let hours, minutes;

    if (typeof time === "string") {
      const [h, m] = time.split(":").map(Number);
      hours = h;
      minutes = m;
    } else if (time instanceof Date) {
      hours = time.getHours();
      minutes = time.getMinutes();
    } else {
      return "Invalid time";
    }

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Get events for the selected date
  const getEventsForDate = (date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      })
      .sort((a, b) => {
        // Sort by start time
        const timeA =
          typeof a.startTime === "string"
            ? a.startTime
            : `${a.startTime.getHours()}:${a.startTime.getMinutes()}`;
        const timeB =
          typeof b.startTime === "string"
            ? b.startTime
            : `${b.startTime.getHours()}:${b.startTime.getMinutes()}`;

        return timeA.localeCompare(timeB);
      });
  };

  // Get weekday name
  const getWeekdayName = (date) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get dates for the current week
  const getDatesForWeek = (date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const diff = date.getDate() - day;

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(diff + i);
      weekDates.push(newDate);
    }

    return weekDates;
  };

  // Get color based on event type
  const getEventColor = (eventType) => {
    const colors = {
      learning: "bg-blue-100 border-blue-400 text-blue-800",
      appointment: "bg-purple-100 border-purple-400 text-purple-800",
      task: "bg-green-100 border-green-400 text-green-800",
      leisure: "bg-yellow-100 border-yellow-400 text-yellow-800",
      default: "bg-gray-100 border-gray-400 text-gray-800",
    };

    return colors[eventType] || colors.default;
  };

  // Change date
  const changeDate = (increment) => {
    const newDate = new Date(selectedDate);

    if (activeView === "daily") {
      newDate.setDate(newDate.getDate() + increment);
    } else {
      newDate.setDate(newDate.getDate() + increment * 7);
    }

    setSelectedDate(newDate);
  };

  return (
    <motion.div
      className="visual-schedule bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="schedule-header bg-indigo-50 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800 flex items-center">
            <FaCalendarAlt className="text-indigo-600 mr-2" />
            Visual Schedule
          </h3>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-md ${activeView === "daily" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setActiveView("daily")}
            >
              Day
            </button>
            <button
              className={`px-3 py-1 rounded-md ${activeView === "weekly" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setActiveView("weekly")}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Date navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={activeView === "daily" ? "Previous day" : "Previous week"}
          >
            <FaChevronLeft />
          </button>

          <h4 className="font-medium text-gray-800">
            {activeView === "daily"
              ? `${getWeekdayName(selectedDate)}, ${formatDate(selectedDate)}`
              : `Week of ${formatDate(getDatesForWeek(selectedDate)[0])}`}
          </h4>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={activeView === "daily" ? "Next day" : "Next week"}
          >
            <FaChevronDown />
          </button>
        </div>

        {/* Daily view */}
        {activeView === "daily" && (
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event, index) => (
                <motion.div
                  key={event.id || index}
                  className={`p-3 border-l-4 rounded-md shadow-sm ${getEventColor(event.type)}`}
                  onClick={() => onEventClick(event)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium">{event.title}</h5>
                    <span className="text-sm">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  {event.location && <div className="text-sm mt-1">Location: {event.location}</div>}
                  {event.description && <div className="text-sm mt-1">{event.description}</div>}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No events scheduled for this day</div>
            )}
          </div>
        )}

        {/* Weekly view */}
        {activeView === "weekly" && (
          <div className="grid grid-cols-7 gap-2">
            {getDatesForWeek(selectedDate).map((date, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div
                  className={`p-2 text-center ${
                    date.toDateString() === new Date().toDateString()
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="text-xs">{getWeekdayName(date).slice(0, 3)}</div>
                  <div className="font-medium">{date.getDate()}</div>
                </div>
                <div className="p-1 max-h-32 overflow-y-auto">
                  {getEventsForDate(date).length > 0 ? (
                    getEventsForDate(date).map((event, idx) => (
                      <div
                        key={event.id || idx}
                        className={`p-1 mb-1 text-xs rounded border-l-2 truncate ${getEventColor(event.type)}`}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div>{formatTime(event.startTime)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-center text-gray-500 p-2">No events</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * StartingStrategies Component
 *
 * Provides templates, prompts, and strategies to help overcome task
 * initiation difficulties and get started on assignments.
 */
export const StartingStrategies = ({
  taskType = "general", // 'general', 'writing', 'math', 'project', 'reading'
  onStrategySelect = () => {},
  onTemplateSelect = () => {},
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  // Task type specific strategies and templates
  const strategies = {
    general: [
      {
        id: "g1",
        title: "Five-Minute Start",
        description: "Just commit to working for 5 minutes. Once started, it's easier to continue.",
      },
      {
        id: "g2",
        title: "Body Doubling",
        description: "Work alongside someone else (in person or virtually) for accountability.",
      },
      {
        id: "g3",
        title: "Task Visualization",
        description: "Visualize yourself completing the task successfully.",
      },
      {
        id: "g4",
        title: "Set Up Environment",
        description: "Prepare your workspace first, removing distractions and gathering materials.",
      },
    ],
    writing: [
      {
        id: "w1",
        title: "Free Writing",
        description:
          "Write continuously for 5 minutes without stopping, don't worry about quality.",
      },
      {
        id: "w2",
        title: "Voice Dictation",
        description: "Speak your ideas aloud and record or use speech-to-text software.",
      },
      {
        id: "w3",
        title: "Sentence Starters",
        description: "Use pre-written sentence beginnings to overcome blank page anxiety.",
      },
      {
        id: "w4",
        title: "Mind Mapping",
        description: "Create a visual map of connected ideas before writing linearly.",
      },
    ],
    math: [
      {
        id: "m1",
        title: "Example First",
        description: "Review a similar solved example before attempting your problem.",
      },
      {
        id: "m2",
        title: "Draw It Out",
        description: "Create a visual representation of the problem.",
      },
      {
        id: "m3",
        title: "Talk Through Steps",
        description: "Verbalize the steps needed to solve the problem.",
      },
      {
        id: "m4",
        title: "Simplify First",
        description: "Break down the problem into smaller, more manageable parts.",
      },
    ],
    project: [
      {
        id: "p1",
        title: "Create Timeline",
        description: "Work backwards from the deadline, setting mini-deadlines.",
      },
      {
        id: "p2",
        title: "Materials Inventory",
        description: "List and gather all materials needed for the project.",
      },
      {
        id: "p3",
        title: "Similar Project Study",
        description: "Look at examples of completed projects for inspiration.",
      },
      {
        id: "p4",
        title: "Project Map",
        description: "Create a visual map of all project components and connections.",
      },
    ],
    reading: [
      {
        id: "r1",
        title: "Preview Text",
        description: "Skim headings, images, and bold text before reading in depth.",
      },
      {
        id: "r2",
        title: "Question Generation",
        description: "Create questions you hope the text will answer.",
      },
      {
        id: "r3",
        title: "Paired Reading",
        description: "Alternate reading paragraphs with someone else.",
      },
      {
        id: "r4",
        title: "Audio Support",
        description: "Use text-to-speech while following along with the text.",
      },
    ],
  };

  // Templates by task type
  const templates = {
    writing: [
      {
        id: "wt1",
        title: "Essay Outline",
        content:
          "Introduction:\n- Hook:\n- Background:\n- Thesis:\n\nBody Paragraph 1:\n- Topic sentence:\n- Evidence:\n- Analysis:\n\nBody Paragraph 2:\n- Topic sentence:\n- Evidence:\n- Analysis:\n\nConclusion:\n- Restate thesis:\n- Summary:\n- Final thoughts:",
      },
      {
        id: "wt2",
        title: "Creative Story",
        content:
          "Setting:\n- Time:\n- Place:\n- Atmosphere:\n\nMain Character:\n- Name:\n- Key traits:\n- Goal:\n\nConflict:\n- Problem:\n- Obstacle:\n\nResolution:\n- How the conflict is addressed:\n- Character growth:",
      },
    ],
    project: [
      {
        id: "pt1",
        title: "Project Plan",
        content:
          "Project Title:\n\nObjective:\n\nMaterials Needed:\n-\n-\n-\n\nSteps:\n1.\n2.\n3.\n\nTimeline:\n- Start date:\n- Milestone 1:\n- Milestone 2:\n- Completion date:",
      },
      {
        id: "pt2",
        title: "Research Notes",
        content:
          "Research Topic:\n\nKey Questions:\n1.\n2.\n3.\n\nSources:\n1. Title:\n   Author:\n   Main points:\n\n2. Title:\n   Author:\n   Main points:",
      },
    ],
    math: [
      {
        id: "mt1",
        title: "Problem Solving",
        content:
          "Problem:\n\nWhat I Know:\n-\n-\n\nWhat I Need to Find:\n-\n\nStrategy:\n-\n\nWorking Space:\n\n\nSolution:\n",
      },
    ],
    reading: [
      {
        id: "rt1",
        title: "Reading Notes",
        content:
          "Title:\nAuthor:\n\nMain Idea:\n\nImportant Details:\n-\n-\n-\n\nNew Vocabulary:\n-\n-\n\nQuestions I Have:\n-\n-\n",
      },
    ],
    general: [
      {
        id: "gt1",
        title: "Task Planner",
        content:
          "Task:\n\nPurpose:\n\nSteps:\n1.\n2.\n3.\n\nPotential Challenges:\n-\n-\n\nResources Needed:\n-\n-\n",
      },
    ],
  };

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
    onStrategySelect(strategy);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  return (
    <motion.div
      className="starting-strategies bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="strategies-header bg-yellow-50 p-4">
        <h3 className="font-medium text-gray-800 flex items-center">
          <FaRegLightbulb className="text-yellow-600 mr-2" />
          Getting Started Strategies for {taskType.charAt(0).toUpperCase() + taskType.slice(1)}{" "}
          Tasks
        </h3>
      </div>

      <div className="p-4">
        {/* Strategies section */}
        <h4 className="font-medium text-gray-700 mb-3">Strategies to help you begin:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {strategies[taskType].map((strategy) => (
            <motion.div
              key={strategy.id}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                selectedStrategy?.id === strategy.id
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 hover:border-yellow-300"
              }`}
              onClick={() => handleStrategySelect(strategy)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <h5 className="font-medium text-gray-800">{strategy.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Templates section */}
        {templates[taskType] && templates[taskType].length > 0 && (
          <>
            <h4 className="font-medium text-gray-700 mb-3">Templates to get you started:</h4>
            <div className="space-y-3">
              {templates[taskType].map((template) => (
                <motion.div
                  key={template.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <h5 className="font-medium text-gray-800">{template.title}</h5>
                  <div className="mt-2">
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 transition-colors">
                      Use Template
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Selected template preview */}
        {selectedTemplate && (
          <motion.div
            className="mt-6 p-4 border border-yellow-300 rounded-md bg-yellow-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <h5 className="font-medium text-gray-800 mb-2">{selectedTemplate.title} Template</h5>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 border border-yellow-200 rounded-md">
              {selectedTemplate.content}
            </pre>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * WorkingMemorySupport Component
 *
 * Visual tools to support working memory, including note-taking features,
 * visual reminders, and instruction breakdowns.
 */
export const WorkingMemorySupport = ({
  instructions = [],
  onNoteAdded = () => {},
  onNoteDeleted = () => {},
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  // Add a new note
  const addNote = useCallback(() => {
    if (newNote.trim() === "") return;

    const note = {
      id: Date.now().toString(),
      text: newNote,
      timestamp: new Date().toISOString(),
    };

    setNotes((prevNotes) => [...prevNotes, note]);
    setNewNote("");
    onNoteAdded(note);
  }, [newNote, onNoteAdded]);

  // Delete a note
  const deleteNote = useCallback(
    (id) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      onNoteDeleted(id);
    },
    [onNoteDeleted],
  );

  // Format a timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      className="working-memory-support bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="memory-header bg-purple-50 p-4">
        <h3 className="font-medium text-gray-800 flex items-center">
          <FaBrain className="text-purple-600 mr-2" />
          Working Memory Support
        </h3>
      </div>

      <div className="p-4">
        {/* Instructions section */}
        {instructions.length > 0 && (
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <h4 className="font-medium text-gray-700">Instructions:</h4>
              <button className="text-gray-500">
                {showInstructions ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mt-2 p-3 bg-purple-50 rounded-md">
                    <ol className="list-decimal pl-5 space-y-2">
                      {instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Notes section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Quick Notes</h4>
          <div className="flex">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note to remember..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") addNote();
              }}
            />
            <button
              onClick={addNote}
              className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
              aria-label="Add note"
            >
              Add
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-2">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <motion.div
                key={note.id}
                className="p-3 bg-white border border-gray-200 rounded-md shadow-sm flex justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div>
                  <p className="text-gray-800">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(note.timestamp)}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 self-start"
                  aria-label="Delete note"
                >
                  <FaTimes />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No notes yet. Add some quick reminders above.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * ExecutiveFunctionTools - Main component that combines all tools
 *
 * This component integrates all executive function support tools into a single
 * interface, with tabs for easy navigation between the different tools.
 */
const ExecutiveFunctionTools = ({
  defaultTab = "tasks",
  taskSteps = [],
  taskTitle = "Complete Task",
  onTaskComplete = () => {},
  scheduleEvents = [],
  instructions = [],
  taskType = "general",
  onStrategySelect = () => {},
  onTemplateSelect = () => {},
  onNoteAdded = () => {},
  onNoteDeleted = () => {},
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Define tab options
  const tabs = [
    { id: "tasks", label: "Task Breakdown", icon: <FaList /> },
    { id: "timer", label: "Focus Timer", icon: <FaClock /> },
    { id: "schedule", label: "Visual Schedule", icon: <FaCalendarAlt /> },
    { id: "start", label: "Getting Started", icon: <FaRegLightbulb /> },
    { id: "memory", label: "Memory Support", icon: <FaBrain /> },
  ];

  return (
    <div
      className="executive-function-tools bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
      {...props}
    >
      {/* Tabs navigation */}
      <div className="tabs-navigation flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 flex items-center justify-center whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content p-4">
        <AnimatePresence mode="wait">
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TaskBreakdown
                taskTitle={taskTitle}
                steps={taskSteps}
                onComplete={onTaskComplete}
                allowCustomSteps={true}
              />
            </motion.div>
          )}

          {activeTab === "timer" && (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PomodoroTimer
                onSessionComplete={(sessions) => console.log(`Completed ${sessions} sessions`)}
                onBreakComplete={() => console.log("Break completed")}
              />
            </motion.div>
          )}

          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VisualSchedule
                events={scheduleEvents}
                onEventClick={(event) => console.log("Event clicked:", event)}
              />
            </motion.div>
          )}

          {activeTab === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StartingStrategies
                taskType={taskType}
                onStrategySelect={onStrategySelect}
                onTemplateSelect={onTemplateSelect}
              />
            </motion.div>
          )}

          {activeTab === "memory" && (
            <motion.div
              key="memory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WorkingMemorySupport
                instructions={instructions}
                onNoteAdded={onNoteAdded}
                onNoteDeleted={onNoteDeleted}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExecutiveFunctionTools;
