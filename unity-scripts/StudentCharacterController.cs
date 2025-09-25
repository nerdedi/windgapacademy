using UnityEngine;
using System.Collections;

/// <summary>
/// Controller for student character in Windgap Academy educational environment.
/// Adapted from 3D Game Kit's Ellen character controller for educational context.
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class StudentCharacterController : MonoBehaviour
{
    [Header("Movement Settings")]
    [SerializeField] private float walkSpeed = 3.0f;
    [SerializeField] private float runSpeed = 6.0f;
    [SerializeField] private float rotationSpeed = 15.0f;
    [SerializeField] private float jumpForce = 5.0f;
    [SerializeField] private float gravity = 20.0f;

    [Header("Animation")]
    [SerializeField] private Animator animator;
    [SerializeField] private string walkParameterName = "IsWalking";
    [SerializeField] private string runParameterName = "IsRunning";
    [SerializeField] private string jumpParameterName = "Jump";
    [SerializeField] private string groundedParameterName = "IsGrounded";

    [Header("Interaction")]
    [SerializeField] private float interactionDistance = 2.0f;
    [SerializeField] private LayerMask interactionLayer;

    // Private variables
    private CharacterController characterController;
    private Vector3 moveDirection = Vector3.zero;
    private bool isGrounded = false;
    private bool isInteracting = false;
    private GameObject currentInteractionObject = null;

    // Animation parameter hashes for better performance
    private int walkHash;
    private int runHash;
    private int jumpHash;
    private int groundedHash;

    private void Start()
    {
        characterController = GetComponent<CharacterController>();

        // Cache animator parameter hashes
        walkHash = Animator.StringToHash(walkParameterName);
        runHash = Animator.StringToHash(runParameterName);
        jumpHash = Animator.StringToHash(jumpParameterName);
        groundedHash = Animator.StringToHash(groundedParameterName);
    }

    private void Update()
    {
        // Check if character is on the ground
        isGrounded = characterController.isGrounded;

        // Update animator with grounded state
        if (animator)
        {
            animator.SetBool(groundedHash, isGrounded);
        }

        // Handle movement input
        HandleMovement();

        // Handle jump input
        HandleJump();

        // Handle interaction input
        HandleInteraction();

        // Apply gravity and move the character
        ApplyGravityAndMove();
    }

    private void HandleMovement()
    {
        // Get input axes
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        // Create movement vector
        Vector3 inputDirection = new Vector3(horizontal, 0, vertical);
        bool isMoving = inputDirection.magnitude > 0.1f;

        // Get movement speed based on run button
        float movementSpeed = Input.GetButton("Run") ? runSpeed : walkSpeed;

        // Update animator parameters
        if (animator)
        {
            animator.SetBool(walkHash, isMoving && !Input.GetButton("Run"));
            animator.SetBool(runHash, isMoving && Input.GetButton("Run"));
        }

        // If moving, rotate character to face movement direction
        if (isMoving)
        {
            // Get camera forward direction without vertical component
            Vector3 cameraForward = Camera.main.transform.forward;
            cameraForward.y = 0;
            cameraForward.Normalize();

            Vector3 cameraRight = Camera.main.transform.right;
            cameraRight.y = 0;
            cameraRight.Normalize();

            // Calculate movement direction relative to camera
            Vector3 targetDirection = cameraForward * vertical + cameraRight * horizontal;

            // Rotate character to face movement direction
            if (targetDirection != Vector3.zero)
            {
                Quaternion targetRotation = Quaternion.LookRotation(targetDirection);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, rotationSpeed * Time.deltaTime);
            }

            // Set horizontal movement
            moveDirection.x = targetDirection.x * movementSpeed;
            moveDirection.z = targetDirection.z * movementSpeed;
        }
        else
        {
            // No movement input
            moveDirection.x = 0;
            moveDirection.z = 0;
        }
    }

    private void HandleJump()
    {
        if (isGrounded && Input.GetButtonDown("Jump"))
        {
            moveDirection.y = jumpForce;

            if (animator)
            {
                animator.SetTrigger(jumpHash);
            }
        }
    }

    private void HandleInteraction()
    {
        // Check for interaction input
        if (Input.GetButtonDown("Interact"))
        {
            // Cast a ray forward to detect interactable objects
            Ray interactionRay = new Ray(transform.position + Vector3.up, transform.forward);
            RaycastHit hit;

            if (Physics.Raycast(interactionRay, out hit, interactionDistance, interactionLayer))
            {
                // Get interactable component
                IEducationalInteractable interactable = hit.collider.GetComponent<IEducationalInteractable>();

                if (interactable != null)
                {
                    // Start interaction
                    isInteracting = true;
                    currentInteractionObject = hit.collider.gameObject;
                    interactable.Interact(this.gameObject);

                    // Notify WindgapAcademyManager about the interaction
                    WindgapAcademyManager.Instance.RecordInteraction(interactable.GetInteractionType());
                }
            }
        }
    }

    private void ApplyGravityAndMove()
    {
        // Apply gravity if not grounded
        if (!isGrounded)
        {
            moveDirection.y -= gravity * Time.deltaTime;
        }

        // Move the character
        characterController.Move(moveDirection * Time.deltaTime);
    }

    /// <summary>
    /// Called when an educational activity starts
    /// </summary>
    public void StartEducationalActivity(string activityType)
    {
        // Disable movement during certain activities if needed
        switch (activityType)
        {
            case "quiz":
            case "video":
            case "reading":
                SetMovementEnabled(false);
                break;

            default:
                // Other activities allow movement
                SetMovementEnabled(true);
                break;
        }
    }

    /// <summary>
    /// Called when an educational activity ends
    /// </summary>
    public void EndEducationalActivity()
    {
        // Re-enable movement
        SetMovementEnabled(true);
    }

    /// <summary>
    /// Enable or disable character movement
    /// </summary>
    public void SetMovementEnabled(bool enabled)
    {
        this.enabled = enabled;

        if (!enabled)
        {
            // Reset animation states when disabling movement
            if (animator)
            {
                animator.SetBool(walkHash, false);
                animator.SetBool(runHash, false);
            }

            // Reset movement
            moveDirection = Vector3.zero;
        }
    }
}

/// <summary>
/// Interface for educational interactive objects
/// </summary>
public interface IEducationalInteractable
{
    void Interact(GameObject interactor);
    string GetInteractionType();
}
