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

```jsx
import UnityPlayer from "../path/to/UnityPlayer";

const MyGamePage = () => {
  return (
    <div>
      <h1>My Educational Game</h1>
      <UnityPlayer
        buildUrl="/unity-builds/my-game"
        width={960}
        height={600}
        onScoreUpdate={(score) => console.log("Score:", score)}
        onLevelComplete={(levelId, completed) => console.log("Level completed:", levelId)}
      />
    </div>
  );
};
```

### Communication with Unity

#### From React to Unity

Send messages to Unity game objects:

```jsx
// Get a reference to the Unity instance
const handleUnityLoaded = (unityInstance) => {
  // Store the Unity instance
  this.unityInstance = unityInstance;

  // Send data to Unity
  unityInstance.SendMessage("GameManager", "SetDifficulty", "hard");
};

// Use the reference later
const setPlayerName = (name) => {
  if (this.unityInstance) {
    this.unityInstance.SendMessage("GameManager", "SetPlayerName", name);
  }
};
```

#### From Unity to React

In your Unity C# script:

```csharp
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
        SendMessageToReact("UNITY_SCORE", "{\"score\":" + score + "}");
        #endif
    }

    // Example: Report level completion
    public void ReportLevelCompletion(int levelId)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendMessageToReact("UNITY_LEVEL_COMPLETION", "{\"levelId\":" + levelId + ",\"completed\":true}");
        #endif
    }
}
```

## Deployment

To deploy a new Unity WebGL build:

1. Build your Unity project to WebGL format
2. Run the deployment script:

```bash
./deploy-unity-build.sh
```

This will copy the build to the correct location in the web app and set up the necessary configurations.

## Troubleshooting

Common issues and solutions:

- **Unity content doesn't load**: Check browser console for errors, ensure all files are properly copied to the web directory
- **Communication not working**: Verify the SendMessage syntax and that object/method names match exactly
- **Performance issues**: Adjust the Unity WebGL build settings for better performance (memory, compression, etc.)
