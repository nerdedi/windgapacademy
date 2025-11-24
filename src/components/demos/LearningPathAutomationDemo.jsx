import { useEffect, useState } from "react";
import { useLearningAutomation } from "../hooks/useLearningAutomation";
import { useAutomationAnalytics } from "../stores/automationStore";

const LearningPathAutomationDemo = () => {
  const [demoModules, setDemoModules] = useState([]);
  const analytics = useAutomationAnalytics();

  // Initialize demo modules
  useEffect(() => {
    const modules = [
      {
        id: "module1",
        title: "Introduction to Digital Skills",
        estimatedDuration: 5, // in seconds for demo purposes
        type: "video",
      },
      {
        id: "module2",
        title: "Email Basics",
        estimatedDuration: 8,
        type: "interactive",
      },
      {
        id: "module3",
        title: "Internet Safety",
        estimatedDuration: 7,
        type: "quiz",
      },
      {
        id: "module4",
        title: "Using Search Engines",
        estimatedDuration: 10,
        type: "activity",
      },
    ];

    setDemoModules(modules);
  }, []);

  // Initialize our automation system with options
  const automation = useLearningAutomation({
    autoStart: false,
    initialSpeed: 1.0,
    trackEngagement: true,
    engagementCheckInterval: 2000, // Check every 2 seconds for demo
    customThresholds: {
      attention: 40, // Higher threshold for demo
      interaction: 3, // Lower threshold for demo
    },
  });

  // Handle loading modules
  const handleLoadModules = () => {
    automation.addModules(demoModules);
  };

  // Handle user interaction with the content
  const handleInteraction = () => {
    automation.trackInteraction("click", {
      element: "demo-button",
      context: "user demonstration",
    });
  };

  // Status display state
  const [status, setStatus] = useState({});

  // Update status display
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(automation.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [automation]);

  // Render metrics from analytics
  const renderMetrics = () => {
    const engagementStats = analytics.getEngagementAnalytics();
    const pathMetrics = analytics.getLearningPathMetrics();

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Learning Analytics</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium">Engagement</h4>
            <ul className="list-disc list-inside">
              <li>Avg. Attention: {engagementStats.averageAttention.toFixed(1)}%</li>
              <li>Avg. Interactions: {engagementStats.averageInteraction.toFixed(1)}/min</li>
              <li>Trend: {engagementStats.attentionTrend}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-medium">Learning Path</h4>
            <ul className="list-disc list-inside">
              <li>Modules Completed: {pathMetrics.totalModulesCompleted}</li>
              <li>Avg. Duration: {(pathMetrics.averageDuration / 1000).toFixed(1)}s</li>
              <li>Completion Rate: {(pathMetrics.completionRate * 100).toFixed(0)}%</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Learning Path Automation Demo</h2>
      <p className="mb-4">
        This demo showcases how the warehouse automation concepts (conveyor belt and proximity
        sensor) can be applied to create an automated learning path system. The learning path acts
        like a conveyor belt, moving content at adjustable speeds, while engagement sensors detect
        user interaction similar to proximity sensors.
      </p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleLoadModules}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Load Modules
        </button>

        <button
          onClick={automation.startLearningPath}
          disabled={automation.isActive}
          className={`px-4 py-2 rounded transition-colors ${
            automation.isActive
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Start Learning Path
        </button>

        <button
          onClick={automation.stopLearningPath}
          disabled={!automation.isActive}
          className={`px-4 py-2 rounded transition-colors ${
            !automation.isActive
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Stop Learning Path
        </button>

        <button
          onClick={handleInteraction}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Simulate Interaction
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Speed Control</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => automation.adjustSpeed(0.5)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Slow (0.5x)
          </button>
          <button
            onClick={() => automation.adjustSpeed(1.0)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Normal (1.0x)
          </button>
          <button
            onClick={() => automation.adjustSpeed(2.0)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Fast (2.0x)
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Learning Path Active:</strong> {status.isActive ? "Yes" : "No"}
            </p>
            <p>
              <strong>Current Speed:</strong> {status.currentSpeed?.toFixed(1)}x
            </p>
          </div>
          <div>
            <p>
              <strong>Queue Length:</strong> {status.queueLength || 0} modules
            </p>
            <p>
              <strong>Engagement Level:</strong> {status.engagementLevel?.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Module Queue</h3>
        {automation.moduleQueue.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {automation.moduleQueue.map((module, index) => (
              <li key={module.id} className="py-2">
                <div className="flex justify-between">
                  <span>
                    <strong>{index + 1}.</strong> {module.title}
                  </span>
                  <span className="text-gray-500">
                    {module.type} ({module.estimatedDuration}s)
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No modules in queue. Click &quot;Load Modules&quot; to add some.
          </p>
        )}
      </div>

      {/* Show analytics if we have data */}
      {analytics.engagementHistory.length > 0 && renderMetrics()}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How This Relates to Warehouse Automation</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Conveyor Belt = Learning Path</strong>: Just like a conveyor belt moves items
            through a warehouse, our learning path moves educational content to the student.
          </li>
          <li>
            <strong>Start/Stop Controls</strong>: Similar to a conveyor belt&apos;s controls, we can
            start, stop, and adjust the speed of content delivery.
          </li>
          <li>
            <strong>Proximity Sensor = Engagement Detection</strong>: Just as proximity sensors
            detect objects, our system detects user engagement through interactions and time
            tracking.
          </li>
          <li>
            <strong>Automation Logic</strong>: The system automatically adjusts based on engagement,
            slowing down or stopping when attention drops, similar to how conveyor systems respond
            to sensor inputs.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LearningPathAutomationDemo;
