# Windgap Academy Character Animation System

This directory contains the animation system for Windgap Academy characters. The system provides advanced animation capabilities including:

- Animation queueing and blending
- Facial expressions using blend shapes
- Priority-based animation playback
- Event-driven animation callbacks

## Usage Guide

### Setup

1. Add the `CharacterAnimationManager` component to your character prefab
2. If your character uses the existing `CharacterInstance` component, add the `CharacterController` adapter component
3. Set up the facial renderer if you want to use facial animations
4. Initialize the animation manager in your character script:

```csharp
// Get the character controller
CharacterController controller = GetComponent<CharacterController>();

// Get the animation manager
CharacterAnimationManager animManager = GetComponent<CharacterAnimationManager>();

// Initialize
animManager.Initialize(controller);
```

### Playing Animations

```csharp
// Play a simple animation
animManager.PlayAnimation("Walk");

// Play an animation with parameters
var parameters = new Dictionary<string, object>
{
    { "Speed", 1.5f },
    { "Trigger", "Jump" }
};
animManager.PlayAnimation("Run", parameters);

// Play a high priority animation that can interrupt others
animManager.PlayAnimationWithPriority("Fall", AnimationPriority.Critical);
```

### Facial Animations

```csharp
// Set specific blend shapes
animManager.SetBlendShape("Smile", 0.8f);

// Use predefined emotional states
animManager.SetEmotion(EmotionalState.Happy, 0.7f);
```

### Animation Events

```csharp
// Subscribe to animation events
animManager.OnAnimationStarted += (animName) => Debug.Log($"Started: {animName}");
animManager.OnAnimationCompleted += (animName) => Debug.Log($"Completed: {animName}");
```

## Demo Scene

An `AnimationDemo` scene has been included to demonstrate how to use the animation system. To try it:

1. Open the AnimationDemo scene
2. Assign a character prefab with an Animator component to the character prefab field
3. Press Play to see the animation demo in action

## Integrating With Existing Characters

If you're using the existing `CharacterInstance` class, the `CharacterController` adapter is provided to bridge between the two systems. You don't need to modify your existing character code.

## Adding Custom Emotions

To add custom emotions:

1. Extend the `EmotionalState` enum in `EmotionalState.cs`
2. Update the `SetEmotion` method in `CharacterAnimationManager.cs` to handle the new emotion

## Support

For issues or questions about the animation system, contact the development team.