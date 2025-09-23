// Portions of this file were generated with the assistance of GitHub Copilot

import React, { useState, useEffect } from "react";

import { useAdaptiveUI } from "../adaptive";
import AdaptiveCard from "../adaptive/AdaptiveCard";
import { useAnalytics } from "../analytics";

// Sample content for the demo
const sampleContent = [
  {
    id: "card-1",
    title: "Introduction to Adaptive Learning",
    content:
      "Adaptive learning systems personalize the educational experience based on individual needs, learning styles, and progress.",
    image: "/assets/images/adaptive-learning.png",
    video: "/assets/videos/adaptive-intro.mp4",
    audio: "/assets/audio/adaptive-overview.mp3",
    interactive: (
      <div className="interactive-element">
        <button>Explore Learning Styles</button>
        <div className="slider-container">
          <label>Learning Speed</label>
          <input type="range" min="1" max="10" defaultValue="5" />
        </div>
      </div>
    ),
    importance: "high",
  },
  {
    id: "card-2",
    title: "Visual Learning Techniques",
    content:
      "Visual learners process information best when it's presented through images, diagrams, and spatial arrangements.",
    image: "/assets/images/visual-learning.png",
    video: "/assets/videos/visual-techniques.mp4",
    interactive: (
      <div className="interactive-element">
        <div className="color-palette">
          <div className="color-sample" style={{ backgroundColor: "#ff5555" }}></div>
          <div className="color-sample" style={{ backgroundColor: "#55ff55" }}></div>
          <div className="color-sample" style={{ backgroundColor: "#5555ff" }}></div>
        </div>
      </div>
    ),
    importance: "medium",
  },
  {
    id: "card-3",
    title: "Auditory Learning Methods",
    content:
      "Auditory learners retain information best through listening, discussions, and verbal explanations.",
    audio: "/assets/audio/auditory-learning.mp3",
    interactive: (
      <div className="interactive-element">
        <button className="play-button">Play Audio Sample</button>
        <div className="volume-control">
          <label>Volume</label>
          <input type="range" min="0" max="100" defaultValue="75" />
        </div>
      </div>
    ),
    importance: "medium",
  },
  {
    id: "card-4",
    title: "Kinesthetic Learning Activities",
    content:
      "Kinesthetic learners learn best through physical activities, hands-on experiences, and movement.",
    video: "/assets/videos/kinesthetic-demo.mp4",
    interactive: (
      <div className="interactive-element">
        <div className="drag-drop-demo">
          <div className="draggable" draggable="true">
            Drag Me
          </div>
          <div className="drop-zone">Drop Zone</div>
        </div>
      </div>
    ),
    importance: "medium",
  },
  {
    id: "card-5",
    title: "Setting Up Your Learning Environment",
    content:
      "Create an optimal learning environment by considering factors like lighting, sound, temperature, and ergonomics.",
    image: "/assets/images/learning-environment.png",
    importance: "low",
  },
];

/**
 * AdaptiveUIDemo - Component to demonstrate the Adaptive UI System
 *
 * This component shows how different UI elements adapt based on user preferences,
 * device capabilities, and interaction patterns.
 */
const AdaptiveUIDemo = () => {
  // Get adaptive UI context
  const {
    adaptationsEnabled,
    colorScheme,
    motionReduced,
    uiComplexity,
    focusMode,
    contentPriority,
    deviceCapabilities,
    setColorScheme,
    setMotionReduced,
    setUIComplexity,
    setFocusMode,
  } = useAdaptiveUI();

  // Get analytics for demo purposes
  const { trackEvent } = useAnalytics();

  // Local state for simulating learning styles
  const [learningStyle, setLearningStyle] = useState("balanced");
  const [simulatedDevice, setSimulatedDevice] = useState("desktop");

  // Track page view
  useEffect(() => {
    trackEvent({
      category: "page_view",
      action: "view",
      label: "adaptive_demo_page",
    });
  }, [trackEvent]);

  // Simulate user activity based on selected learning style
  useEffect(() => {
    if (!adaptationsEnabled) return;

    // Simulate user preferences based on selected learning style
    trackEvent({
      category: "learning_style",
      action: "select",
      label: learningStyle,
    });

    // Update mock analytics data for the demo
    const mockLearningData = {
      learningStyle,
      contentPreferences: [],
      interactionPatterns: {},
    };

    switch (learningStyle) {
      case "visual":
        mockLearningData.contentPreferences = ["images", "videos", "diagrams"];
        mockLearningData.interactionPatterns = {
          scrollSpeed: "slow",
          focusTime: "long",
          errorRate: "low",
        };
        break;
      case "auditory":
        mockLearningData.contentPreferences = ["audio", "videos", "text"];
        mockLearningData.interactionPatterns = {
          scrollSpeed: "medium",
          focusTime: "medium",
          errorRate: "medium",
        };
        break;
      case "kinesthetic":
        mockLearningData.contentPreferences = ["interactive", "videos", "exercises"];
        mockLearningData.interactionPatterns = {
          scrollSpeed: "fast",
          focusTime: "short",
          errorRate: "low",
        };
        break;
      case "reading":
        mockLearningData.contentPreferences = ["text", "diagrams", "charts"];
        mockLearningData.interactionPatterns = {
          scrollSpeed: "medium",
          focusTime: "long",
          errorRate: "low",
        };
        break;
      default:
        mockLearningData.contentPreferences = ["mixed"];
        mockLearningData.interactionPatterns = {
          scrollSpeed: "medium",
          focusTime: "medium",
          errorRate: "medium",
        };
    }

    // Set content priority based on learning style
    // Note: In a real app, this would be done by the analytics system
    localStorage.setItem("demo_learning_data", JSON.stringify(mockLearningData));
  }, [learningStyle, adaptationsEnabled, trackEvent]);

  // Handle device simulation
  useEffect(() => {
    if (!adaptationsEnabled) return;

    // Update device simulation
    const deviceSettings = {
      desktop: {
        isSmallScreen: false,
        isTouch: false,
        isHighPerformance: true,
        isLowPower: false,
      },
      tablet: {
        isSmallScreen: true,
        isTouch: true,
        isHighPerformance: false,
        isLowPower: false,
      },
      mobile: {
        isSmallScreen: true,
        isTouch: true,
        isHighPerformance: false,
        isLowPower: true,
      },
    };

    // Store simulated device info in localStorage for the demo
    localStorage.setItem("demo_device_info", JSON.stringify(deviceSettings[simulatedDevice]));
  }, [simulatedDevice, adaptationsEnabled]);

  // Handle card interaction
  const handleCardInteraction = (cardId, action, data) => {
    trackEvent({
      category: "card_interaction",
      action,
      label: cardId,
      ...data,
    });
  };

  return (
    <div className="adaptive-ui-demo">
      <section className="adaptive-ui-demo__controls">
        <h2>Adaptation Controls</h2>
        <p>Use these controls to see how the UI adapts to different conditions.</p>

        <div className="control-group">
          <h3>Learning Style</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="learning-style"
                value="balanced"
                checked={learningStyle === "balanced"}
                onChange={() => setLearningStyle("balanced")}
              />
              Balanced
            </label>
            <label>
              <input
                type="radio"
                name="learning-style"
                value="visual"
                checked={learningStyle === "visual"}
                onChange={() => setLearningStyle("visual")}
              />
              Visual
            </label>
            <label>
              <input
                type="radio"
                name="learning-style"
                value="auditory"
                checked={learningStyle === "auditory"}
                onChange={() => setLearningStyle("auditory")}
              />
              Auditory
            </label>
            <label>
              <input
                type="radio"
                name="learning-style"
                value="kinesthetic"
                checked={learningStyle === "kinesthetic"}
                onChange={() => setLearningStyle("kinesthetic")}
              />
              Kinesthetic
            </label>
            <label>
              <input
                type="radio"
                name="learning-style"
                value="reading"
                checked={learningStyle === "reading"}
                onChange={() => setLearningStyle("reading")}
              />
              Reading/Writing
            </label>
          </div>
        </div>

        <div className="control-group">
          <h3>Device Simulation</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="device"
                value="desktop"
                checked={simulatedDevice === "desktop"}
                onChange={() => setSimulatedDevice("desktop")}
              />
              Desktop
            </label>
            <label>
              <input
                type="radio"
                name="device"
                value="tablet"
                checked={simulatedDevice === "tablet"}
                onChange={() => setSimulatedDevice("tablet")}
              />
              Tablet
            </label>
            <label>
              <input
                type="radio"
                name="device"
                value="mobile"
                checked={simulatedDevice === "mobile"}
                onChange={() => setSimulatedDevice("mobile")}
              />
              Mobile
            </label>
          </div>
        </div>

        <div className="control-group">
          <h3>UI Settings</h3>
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={colorScheme === "dark"}
                onChange={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
              />
              Dark Mode
            </label>

            <label>
              <input
                type="checkbox"
                checked={motionReduced}
                onChange={() => setMotionReduced(!motionReduced)}
              />
              Reduce Motion
            </label>

            <label>
              <input
                type="checkbox"
                checked={focusMode}
                onChange={() => setFocusMode(!focusMode)}
              />
              Focus Mode
            </label>
          </div>

          <div className="control-row">
            <label>UI Complexity</label>
            <select value={uiComplexity} onChange={(e) => setUIComplexity(e.target.value)}>
              <option value="simple">Simple</option>
              <option value="balanced">Balanced</option>
              <option value="advanced">Advanced</option>
              <option value="dense">Dense</option>
              <option value="focused">Focused</option>
            </select>
          </div>
        </div>

        <div className="control-group">
          <h3>Current Adaptations</h3>
          <div className="current-adaptations">
            <p>
              <strong>Color Scheme:</strong> {colorScheme}
            </p>
            <p>
              <strong>Motion:</strong> {motionReduced ? "Reduced" : "Standard"}
            </p>
            <p>
              <strong>UI Complexity:</strong> {uiComplexity}
            </p>
            <p>
              <strong>Focus Mode:</strong> {focusMode ? "Enabled" : "Disabled"}
            </p>
            <p>
              <strong>Content Priority:</strong> {contentPriority.join(", ")}
            </p>
            <p>
              <strong>Device:</strong> {JSON.stringify(deviceCapabilities)}
            </p>
          </div>
        </div>
      </section>

      <section className="adaptive-ui-demo__content">
        <h2>Content Cards</h2>
        <p>These cards adapt based on your learning style and other preferences.</p>

        <div className="card-grid">
          {sampleContent.map((card) => (
            <AdaptiveCard
              key={card.id}
              id={card.id}
              title={card.title}
              content={card.content}
              image={card.image}
              video={card.video}
              audio={card.audio}
              interactive={card.interactive}
              importance={card.importance}
              defaultExpanded={false}
              onInteraction={(action, data) => handleCardInteraction(card.id, action, data)}
              className="demo-card"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdaptiveUIDemo;
