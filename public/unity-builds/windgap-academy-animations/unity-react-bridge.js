// JavaScript bridge for Unity-React communication
// This script needs to be included in the HTML page that hosts the Unity WebGL player

// Function to send messages from Unity to React
function SendToReactJS(actionType, jsonData) {
  console.log("SendToReactJS:", actionType, jsonData);

  // Call the appropriate handler in the unityToReact object
  if (window.unityToReact) {
    switch (actionType) {
      case "ANIMATION_COMPLETE":
        if (window.unityToReact.onAnimationComplete) {
          window.unityToReact.onAnimationComplete(jsonData);
        }
        break;
      case "STORY_NODE":
        if (window.unityToReact.onStoryNode) {
          window.unityToReact.onStoryNode(jsonData);
        }
        break;
      case "STORY_COMPLETE":
        if (window.unityToReact.onStoryComplete) {
          window.unityToReact.onStoryComplete(jsonData);
        }
        break;
      case "CHARACTER_CHANGED":
        if (window.unityToReact.onCharacterChanged) {
          window.unityToReact.onCharacterChanged(jsonData);
        }
        break;
      case "UNITY_ERROR":
        if (window.unityToReact.onUnityError) {
          window.unityToReact.onUnityError(jsonData);
        }
        break;
      default:
        // Use the generic message handler for any other message types
        if (window.unityToReact.onMessage) {
          window.unityToReact.onMessage(actionType, jsonData);
        }
        break;
    }
  }
}
