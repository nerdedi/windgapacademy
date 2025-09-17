/**
 * Unity Bridge - Placeholder implementation for development builds
 *
 * This file provides mock implementations of Unity integration functions
 * to allow the application to build without Unity WebGL builds present.
 */

// Mock Unity instance placeholder
let unityInstance = null;

/**
 * Send a message to Unity
 * @param {string} gameObjectName - The name of the GameObject to send message to
 * @param {string} methodName - The method name to call on the GameObject
 * @param {any} data - The data to send to Unity (will be JSON serialized)
 */
export const sendToUnity = (gameObjectName, methodName, data) => {
  if (typeof window !== "undefined" && window.unityInstance) {
    try {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      window.unityInstance.SendMessage(gameObjectName, methodName, message);
      console.log(`Unity message sent to ${gameObjectName}.${methodName}:`, data);
    } catch (error) {
      console.warn("Failed to send message to Unity:", error);
    }
  } else {
    console.log(`[Mock] Unity message to ${gameObjectName}.${methodName}:`, data);
  }
};

/**
 * Register a handler for messages from Unity
 * @param {string} gameObjectName - The GameObject to listen for messages from
 * @param {function} handler - The handler function to call when messages are received
 * @returns {function} Unregister function to clean up the handler
 */
export const registerUnityMessageHandler = (gameObjectName, handler) => {
  const handlerName = `onUnityMessage_${gameObjectName}_${Date.now()}`;

  if (typeof window !== "undefined") {
    window[handlerName] = handler;
    console.log(`Unity message handler registered: ${handlerName}`);

    // Return unregister function
    return () => {
      if (window[handlerName]) {
        delete window[handlerName];
        console.log(`Unity message handler unregistered: ${handlerName}`);
      }
    };
  }

  console.log(`[Mock] Unity message handler registered for ${gameObjectName}`);
  return () => {};
};

/**
 * Initialize Unity WebGL build
 * @param {HTMLCanvasElement} canvas - The canvas element for Unity
 * @param {object} buildConfig - Unity build configuration
 * @returns {Promise} Promise that resolves when Unity is loaded
 */
export const initializeUnity = async (canvas, buildConfig) => {
  if (typeof window === "undefined") {
    console.log("[Mock] Unity initialization in SSR environment");
    return null;
  }

  try {
    // Check if Unity loader is available
    if (typeof window.createUnityInstance === "function") {
      unityInstance = await window.createUnityInstance(canvas, buildConfig);
      window.unityInstance = unityInstance;
      console.log("Unity WebGL build initialized successfully");
      return unityInstance;
    }

    console.warn("Unity loader not available, using mock implementation");
    return null;
  } catch (error) {
    console.error("Failed to initialize Unity:", error);
    return null;
  }
};

/**
 * Get the current Unity instance
 * @returns {object|null} The Unity instance or null if not initialized
 */
export const getUnityInstance = () => {
  return unityInstance || (typeof window !== "undefined" ? window.unityInstance : null);
};

/**
 * Check if Unity is ready and loaded
 * @returns {boolean} True if Unity is loaded and ready
 */
export const isUnityReady = () => {
  const instance = getUnityInstance();
  return instance !== null && typeof instance.SendMessage === "function";
};

export default {
  sendToUnity,
  registerUnityMessageHandler,
  initializeUnity,
  getUnityInstance,
  isUnityReady,
};
