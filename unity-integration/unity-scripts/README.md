# Unity Animation System Extension for Windgap Academy

This extension automates the setup of code-based animations in Unity, eliminating the need for manual configuration. It provides a one-click solution to add all necessary animation components to your character models, set up React integration, and create demo scenes.

## Installation

1. Copy the entire `unity-scripts` folder into your Unity project's `Assets` folder.
2. Open Unity and navigate to the `Windgap Academy > Animation System` menu.

## Features

### One-Click Animation System Setup

The extension includes a visual wizard that:

- Automatically detects character models in your project
- Adds all necessary animation components
- Sets up IK rigging for procedural animations
- Configures the React integration bridge
- Creates a demo scene to test your animations

### Automatic Script Generation

The extension automatically creates the necessary scripts if they don't exist:

- `AnimationController.cs` - Core component for playing and managing animations
- `AnimationSequencePlayer.cs` - Creates sequences of animations programmatically
- `ProceduralAnimator.cs` - Handles IK-based procedural animations
- `EmoteSystem.cs` - Manages character emote animations
- `ReactAnimationManager.cs` - Interfaces with React to control animations

### Integration with React

The extension sets up the connection between Unity and React, allowing you to control animations from your React frontend. This works with the existing characters from the CurriculumBuilderWithBlender component.

## How to Use

### Setup Wizard

1. Open Unity
2. Select `Windgap Academy > Animation System > Setup Wizard` from the menu
3. Select the character models you want to set up
4. Configure the options as needed
5. Click `Setup Animation System`

### Quick Setup

If you just want to set up a single character:

1. Select your character model in the Unity Editor
2. Select `Windgap Academy > Animation System > Quick Setup Selected Character` from the menu

### Creating a Demo Scene

To create a demo scene for testing:

1. Select `Windgap Academy > Animation System > Create New Demo Scene` from the menu

## React Integration

The extension sets up the React bridge automatically. In your React code, you can trigger animations using:

```javascript
import { sendToUnity } from '../unity-integration/UnityBridge';

// Play an animation
sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
  actionType: 'START_ANIMATION',
  characterName: 'Winnie',
  animationName: 'talk',
  duration: 3.0
});

// Play an emote
sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
  actionType: 'PLAY_EMOTE',
  characterName: 'Winnie',
  emoteName: 'happy'
});

// Make character look at something
sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
  actionType: 'LOOK_AT',
  characterName: 'Winnie',
  position: { x: 1, y: 1.5, z: 2 },
  duration: 2.0
});
```

## Works With Your Existing Characters

The extension is designed to work with the characters defined in your CurriculumBuilderWithBlender component:

```tsx
const curriculumCharacters = [
  {
    id: "winnie",
    name: "Winnie",
    path: "/assets/characters/winnie/winnie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
      { id: "encourage", label: "Encourage", clipName: "encourage" },
      { id: "celebrate", label: "Celebrate", clipName: "celebrate" },
    ],
    subjects: ["Life Skills", "Digital Literacy"],
  },
  {
    id: "natalie",
    name: "Natalie",
    path: "/assets/characters/natalie/natalie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
    ],
    subjects: ["Employment Skills", "Digital Literacy"],
  },
];
```

The extension will detect these characters and set up the animation system to work with them.

## Troubleshooting

If you encounter issues with the extension:

1. Make sure your character models have proper rigging (bones and skinned mesh renderers)
2. Check if your animation clips are properly configured in the Animator component
3. Verify that the Animation Rigging package is installed in your Unity project
4. Check the console for any error messages from the extension

For additional help, refer to the documentation created by the extension or contact the Windgap Academy development team.