#!/bin/bash
# Unity WebGL Integration Script
# This script integrates Unity WebGL builds with the Windgap Academy platform

echo "Setting up Unity WebGL integration with Windgap Academy platform..."

# Create integration directory
INTEGRATION_DIR="/workspaces/windgapacademy/unity-integration"
mkdir -p "$INTEGRATION_DIR"

# Create React component for embedding Unity WebGL content
cat > "$INTEGRATION_DIR/UnityPlayer.jsx" << EOL
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './UnityPlayer.css';

/**
 * UnityPlayer component for embedding Unity WebGL builds in the Windgap Academy platform
 * @param {Object} props - Component properties
 * @param {string} props.buildUrl - Base URL to the Unity WebGL build directory
 * @param {string} props.loaderUrl - URL to the Unity loader JavaScript file
 * @param {string} props.dataUrl - URL to the Unity data file
 * @param {string} props.frameworkUrl - URL to the Unity framework JavaScript file
 * @param {string} props.codeUrl - URL to the Unity WebAssembly code file
 * @param {number} props.width - Width of the Unity container (default: 960)
 * @param {number} props.height - Height of the Unity container (default: 600)
 * @param {Function} props.onScoreUpdate - Callback when a score is reported from Unity
 * @param {Function} props.onLevelComplete - Callback when a level is completed in Unity
 * @param {Function} props.onUnityLoaded - Callback when Unity has finished loading
 * @param {Object} props.initialState - Initial state to pass to Unity
 */
const UnityPlayer = ({ 
  buildUrl,
  loaderUrl = \`\${buildUrl}/Build/UnityLoader.js\`,
  dataUrl = null,
  frameworkUrl = null,
  codeUrl = null,
  width = 960,
  height = 600,
  onScoreUpdate = () => {},
  onLevelComplete = () => {},
  onUnityLoaded = () => {},
  initialState = {}
}) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unityInstance, setUnityInstance] = useState(null);
  
  // Determine if we're using a JSON configuration or direct URLs
  const useJsonConfig = !dataUrl || !frameworkUrl || !codeUrl;
  
  useEffect(() => {
    let unmounted = false;
    let unity = null;
    
    // Load Unity content
    const loadUnity = async () => {
      // Load the Unity loader script
      const script = document.createElement('script');
      script.src = loaderUrl;
      script.async = true;
      
      script.onload = () => {
        if (unmounted) return;
        
        // Initialize Unity with JSON config or direct URLs
        if (useJsonConfig) {
          unity = window.UnityLoader.instantiate('unityContainer', \`\${buildUrl}/Build/WebGLBuild.json\`, {
            onProgress: (instance, progress) => {
              if (unmounted) return;
              setLoadingProgress(progress);
              if (progress === 1) {
                setIsLoaded(true);
                setUnityInstance(instance);
                onUnityLoaded(instance);
              }
            }
          });
        } else {
          // Initialize with direct URLs (Unity 2019.3+)
          createUnityInstance(document.getElementById('unityContainer'), {
            dataUrl: dataUrl,
            frameworkUrl: frameworkUrl,
            codeUrl: codeUrl,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "Windgap Academy",
            productName: "Windgap Educational Game",
            productVersion: "1.0",
          }, (progress) => {
            if (unmounted) return;
            setLoadingProgress(progress);
          }).then((instance) => {
            if (unmounted) return;
            unity = instance;
            setIsLoaded(true);
            setUnityInstance(instance);
            onUnityLoaded(instance);
          }).catch((error) => {
            console.error("Unity content failed to load:", error);
          });
        }
      };
      
      document.body.appendChild(script);
    };
    
    if (containerRef.current) {
      loadUnity();
    }
    
    // Setup message listener for Unity
    const handleMessage = (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      
      // Handle messages from Unity
      if (event.data.type === 'UNITY_SCORE') {
        onScoreUpdate(event.data.data.score);
      } else if (event.data.type === 'UNITY_LEVEL_COMPLETION') {
        onLevelComplete(event.data.data.levelId, event.data.data.completed);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      unmounted = true;
      window.removeEventListener('message', handleMessage);
      
      // Clean up Unity instance on unmount
      if (unity) {
        unity.Quit();
      }
    };
  }, [buildUrl, loaderUrl, dataUrl, frameworkUrl, codeUrl, onScoreUpdate, onLevelComplete, onUnityLoaded, useJsonConfig]);
  
  // Send message to Unity
  const sendMessageToUnity = (gameObjectName, methodName, parameter) => {
    if (unityInstance && isLoaded) {
      unityInstance.SendMessage(gameObjectName, methodName, parameter);
      return true;
    }
    return false;
  };
  
  // Send initial state to Unity once loaded
  useEffect(() => {
    if (isLoaded && unityInstance && initialState && Object.keys(initialState).length > 0) {
      sendMessageToUnity('GameManager', 'SetInitialState', JSON.stringify(initialState));
    }
  }, [isLoaded, unityInstance, initialState]);
  
  return (
    <div className="unity-player-container">
      <div 
        id="unityContainer" 
        ref={containerRef} 
        style={{ width, height }}
        className="unity-player"
      />
      
      {!isLoaded && (
        <div className="unity-loading-overlay">
          <div className="unity-loading-bar">
            <div 
              className="unity-loading-bar-fill" 
              style={{ width: \`\${loadingProgress * 100}%\` }}
            />
          </div>
          <div className="unity-loading-text">
            Loading... {Math.round(loadingProgress * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

UnityPlayer.propTypes = {
  buildUrl: PropTypes.string.isRequired,
  loaderUrl: PropTypes.string,
  dataUrl: PropTypes.string,
  frameworkUrl: PropTypes.string,
  codeUrl: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onScoreUpdate: PropTypes.func,
  onLevelComplete: PropTypes.func,
  onUnityLoaded: PropTypes.func,
  initialState: PropTypes.object
};

export default UnityPlayer;
EOL

# Create CSS for the Unity Player component
cat > "$INTEGRATION_DIR/UnityPlayer.css" << EOL
.unity-player-container {
  position: relative;
  display: inline-block;
  background: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.unity-player {
  display: block;
}

.unity-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

.unity-loading-bar {
  width: 80%;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.unity-loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.unity-loading-text {
  font-size: 14px;
  text-align: center;
}
EOL

# Create a sample integration page
cat > "$INTEGRATION_DIR/UnityGamePage.jsx" << EOL
import React, { useState } from 'react';
import UnityPlayer from './UnityPlayer';

const UnityGamePage = () => {
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Handle score updates from Unity
  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    // You could also send this to your backend for tracking
    console.log('Score updated:', newScore);
  };
  
  // Handle level completion from Unity
  const handleLevelComplete = (levelId, completed) => {
    if (completed && !completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
      // You could also send this to your backend for tracking
      console.log('Level completed:', levelId);
    }
  };
  
  // Handle Unity loaded event
  const handleUnityLoaded = () => {
    setIsLoaded(true);
    console.log('Unity content loaded successfully');
  };
  
  return (
    <div className="unity-game-page">
      <h1>Windgap Academy Educational Game</h1>
      
      <div className="game-container">
        <UnityPlayer 
          buildUrl="/unity-builds/windgap-academy-game"
          width={960}
          height={600}
          onScoreUpdate={handleScoreUpdate}
          onLevelComplete={handleLevelComplete}
          onUnityLoaded={handleUnityLoaded}
          initialState={{
            playerName: "Student",
            difficulty: "medium",
            accessibility: true,
            startingLevel: 1
          }}
        />
      </div>
      
      <div className="game-status">
        <h2>Game Progress</h2>
        <p>Current Score: {score}</p>
        <p>Completed Levels: {completedLevels.length > 0 ? completedLevels.join(', ') : 'None yet'}</p>
        <p>Game Status: {isLoaded ? 'Loaded' : 'Loading...'}</p>
      </div>
      
      <div className="game-controls">
        <h2>Game Controls</h2>
        <p>Use the following controls to play the game:</p>
        <ul>
          <li><strong>W, A, S, D</strong> - Move character</li>
          <li><strong>Space</strong> - Jump</li>
          <li><strong>E</strong> - Interact with objects</li>
          <li><strong>ESC</strong> - Pause game</li>
        </ul>
      </div>
    </div>
  );
};

export default UnityGamePage;
EOL

# Create a script for building and copying Unity builds to the web app
cat > "$INTEGRATION_DIR/deploy-unity-build.sh" << EOL
#!/bin/bash
# Script to deploy Unity WebGL builds to the Windgap Academy web app

# Paths
UNITY_BUILD_PATH="/workspaces/windgapacademy/unity-setup/simulated-unity/WebGLBuild"
WEB_APP_UNITY_PATH="/workspaces/windgapacademy/public/unity-builds/windgap-academy-game"

# Create destination directory if it doesn't exist
mkdir -p "\$WEB_APP_UNITY_PATH"

# Copy the Unity WebGL build to the web app public directory
echo "Copying Unity WebGL build to web app..."
cp -r "\$UNITY_BUILD_PATH"/* "\$WEB_APP_UNITY_PATH"

# Create .htaccess file for proper MIME types
cat > "\$WEB_APP_UNITY_PATH/.htaccess" << HTACCESS
# Unity WebGL build MIME types
AddType application/wasm .wasm
AddType application/javascript .js
AddType application/octet-stream .data
AddType application/json .json
AddType text/html .html
AddType text/css .css
AddType image/png .png
AddType image/jpg .jpg
AddType image/jpeg .jpeg
AddType image/gif .gif
AddType image/ico .ico

# Enable CORS
Header set Access-Control-Allow-Origin "*"
HTACCESS

# Update permissions
chmod -R 755 "\$WEB_APP_UNITY_PATH"

echo "Unity WebGL build deployed successfully to the web app!"
echo "The game is now available at: /unity-builds/windgap-academy-game/"
EOL

# Create documentation
cat > "$INTEGRATION_DIR/README.md" << EOL
# Unity Integration with Windgap Academy

This directory contains the necessary files and components to integrate Unity WebGL builds with the Windgap Academy platform.

## Overview

Unity integration allows for interactive 3D educational games and simulations to be embedded directly within the Windgap Academy platform. These Unity-based experiences enhance learning through gamification and interactive visual aids.

## Components

1. **UnityPlayer.jsx** - React component for embedding Unity WebGL builds
2. **UnityPlayer.css** - Styling for the Unity player component
3. **UnityGamePage.jsx** - Example page showing how to use the Unity player
4. **deploy-unity-build.sh** - Script for deploying Unity builds to the web app

## Integration Architecture

The integration uses the following approach:

1. Unity games are built to WebGL format
2. The WebGL builds are hosted within the Windgap Academy web platform
3. Communication between Unity and the web platform is achieved through:
   - JavaScript messaging between Unity and the React application
   - API calls to backend services for data persistence

## Usage

### Embedding a Unity Game

Use the UnityPlayer component in your React code:

\`\`\`jsx
import UnityPlayer from '../path/to/UnityPlayer';

const MyGamePage = () => {
  return (
    <div>
      <h1>My Educational Game</h1>
      <UnityPlayer 
        buildUrl="/unity-builds/my-game"
        width={960}
        height={600}
        onScoreUpdate={(score) => console.log('Score:', score)}
        onLevelComplete={(levelId, completed) => console.log('Level completed:', levelId)}
      />
    </div>
  );
};
\`\`\`

### Communication with Unity

#### From React to Unity

Send messages to Unity game objects:

\`\`\`jsx
// Get a reference to the Unity instance
const handleUnityLoaded = (unityInstance) => {
  // Store the Unity instance
  this.unityInstance = unityInstance;
  
  // Send data to Unity
  unityInstance.SendMessage('GameManager', 'SetDifficulty', 'hard');
};

// Use the reference later
const setPlayerName = (name) => {
  if (this.unityInstance) {
    this.unityInstance.SendMessage('GameManager', 'SetPlayerName', name);
  }
};
\`\`\`

#### From Unity to React

In your Unity C# script:

\`\`\`csharp
using UnityEngine;
using System.Runtime.InteropServices;

public class JavaScriptBridge : MonoBehaviour
{
    // Define JavaScript function
    [DllImport("__Internal")]
    private static extern void SendMessageToReact(string messageType, string messageData);
    
    // Example: Send score to React
    public void ReportScore(int score)
    {
        // Only works in WebGL builds
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendMessageToReact("UNITY_SCORE", "{\\"score\\":" + score + "}");
        #endif
    }
    
    // Example: Report level completion
    public void ReportLevelCompletion(int levelId)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendMessageToReact("UNITY_LEVEL_COMPLETION", "{\\"levelId\\":" + levelId + ",\\"completed\\":true}");
        #endif
    }
}
\`\`\`

## Deployment

To deploy a new Unity WebGL build:

1. Build your Unity project to WebGL format
2. Run the deployment script:

\`\`\`bash
./deploy-unity-build.sh
\`\`\`

This will copy the build to the correct location in the web app and set up the necessary configurations.

## Troubleshooting

Common issues and solutions:

- **Unity content doesn't load**: Check browser console for errors, ensure all files are properly copied to the web directory
- **Communication not working**: Verify the SendMessage syntax and that object/method names match exactly
- **Performance issues**: Adjust the Unity WebGL build settings for better performance (memory, compression, etc.)
EOL

# Make script executable
chmod +x "$INTEGRATION_DIR/deploy-unity-build.sh"

echo "Unity WebGL integration setup completed successfully!"
echo "Integration files are available in: $INTEGRATION_DIR"