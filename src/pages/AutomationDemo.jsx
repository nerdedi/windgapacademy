import Layout from "../components/Layout";
import LearningPathAutomationDemo from "../components/demos/LearningPathAutomationDemo";

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

          <LearningPathAutomationDemo />

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
