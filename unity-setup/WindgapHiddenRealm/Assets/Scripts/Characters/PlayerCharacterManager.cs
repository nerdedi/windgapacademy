using System.Collections;
using UnityEngine;
using WindgapAcademy.Input;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Manages a player character with integration to the Input System.
    /// This is a simplified version of a character manager.
    /// </summary>
    [RequireComponent(typeof(PlayerCharacterController))]
    [RequireComponent(typeof(CharacterEmotionalState))]
    [RequireComponent(typeof(PlayerInputHandler))]
    public class PlayerCharacterManager : MonoBehaviour
    {
        [Header("Character Settings")]
        [SerializeField] private string characterName = "Winnie";
        [SerializeField] private int health = 100;
        [SerializeField] private float interactionRange = 2f;
        
        // Component references
        private PlayerCharacterController characterController;
        private CharacterEmotionalState emotionalState;
        private PlayerInputHandler inputHandler;
        
        // Interaction state
        private GameObject currentInteractable;
        
        // Character state
        private bool isDead = false;
        
        // Properties
        public string CharacterName => characterName;
        public int Health => health;
        public bool IsDead => isDead;
        
        private void Awake()
        {
            // Get required components
            characterController = GetComponent<PlayerCharacterController>();
            emotionalState = GetComponent<CharacterEmotionalState>();
            inputHandler = GetComponent<PlayerInputHandler>();
            
            // Subscribe to input events
            inputHandler.OnInteractStarted += HandleInteraction;
            inputHandler.OnJumpStarted += HandleJump;
            inputHandler.OnAttackStarted += HandleAttack;
        }
        
        private void OnDestroy()
        {
            // Unsubscribe from input events
            if (inputHandler != null)
            {
                inputHandler.OnInteractStarted -= HandleInteraction;
                inputHandler.OnJumpStarted -= HandleJump;
                inputHandler.OnAttackStarted -= HandleAttack;
            }
        }
        
        private void Update()
        {
            // Detect interactable objects
            CheckForInteractables();
        }
        
        /// <summary>
        /// Check for interactable objects in front of the character
        /// </summary>
        private void CheckForInteractables()
        {
            // Raycast forward to detect interactable objects
            Ray ray = new Ray(transform.position + Vector3.up, transform.forward);
            RaycastHit hit;
            
            if (Physics.Raycast(ray, out hit, interactionRange))
            {
                // Check if object has an IInteractable component
                IInteractable interactable = hit.collider.GetComponent<IInteractable>();
                
                if (interactable != null)
                {
                    // If we found a new interactable
                    if (currentInteractable != hit.collider.gameObject)
                    {
                        // Unhighlight previous interactable
                        if (currentInteractable != null)
                        {
                            IInteractable prevInteractable = currentInteractable.GetComponent<IInteractable>();
                            if (prevInteractable != null)
                            {
                                prevInteractable.OnUnhighlight();
                            }
                        }
                        
                        // Set and highlight new interactable
                        currentInteractable = hit.collider.gameObject;
                        interactable.OnHighlight();
                    }
                    
                    return;
                }
            }
            
            // If no interactable was found, unhighlight current interactable
            if (currentInteractable != null)
            {
                IInteractable interactable = currentInteractable.GetComponent<IInteractable>();
                if (interactable != null)
                {
                    interactable.OnUnhighlight();
                }
                
                currentInteractable = null;
            }
        }
        
        /// <summary>
        /// Handle interaction input
        /// </summary>
        private void HandleInteraction()
        {
            if (currentInteractable != null)
            {
                IInteractable interactable = currentInteractable.GetComponent<IInteractable>();
                if (interactable != null)
                {
                    // Interact with the object
                    interactable.OnInteract(this);
                    
                    // Show appropriate emotion based on interaction result
                    if (interactable.IsPositiveInteraction())
                    {
                        emotionalState.SetEmotionalState(EmotionalState.Happy, false, 2f);
                    }
                    else
                    {
                        emotionalState.SetEmotionalState(EmotionalState.Sad, false, 2f);
                    }
                }
            }
        }
        
        /// <summary>
        /// Handle jump input
        /// </summary>
        private void HandleJump()
        {
            // Set a surprised emotion briefly when jumping
            emotionalState.SetEmotionalState(EmotionalState.Surprised, false, 0.5f);
        }
        
        /// <summary>
        /// Handle attack input
        /// </summary>
        private void HandleAttack()
        {
            // Set an angry emotion when attacking
            emotionalState.SetEmotionalState(EmotionalState.Angry, false, 1f);
        }
        
        /// <summary>
        /// Apply damage to the character
        /// </summary>
        public void TakeDamage(int amount)
        {
            if (isDead) return;
            
            health -= amount;
            
            // Show pain emotion
            emotionalState.SetEmotionalState(EmotionalState.Sad, false, 1f);
            
            // Check if dead
            if (health <= 0)
            {
                health = 0;
                isDead = true;
                
                // Disable character controller
                characterController.enabled = false;
                
                // Show death emotion
                emotionalState.SetEmotionalState(EmotionalState.Sad, true);
            }
        }
        
        /// <summary>
        /// Heal the character
        /// </summary>
        public void Heal(int amount)
        {
            if (isDead) return;
            
            health = Mathf.Min(health + amount, 100);
            
            // Show happy emotion
            emotionalState.SetEmotionalState(EmotionalState.Happy, false, 1f);
        }
        
        /// <summary>
        /// Revive the character if dead
        /// </summary>
        public void Revive()
        {
            if (!isDead) return;
            
            health = 100;
            isDead = false;
            
            // Enable character controller
            characterController.enabled = true;
            
            // Show surprise emotion
            emotionalState.SetEmotionalState(EmotionalState.Surprised, false, 2f);
        }
    }
}