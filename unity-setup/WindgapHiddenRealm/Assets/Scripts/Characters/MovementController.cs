using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Handles character movement with accessibility options
    /// Provides options for different control schemes and assists
    /// </summary>
    public class MovementController : MonoBehaviour
    {
        // Movement parameters
        [Header("Basic Movement")]
        public float walkSpeed = 3.0f;
        public float runSpeed = 6.0f;
        public float turnSpeed = 120.0f;
        public float jumpForce = 5.0f;
        
        [Header("Accessibility Options")]
        public bool useAutoPathfinding = false;
        public bool useMotionSmoothing = true;
        public float motionSmoothingFactor = 0.5f;
        public bool useAutoBalance = true;
        public bool useTerrainAssist = true;
        
        // Components
        private CharacterController characterController;
        private Animator animator;
        private Transform cameraTransform;
        
        // Movement state
        private Vector3 moveDirection = Vector3.zero;
        private bool isGrounded = true;
        private bool isRunning = false;
        
        // Accessibility state
        private Transform currentTarget;
        private bool isAutoPathfinding = false;
        
        private void Awake()
        {
            // Get required components
            characterController = GetComponent<CharacterController>();
            animator = GetComponent<Animator>();
            
            // Find main camera
            if (Camera.main != null)
            {
                cameraTransform = Camera.main.transform;
            }
            
            // Create character controller if it doesn't exist
            if (characterController == null)
            {
                characterController = gameObject.AddComponent<CharacterController>();
                characterController.center = new Vector3(0, 1, 0);
                characterController.height = 2.0f;
                characterController.radius = 0.5f;
            }
        }
        
        private void Update()
        {
            // In an actual implementation, input would be handled through an Input Manager
            // This is a placeholder that demonstrates the structure
            
            if (isAutoPathfinding && currentTarget != null)
            {
                // Handle automatic pathfinding to target
                HandleAutoPathfinding();
            }
            else
            {
                // Handle manual movement
                HandleManualMovement();
            }
            
            // Apply movement
            ApplyMovement();
            
            // Update animator parameters
            if (animator != null)
            {
                animator.SetFloat("Speed", characterController.velocity.magnitude);
                animator.SetBool("IsGrounded", isGrounded);
                animator.SetBool("IsRunning", isRunning);
            }
        }
        
        /// <summary>
        /// Handles automatic pathfinding to a target
        /// </summary>
        private void HandleAutoPathfinding()
        {
            // In a real implementation, this would use NavMesh or similar for pathfinding
            // For now, just move directly toward the target
            
            if (currentTarget != null)
            {
                Vector3 direction = (currentTarget.position - transform.position).normalized;
                direction.y = 0; // Keep movement on the horizontal plane
                
                // Rotate toward the target
                if (direction != Vector3.zero)
                {
                    Quaternion targetRotation = Quaternion.LookRotation(direction);
                    transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);
                }
                
                // Move toward the target
                moveDirection = direction * walkSpeed;
                
                // Stop when close enough
                if (Vector3.Distance(transform.position, currentTarget.position) < 1.0f)
                {
                    // Arrived at destination
                    isAutoPathfinding = false;
                    moveDirection = Vector3.zero;
                }
            }
        }
        
        /// <summary>
        /// Handles manual movement input
        /// </summary>
        private void HandleManualMovement()
        {
            // Placeholder for manual movement input
            // In a real implementation, this would handle various input methods
            // including keyboard, gamepad, and accessibility devices
            
            // Horizontal and vertical input (typically WASD or gamepad)
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");
            
            // Calculate movement direction relative to camera
            Vector3 forward = cameraTransform ? cameraTransform.forward : transform.forward;
            Vector3 right = cameraTransform ? cameraTransform.right : transform.right;
            
            forward.y = 0;
            right.y = 0;
            forward.Normalize();
            right.Normalize();
            
            // Combine movement input
            Vector3 desiredMoveDirection = (forward * vertical + right * horizontal).normalized;
            
            // Apply movement smoothing for accessibility
            if (useMotionSmoothing && desiredMoveDirection != Vector3.zero)
            {
                moveDirection = Vector3.Lerp(moveDirection, desiredMoveDirection * (isRunning ? runSpeed : walkSpeed), motionSmoothingFactor);
            }
            else
            {
                moveDirection = desiredMoveDirection * (isRunning ? runSpeed : walkSpeed);
            }
            
            // Rotate character to face movement direction
            if (desiredMoveDirection != Vector3.zero)
            {
                Quaternion targetRotation = Quaternion.LookRotation(desiredMoveDirection);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);
            }
            
            // Handle jumping
            if (isGrounded && Input.GetButtonDown("Jump"))
            {
                moveDirection.y = jumpForce;
            }
            
            // Handle running
            isRunning = Input.GetKey(KeyCode.LeftShift);
        }
        
        /// <summary>
        /// Applies movement to the character controller
        /// </summary>
        private void ApplyMovement()
        {
            // Apply gravity
            if (!isGrounded)
            {
                moveDirection.y += Physics.gravity.y * Time.deltaTime;
            }
            
            // Apply terrain assist if enabled
            if (useTerrainAssist && isGrounded)
            {
                RaycastHit hit;
                if (Physics.Raycast(transform.position + Vector3.up, Vector3.down, out hit, 2.0f))
                {
                    // Adjust y position to follow terrain
                    moveDirection.y = (1.0f - hit.distance) * 10.0f;
                }
            }
            
            // Move the character
            CharacterController controller = GetComponent<CharacterController>();
            if (controller != null)
            {
                controller.Move(moveDirection * Time.deltaTime);
                
                // Check if character is grounded
                isGrounded = controller.isGrounded;
                
                // Reset y velocity when grounded
                if (isGrounded && moveDirection.y < 0)
                {
                    moveDirection.y = -0.5f;
                }
            }
        }
        
        /// <summary>
        /// Sets a target for automatic pathfinding
        /// </summary>
        public void SetPathfindingTarget(Transform target)
        {
            currentTarget = target;
            isAutoPathfinding = true;
        }
        
        /// <summary>
        /// Stops automatic pathfinding
        /// </summary>
        public void StopPathfinding()
        {
            isAutoPathfinding = false;
            moveDirection = Vector3.zero;
        }
        
        /// <summary>
        /// Adjusts movement parameters based on accessibility needs
        /// </summary>
        public void SetAccessibilityOptions(bool autoPathfinding, bool motionSmoothing, float smoothingFactor, bool autoBalance, bool terrainAssist)
        {
            useAutoPathfinding = autoPathfinding;
            useMotionSmoothing = motionSmoothing;
            motionSmoothingFactor = smoothingFactor;
            useAutoBalance = autoBalance;
            useTerrainAssist = terrainAssist;
        }
    }
}