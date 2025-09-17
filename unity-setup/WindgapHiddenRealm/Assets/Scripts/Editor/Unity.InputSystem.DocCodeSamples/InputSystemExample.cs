using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

namespace Unity.InputSystem.DocCodeSamples
{
    /// <summary>
    /// Example of using the new Input System for character control
    /// </summary>
    public class InputSystemExample : MonoBehaviour
    {
        // Input Actions reference
        private InputAction moveAction;
        private InputAction jumpAction;
        
        private void Awake()
        {
            // Create input actions
            moveAction = new InputAction("move", binding: "<Gamepad>/leftStick");
            moveAction.AddCompositeBinding("Dpad")
                .With("Up", "<Keyboard>/w")
                .With("Down", "<Keyboard>/s")
                .With("Left", "<Keyboard>/a")
                .With("Right", "<Keyboard>/d");
            
            jumpAction = new InputAction("jump", binding: "<Keyboard>/space");
            jumpAction.AddBinding("<Gamepad>/buttonSouth");
            
            // Set up callbacks
            jumpAction.performed += ctx => Jump();
        }
        
        private void OnEnable()
        {
            moveAction.Enable();
            jumpAction.Enable();
        }
        
        private void OnDisable()
        {
            moveAction.Disable();
            jumpAction.Disable();
        }
        
        private void Update()
        {
            // Read move value
            Vector2 moveInput = moveAction.ReadValue<Vector2>();
            
            // Use the input value for movement
            if (moveInput != Vector2.zero)
            {
                // Example of using the move input
                Debug.Log($"Moving: {moveInput}");
            }
        }
        
        private void Jump()
        {
            Debug.Log("Jump action performed!");
        }
    }
}