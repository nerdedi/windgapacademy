# Unity Integration for Windgap Academy

This document provides an overview of the Unity integration with the Windgap Academy platform, including setup instructions, usage guidelines, and best practices.

## Overview

The Unity integration allows Windgap Academy to incorporate interactive 3D educational experiences directly into the platform. These Unity-based games and simulations enhance learning through gamification, visualization, and hands-on interaction.

## Directory Structure

```
/workspaces/windgapacademy/
├── unity-setup/                  # Unity setup and build configuration
│   ├── WebGLBuilder.cs           # Unity editor script for WebGL builds
│   ├── build-webgl.sh            # Script to build Unity projects for WebGL
│   ├── create-project.sh         # Script to create new Unity projects
│   ├── docker-compose.yml        # Docker configuration for Unity Editor
│   └── simulated-unity/          # Simulated Unity environment (for development)
│
├── unity-integration/            # Integration components
│   ├── UnityPlayer.jsx           # React component for embedding Unity WebGL
│   ├── UnityPlayer.css           # Styling for Unity player
│   ├── UnityGamePage.jsx         # Example page with Unity integration
│   ├── deploy-unity-build.sh     # Script to deploy Unity builds to web app
│   └── README.md                 # Documentation
│
└── public/unity-builds/          # Public directory for Unity WebGL builds
    └── windgap-academy-game/     # Example Unity game build
```

## Setup Instructions

### Prerequisites

- Unity Hub and Unity Editor (2022.3.20f1 or later) with WebGL build support
- Node.js and npm (for the React components)
- Docker and Docker Compose (for containerized development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nerdedi/windgapacademy.git
   cd windgapacademy
   ```

2. Set up Unity for development:

   ```bash
   cd unity-setup
   chmod +x *.sh
   ./create-project.sh WindgapAcademyGame
   ```

3. Build a Unity WebGL project:

   ```bash
   ./build-webgl.sh WindgapAcademyGame
   ```

4. Deploy the Unity build to the web app:
   ```bash
   cd ../unity-integration
   chmod +x deploy-unity-build.sh
   ./deploy-unity-build.sh
   ```

## Using the Unity Integration

### Embedding Unity Content in React

To embed a Unity WebGL build in a React component:

```jsx
import UnityPlayer from "../unity-integration/UnityPlayer";

const GamePage = () => {
  return (
    <div>
      <h1>Educational Game</h1>
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

### Communication Between Unity and React

#### From React to Unity

```jsx
// Get reference to Unity instance
const handleUnityLoaded = (unityInstance) => {
  // Store the Unity instance
  this.unityInstance = unityInstance;

  // Send data to Unity
  unityInstance.SendMessage("GameManager", "SetDifficulty", "hard");
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
}
```

## Educational Features

The Unity integration includes several educational features:

### Accessibility Features

- Text-to-speech for UI elements
- High contrast mode
- Larger UI elements
- Simplified controls
- Screen reader compatibility
- Closed captions
- Adjustable game speed

### Learning Analytics

- Track time spent on objectives
- Record attempts and successes
- Monitor overall progress
- Generate learning reports

### Adaptive Difficulty

- Adjust difficulty based on performance
- Personalize learning experience
- Track performance metrics
- Optimize learning curve

## Best Practices

1. **Performance Optimization**
   - Use texture compression
   - Minimize draw calls
   - Optimize scripts for WebGL
   - Use LOD (Level of Detail) for complex models

2. **Accessibility**
   - Ensure keyboard navigation
   - Provide visual and audio feedback
   - Allow customization of controls
   - Follow WCAG guidelines

3. **Integration**
   - Use event-based communication
   - Minimize data transfer between Unity and React
   - Handle loading states gracefully
   - Implement error recovery

4. **Educational Design**
   - Define clear learning objectives
   - Provide immediate feedback
   - Track progress and achievements
   - Balance challenge with accessibility

## Troubleshooting

### Common Issues

1. **Unity content doesn't load**
   - Check browser console for errors
   - Verify all files are correctly deployed
   - Ensure MIME types are properly configured

2. **Communication not working**
   - Verify SendMessage syntax
   - Check object and method names match exactly
   - Ensure messages are properly formatted

3. **Performance issues**
   - Reduce texture sizes
   - Simplify models
   - Optimize scripts
   - Adjust WebGL memory settings

## Resources

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [React Integration Guide](https://react.dev/learn/integrating-with-other-libraries)
- [Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Educational Game Design](https://www.researchgate.net/publication/258926822_Gamification_in_Education_What_How_Why_Bother)

## Contributing

Contributions to the Unity integration are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
