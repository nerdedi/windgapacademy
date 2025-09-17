# Code-Based Animation System for Windgap Academy

I've created a comprehensive system for using code to create and control animations in Unity for the Windgap Academy project. This implementation demonstrates how to:

1. Control animations programmatically in Unity
2. Create dynamic animation sequences
3. Generate procedural animations
4. Connect animations to the React frontend

## Files Created

### Unity C# Scripts

These scripts are located in `/workspaces/windgapacademy/unity-integration/unity-scripts/`:

1. `Animation/AnimationController.cs` - Core animation controller that plays and manages animations
2. `Animation/AnimationSequencePlayer.cs` - Creates sequences of animations programmatically
3. `Animation/ProceduralAnimator.cs` - Handles IK-based procedural animations
4. `Animation/EmoteSystem.cs` - Manages character emote animations
5. `Animation/ReactAnimationManager.cs` - Interfaces with React to control animations
6. `Demo/AnimationCodeDemo.cs` - Example script showing how to use animations in code
7. `Demo/AnimationDemoScene.cs` - UI-based demo scene for testing animations

### React Components

1. `src/components/CharacterAnimationController.jsx` - React component for controlling Unity animations
2. `src/components/CharacterAnimationController.css` - Styles for the animation controller
3. `src/pages/CharacterAnimationDemo.jsx` - Demo page showcasing the animation system

### Documentation

1. `docs/unity-code-animation-guide.md` - Comprehensive guide to using code for animations

## How to Use This System

### In Unity

1. **Add animation components to your character:**
   - Add `AnimationController.cs` for basic animation control
   - Add `AnimationSequencePlayer.cs` for creating animation sequences
   - Add `ProceduralAnimator.cs` for IK-based animations
   - Add `EmoteSystem.cs` for emotion-based animations

2. **Control animations from code:**
   ```csharp
   // Get the animation controller
   AnimationController animController = GetComponent<AnimationController>();
   
   // Play a simple animation
   animController.PlayAnimation("talk");
   
   // Play an animation with duration
   animController.PlayAnimationWithDuration("celebrate", 2.0f);
   
   // Create a sequence
   AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();
   sequencePlayer.StartSequence()
       .Then("talk", 2.0f)
       .Then("think", 1.5f)
       .Then("celebrate", 1.0f)
       .EndWithIdle();
   ```

3. **Add procedural animations:**
   ```csharp
   // Get the procedural animator
   ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();
   
   // Make character look at something
   procAnimator.LookAt(targetPosition);
   
   // Point at something
   procAnimator.PointAt(targetPosition);
   ```

### In React

1. **Import the animation controller component:**
   ```jsx
   import CharacterAnimationController from '../components/CharacterAnimationController';
   ```

2. **Add it to your page:**
   ```jsx
   <CharacterAnimationController 
     characterId="Winnie"
     width={800}
     height={450}
   />
   ```

3. **Trigger animations from React:**
   ```jsx
   import { sendToUnity } from '../unity-integration/UnityBridge';
   
   // Play an animation
   sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
     actionType: 'START_ANIMATION',
     characterName: 'Winnie',
     animationName: 'talk',
     duration: 3.0
   });
   ```

## Demo

To see the animation system in action:

1. Open the Character Animation Demo page in your React application
2. Use the UI controls to trigger different animations
3. See how animations can be sequenced and combined

## Documentation

For detailed information on using code to create and control animations, refer to:
- `/workspaces/windgapacademy/docs/unity-code-animation-guide.md`

This guide provides comprehensive examples of how to use all aspects of the animation system, from basic animation control to complex procedural animations and React integration.

## Next Steps

1. **Integrate with your character models**: Add these components to your existing character prefabs
2. **Extend the animation system**: Add custom animations and behaviors for specific characters
3. **Connect to your educational content**: Trigger animations based on learning milestones and interactions