# Animation Rigging Setup Guide for Windgap Academy

This guide explains how to set up animation rigging for character animations in your Unity project for Windgap Academy.

## Overview

Animation rigging allows for dynamic control of character animations at runtime, making it possible to create reactive and interactive character experiences. This setup is essential for the character animations in Windgap Academy, enabling characters to:

- Look at specific targets (head tracking)
- Reach for objects (hand IK)
- Respond to user interactions
- Blend between animations smoothly

## Prerequisites

- Unity 2023.2 LTS or later
- Animation Rigging package installed in your Unity project
- A rigged humanoid character model (such as from Creative Characters FREE)

## Using the Animation Rigging Setup Script

The `setup-animation-rigging.sh` script automates the process of setting up animation rigging for your Windgap Academy Unity project.

### What the Script Does

1. **Creates animation scripts**:
   - `CharacterAnimatorSetup.cs` - Sets up the rig constraints for head and hand IK
   - `AnimationController.cs` - Manages animation states and communication with React

2. **Creates editor tools**:
   - `CreateAnimationTargetsPrefab.cs` - Tool to create animation targets for head and hand IK

### Running the Setup

```bash
# Navigate to the Windgap Academy root directory
cd /workspaces/windgapacademy

# Run the animation rigging setup script
bash scripts/setup-animation-rigging.sh
```

You'll be prompted to enter the path to your Unity project. The script will then create the necessary scripts and provide instructions for the next steps.

## Manual Setup Steps

After running the script, you'll need to:

1. **Install the Animation Rigging package** in your Unity project:
   - Window > Package Manager > + > Add package by name > `com.unity.animation.rigging`

2. **Create animation targets**:
   - In Unity, go to the menu: Windgap > Create Animation Targets
   - This creates a prefab with target objects for head and hands

3. **Set up your character**:
   - Add your character model to the scene
   - Add the `CharacterAnimatorSetup` component to your character
   - Drag the created target objects to the respective fields

4. **Configure the animation controller**:
   - Add the `AnimationController` component to your character
   - Set animation names to match your animation clips

## Animation System Architecture

The animation system consists of:

### 1. Character Animator Setup

This component sets up the rigging constraints:

- Head look-at constraint (using `MultiAimConstraint`)
- Hand IK constraints (using `TwoBoneIKConstraint`)

### 2. Animation Controller

This component manages animation playback:

- Controls animation state transitions
- Communicates with React via the `ReactBridgeManager`
- Handles animation events

### 3. React Integration

Animations can be triggered from React:

```jsx
import { sendToUnity } from "../unity-integration/UnityBridge";

// Play an animation
const playAnimation = (characterName, animationName) => {
  sendToUnity("ReactBridgeManager", "PlayAnimation", {
    character: characterName,
    animation: animationName,
  });
};

// Example usage
playAnimation("Winnie", "talk");
```

## Supported Animations

The default setup supports these animation types:

- `idle` - Default idle animation
- `talk` - Talking animation
- `walk` - Walking animation
- `jump` - Jumping animation
- `celebrate` - Celebration animation
- `think` - Thinking animation

You can add more by extending the `AnimationController` script.

## Troubleshooting

- **Missing Animation Rigging package**: Install it via the Package Manager
- **Animation targets not positioned correctly**: Adjust their transform in the scene
- **Animations not playing**: Check the Animator Controller setup and animation parameter names
- **IK not working**: Make sure the character model has a properly configured humanoid rig
