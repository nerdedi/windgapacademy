# Windgap Academy Input System Guide

This guide provides detailed information on setting up and working with the Unity Input System in the Windgap Academy project.

## Overview

The Input System package in Unity provides a modern, flexible framework for handling user input across various devices. In Windgap Academy, we use it to:

- Handle keyboard, mouse, and touch inputs
- Support multiple input devices and control schemes
- Create responsive and customizable character controls
- Implement input-based interactive elements

## Setting Up the Input System

### Installation

The Input System package is automatically included when you run the `transfer-unity-project.sh` script, but you can also install it manually:

1. Open your Unity project
2. Go to Window > Package Manager
3. Click the "+" button > "Add package by name"
4. Enter `com.unity.inputsystem` and click "Add"

### Input Actions Setup

The Windgap Academy project includes a pre-configured Input Actions asset located at:
`Assets/Scenes/InputSystem_Actions.inputactions`

This file defines:

- Action Maps (groupings of related inputs)
- Input Actions (specific input events)
- Bindings (connections between physical inputs and actions)

## Working with Input Actions

### Structure of Our Input System

The Input System in Windgap Academy is organized into these action maps:

1. **Player** - For character movement and interactions
   - Move (WASD/Arrow Keys)
   - Jump (Space)
   - Interact (E/Mouse Click)

2. **UI** - For menu navigation and UI interactions
   - Navigate (WASD/Arrow Keys)
   - Submit (Enter/Space)
   - Cancel (Escape)

3. **Camera** - For camera controls
   - Rotate (Mouse/Touch)
   - Zoom (Mouse Wheel/Pinch)

### Using Input Actions in Scripts

Here's how to use the Input System in your C# scripts:

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    // Reference to the Input Actions asset
    private PlayerInput playerInput;
    private InputAction moveAction;
    private InputAction jumpAction;

    private void Awake()
    {
        // Get the PlayerInput component (automatically added when using Input Actions asset)
        playerInput = GetComponent<PlayerInput>();

        // Get references to specific actions
        moveAction = playerInput.actions["Move"];
        jumpAction = playerInput.actions["Jump"];
    }

    private void OnEnable()
    {
        // Subscribe to jump action
        jumpAction.performed += OnJump;
    }

    private void OnDisable()
    {
        // Unsubscribe from jump action
        jumpAction.performed -= OnJump;
    }

    private void Update()
    {
        // Read movement input
        Vector2 moveInput = moveAction.ReadValue<Vector2>();

        // Use movement input to move character
        transform.Translate(new Vector3(moveInput.x, 0, moveInput.y) * Time.deltaTime * 5f);
    }

    private void OnJump(InputAction.CallbackContext context)
    {
        // Jump when the jump action is performed
        Debug.Log("Jump!");
        // Implement jump logic here
    }
}
```

## Customizing Input Actions

To customize the Input Actions:

1. Open the `InputSystem_Actions.inputactions` asset in Unity
2. Use the visual editor to:
   - Add new Action Maps for different contexts
   - Create new Actions for specific inputs
   - Define Bindings to connect physical inputs to actions
   - Set up Control Schemes for different input devices

## Input System and React Integration

The Input System in Unity is designed to work seamlessly with our React integration. User inputs in Unity can trigger events that are communicated back to React:

```csharp
// In Unity
private void OnInteract(InputAction.CallbackContext context)
{
    if (context.performed)
    {
        // Send message to React when interaction happens
        ReactBridgeManager.Instance.SendInteractionEvent("interaction_started",
            new Dictionary<string, object> {
                { "objectName", interactableObject.name },
                { "position", transform.position }
            });
    }
}
```

In React, you can listen for these events:

```jsx
// In React component
const handleUnityMessage = (actionType, data) => {
  if (actionType === "INTERACTION_EVENT" && data.eventName === "interaction_started") {
    console.log(`Interaction with ${data.objectName} at position ${data.position}`);
    // Handle the interaction in the React UI
  }
};
```

## Troubleshooting

Common issues and solutions:

1. **Input not registering**:
   - Ensure the Input System package is installed
   - Check that the Input Actions asset is properly configured
   - Verify your GameObject has a PlayerInput component attached

2. **Input Actions not found**:
   - Make sure you're referencing the correct action names
   - Check if the Action Map is enabled

3. **Multiple inputs conflicting**:
   - Review your Input Action bindings for conflicts
   - Consider using different Action Maps for different contexts

4. **Performance issues**:
   - Avoid polling input values every frame when possible
   - Use callback events (performed, started, canceled) instead

## Resources

- [Unity Input System Documentation](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.5/manual/index.html)
- [Input System GitHub Repository](https://github.com/Unity-Technologies/InputSystem)
- [Input System Tutorial Videos](https://learn.unity.com/tutorial/new-input-system)
