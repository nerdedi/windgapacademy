using System;
using UnityEngine;
using UnityEngine.InputSystem;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Input
{
    /// <summary>
    /// Input handler for the WindgapHiddenRealm game.
    /// This class wraps the Unity Input System and provides easy access to input actions.
    /// </summary>
    public class PlayerInputHandler : MonoBehaviour
    {
        // Input Actions asset reference
        private InputSystem_Actions inputActions;
        
        // Input values
        private Vector2 moveInput;
        private Vector2 lookInput;
        private bool jumpInput;
        private bool attackInput;
        private bool interactInput;
        private bool crouchInput;
        private bool sprintInput;
        private bool previousInput;
        private bool nextInput;
        
        // Events
        public event Action<Vector2> OnMove;
        public event Action<Vector2> OnLook;
        public event Action OnJumpStarted;
        public event Action OnJumpCanceled;
        public event Action OnAttackStarted;
        public event Action OnAttackCanceled;
        public event Action OnInteractStarted;
        public event Action OnInteractCanceled;
        public event Action OnCrouchStarted;
        public event Action OnCrouchCanceled;
        public event Action OnSprintStarted;
        public event Action OnSprintCanceled;
        public event Action OnPreviousStarted;
        public event Action OnNextStarted;
        
        // Properties
        public Vector2 MoveInput => moveInput;
        public Vector2 LookInput => lookInput;
        public bool JumpInput => jumpInput;
        public bool AttackInput => attackInput;
        public bool InteractInput => interactInput;
        public bool CrouchInput => crouchInput;
        public bool SprintInput => sprintInput;
        
        private void Awake()
        {
            // Initialize input actions
            inputActions = new InputSystem_Actions();
            
            // Register callback methods for Player actions
            inputActions.Player.Move.performed += OnMovePerformed;
            inputActions.Player.Move.canceled += OnMoveCanceled;
            
            inputActions.Player.Look.performed += OnLookPerformed;
            inputActions.Player.Look.canceled += OnLookCanceled;
            
            inputActions.Player.Jump.started += OnJumpPerformed;
            inputActions.Player.Jump.canceled += OnJumpPerformCanceled;
            
            inputActions.Player.Attack.started += OnAttackPerformed;
            inputActions.Player.Attack.canceled += OnAttackPerformCanceled;
            
            inputActions.Player.Interact.started += OnInteractPerformed;
            inputActions.Player.Interact.canceled += OnInteractPerformCanceled;
            
            inputActions.Player.Crouch.started += OnCrouchPerformed;
            inputActions.Player.Crouch.canceled += OnCrouchPerformCanceled;
            
            inputActions.Player.Sprint.started += OnSprintPerformed;
            inputActions.Player.Sprint.canceled += OnSprintPerformCanceled;
            
            inputActions.Player.Previous.started += OnPreviousPerformed;
            
            inputActions.Player.Next.started += OnNextPerformed;
        }
        
        private void OnEnable()
        {
            // Enable input actions
            inputActions.Enable();
        }
        
        private void OnDisable()
        {
            // Disable input actions
            inputActions.Disable();
        }
        
        #region Input Callbacks
        
        private void OnMovePerformed(InputAction.CallbackContext context)
        {
            moveInput = context.ReadValue<Vector2>();
            OnMove?.Invoke(moveInput);
        }
        
        private void OnMoveCanceled(InputAction.CallbackContext context)
        {
            moveInput = Vector2.zero;
            OnMove?.Invoke(moveInput);
        }
        
        private void OnLookPerformed(InputAction.CallbackContext context)
        {
            lookInput = context.ReadValue<Vector2>();
            OnLook?.Invoke(lookInput);
        }
        
        private void OnLookCanceled(InputAction.CallbackContext context)
        {
            lookInput = Vector2.zero;
            OnLook?.Invoke(lookInput);
        }
        
        private void OnJumpPerformed(InputAction.CallbackContext context)
        {
            jumpInput = true;
            OnJumpStarted?.Invoke();
        }
        
        private void OnJumpPerformCanceled(InputAction.CallbackContext context)
        {
            jumpInput = false;
            OnJumpCanceled?.Invoke();
        }
        
        private void OnAttackPerformed(InputAction.CallbackContext context)
        {
            attackInput = true;
            OnAttackStarted?.Invoke();
        }
        
        private void OnAttackPerformCanceled(InputAction.CallbackContext context)
        {
            attackInput = false;
            OnAttackCanceled?.Invoke();
        }
        
        private void OnInteractPerformed(InputAction.CallbackContext context)
        {
            interactInput = true;
            OnInteractStarted?.Invoke();
        }
        
        private void OnInteractPerformCanceled(InputAction.CallbackContext context)
        {
            interactInput = false;
            OnInteractCanceled?.Invoke();
        }
        
        private void OnCrouchPerformed(InputAction.CallbackContext context)
        {
            crouchInput = true;
            OnCrouchStarted?.Invoke();
        }
        
        private void OnCrouchPerformCanceled(InputAction.CallbackContext context)
        {
            crouchInput = false;
            OnCrouchCanceled?.Invoke();
        }
        
        private void OnSprintPerformed(InputAction.CallbackContext context)
        {
            sprintInput = true;
            OnSprintStarted?.Invoke();
        }
        
        private void OnSprintPerformCanceled(InputAction.CallbackContext context)
        {
            sprintInput = false;
            OnSprintCanceled?.Invoke();
        }
        
        private void OnPreviousPerformed(InputAction.CallbackContext context)
        {
            previousInput = true;
            OnPreviousStarted?.Invoke();
            previousInput = false;
        }
        
        private void OnNextPerformed(InputAction.CallbackContext context)
        {
            nextInput = true;
            OnNextStarted?.Invoke();
            nextInput = false;
        }
        
        #endregion
    }
}