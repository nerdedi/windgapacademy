# Unity Integration for Windgap Academy

This directory contains all the necessary files and components for integrating Unity WebGL builds with the React frontend of Windgap Academy.

## Overview

The Unity integration provides interactive 3D character animations and storylines that enhance the learning experience. The integration uses a bidirectional communication bridge between React and Unity to enable seamless interaction.

## Directory Structure

- `EnhancedUnityPlayer.jsx` - React component for embedding Unity WebGL builds
- `EnhancedUnityPlayer.css` - Styles for the Unity player component
- `UnityBridge.js` - Helper functions for communication between Unity and React
- `StorylineManager.js` - JavaScript class for managing storylines
- `AnimationLibrary.jsx` - Library of character animations for easy reuse
- `unity-scripts/` - C# scripts for Unity projects
  - `ReactBridgeManager.cs` - Main Unity script for communication with React
  - `CharacterManager.cs` - Script for managing characters in Unity
  - `AnimationManager.cs` - Script for handling animations in Unity
  - `ReactBridgeManager.cs` - Main Unity script for communication with React
  - `CharacterManager.cs` - Script for managing characters in Unity
  - `AnimationManager.cs` - Script for handling animations in Unity
  - `StorylineManager.cs` - Script for handling interactive stories in Unity
- `storylines/` - JSON data for interactive stories
- `deploy-unity-animations.sh` - Script for deploying Unity WebGL builds

## Usage

### Using the Unity Player

```jsx
import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";

const MyComponent = () => {
  const handleUnityLoaded = () => {
    console.log("Unity loaded successfully");
  };

  const handleUnityMessage = (actionType, data) => {
    console.log(`Received message from Unity: ${actionType}`, data);
  };

  return (
    <EnhancedUnityPlayer
      buildUrl="/unity-builds/windgap-academy-animations"
      width={800}
      height={450}
      onUnityLoaded={handleUnityLoaded}
      onUnityMessage={handleUnityMessage}
      initialState={{
        character: "Winnie",
        startAnimation: "Idle",
      }}
    />
  );
};
```

### Using the Character Animation Player

```jsx
import CharacterAnimationPlayer from "../components/CharacterAnimationPlayer";

const MyComponent = () => {
  const handleAnimationComplete = (animationName, character) => {
    console.log(`Animation completed: ${animationName} for ${character}`);
  };

  return (
    <CharacterAnimationPlayer
      characterName="Winnie"
      width={800}
      height={450}
      storylineId="welcome-to-windgap"
      onAnimationComplete={handleAnimationComplete}
    />
  );
};
```

### Using the Animation Library

```jsx
import AnimationLibrary, { AnimationButton } from "../unity-integration/AnimationLibrary";

const MyComponent = () => {
  const playTalkAnimation = () => {
    AnimationLibrary.talk("Winnie");
  };

  return (
    <div>
      <button onClick={playTalkAnimation}>Play Talk Animation</button>
      <AnimationButton character="Winnie" animationType="celebrate" label="Celebrate!" />
    </div>
  );
};
```

## Deployment

To deploy a new Unity WebGL build:

1. Build the Unity project with WebGL target
2. Run the deployment script:

```bash
./unity-integration/deploy-unity-animations.sh
```

## Communication Protocol

### React to Unity

Messages are sent from React to Unity using the `SendMessage` method:

```javascript
unityInstance.SendMessage(
  "ReactBridgeManager",
  "ReceiveFromReact",
  JSON.stringify({
    actionType: "START_ANIMATION",
    characterName: "Winnie",
    animationName: "Talk",
  }),
);
```

### Unity to React

Messages are sent from Unity to React using the global `unityToReact` object:

```javascript
window.unityToReact = {
  onAnimationComplete: (data) => {
    const result = JSON.parse(data);
    // Handle animation completion
  },

  onStoryNode: (data) => {
    const node = JSON.parse(data);
    // Handle story node change
  },
};
```

## Adding New Storylines

To add a new storyline:

1.  Create a new JSON story definition in `storylines/`
2.  Import it in `StorylineManager.js`
3.  Use the `CharacterAnimationPlayer` component with the new storyline ID

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

````

## Deployment

To deploy a new Unity WebGL build:

1. Build your Unity project to WebGL format
2. Run the deployment script:

```bash
./deploy-unity-build.sh
````

This will copy the build to the correct location in the web app and set up the necessary configurations.

## Troubleshooting

Common issues and solutions:

- **Unity content doesn't load**: Check browser console for errors, ensure all files are properly copied to the web directory
- **Communication not working**: Verify the SendMessage syntax and that object/method names match exactly
- **Performance issues**: Adjust the Unity WebGL build settings for better performance (memory, compression, etc.)
