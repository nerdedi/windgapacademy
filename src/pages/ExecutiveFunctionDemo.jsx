import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaArrowLeft, FaBrain, FaCog, FaQuestionCircle } from "react-icons/fa";

import ExecutiveFunctionTools, {
  TaskBreakdown,
  PomodoroTimer,
  VisualSchedule,
  StartingStrategies,
  WorkingMemorySupport,
} from "../components/ExecutiveFunctionTools";
import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";

/**
 * ExecutiveFunctionDemo
 *
 * A comprehensive demo page that showcases the executive function support tools
 * available for neurodivergent learners. This page demonstrates how these tools
 * can help with task management, time management, and other executive function needs.
 */
const ExecutiveFunctionDemo = () => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  // Sample task steps
  const [demoTaskSteps, setDemoTaskSteps] = useState([
    {
      id: "step1",
      text: "Read assignment instructions carefully",
      completed: true,
      estimatedTime: 5,
    },
    { id: "step2", text: "Research topic and gather sources", completed: false, estimatedTime: 20 },
    { id: "step3", text: "Create outline with main points", completed: false, estimatedTime: 15 },
    { id: "step4", text: "Write first draft", completed: false, estimatedTime: 30 },
    { id: "step5", text: "Review and revise for clarity", completed: false, estimatedTime: 15 },
    { id: "step6", text: "Check grammar and formatting", completed: false, estimatedTime: 10 },
    { id: "step7", text: "Submit final assignment", completed: false, estimatedTime: 5 },
  ]);

  // Sample schedule events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const scheduleEvents = [
    {
      id: "evt1",
      title: "Math Lesson",
      startTime: "09:00",
      endTime: "10:30",
      date: today,
      location: "Room 201",
      type: "learning",
    },
    {
      id: "evt2",
      title: "Study Group",
      startTime: "13:00",
      endTime: "14:30",
      date: today,
      type: "learning",
    },
    {
      id: "evt3",
      title: "Homework Time",
      startTime: "16:00",
      endTime: "17:30",
      date: today,
      type: "task",
    },
    {
      id: "evt4",
      title: "Science Project",
      startTime: "10:00",
      endTime: "11:30",
      date: tomorrow,
      type: "task",
    },
    {
      id: "evt5",
      title: "Counselor Meeting",
      startTime: "14:00",
      endTime: "15:00",
      date: tomorrow,
      location: "Student Services",
      type: "appointment",
    },
  ];

  // Sample instructions
  const sampleInstructions = [
    "Read all lesson materials before beginning the assignment",
    "Complete all exercises in order",
    "Save your work frequently",
    "Ask for help if you get stuck for more than 10 minutes",
    "Submit your work through the online portal by Friday",
  ];

  // Handle task completion
  const handleTaskComplete = (completedSteps) => {
    console.log("Task completed!", completedSteps);
    alert("Great job completing the task!");
  };

  // Handle strategy selection
  const handleStrategySelect = (strategy) => {
    console.log("Strategy selected:", strategy);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    console.log("Template selected:", template);
  };

  // Handle note added
  const handleNoteAdded = (note) => {
    console.log("Note added:", note);
  };

  // Handle note deleted
  const handleNoteDeleted = (id) => {
    console.log("Note deleted:", id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 text-gray-600 hover:text-gray-900"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <FaBrain className="text-purple-600 mr-2" />
              Executive Function Support Tools
            </h1>
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900" aria-label="Help">
              <FaQuestionCircle />
            </button>
            <button className="text-gray-600 hover:text-gray-900" aria-label="Settings">
              <FaCog />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {/* Introduction */}
        <motion.section
          className="mb-8 bg-white p-6 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Function Support</h2>
          <p className="text-gray-600 mb-4">
            These tools are designed to help with common executive function challenges such as:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1">
            <li>Breaking down complex tasks into manageable steps</li>
            <li>Managing time and maintaining focus</li>
            <li>Organizing schedules and planning ahead</li>
            <li>Overcoming task initiation difficulties</li>
            <li>Supporting working memory</li>
          </ul>
          <p className="text-gray-600">
            All tools can be customized based on your individual needs and preferences. Explore each
            tool below to find what works best for you.
          </p>
        </motion.section>

        {/* All-in-one Tool */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            All-in-One Executive Function Tools
          </h3>
          <ExecutiveFunctionTools
            taskSteps={demoTaskSteps}
            taskTitle="Complete Research Assignment"
            onTaskComplete={handleTaskComplete}
            scheduleEvents={scheduleEvents}
            instructions={sampleInstructions}
            taskType="writing"
            onStrategySelect={handleStrategySelect}
            onTemplateSelect={handleTemplateSelect}
            onNoteAdded={handleNoteAdded}
            onNoteDeleted={handleNoteDeleted}
          />
        </motion.section>

        {/* Individual Tools */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Support Tools</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Breakdown */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Task Breakdown</h4>
              <TaskBreakdown
                taskTitle="Complete Math Assignment"
                steps={[
                  { text: "Review class notes on the topic", completed: true },
                  { text: "Read textbook chapter", completed: false },
                  { text: "Watch tutorial video if needed", completed: false },
                  { text: "Complete practice problems 1-5", completed: false },
                  { text: "Check answers and revise if needed", completed: false },
                ]}
                allowCustomSteps={true}
                estimatedTime={45}
              />
            </div>

            {/* Pomodoro Timer */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Focus Timer</h4>
              <PomodoroTimer customizable={true} focusMinutes={25} breakMinutes={5} />
            </div>

            {/* Visual Schedule */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Visual Schedule</h4>
              <VisualSchedule events={scheduleEvents} date={new Date()} view="daily" />
            </div>

            {/* Starting Strategies */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Getting Started Strategies</h4>
              <StartingStrategies
                taskType="writing"
                onStrategySelect={handleStrategySelect}
                onTemplateSelect={handleTemplateSelect}
              />
            </div>

            {/* Working Memory Support */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Memory Support</h4>
              <WorkingMemorySupport
                instructions={[
                  "Remember to include your name and date on all assignments",
                  "Double-check your work before submitting",
                  "Submit assignments through the online portal",
                ]}
                onNoteAdded={handleNoteAdded}
                onNoteDeleted={handleNoteDeleted}
              />
            </div>
          </div>
        </motion.section>

        {/* Resources */}
        <motion.section
          className="bg-white p-6 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Resources</h3>
          <p className="text-gray-600 mb-4">
            Looking for more support with executive function skills? Explore these resources:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <div>
                <h4 className="font-medium text-gray-800">Executive Function Workshop</h4>
                <p className="text-sm text-gray-600">
                  Learn strategies for improving organization, time management, and task completion.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <div>
                <h4 className="font-medium text-gray-800">One-on-One Coaching</h4>
                <p className="text-sm text-gray-600">
                  Schedule a session with a learning specialist to develop personalized strategies.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <div>
                <h4 className="font-medium text-gray-800">Digital Tools Library</h4>
                <p className="text-sm text-gray-600">
                  Explore apps and tools specifically designed to support executive function.
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Access Resources
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ExecutiveFunctionDemo;
