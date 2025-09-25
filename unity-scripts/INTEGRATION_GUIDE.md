# Unity 3D Game Kit Integration for Windgap Academy

This document provides step-by-step instructions on how to adapt the Unity 3D Game Kit to create interactive educational experiences for Windgap Academy.

## Prerequisites

1. **Unity Hub and Unity 2022.3 LTS or newer**
2. **3D Game Kit from Unity Asset Store**: [https://assetstore.unity.com/packages/templates/tutorials/3d-game-kit-115747](https://assetstore.unity.com/packages/templates/tutorials/3d-game-kit-115747)
3. **Basic Unity and C# knowledge**
4. **Windgap Academy C# Scripts**: Scripts available in `/workspaces/windgapacademy/unity-scripts/`

## Step 1: Set Up a New Unity Project

1. Open Unity Hub and create a new 3D project
2. Import the 3D Game Kit from the Asset Store:
   - Window > Package Manager > My Assets > 3D Game Kit > Import
3. Allow the project to compile and set up the necessary components

## Step 2: Adapt the Environment for Educational Purposes

### 2.1 Open the Demo Scene

1. Open the main demo scene: `/Assets/3DGamekit/Scenes/GamePlay.unity`
2. Explore the environment to understand the game kit structure
3. Identify areas to adapt for educational stations

### 2.2 Modify the Environment

1. Remove combat-focused elements:
   - Delete enemy spawners and hazards
   - Keep puzzle elements that can be repurposed
2. Create open learning areas:
   - Modify terrain for more accessible spaces
   - Create clear pathways between learning stations
3. Adjust lighting for educational clarity:
   - Increase overall brightness for better visibility
   - Use spotlights to highlight educational areas

## Step 3: Import Windgap Academy Scripts

1. Copy the scripts from `/workspaces/windgapacademy/unity-scripts/` to your Unity project:
   - `WindgapAcademyManager.cs`
   - `StudentCharacterController.cs`
   - `LearningStation.cs`
   - `WindgapAcademyUI.cs`
2. Create a new folder in your Unity project: `/Assets/WindgapAcademy/`
3. Place these scripts in the new folder

## Step 4: Set Up the Character Controller

### 4.1 Replace the Default Character Controller

1. Find the Ellen character prefab in the scene
2. Remove the default player controller components:
   - Remove `PlayerController.cs`
   - Keep the character model, animations, and basic components
3. Add the `StudentCharacterController.cs` component to the character

### 4.2 Configure Character Animation

1. Link the character's Animator component to `StudentCharacterController.cs`
2. Verify animation parameters match those in the script:
   - IsWalking
   - IsRunning
   - Jump
   - InteractingWithStation

## Step 5: Create Learning Stations

### 5.1 Set Up Learning Station Prefabs

1. Create a new empty GameObject named "Learning Station"
2. Add the `LearningStation.cs` component
3. Add visual elements to represent educational content:
   - Add a podium or display surface (use kit props)
   - Add particle effects for visibility
4. Configure each station with educational content:
   - Station ID
   - Station Name
   - Content Type
   - Description

### 5.2 Deploy Stations in the Environment

1. Place multiple learning station instances throughout the map
2. Ensure stations are accessible via clear paths
3. Use different content types for variety:
   - Text-based lessons
   - Quiz stations
   - Interactive demonstrations
   - Video learning stations

## Step 6: Implement the Management System

### 6.1 Create Academy Manager

1. Create an empty GameObject named "WindgapAcademyManager"
2. Add the `WindgapAcademyManager.cs` component
3. Configure the manager:
   - Link to all learning stations in the scene
   - Reference the student character
   - Set up educational module information

### 6.2 Create UI System

1. Create a new Canvas GameObject named "WindgapAcademyUI"
2. Add the `WindgapAcademyUI.cs` component
3. Design the UI panels:
   - Progress panel
   - Lesson content panel
   - Interaction prompts
   - Feedback system
4. Link the UI elements to the manager

## Step 7: Connect with React Integration

### 7.1 Add WebGL Communication

1. Create a JavaScript file named `unity-bridge.jslib` in `/Assets/Plugins/`:

```javascript
mergeInto(LibraryManager.library, {
  SendToReact: function (eventName, data) {
    try {
      window.dispatchReactUnityEvent(UTF8ToString(eventName), UTF8ToString(data));
    } catch (e) {
      console.error("Error sending message to React:", e);
    }
  },
});
```

2. Ensure `WindgapAcademyManager.cs` uses the correct method signatures for WebGL communication

### 7.2 Configure WebGL Build Settings

1. Go to File > Build Settings
2. Select WebGL as the platform
3. Configure Player Settings:
   - Enable "Allow cross-site scripting"
   - Set compression format to "Brotli"
   - Enable "Decompression Fallback"
4. Add all necessary scenes to the build

## Step 8: Test the Integration

1. Build the WebGL project: File > Build And Run
2. Test the educational experience locally
3. Verify communication between Unity and React works properly
4. Check all educational functions:
   - Character movement
   - Learning station interaction
   - Progress tracking
   - UI display

## Step 9: Customize for Windgap Academy

1. Replace textures and models with Windgap Academy branding:
   - Update character appearance
   - Add logo to UI elements
   - Customize environment colors
2. Add custom sound effects and music:
   - Replace combat sounds with educational feedback sounds
   - Use appropriate background music for learning
3. Optimize performance for WebGL:
   - Reduce texture sizes
   - Optimize lighting for web performance
   - Minimize physics calculations

## Step 10: Deploy to Windgap Academy Platform

1. Build the final WebGL project to a designated folder
2. Update the Windgap Academy React component to load your new build:
   - Update paths in `EnhancedUnityPlayer.jsx`
   - Configure event handlers for educational events
3. Test the complete integration in the Windgap Academy platform
4. Document your customizations for future maintenance

## Troubleshooting

### Common Issues and Solutions

1. **WebGL Build Errors**:
   - Check for unsupported features in WebGL
   - Verify all plugins are WebGL-compatible

2. **Communication Issues**:
   - Ensure the React component is properly loading the Unity build
   - Check browser console for errors in message passing

3. **Performance Problems**:
   - Reduce texture sizes and polygon counts
   - Optimize lighting (baked lighting recommended)
   - Minimize real-time shadows

4. **Animation Issues**:
   - Verify animation parameter names match exactly
   - Check for animation transitions configuration

## Resources

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl-gettingstarted.html)
- [3D Game Kit Documentation](https://learn.unity.com/project/3d-game-kit)
- [React-Unity WebGL Integration Guide](https://react-unity-webgl.dev/)
