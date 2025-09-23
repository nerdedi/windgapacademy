/**
 * Example of how to import and use the Three.js character system
 */

// Method 1: Import everything from the index file
import WindgapCharacterSystem from "../components/WindgapCharacterSystem";
import CharacterControllerOnly from "../threeJs/CharacterController";
import ThreeJsSystem from "../threeJs/index";

// Method 2: Import specific components
import { VirtualCharacters, LearningEnvironment, initThreeJsGlobally } from "../threeJs/index";

// Method 3: Import components directly from their source files
import CharacterController from "../utils/CharacterController";
import WebGLEffects from "../utils/WebGLEffects";

// Method 4: Import just the character controller from its convenience file

// Initialize Three.js globally if needed
// initThreeJsGlobally();

/**
 * Example React component using the Three.js character system
 */
const ExampleThreeJsUsage = () => {
  // Use the imported components
  return (
    <div className="three-js-example">
      <h1>Three.js Character System Example</h1>

      {/* Method 1: Using VirtualCharacters from the imported ThreeJsSystem */}
      <ThreeJsSystem.VirtualCharacters
        containerId="example-container-1"
        selectedCharacters={["winnie"]}
        environment="classroom"
        height="400px"
      />

      {/* Method 2: Using LearningEnvironment imported directly */}
      <LearningEnvironment
        lessonId="example-lesson"
        title="Example Lesson"
        characters={["natalie"]}
        environment="library"
      />
    </div>
  );
};

export default ExampleThreeJsUsage;
