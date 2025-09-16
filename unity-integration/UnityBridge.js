// Unity-React Communication Bridge
// This file provides helper functions for bidirectional communication between Unity and React

/**
 * Set up the Unity communication bridge in the global scope
 * This should be called when your React component mounts
 * @param {Function} onMessage - Callback function for handling messages from Unity
 * @returns {Function} Cleanup function to remove the global handlers
 */
export function setupUnityBridge(onMessage) {
  // Create the global message handler for Unity
  window.unityToReact = {
    onAnimationComplete: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        onMessage("ANIMATION_COMPLETE", data);
      } catch (error) {
        console.error("Error parsing animation complete data:", error);
      }
    },

    onStoryNode: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        onMessage("STORY_NODE", data);
      } catch (error) {
        console.error("Error parsing story node data:", error);
      }
    },

    onStoryComplete: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        onMessage("STORY_COMPLETE", data);
      } catch (error) {
        console.error("Error parsing story complete data:", error);
      }
    },

    onCharacterChanged: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        onMessage("CHARACTER_CHANGED", data);
      } catch (error) {
        console.error("Error parsing character changed data:", error);
      }
    },

    onUnityError: (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        console.error("Unity Error:", data.message);
        onMessage("UNITY_ERROR", data);
      } catch (error) {
        console.error("Error parsing unity error data:", error);
      }
    },

    // Generic message handler for any other message types
    onMessage: (actionType, jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        onMessage(actionType, data);
      } catch (error) {
        console.error(`Error parsing ${actionType} data:`, error);
      }
    },
  };

  // Return cleanup function
  return () => {
    delete window.unityToReact;
  };
}

/**
 * Send a message to Unity
 * @param {Object} unityInstance - The Unity instance object
 * @param {string} gameObjectName - Name of the GameObject in Unity
 * @param {string} methodName - Name of the method to call
 * @param {Object|string} data - Data to send (will be converted to JSON if object)
 * @returns {boolean} Whether the message was sent successfully
 */
export function sendToUnity(unityInstance, gameObjectName, methodName, data) {
  if (!unityInstance || typeof unityInstance.SendMessage !== "function") {
    console.error("Unity instance is not available or does not have SendMessage method");
    return false;
  }

  try {
    const message = typeof data === "object" ? JSON.stringify(data) : data;
    unityInstance.SendMessage(gameObjectName, methodName, message);
    return true;
  } catch (error) {
    console.error("Error sending message to Unity:", error);
    return false;
  }
}

/**
 * Helper function to get the Unity instance from the canvas element
 * @returns {Object|null} The Unity instance or null if not found
 */
export function getUnityInstance() {
  const canvas = document.querySelector("canvas");
  if (!canvas || !canvas.parentNode || !canvas.parentNode.__unityInstance) {
    return null;
  }

  return canvas.parentNode.__unityInstance;
}

/**
 * Start an animation for a character
 * @param {string} characterName - Name of the character
 * @param {string} animationName - Name of the animation
 * @param {Object} options - Additional options for the animation
 * @returns {boolean} Whether the message was sent successfully
 */
export function playAnimation(characterName, animationName, options = {}) {
  const unityInstance = getUnityInstance();
  if (!unityInstance) return false;

  return sendToUnity(unityInstance, "ReactBridgeManager", "ReceiveFromReact", {
    actionType: "START_ANIMATION",
    characterName,
    animationName,
    options,
  });
}

/**
 * Set the active character
 * @param {string} characterName - Name of the character to set as active
 * @param {Object} options - Additional options
 * @returns {boolean} Whether the message was sent successfully
 */
export function setCharacter(characterName, options = {}) {
  const unityInstance = getUnityInstance();
  if (!unityInstance) return false;

  return sendToUnity(unityInstance, "ReactBridgeManager", "ReceiveFromReact", {
    actionType: "SET_CHARACTER",
    characterName,
    options,
  });
}

/**
 * Start a story by ID
 * @param {string} storyId - ID of the story to start
 * @param {Object} options - Additional options
 * @returns {boolean} Whether the message was sent successfully
 */
export function startStory(storyId, options = {}) {
  const unityInstance = getUnityInstance();
  if (!unityInstance) return false;

  return sendToUnity(unityInstance, "ReactBridgeManager", "ReceiveFromReact", {
    actionType: "START_STORY",
    storyId,
    options,
  });
}

/**
 * Make a choice in the current story
 * @param {number} choiceIndex - Index of the choice to make
 * @returns {boolean} Whether the message was sent successfully
 */
export function makeChoice(choiceIndex) {
  const unityInstance = getUnityInstance();
  if (!unityInstance) return false;

  return sendToUnity(unityInstance, "StorylineManager", "MakeChoice", choiceIndex.toString());
}

/**
 * Initialize the Unity player with initial state
 * @param {Object} state - Initial state for Unity
 * @returns {boolean} Whether the message was sent successfully
 */
export function initializeUnity(state) {
  const unityInstance = getUnityInstance();
  if (!unityInstance) return false;

  return sendToUnity(unityInstance, "ReactBridgeManager", "ReceiveFromReact", {
    actionType: "INITIALIZE",
    state,
  });
}
