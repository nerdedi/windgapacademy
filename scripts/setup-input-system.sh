#!/bin/bash

# Setup Input System for Windgap Academy Unity Project
# This script helps set up the Unity Input System for character controls and interactions

echo "🚀 Windgap Academy - Input System Setup 🚀"
echo "====================================================="

# Define paths
UNITY_PROJECT_PATH=""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Ask for Unity project path
echo -e "${BLUE}Step 1: Unity Project Location${NC}"
echo "Please enter the absolute path to your Unity project:"
read -p "> " UNITY_PROJECT_PATH

if [ ! -d "$UNITY_PROJECT_PATH" ]; then
    echo -e "${RED}Error: The specified Unity project path does not exist.${NC}"
    exit 1
fi

# Step 2: Create Input System package manifest entry
echo -e "\n${BLUE}Step 2: Setting up Input System Package${NC}"

# Check if manifest.json exists
MANIFEST_PATH="$UNITY_PROJECT_PATH/Packages/manifest.json"
if [ ! -f "$MANIFEST_PATH" ]; then
    echo -e "${RED}Error: manifest.json not found in $UNITY_PROJECT_PATH/Packages/. Make sure this is a valid Unity project.${NC}"
    exit 1
fi

# Check if Input System is already in the manifest
if grep -q "com.unity.inputsystem" "$MANIFEST_PATH"; then
    echo -e "${YELLOW}Input System package is already installed in the project.${NC}"
else
    # Back up the original manifest
    cp "$MANIFEST_PATH" "${MANIFEST_PATH}.bak"
    
    # Add the Input System package to the manifest
    # Use temporary file and sed to preserve formatting
    sed -i '/dependencies/a \    "com.unity.inputsystem": "1.5.1",' "$MANIFEST_PATH"
    
    echo -e "${GREEN}✅ Added Input System package to manifest.json${NC}"
fi

# Step 3: Create Input Actions asset
echo -e "\n${BLUE}Step 3: Creating Input Actions Asset${NC}"

# Create directories if they don't exist
mkdir -p "$UNITY_PROJECT_PATH/Assets/Scenes"
mkdir -p "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Input"

# Create the Input Actions asset
cat > "$UNITY_PROJECT_PATH/Assets/Scenes/InputSystem_Actions.inputactions" << 'EOF'
{
    "name": "InputSystem_Actions",
    "maps": [
        {
            "name": "Player",
            "id": "e9dd7356-02d5-4ef7-8afe-5c2f20e2995b",
            "actions": [
                {
                    "name": "Move",
                    "type": "Value",
                    "id": "a8be17fd-af35-4399-8295-0d6f753f1e41",
                    "expectedControlType": "Vector2",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": true
                },
                {
                    "name": "Jump",
                    "type": "Button",
                    "id": "f5ee9a88-8e4d-40bf-85e0-24eed3d8bde6",
                    "expectedControlType": "Button",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": false
                },
                {
                    "name": "Interact",
                    "type": "Button",
                    "id": "09c23cf3-b5a7-4cec-b5ff-59a1e44b5ebc",
                    "expectedControlType": "Button",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": false
                }
            ],
            "bindings": [
                {
                    "name": "WASD",
                    "id": "a5e00fbd-5c5d-4a50-bb15-63c2c3b88f2b",
                    "path": "2DVector",
                    "interactions": "",
                    "processors": "",
                    "groups": "",
                    "action": "Move",
                    "isComposite": true,
                    "isPartOfComposite": false
                },
                {
                    "name": "up",
                    "id": "e63d1d99-fe25-4e3d-94cd-35d5b5e1ad7b",
                    "path": "<Keyboard>/w",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "down",
                    "id": "5d5a7bcf-15ec-48f9-9aac-3b1e9d462bb1",
                    "path": "<Keyboard>/s",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "left",
                    "id": "7c9c9e96-c84d-48cf-8a58-9faeef131c3a",
                    "path": "<Keyboard>/a",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "right",
                    "id": "bb0ee2b3-57c8-4af9-a5ad-91720eae493a",
                    "path": "<Keyboard>/d",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "Arrow Keys",
                    "id": "8c6a8d4f-e0e4-4a4c-9a5d-c6d8f7a5fa3d",
                    "path": "2DVector",
                    "interactions": "",
                    "processors": "",
                    "groups": "",
                    "action": "Move",
                    "isComposite": true,
                    "isPartOfComposite": false
                },
                {
                    "name": "up",
                    "id": "7fc7c62f-5d20-4ddd-8c9c-d5c7b7f2eb6c",
                    "path": "<Keyboard>/upArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "down",
                    "id": "b6a80f96-3cc5-4c16-b687-3a6c0a4e4d2d",
                    "path": "<Keyboard>/downArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "left",
                    "id": "a5c38e04-2f30-4b5e-b2c9-7d5d2c49e4b4",
                    "path": "<Keyboard>/leftArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "right",
                    "id": "1b54c7ac-e86d-47c2-bd6d-7be7c4903ebe",
                    "path": "<Keyboard>/rightArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Move",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "",
                    "id": "b300c0d7-db29-4fb7-9d4f-7d9ba0c91ef7",
                    "path": "<Keyboard>/space",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Jump",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "2ec5f6b5-0a69-4b7a-85b3-5f8c1a6f2e85",
                    "path": "<Keyboard>/e",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Interact",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "25a1c36d-63f7-487d-b2ea-e2d80b9c0aa1",
                    "path": "<Mouse>/leftButton",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Interact",
                    "isComposite": false,
                    "isPartOfComposite": false
                }
            ]
        },
        {
            "name": "UI",
            "id": "f64df8ca-9d3b-471d-9b6a-c7e9d8d9bc08",
            "actions": [
                {
                    "name": "Navigate",
                    "type": "PassThrough",
                    "id": "c6fa45e7-42eb-45cb-9fd1-5c9f1c15a2b2",
                    "expectedControlType": "Vector2",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": false
                },
                {
                    "name": "Submit",
                    "type": "Button",
                    "id": "09efa1de-2b13-447f-a9e8-f4e7feacd2b9",
                    "expectedControlType": "Button",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": false
                },
                {
                    "name": "Cancel",
                    "type": "Button",
                    "id": "98d3c8a9-7a07-41cf-aca1-4f9a56f78a5a",
                    "expectedControlType": "Button",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": false
                },
                {
                    "name": "Point",
                    "type": "PassThrough",
                    "id": "5e0b7be5-6456-4e9d-95b5-0d1b29bf9778",
                    "expectedControlType": "Vector2",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": true
                },
                {
                    "name": "Click",
                    "type": "PassThrough",
                    "id": "b4fdf2ce-82a5-4ab5-8f13-dd62a621cfd1",
                    "expectedControlType": "Button",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": true
                }
            ],
            "bindings": [
                {
                    "name": "Keyboard",
                    "id": "dc6a4b40-c124-4c67-9d5a-b505a0eb5d67",
                    "path": "2DVector",
                    "interactions": "",
                    "processors": "",
                    "groups": "",
                    "action": "Navigate",
                    "isComposite": true,
                    "isPartOfComposite": false
                },
                {
                    "name": "up",
                    "id": "9c518d5f-4e2e-45ba-9c12-ca6cadd6df24",
                    "path": "<Keyboard>/w",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "up",
                    "id": "5a81ff58-6fb4-418d-a08a-5e7d16178cfa",
                    "path": "<Keyboard>/upArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "down",
                    "id": "4d1abc60-e324-4f5a-8bb5-a1a0d10cce3d",
                    "path": "<Keyboard>/s",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "down",
                    "id": "3fec0ca0-aa17-4803-b23a-6c580fcb4d00",
                    "path": "<Keyboard>/downArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "left",
                    "id": "a4e13c0a-0aa9-4693-abd0-0e1e7b9a64d5",
                    "path": "<Keyboard>/a",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "left",
                    "id": "c2c1bd34-9a0e-4b62-a4d8-2fe730fa13d1",
                    "path": "<Keyboard>/leftArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "right",
                    "id": "9bd05d83-1f5e-4af9-bb35-1b8aed9c62b3",
                    "path": "<Keyboard>/d",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "right",
                    "id": "5bd62c99-af7e-43ee-bf4e-7ead1e1bc85e",
                    "path": "<Keyboard>/rightArrow",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Navigate",
                    "isComposite": false,
                    "isPartOfComposite": true
                },
                {
                    "name": "",
                    "id": "6ed8cf45-7c49-4c35-90e6-2ddc7c53a5b5",
                    "path": "<Keyboard>/enter",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Submit",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "69b9cf12-81e2-4bec-85ce-4a9264393e4a",
                    "path": "<Keyboard>/space",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Submit",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "24e6a8b0-1c7c-4bc8-89d8-2ee5401be9d1",
                    "path": "<Keyboard>/escape",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Cancel",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "a3d0b8ab-90b5-4c5c-863a-1b6ba8c4fad3",
                    "path": "<Mouse>/position",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Point",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "42e5de1a-4db5-4a32-a9b9-4c1f97cd9a31",
                    "path": "<Mouse>/leftButton",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Click",
                    "isComposite": false,
                    "isPartOfComposite": false
                }
            ]
        },
        {
            "name": "Camera",
            "id": "9e5e7e0f-2c6a-40d2-b0ce-e06e4bd50c38",
            "actions": [
                {
                    "name": "Rotate",
                    "type": "Value",
                    "id": "dcb31d0c-bbe3-44f5-81f0-76c06e8be9c5",
                    "expectedControlType": "Vector2",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": true
                },
                {
                    "name": "Zoom",
                    "type": "Value",
                    "id": "ca09f8a6-1a25-4985-82df-4a6d7f8b59c5",
                    "expectedControlType": "Axis",
                    "processors": "",
                    "interactions": "",
                    "initialStateCheck": true
                }
            ],
            "bindings": [
                {
                    "name": "",
                    "id": "c8e59e5a-c6d0-4689-a2c5-bb64e2e87143",
                    "path": "<Mouse>/delta",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Rotate",
                    "isComposite": false,
                    "isPartOfComposite": false
                },
                {
                    "name": "",
                    "id": "6c7c8e42-3d24-4834-9b7c-9ddc825a8c33",
                    "path": "<Mouse>/scroll/y",
                    "interactions": "",
                    "processors": "",
                    "groups": "Keyboard&Mouse",
                    "action": "Zoom",
                    "isComposite": false,
                    "isPartOfComposite": false
                }
            ]
        }
    ],
    "controlSchemes": [
        {
            "name": "Keyboard&Mouse",
            "bindingGroup": "Keyboard&Mouse",
            "devices": [
                {
                    "devicePath": "<Keyboard>",
                    "isOptional": false,
                    "isOR": false
                },
                {
                    "devicePath": "<Mouse>",
                    "isOptional": false,
                    "isOR": false
                }
            ]
        }
    ]
}
EOF

echo -e "${GREEN}✅ Created Input Actions asset${NC}"

# Step 4: Create Input Controller script
echo -e "\n${BLUE}Step 4: Creating Input Controller Script${NC}"

cat > "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Input/InputController.cs" << 'EOF'
using UnityEngine;
using UnityEngine.InputSystem;
using System;

namespace WindgapAcademy.Input
{
    /// <summary>
    /// Manages input for Windgap Academy characters
    /// Processes input from the InputSystem_Actions asset
    /// </summary>
    public class InputController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float movementSpeed = 5f;
        [SerializeField] private float rotationSpeed = 120f;
        
        // Input action references
        private InputSystem_Actions inputActions;
        private InputAction moveAction;
        private InputAction jumpAction;
        private InputAction interactAction;
        
        // Movement state
        private Vector2 moveInput;
        private bool isJumping;
        
        // Events
        public event Action OnJumpPerformed;
        public event Action OnInteractPerformed;
        public event Action<Vector2> OnMovePerformed;
        
        private void Awake()
        {
            // Initialize the input actions
            inputActions = new InputSystem_Actions();
            
            // Get references to the actions
            moveAction = inputActions.Player.Move;
            jumpAction = inputActions.Player.Jump;
            interactAction = inputActions.Player.Interact;
        }
        
        private void OnEnable()
        {
            // Enable the action map
            inputActions.Player.Enable();
            
            // Subscribe to input events
            jumpAction.performed += OnJumpInput;
            interactAction.performed += OnInteractInput;
        }
        
        private void OnDisable()
        {
            // Disable the action map
            inputActions.Player.Disable();
            
            // Unsubscribe from input events
            jumpAction.performed -= OnJumpInput;
            interactAction.performed -= OnInteractInput;
        }
        
        private void Update()
        {
            // Read movement input
            moveInput = moveAction.ReadValue<Vector2>();
            
            // Invoke move event if there is input
            if (moveInput != Vector2.zero)
            {
                OnMovePerformed?.Invoke(moveInput);
            }
        }
        
        private void OnJumpInput(InputAction.CallbackContext context)
        {
            isJumping = true;
            OnJumpPerformed?.Invoke();
            
            // Send to ReactBridgeManager if it exists
            if (ReactBridgeManager.Instance != null)
            {
                ReactBridgeManager.Instance.SendInputEvent("jump", gameObject.name);
            }
        }
        
        private void OnInteractInput(InputAction.CallbackContext context)
        {
            OnInteractPerformed?.Invoke();
            
            // Send to ReactBridgeManager if it exists
            if (ReactBridgeManager.Instance != null)
            {
                ReactBridgeManager.Instance.SendInputEvent("interact", gameObject.name);
            }
        }
        
        /// <summary>
        /// Get current movement input
        /// </summary>
        public Vector2 GetMoveInput()
        {
            return moveInput;
        }
        
        /// <summary>
        /// Check if the jump button is pressed
        /// </summary>
        public bool IsJumping()
        {
            if (isJumping)
            {
                isJumping = false;
                return true;
            }
            return false;
        }
    }
}
EOF

echo -e "${GREEN}✅ Created Input Controller script${NC}"

# Step 5: Create the PlayerController script that uses the InputController
echo -e "\n${BLUE}Step 5: Creating Player Controller Script${NC}"

cat > "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Characters/PlayerController.cs" << 'EOF'
using UnityEngine;
using WindgapAcademy.Input;
using WindgapAcademy.Animation;

namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Controls the player character using input from InputController
    /// </summary>
    [RequireComponent(typeof(InputController))]
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float moveSpeed = 5f;
        [SerializeField] private float rotationSpeed = 120f;
        [SerializeField] private float jumpForce = 5f;
        [SerializeField] private float gravity = 20f;
        
        // Components
        private InputController inputController;
        private CharacterController characterController;
        private AnimationController animationController;
        
        // Movement state
        private Vector3 moveDirection = Vector3.zero;
        private float verticalVelocity = 0f;
        
        private void Awake()
        {
            // Get required components
            inputController = GetComponent<InputController>();
            characterController = GetComponent<CharacterController>();
            animationController = GetComponent<AnimationController>();
        }
        
        private void OnEnable()
        {
            // Subscribe to input events
            if (inputController != null)
            {
                inputController.OnJumpPerformed += HandleJump;
                inputController.OnInteractPerformed += HandleInteract;
            }
        }
        
        private void OnDisable()
        {
            // Unsubscribe from input events
            if (inputController != null)
            {
                inputController.OnJumpPerformed -= HandleJump;
                inputController.OnInteractPerformed -= HandleInteract;
            }
        }
        
        private void Update()
        {
            // Handle movement
            HandleMovement();
        }
        
        private void HandleMovement()
        {
            // Only process movement if we have a controller
            if (characterController == null) return;
            
            // Get input from the input controller
            Vector2 input = inputController.GetMoveInput();
            
            // Check if grounded
            bool isGrounded = characterController.isGrounded;
            
            // Reset vertical velocity when grounded
            if (isGrounded)
            {
                verticalVelocity = -0.5f; // Small downward force to keep grounded
            }
            
            // Apply gravity
            verticalVelocity -= gravity * Time.deltaTime;
            
            // Calculate move direction based on input
            moveDirection = new Vector3(input.x, 0, input.y);
            
            // Transform direction relative to camera
            moveDirection = Camera.main.transform.TransformDirection(moveDirection);
            moveDirection.y = 0; // Keep movement on the horizontal plane
            
            if (moveDirection.magnitude > 0.1f)
            {
                // Normalize and apply speed
                moveDirection.Normalize();
                moveDirection *= moveSpeed;
                
                // Rotate character to face movement direction
                Quaternion targetRotation = Quaternion.LookRotation(moveDirection);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, rotationSpeed * Time.deltaTime);
                
                // Play walk animation if we have an animation controller
                if (animationController != null && !animationController.IsPlaying("walk"))
                {
                    animationController.PlayAnimation("walk");
                }
            }
            else if (animationController != null && !animationController.IsPlaying("idle"))
            {
                // Return to idle if no movement
                animationController.PlayAnimation("idle");
            }
            
            // Apply vertical velocity (for jumping and gravity)
            moveDirection.y = verticalVelocity;
            
            // Apply movement
            characterController.Move(moveDirection * Time.deltaTime);
        }
        
        private void HandleJump()
        {
            if (characterController.isGrounded)
            {
                verticalVelocity = jumpForce;
                
                // Play jump animation if we have an animation controller
                if (animationController != null)
                {
                    animationController.PlayAnimation("jump");
                }
            }
        }
        
        private void HandleInteract()
        {
            // Raycast to find interactable objects
            Ray ray = new Ray(transform.position + Vector3.up, transform.forward);
            RaycastHit hit;
            
            if (Physics.Raycast(ray, out hit, 2f))
            {
                // Check if the hit object has an interactable component
                IInteractable interactable = hit.collider.GetComponent<IInteractable>();
                if (interactable != null)
                {
                    interactable.Interact(gameObject);
                }
            }
            
            // Play interact animation
            if (animationController != null)
            {
                animationController.PlayAnimation("celebrate");
            }
        }
    }
    
    /// <summary>
    /// Interface for interactable objects
    /// </summary>
    public interface IInteractable
    {
        void Interact(GameObject instigator);
    }
}
EOF

echo -e "${GREEN}✅ Created Player Controller script${NC}"

# Step 6: Create a simple interface class
echo -e "\n${BLUE}Step 6: Creating React Bridge Input Extensions${NC}"

# Update the ReactBridgeManager with Input handling (if it exists)
# First, check if the ReactBridgeManager.cs file exists
REACT_BRIDGE_PATH="$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Integration/ReactBridgeManager.cs"
if [ -f "$REACT_BRIDGE_PATH" ]; then
    # Check if the SendInputEvent method already exists
    if grep -q "SendInputEvent" "$REACT_BRIDGE_PATH"; then
        echo -e "${YELLOW}SendInputEvent method already exists in ReactBridgeManager${NC}"
    else
        # Find the closing brace of the class definition
        LINE_NUMBER=$(grep -n "}" "$REACT_BRIDGE_PATH" | tail -1 | cut -d':' -f1)
        
        # Insert the SendInputEvent method before the closing brace
        sed -i "${LINE_NUMBER}i\\    /// <summary>\\n    /// Send input event to React\\n    /// </summary>\\n    /// <param name=\"inputType\">Type of input (e.g., jump, interact)</param>\\n    /// <param name=\"sender\">Name of the game object that sent the input</param>\\n    public void SendInputEvent(string inputType, string sender)\\n    {\\n        Dictionary<string, object> data = new Dictionary<string, object>\\n        {\\n            { \"inputType\", inputType },\\n            { \"sender\", sender },\\n            { \"timestamp\", DateTime.Now.ToString(\"o\") }\\n        };\\n        \\n        SendMessageToReact(\"INPUT_EVENT\", data);\\n    }" "$REACT_BRIDGE_PATH"
        
        echo -e "${GREEN}✅ Added SendInputEvent method to ReactBridgeManager${NC}"
    fi
else
    echo -e "${YELLOW}ReactBridgeManager.cs not found. Will be created by the transfer-unity-project.sh script${NC}"
fi

# Step 7: Final instructions
echo -e "\n${BLUE}Step 7: Next Steps${NC}"
echo -e "${GREEN}✅ Input System setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Open your Unity project"
echo "2. Import the Input System package:"
echo "   - Unity will prompt you to restart and enable the new Input System backend"
echo "   - Click 'Yes' to restart and enable the new Input System"
echo ""
echo "3. Set up your character with input controls:"
echo "   - Add a Character Controller component to your character"
echo "   - Add the InputController component to your character"
echo "   - Add the PlayerController component to your character"
echo ""
echo "4. Connect to animations:"
echo "   - If you've set up the Animation system, the PlayerController will automatically use it"
echo "   - Make sure you have an AnimationController component on your character"
echo ""
echo "5. Test in Unity:"
echo "   - Press Play in the editor"
echo "   - Use WASD or arrow keys to move"
echo "   - Press Space to jump"
echo "   - Press E or click to interact"
echo ""
echo -e "${YELLOW}For more details, see the documentation at:${NC}"
echo -e "${YELLOW}/workspaces/windgapacademy/docs/unity-input-system-guide.md${NC}"
echo ""
echo -e "${GREEN}Happy gaming!${NC}"