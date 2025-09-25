import Layout from "../../components/Layout";

const AutomationDemo = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Learning Path Automation</h1>
          <p className="text-lg mb-8">
            This demo showcases how concepts from warehouse automation can be applied to create
            smarter, more adaptive learning experiences. We&apos;ve implemented a system that mimics
            conveyor belts and proximity sensors to automatically deliver and adjust educational
            content based on learner engagement.
          </p>

          {/* Simple demo content instead of the full component */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Conveyor Belt Learning System</h2>
            <p className="mb-4">This simplified demo shows the concept of the automation system.</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Learning Progress</h3>
              <div className="h-20 bg-gray-200 rounded relative overflow-hidden mb-4">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-blue-500"
                  style={{ width: "30%" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-bold text-gray-700">30% Complete</p>
                </div>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-green-500 text-white rounded">Start</button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Module Queue</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <h3 className="font-bold">Introduction to Digital Skills</h3>
                <p className="text-sm text-gray-700">
                  Covers basic computer literacy and navigation
                </p>
                <div className="mt-2 text-xs text-gray-500">Estimated time: 5 min</div>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <h3 className="font-bold">Email Basics</h3>
                <p className="text-sm text-gray-700">
                  Learn how to create, send, and manage emails
                </p>
                <div className="mt-2 text-xs text-gray-500">Estimated time: 8 min</div>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <h3 className="font-bold">Internet Safety</h3>
                <p className="text-sm text-gray-700">Understanding online threats and protection</p>
                <div className="mt-2 text-xs text-gray-500">Estimated time: 7 min</div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 bg-blue-500 text-white rounded">Add More Modules</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Start Learning Path
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Completed Modules</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <h3 className="font-bold">Computer Basics</h3>
                <p className="text-sm text-gray-700">Understanding hardware and software</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-gray-500">Completed: 10 minutes ago</span>
                  <span className="text-xs font-semibold text-green-600">Score: 92%</span>
                </div>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <h3 className="font-bold">Using a Mouse and Keyboard</h3>
                <p className="text-sm text-gray-700">Basic input device skills</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-gray-500">Completed: 25 minutes ago</span>
                  <span className="text-xs font-semibold text-green-600">Score: 100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
            <p className="mb-4">
              This system was built using React and Zustand for state management. It applies
              industrial automation design patterns to educational technology:
            </p>

            <h3 className="text-xl font-semibold mb-2">Key Components:</h3>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>
                <strong>Automation Store</strong>: A central state management system that handles
                the learning path &quot;conveyor belt&quot; and engagement &quot;sensors&quot;
              </li>
              <li>
                <strong>Learning Path Controls</strong>: Start, stop, and speed adjustment for the
                flow of content
              </li>
              <li>
                <strong>Engagement Sensors</strong>: Detect user interaction frequency, time spent
                on content, and estimated attention level
              </li>
              <li>
                <strong>Adaptive Logic</strong>: Automatically adjusts learning pace based on
                engagement metrics
              </li>
              <li>
                <strong>Analytics</strong>: Tracks performance and provides insights into learning
                patterns
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Technical Implementation:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Zustand Store</strong>: Modeled after industrial control systems with state,
                actions, and selectors
              </li>
              <li>
                <strong>React Hooks</strong>: Custom hook (useLearningAutomation) for easy
                integration with components
              </li>
              <li>
                <strong>Threshold-Based Control</strong>: Uses configurable thresholds to determine
                when intervention is needed
              </li>
              <li>
                <strong>Queue Management</strong>: Handles content similar to how conveyor systems
                manage physical items
              </li>
            </ul>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
            <p className="mb-4">
              This system was built using React and Zustand for state management. It applies
              industrial automation design patterns to educational technology:
            </p>

            <h3 className="text-xl font-semibold mb-2">Key Components:</h3>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>
                <strong>Automation Store</strong>: A central state management system that handles
                the learning path &quot;conveyor belt&quot; and engagement &quot;sensors&quot;
              </li>
              <li>
                <strong>Learning Path Controls</strong>: Start, stop, and speed adjustment for the
                flow of content
              </li>
              <li>
                <strong>Engagement Sensors</strong>: Detect user interaction frequency, time spent
                on content, and estimated attention level
              </li>
              <li>
                <strong>Adaptive Logic</strong>: Automatically adjusts learning pace based on
                engagement metrics
              </li>
              <li>
                <strong>Analytics</strong>: Tracks performance and provides insights into learning
                patterns
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Technical Implementation:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Zustand Store</strong>: Modeled after industrial control systems with state,
                actions, and selectors
              </li>
              <li>
                <strong>React Hooks</strong>: Custom hook (useLearningAutomation) for easy
                integration with components
              </li>
              <li>
                <strong>Threshold-Based Control</strong>: Uses configurable thresholds to determine
                when intervention is needed
              </li>
              <li>
                <strong>Queue Management</strong>: Handles content similar to how conveyor systems
                manage physical items
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutomationDemo;
