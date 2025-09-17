using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WindgapAcademy.Input;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Characters
{
    [RequireComponent(typeof(CharacterController))]
    [RequireComponent(typeof(PlayerInputHandler))]
    public class PlayerCharacterController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float moveSpeed = 5f;
        [SerializeField] private float sprintSpeed = 8f;
        [SerializeField] private float rotationSpeed = 10f;
        [SerializeField] private float jumpHeight = 1.5f;
        [SerializeField] private float gravity = -20f;

        [Header("Ground Check")]
        [SerializeField] private Transform groundCheck;
        [SerializeField] private float groundDistance = 0.4f;
        [SerializeField] private LayerMask groundMask;

        // Components
        private CharacterController controller;
        private PlayerInputHandler inputHandler;
        private Camera playerCamera;
        private Animator animator;

        // Animation parameter hashes
        private int animSpeedHash;
        private int animGroundedHash;
        private int animJumpHash;
        private int animAttackHash;
        private int animCrouchHash;

        // Movement variables
        private Vector3 moveDirection;
        private Vector3 velocity;
        private bool isGrounded;
        private bool isSprinting;
        private bool isAttacking;
        private bool isCrouching;

        private void Awake()
        {
            // Get components
            controller = GetComponent<CharacterController>();
            inputHandler = GetComponent<PlayerInputHandler>();
            animator = GetComponentInChildren<Animator>();
            playerCamera = Camera.main;

            // Cache animation parameter hashes
            if (animator != null)
            {
                animSpeedHash = Animator.StringToHash("Speed");
                animGroundedHash = Animator.StringToHash("Grounded");
                animJumpHash = Animator.StringToHash("Jump");
                animAttackHash = Animator.StringToHash("Attack");
                animCrouchHash = Animator.StringToHash("Crouch");
            }

            // Subscribe to input events
            inputHandler.OnMove += HandleMove;
            inputHandler.OnJumpStarted += HandleJump;
            inputHandler.OnAttackStarted += HandleAttack;
            inputHandler.OnCrouchStarted += HandleCrouchStart;
            inputHandler.OnCrouchCanceled += HandleCrouchEnd;
            inputHandler.OnSprintStarted += HandleSprintStart;
            inputHandler.OnSprintCanceled += HandleSprintEnd;
        }

        private void OnDestroy()
        {
            // Unsubscribe from input events
            if (inputHandler != null)
            {
                inputHandler.OnMove -= HandleMove;
                inputHandler.OnJumpStarted -= HandleJump;
                inputHandler.OnAttackStarted -= HandleAttack;
                inputHandler.OnCrouchStarted -= HandleCrouchStart;
                inputHandler.OnCrouchCanceled -= HandleCrouchEnd;
                inputHandler.OnSprintStarted -= HandleSprintStart;
                inputHandler.OnSprintCanceled -= HandleSprintEnd;
            }
        }

        private void Update()
        {
            // Check if the character is grounded
            isGrounded = Physics.CheckSphere(groundCheck.position, groundDistance, groundMask);

            // Apply gravity
            ApplyGravity();
            
            // Move the character
            MoveCharacter();
            
            // Update animations
            UpdateAnimations();
        }

        private void ApplyGravity()
        {
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -2f; // Small negative value to ensure the character stays grounded
            }

            velocity.y += gravity * Time.deltaTime;
            controller.Move(velocity * Time.deltaTime);
        }

        private void MoveCharacter()
        {
            if (moveDirection.magnitude > 0.1f)
            {
                // Calculate rotation
                float targetAngle = Mathf.Atan2(moveDirection.x, moveDirection.z) * Mathf.Rad2Deg;
                float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref rotationSpeed, 0.1f);
                transform.rotation = Quaternion.Euler(0f, angle, 0f);

                // Move in the direction the character is facing
                float currentSpeed = isSprinting ? sprintSpeed : moveSpeed;
                if (isCrouching) currentSpeed *= 0.5f;
                
                Vector3 movement = transform.forward * currentSpeed * Time.deltaTime;
                controller.Move(movement);
            }
        }

        private void UpdateAnimations()
        {
            if (animator != null)
            {
                // Calculate movement speed for animation
                float animationSpeed = moveDirection.magnitude;
                if (isSprinting) animationSpeed *= 2f;
                if (isCrouching) animationSpeed *= 0.5f;

                // Update animator parameters
                animator.SetFloat(animSpeedHash, animationSpeed, 0.1f, Time.deltaTime);
                animator.SetBool(animGroundedHash, isGrounded);
                animator.SetBool(animCrouchHash, isCrouching);
            }
        }

        #region Input Handlers

        private void HandleMove(Vector2 input)
        {
            // Convert 2D input to 3D movement direction
            moveDirection = new Vector3(input.x, 0f, input.y);
            
            // Make movement relative to camera
            if (playerCamera != null && moveDirection.magnitude > 0.1f)
            {
                float targetAngle = Mathf.Atan2(moveDirection.x, moveDirection.z) * Mathf.Rad2Deg + playerCamera.transform.eulerAngles.y;
                moveDirection = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
            }
            
            // Normalize movement vector
            moveDirection.Normalize();
        }

        private void HandleJump()
        {
            if (isGrounded)
            {
                velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
                
                if (animator != null)
                {
                    animator.SetTrigger(animJumpHash);
                }
            }
        }

        private void HandleAttack()
        {
            if (!isAttacking)
            {
                isAttacking = true;
                
                if (animator != null)
                {
                    animator.SetTrigger(animAttackHash);
                }
                
                // Reset attacking state after animation completes
                StartCoroutine(ResetAttackState());
            }
        }

        private IEnumerator ResetAttackState()
        {
            // Wait for the attack animation to complete (adjust time as needed)
            yield return new WaitForSeconds(1.0f);
            isAttacking = false;
        }

        private void HandleCrouchStart()
        {
            isCrouching = true;
            // Optionally modify character controller height
            controller.height = 1.0f;
            controller.center = new Vector3(0, 0.5f, 0);
        }

        private void HandleCrouchEnd()
        {
            isCrouching = false;
            // Reset character controller height
            controller.height = 2.0f;
            controller.center = new Vector3(0, 1.0f, 0);
        }

        private void HandleSprintStart()
        {
            isSprinting = true;
        }

        private void HandleSprintEnd()
        {
            isSprinting = false;
        }

        #endregion
    }
}