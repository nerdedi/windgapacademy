# Using Code to Create and Control Animations in Unity

This guide demonstrates how to use code to create and control animations in Unity for the Windgap Academy project.

## Overview

The Windgap Academy animation system allows you to:

1. **Play and control pre-made animations** from code
2. **Create animation sequences** programmatically
3. **Generate procedural animations** at runtime
4. **Respond to events** with appropriate animations
5. **Integrate with React** for web-controlled animations

## Core Animation Components

The following scripts provide the foundation for animation control through code:

### 1. AnimationController.cs

The main controller for playing and managing animations.

```csharp
// Get a reference to the AnimationController
AnimationController animController = GetComponent<AnimationController>();

// Play a specific animation
animController.PlayAnimation("talk");

// Play an animation with a specific duration, then return to idle
animController.PlayAnimationWithDuration("celebrate", 2.5f);

// Check if an animation is currently playing
if (!animController.IsPlaying("walk")) {
    animController.PlayAnimation("walk");
}

// Play a random animation from a list
animController.PlayRandomAnimation("talk", "think", "celebrate");
```

### 2. AnimationSequencePlayer.cs

Creates sequences of animations that play one after another.

```csharp
// Get a reference to the AnimationSequencePlayer
AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();

// Create and play an animation sequence
sequencePlayer.StartSequence()
    .Then("idle", 1.0f)        // Start with idle for 1 second
    .Then("talk", 2.0f)        // Talk for 2 seconds
    .Then("think", 2.0f)       // Think for 2 seconds
    .Then("celebrate", 1.5f)   // Celebrate for 1.5 seconds
    .EndWithIdle();            // Return to idle
```

### 3. ProceduralAnimator.cs

Provides runtime procedural animation control using IK (Inverse Kinematics).

```csharp
// Get a reference to the ProceduralAnimator
ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();

// Make the character look at a target
procAnimator.LookAt(targetPosition, 0.8f);

// Make the character point at something
procAnimator.PointAt(targetPosition);

// Move the character's hands to specific positions
procAnimator.MoveLeftHandTo(leftHandTarget, 0.9f);
procAnimator.MoveRightHandTo(rightHandTarget, 0.9f);

// Reset procedural animations
procAnimator.StopLooking();
procAnimator.ResetHandPositions();
```

### 4. EmoteSystem.cs

Manages emotion-based animations with predefined emotes.

```csharp
// Get a reference to the EmoteSystem
EmoteSystem emoteSystem = GetComponent<EmoteSystem>();

// Play a specific emote
emoteSystem.PlayEmote("happy");

// Play a random emote
emoteSystem.PlayRandomEmote();

// Get all available emotes
string[] emotes = emoteSystem.GetAvailableEmotes();
```

### 5. ReactAnimationManager.cs

Interfaces with React to control animations from the web frontend.

```csharp
// This is typically accessed through the singleton instance
ReactAnimationManager.Instance.PlayCharacterAnimation("winnie", "talk", 3.0f);
ReactAnimationManager.Instance.PlayCharacterEmote("winnie", "happy");
```

## Common Animation Scenarios

### 1. Responding to Player Interaction

```csharp
// In your interaction handler
public void OnPlayerInteract()
{
    // Get animation controller
    AnimationController animController = GetComponent<AnimationController>();

    // Play talk animation for 3 seconds
    animController.PlayAnimationWithDuration("talk", 3.0f);

    // Then let the animation system automatically return to idle
}
```

### 2. Creating Character Behavior Patterns

```csharp
// Create an idle behavior pattern
public void PlayIdleBehavior()
{
    AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();

    // Random idle sequence
    int randomChoice = Random.Range(0, 3);

    switch (randomChoice)
    {
        case 0:
            // Simple think and return to idle
            sequencePlayer.StartSequence()
                .Then("idle", 1.0f)
                .Then("think", 2.0f)
                .EndWithIdle();
            break;

        case 1:
            // Look around
            sequencePlayer.StartSequence()
                .Then("idle", 0.5f)
                .Then("think", 1.0f)
                .EndWithIdle();

            // Also use procedural animation to look around
            StartCoroutine(LookAround());
            break;

        case 2:
            // Just play a longer idle
            sequencePlayer.StartSequence()
                .Then("idle", 3.0f)
                .EndWithIdle();
            break;
    }
}

private IEnumerator LookAround()
{
    ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();

    // Look left
    Vector3 leftPos = transform.position + transform.right * -3f;
    procAnimator.LookAt(leftPos, 0.7f);
    yield return new WaitForSeconds(1.0f);

    // Look right
    Vector3 rightPos = transform.position + transform.right * 3f;
    procAnimator.LookAt(rightPos, 0.7f);
    yield return new WaitForSeconds(1.0f);

    // Look center
    procAnimator.StopLooking();
}
```

### 3. Creating a Teaching Animation Sequence

```csharp
public void ExplainConcept()
{
    AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();
    ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();

    // Start with introduction animation
    sequencePlayer.StartSequence()
        .Then("talk", 3.0f)
        .Then("idle", 0.5f);

    // Point at the learning object
    Invoke("PointAtLearningObject", 3.5f);

    // Continue explanation after pointing
    Invoke("ContinueExplanation", 6.0f);
}

private void PointAtLearningObject()
{
    ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();
    Transform learningObject = GameObject.Find("LearningObject").transform;

    procAnimator.PointAt(learningObject.position);
}

private void ContinueExplanation()
{
    ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();
    AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();

    // Stop pointing
    procAnimator.StopPointing();

    // Continue with more animations
    sequencePlayer.StartSequence()
        .Then("talk", 2.0f)
        .Then("think", 1.0f)
        .Then("talk", 2.0f)
        .Then("celebrate", 1.0f)
        .EndWithIdle();
}
```

## Integrating with React

### Sending Animation Commands from React

In your React component:

```jsx
import { sendToUnity } from "../unity-integration/UnityBridge";

// Play a simple animation
const playTalkAnimation = () => {
  sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
    actionType: "START_ANIMATION",
    characterName: "Winnie",
    animationName: "talk",
    duration: 3.0,
  });
};

// Play an emote
const playHappyEmote = () => {
  sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
    actionType: "PLAY_EMOTE",
    characterId: "Winnie",
    emoteName: "happy",
  });
};

// Play a complex animation sequence
const playExplanationSequence = () => {
  sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
    actionType: "PLAY_SEQUENCE",
    characterId: "Winnie",
    sequence: [
      { animation: "talk", duration: 2.0 },
      { animation: "think", duration: 1.5 },
      { animation: "talk", duration: 2.0 },
      { animation: "celebrate", duration: 1.0 },
    ],
  });
};
```

### Handling Animation Events in React

```jsx
const handleUnityMessage = (actionType, data) => {
  if (actionType === "ANIMATION_STARTED") {
    console.log(`Animation started: ${data.animationName} for ${data.characterName}`);
    // Update UI or state based on animation start
  }

  if (actionType === "ANIMATION_COMPLETED") {
    console.log(`Animation completed: ${data.animationName} for ${data.characterName}`);
    // Trigger next interaction or UI update
  }
};
```

## Best Practices

1. **Organize animations by function** - Group animations for different purposes (idle, talk, teach, etc.)
2. **Use animation events** - Add events to animation clips to trigger code at specific points
3. **Create reusable animation patterns** - Build common sequences that can be reused
4. **Test animations in context** - Animations may look different when characters are in different positions
5. **Balance procedural and pre-made animations** - Use procedural animations for dynamic situations, pre-made for quality
6. **Optimize for WebGL** - Keep animations simple and efficient for web performance

## Creating Your Own Animation Controller

You can extend the existing system or create your own custom controllers:

```csharp
using UnityEngine;
using WindgapAcademy.Animation;

public class MyCustomAnimator : MonoBehaviour
{
    [SerializeField] private AnimationController animController;
    [SerializeField] private ProceduralAnimator procAnimator;

    // Custom animation behavior
    public void TeachMathConcept()
    {
        // First point at the math problem
        Transform mathProblem = GameObject.Find("MathProblem").transform;
        procAnimator.PointAt(mathProblem.position);

        // Play talk animation
        animController.PlayAnimationWithDuration("talk", 4.0f);

        // After talking, show the solution
        Invoke("ShowSolution", 4.0f);
    }

    private void ShowSolution()
    {
        // Point at the solution
        Transform solution = GameObject.Find("Solution").transform;
        procAnimator.PointAt(solution.position);

        // Play celebration animation
        animController.PlayAnimationWithDuration("celebrate", 2.0f);

        // Return to normal
        Invoke("ReturnToNormal", 2.0f);
    }

    private void ReturnToNormal()
    {
        procAnimator.StopPointing();
        animController.PlayAnimation("idle");
    }
}
```

## Conclusion

By using code to control animations in Unity, you can create dynamic and responsive characters that enhance the learning experience in Windgap Academy. The flexible animation system allows for both simple animation playback and complex interactive sequences that can be controlled from both Unity and the React frontend.

For more details on specific animation components, refer to the comments in the code files themselves.
