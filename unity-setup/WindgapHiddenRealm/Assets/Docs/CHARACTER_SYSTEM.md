# Windgap Academy - Character System

This document explains how to use the character system in the Windgap Hidden Realm Unity project, which integrates with the new Input System.

## Setup Overview

The character system consists of several key components:

1. **Input System**: Uses Unity's new Input System with a custom action map
2. **Character Controller**: Handles movement, jumping, and basic interactions
3. **Emotional State System**: Manages character facial expressions and emotional responses
4. **Educational Character**: A specialized character that can guide students through learning experiences
5. **Interaction System**: Allows characters to interact with objects and NPCs in the world

## Getting Started

### 1. Input System Setup

The project uses Unity's new Input System. The input actions are defined in `Assets/Input/InputSystem_Actions.inputactions`.

To use the input system in your character:

1. Add the `PlayerInputHandler` component to your character GameObject
2. Connect event handlers to respond to input events

```csharp
// Example: Subscribe to movement input
inputHandler.OnMove += HandleMove;
```

### 2. Character Controller

The `PlayerCharacterController` component provides standard character movement capabilities:

- WASD/Arrow key movement
- Camera-relative movement
- Jumping (Space)
- Sprinting (Left Shift)
- Crouching (C)
- Basic attack (Left Mouse Button)

To add a character controller to your scene:

1. Create a character model with an Animator component
2. Add the `CharacterController` Unity component
3. Add the `PlayerCharacterController` script
4. Add the `PlayerInputHandler` script
5. Configure the movement settings in the Inspector
6. Ensure you have a ground check GameObject as a child of the character

### 3. Emotional State System

Characters can express emotions through the `CharacterEmotionalState` component:

- Eight emotional states: Neutral, Happy, Sad, Angry, Scared, Surprised, Confused, Excited
- Smooth transitions between emotions
- Timed emotions that return to neutral

To use the emotional state system:

1. Add the `CharacterEmotionalState` component to your character
2. Set up an Animator with appropriate facial animation parameters
3. Call `SetEmotionalState()` to change emotions:

```csharp
// Example: Make character happy for 2 seconds
emotionalState.SetEmotionalState(EmotionalState.Happy, false, 2f);
```

### 4. Educational Characters

Educational characters provide interactive learning experiences:

- Detect nearby students
- Engage in dialog with typing effects
- Express emotions during conversation
- Guide students through learning activities

To create an educational character:

1. Add the `EducationalCharacter` component to an NPC GameObject
2. Configure the dialog settings and interaction radius
3. Add TMPro text components for dialog display
4. Add voice clips for character speech

### 5. Interaction System

Characters can interact with objects using the interaction system:

1. Create interactable objects by extending the `InteractableObject` class
2. Implement custom interaction behavior in the `OnInteract()` method
3. Characters can interact with objects using the E key

## Common Character Setup

Here's a typical setup for a playable character:

1. Create a character GameObject with a model and animator
2. Add the `CharacterController` Unity component
3. Add the `PlayerInputHandler` script
4. Add the `PlayerCharacterController` script
5. Add the `CharacterEmotionalState` script
6. Configure the ground check and interaction points
7. Set up appropriate layers for ground detection and interaction

## Animation Setup

For character animations to work correctly:

1. Ensure your character model has an Animator component
2. Use the following animation parameters:
   - "Speed" (float): Controls walk/run animation speed
   - "Grounded" (bool): Whether the character is on the ground
   - "Jump" (trigger): Trigger jump animation
   - "Attack" (trigger): Trigger attack animation
   - "Crouch" (bool): Whether the character is crouching
   - "Death" (trigger): Trigger death animation
   - Emotion parameters (float): "Neutral", "Happy", "Sad", etc.

## Input System Reference

The input system includes the following actions:

### Player Actions
- **Move**: WASD/Arrow keys for movement
- **Look**: Mouse movement for camera control
- **Jump**: Space bar
- **Attack**: Left mouse button
- **Interact**: E key
- **Crouch**: C key
- **Sprint**: Left Shift
- **Previous/Next**: 1/2 keys (for cycling through items)

### UI Actions
- Standard UI navigation actions

## Extending the System

You can extend the character system by:

1. Creating custom interactable objects for educational content
2. Adding new emotional states for more complex character reactions
3. Implementing specialized character behaviors for different learning scenarios
4. Creating character abilities that utilize the input system

## Troubleshooting

Common issues:

1. **Character not moving**: Check that the InputHandler is properly connected and the character controller is enabled
2. **Animations not playing**: Verify animation parameter names match those in the scripts
3. **Interactions not working**: Check interaction layers and make sure colliders are properly set up
4. **Emotion system not working**: Ensure the animator has the correct emotion parameters defined

## Additional Resources

- See the Unity documentation for more details on the new Input System
- Check the `unity-integration/` directory for more information on integrating with the web platform
- See `character-animation-design.md` for more details on the animation system