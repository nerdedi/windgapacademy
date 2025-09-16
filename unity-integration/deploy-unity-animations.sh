#!/bin/bash
# Unity WebGL build deployment script
# This script deploys a Unity WebGL build to the public directory

# Configuration
UNITY_PROJECT_PATH="unity-project"
UNITY_BUILD_NAME="windgap-academy-animations"
PUBLIC_PATH="public/unity-builds/$UNITY_BUILD_NAME"

# Create the public directory if it doesn't exist
mkdir -p "$PUBLIC_PATH"
mkdir -p "$PUBLIC_PATH/Build"
mkdir -p "$PUBLIC_PATH/TemplateData"

echo "Deploying Unity WebGL build to $PUBLIC_PATH..."

# Copy the WebGL build files
if [ -d "$UNITY_PROJECT_PATH/Builds/WebGL/$UNITY_BUILD_NAME" ]; then
  # Copy the build files
  cp -r "$UNITY_PROJECT_PATH/Builds/WebGL/$UNITY_BUILD_NAME/Build" "$PUBLIC_PATH/"
  cp -r "$UNITY_PROJECT_PATH/Builds/WebGL/$UNITY_BUILD_NAME/TemplateData" "$PUBLIC_PATH/"
  cp "$UNITY_PROJECT_PATH/Builds/WebGL/$UNITY_BUILD_NAME/index.html" "$PUBLIC_PATH/"
  
  echo "Unity WebGL build deployed successfully!"
else
  echo "Unity WebGL build not found at $UNITY_PROJECT_PATH/Builds/WebGL/$UNITY_BUILD_NAME"
  echo "Using development placeholder..."
  
  # Copy the placeholder files
  cp -r "unity-integration/placeholder-build/"* "$PUBLIC_PATH/"
  
  echo "Development placeholder deployed successfully!"
fi

# Create the unity-react-bridge.js file if it doesn't exist
if [ ! -f "$PUBLIC_PATH/unity-react-bridge.js" ]; then
  cat > "$PUBLIC_PATH/unity-react-bridge.js" << 'EOF'
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
EOF
  
  echo "Unity-React bridge file created!"
fi

echo "Unity deployment complete!"