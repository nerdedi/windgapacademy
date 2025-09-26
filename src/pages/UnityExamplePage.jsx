import UnityIntegrationExample from "../components/examples/UnityIntegrationExample";
import "./UnityExamplePage.css";

/**
 * UnityExamplePage - Demonstrates the Unity integration example component
 *
 * This page showcases the UnityIntegrationExample component and provides context
 * about the implementation and best practices.
 */
const UnityExamplePage = () => {
  // Sample custom commands to send to Unity
  const customCommands = [
    {
      gameObject: "GameManager",
      method: "SetDifficulty",
      data: "medium",
    },
    {
      gameObject: "UIManager",
      method: "SetTheme",
      data: { theme: "default", colorScheme: "light" },
    },
  ];

  return (
    <div className="unity-example-page">
      <header className="example-header">
        <h1>Unity WebGL Integration Examples</h1>
        <p className="header-description">
          Best practices for integrating Unity WebGL into Windgap Academy's React application.
        </p>
      </header>

      <section className="example-section">
        <h2>Complete Unity Integration Example</h2>
        <p>
          This example demonstrates a fully-featured Unity WebGL integration, including loading
          states, error handling, two-way communication, performance monitoring, and responsive
          design.
        </p>

        <div className="example-container">
          <UnityIntegrationExample
            buildUrl="/unity/WebGLBuild/Build.json"
            width="100%"
            height="500px"
            showPerformanceMetrics={true}
            showControls={true}
            customCommands={customCommands}
          />
        </div>

        <div className="code-explanation">
          <h3>Key Implementation Features:</h3>
          <ul>
            <li>
              <strong>Loading State Management:</strong> Tracks loading progress with visual
              feedback
            </li>
            <li>
              <strong>Error Handling:</strong> Graceful fallback with helpful error messages
            </li>
            <li>
              <strong>Two-way Communication:</strong> Send and receive messages between React and
              Unity
            </li>
            <li>
              <strong>Device Detection:</strong> Automatically applies optimizations based on device
              capability
            </li>
            <li>
              <strong>Performance Monitoring:</strong> Tracks FPS, memory usage, and rendering
              metrics
            </li>
            <li>
              <strong>Responsive Design:</strong> Adapts to container size changes
            </li>
            <li>
              <strong>Authentication Integration:</strong> Connects user session to Unity experience
            </li>
          </ul>
        </div>
      </section>

      <section className="example-section">
        <h2>Integration Best Practices</h2>

        <div className="best-practices">
          <div className="practice-item">
            <h3>Memory Management</h3>
            <p>
              Unity WebGL can be memory-intensive. Use the WebGLOptimizer utility to manage memory
              usage and prevent browser crashes, especially on mobile devices.
            </p>
            <pre className="code-snippet">
              {`// Apply memory optimization
WebGLOptimizer.optimizeMemoryUsage(unityInstance, {
  textureQuality: isMobile ? "low" : "high",
  maxMemory: isMobile ? 256 * 1024 * 1024 : 512 * 1024 * 1024
});`}
            </pre>
          </div>

          <div className="practice-item">
            <h3>Communication Protocol</h3>
            <p>
              Use a structured protocol for sending messages between React and Unity to ensure
              reliable communication.
            </p>
            <pre className="code-snippet">
              {`// From React to Unity
sendToUnity("GameManager", "ReceiveData", {
  type: "user_progress",
  data: { level: 3, score: 2500 }
});

// From Unity to React (in C#)
// SendMessageToReact("update_ui", JsonUtility.ToJson(progressData));`}
            </pre>
          </div>

          <div className="practice-item">
            <h3>Responsive Design</h3>
            <p>
              Unity WebGL canvas doesn't automatically resize. Implement a resize observer to handle
              responsive behavior.
            </p>
            <pre className="code-snippet">
              {`// React component implementation
useEffect(() => {
  const resizeObserver = new ResizeObserver(entries => {
    if (unityInstance && unityInstance.Module) {
      const { width, height } = entries[0].contentRect;
      unityInstance.Module.setCanvasSize(width, height);
    }
  });

  resizeObserver.observe(containerRef.current);
  return () => resizeObserver.disconnect();
}, [unityInstance]);`}
            </pre>
          </div>
        </div>
      </section>

      <section className="example-section">
        <h2>Project Structure</h2>
        <p>The Unity integration is organized into several components and utilities:</p>

        <div className="code-structure">
          <pre>
            {`windgapacademy/
├── src/
│   ├── components/
│   │   ├── OptimizedUnityPlayer.jsx        # Base Unity player component
│   │   ├── UnityEducationalExperience.jsx  # Educational experience integration
│   │   ├── PerformanceDashboard/           # Performance monitoring UI
│   │   └── examples/
│   │       └── UnityIntegrationExample.jsx  # Complete example (this component)
│   ├── unity-integration/
│   │   └── UnityBridge.js                  # Communication bridge to Unity
│   └── utils/
│       ├── WebGLOptimizer.js               # Performance optimization utilities
│       ├── PerfMetrics.js                  # Performance monitoring utilities
│       └── unity-mock.js                   # Mock implementation for testing`}
          </pre>
        </div>
      </section>

      <section className="example-section">
        <h2>Additional Resources</h2>
        <ul className="resources-list">
          <li>
            <a href="/docs/unity-integration-guide.pdf" target="_blank" rel="noopener noreferrer">
              Unity Integration Technical Guide
            </a>
          </li>
          <li>
            <a
              href="/docs/UNITY_INTEGRATION_COMPONENTS.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Component Documentation
            </a>
          </li>
          <li>
            <a href="https://unity.com/webgl" target="_blank" rel="noopener noreferrer">
              Unity WebGL Documentation
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default UnityExamplePage;
