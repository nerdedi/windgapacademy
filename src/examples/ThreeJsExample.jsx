import React from "react";
import { createRoot } from "react-dom/client";

import LearningEnvironment from "./components/LearningEnvironment";
import VirtualCharacters from "./components/VirtualCharacters";
import "./styles/animations.css";

/**
 * Example implementation of the WindgapCharacterSystem
 * This demonstrates how to use the Three.js-based character system
 * that replaces the previous Unity implementation
 */

// Sample lesson content
const sampleLesson = {
  lessonId: "intro-to-3d",
  title: "Introduction to 3D Graphics",
  description: "Learn the basics of 3D graphics and WebGL rendering",
  characters: ["winnie"],
  environment: "classroom",
  content: [
    {
      id: "intro",
      title: "Welcome to 3D Graphics",
      content:
        "In this lesson, we&apos;ll explore the fascinating world of 3D graphics using web technologies like Three.js and WebGL. These powerful tools allow us to create immersive experiences directly in the browser without plugins like Unity.",
      characterAnimation: { character: "winnie", animation: "teaching" },
    },
    {
      id: "webgl",
      title: "What is WebGL?",
      content:
        "WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D and 2D graphics within any compatible web browser without plugins. WebGL is fully integrated with other web standards, allowing GPU-accelerated physics, image processing, and effects as part of the web page canvas.",
      characterAnimation: { character: "winnie", animation: "teaching" },
    },
    {
      id: "threejs",
      title: "Three.js Framework",
      content:
        "Three.js is a cross-browser JavaScript library/API used to create and display animated 3D computer graphics in a web browser using WebGL. It makes working with WebGL much simpler by providing a scene graph and many high-level components.",
      characterAnimation: { character: "winnie", animation: "teaching" },
    },
    {
      id: "quiz",
      title: "Quick Check",
      content: "Let&apos;s test your understanding of WebGL and Three.js.",
      interactive: true,
      interactiveComponent: "SimpleQuiz",
      characterAnimation: { character: "winnie", animation: "encourage" },
    },
    {
      id: "models",
      title: "3D Models and Animation",
      content:
        "Three.js supports loading 3D models in various formats including glTF, which is becoming the standard for 3D web content. Models can include animations, textures, and materials that make characters like Winnie come to life in your browser.",
      characterAnimation: { character: "winnie", animation: "teaching" },
    },
    {
      id: "conclusion",
      title: "Congratulations!",
      content:
        "You&apos;ve completed this introduction to 3D graphics on the web! Now you understand how our virtual academy characters are rendered using modern web technologies instead of Unity.",
      characterAnimation: { character: "winnie", animation: "celebrate" },
    },
  ],
};

/**
 * Example application that demonstrates the Three.js character system
 */
const App = () => {
  const handleLessonComplete = (data) => {
    console.log("Lesson completed:", data);
    alert(`Congratulations! You completed the lesson with a score of ${data.score}%`);
  };

  const handleLessonProgress = (data) => {
    console.log("Lesson progress:", data);
  };

  const handleCharacterMessage = (message) => {
    console.log("Character message:", message);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Windgap Academy</h1>
        <p>Three.js Character System Example</p>
      </header>

      <main className="app-content">
        <section className="demo-section">
          <h2>Example 1: Full Learning Environment</h2>
          <p>
            This example shows a complete learning environment with interactive lesson content and
            3D characters:
          </p>
          <div className="demo-container">
            <LearningEnvironment
              {...sampleLesson}
              onComplete={handleLessonComplete}
              onProgress={handleLessonProgress}
            />
          </div>
        </section>

        <section className="demo-section">
          <h2>Example 2: Simple Character Display</h2>
          <p>This example shows just the 3D characters without the lesson content:</p>
          <div className="demo-container" style={{ height: "400px" }}>
            <VirtualCharacters
              containerId="simple-characters"
              selectedCharacters={["winnie", "natalie"]}
              environment="library"
              onMessage={handleCharacterMessage}
              interactionEnabled={true}
              autoRotate={true}
              initialAnimations={{
                winnie: "idle",
                natalie: "teaching",
              }}
            />
          </div>
        </section>

        <section className="demo-section">
          <h2>Three.js vs Unity Comparison</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Three.js Implementation</th>
                  <th>Previous Unity Implementation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>File Size</td>
                  <td>~120KB (Three.js core)</td>
                  <td>~3-5MB (Unity WebGL build)</td>
                </tr>
                <tr>
                  <td>Loading Time</td>
                  <td>Fast (few seconds)</td>
                  <td>Slower (10+ seconds)</td>
                </tr>
                <tr>
                  <td>Mobile Performance</td>
                  <td>Excellent</td>
                  <td>Variable</td>
                </tr>
                <tr>
                  <td>Integration with React</td>
                  <td>Native JavaScript integration</td>
                  <td>Required bridge code</td>
                </tr>
                <tr>
                  <td>Development Workflow</td>
                  <td>Single codebase</td>
                  <td>Separate Unity project</td>
                </tr>
                <tr>
                  <td>Animation Control</td>
                  <td>Direct access to animation system</td>
                  <td>Message passing required</td>
                </tr>
                <tr>
                  <td>Deployment</td>
                  <td>Standard web deployment</td>
                  <td>Special build process required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Windgap Academy © 2025 - Three.js Character System</p>
      </footer>
    </div>
  );
};

// Render the application
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

export default App;
