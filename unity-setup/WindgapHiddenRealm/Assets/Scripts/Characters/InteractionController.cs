using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Handles character interactions with the environment and other characters
    /// Provides accessibility options for different interaction methods
    /// </summary>
    public class InteractionController : MonoBehaviour
    {
        // Interaction parameters
        [Header("Interaction Settings")]
        public float interactionRadius = 2.0f;
        public LayerMask interactableLayers;
        public KeyCode interactionKey = KeyCode.E;
        
        [Header("Accessibility Options")]
        public bool useAutoInteract = false;
        public bool useHighlightInteractables = true;
        public bool useSoundFeedback = true;
        public bool useHapticFeedback = false;
        public float autoInteractDelay = 2.0f;
        
        // Events
        public UnityEvent<GameObject> OnInteractionDetected;
        public UnityEvent<GameObject> OnInteractionStarted;
        public UnityEvent<GameObject> OnInteractionCompleted;
        
        // Internal state
        private GameObject currentInteractable;
        private float autoInteractTimer;
        private bool isInteracting = false;
        
        // Components
        private AudioSource audioSource;
        
        private void Awake()
        {
            // Initialize events if needed
            if (OnInteractionDetected == null)
                OnInteractionDetected = new UnityEvent<GameObject>();
                
            if (OnInteractionStarted == null)
                OnInteractionStarted = new UnityEvent<GameObject>();
                
            if (OnInteractionCompleted == null)
                OnInteractionCompleted = new UnityEvent<GameObject>();
                
            // Get or create audio source
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null && useSoundFeedback)
            {
                audioSource = gameObject.AddComponent<AudioSource>();
                audioSource.spatialBlend = 1.0f; // 3D sound
                audioSource.playOnAwake = false;
            }
        }
        
        private void Update()
        {
            // Detect interactable objects
            DetectInteractables();
            
            // Handle interaction input
            if (currentInteractable != null)
            {
                // Manual interaction
                if (Input.GetKeyDown(interactionKey) && !isInteracting)
                {
                    StartInteraction(currentInteractable);
                }
                
                // Auto interaction after delay
                if (useAutoInteract && !isInteracting)
                {
                    autoInteractTimer += Time.deltaTime;
                    if (autoInteractTimer >= autoInteractDelay)
                    {
                        StartInteraction(currentInteractable);
                        autoInteractTimer = 0f;
                    }
                }
            }
            else
            {
                // Reset timer when no interactable is detected
                autoInteractTimer = 0f;
            }
        }
        
        /// <summary>
        /// Detects interactable objects within the interaction radius
        /// </summary>
        private void DetectInteractables()
        {
            Collider[] colliders = Physics.OverlapSphere(transform.position, interactionRadius, interactableLayers);
            
            // Sort colliders by distance
            System.Array.Sort(colliders, (a, b) => 
                Vector3.Distance(transform.position, a.transform.position)
                .CompareTo(Vector3.Distance(transform.position, b.transform.position)));
            
            GameObject closestInteractable = null;
            
            if (colliders.Length > 0)
            {
                // Find the closest interactable object
                foreach (Collider collider in colliders)
                {
                    // Check if object has an interactable component
                    // In a real implementation, this would check for IInteractable interface
                    if (collider.gameObject.GetComponent<MonoBehaviour>() != null)
                    {
                        closestInteractable = collider.gameObject;
                        break;
                    }
                }
            }
            
            // Check if interactable has changed
            if (closestInteractable != currentInteractable)
            {
                // Unhighlight previous interactable
                if (currentInteractable != null && useHighlightInteractables)
                {
                    SetHighlight(currentInteractable, false);
                }
                
                // Update current interactable
                currentInteractable = closestInteractable;
                
                // Highlight new interactable
                if (currentInteractable != null)
                {
                    OnInteractionDetected.Invoke(currentInteractable);
                    
                    if (useHighlightInteractables)
                    {
                        SetHighlight(currentInteractable, true);
                    }
                    
                    // Play detection sound
                    if (useSoundFeedback && audioSource != null)
                    {
                        // In a real implementation, this would play a sound
                        // audioSource.PlayOneShot(detectionSound);
                    }
                }
            }
        }
        
        /// <summary>
        /// Starts an interaction with the specified object
        /// </summary>
        private void StartInteraction(GameObject interactable)
        {
            if (isInteracting)
                return;
                
            isInteracting = true;
            
            // Notify interaction started
            OnInteractionStarted.Invoke(interactable);
            
            // Play interaction sound
            if (useSoundFeedback && audioSource != null)
            {
                // In a real implementation, this would play a sound
                // audioSource.PlayOneShot(interactionSound);
            }
            
            // Apply haptic feedback
            if (useHapticFeedback)
            {
                // In a real implementation, this would use haptic feedback
                // Implemented via input system or accessibility device
            }
            
            // In a real implementation, this would call the interaction method on the object
            // Example: interactable.GetComponent<IInteractable>().Interact(this.gameObject);
            
            // For this placeholder, just simulate interaction completion after a delay
            StartCoroutine(CompleteInteraction(interactable, 1.0f));
        }
        
        /// <summary>
        /// Completes an interaction after a delay
        /// </summary>
        private IEnumerator CompleteInteraction(GameObject interactable, float delay)
        {
            yield return new WaitForSeconds(delay);
            
            // Notify interaction completed
            OnInteractionCompleted.Invoke(interactable);
            
            // Play completion sound
            if (useSoundFeedback && audioSource != null)
            {
                // In a real implementation, this would play a sound
                // audioSource.PlayOneShot(completionSound);
            }
            
            isInteracting = false;
        }
        
        /// <summary>
        /// Sets the highlight state for an interactable object
        /// </summary>
        private void SetHighlight(GameObject obj, bool highlighted)
        {
            // In a real implementation, this would use a proper highlight system
            // Such as outline shader, emission, or material swap
            
            // Example placeholder:
            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                Color color = highlighted ? Color.yellow : Color.white;
                
                // This is a placeholder. In a real implementation, 
                // this would use a proper highlighting system like:
                // - Material property blocks
                // - Outline shader
                // - Custom highlighting system
                
                // For now, just log the highlight change
                Debug.Log($"Highlight {obj.name}: {highlighted}");
            }
        }
        
        /// <summary>
        /// Adjusts interaction parameters based on accessibility needs
        /// </summary>
        public void SetAccessibilityOptions(bool autoInteract, bool highlightInteractables, bool soundFeedback, bool hapticFeedback, float interactDelay)
        {
            useAutoInteract = autoInteract;
            useHighlightInteractables = highlightInteractables;
            useSoundFeedback = soundFeedback;
            useHapticFeedback = hapticFeedback;
            autoInteractDelay = interactDelay;
        }
        
        /// <summary>
        /// Draws the interaction radius in the editor
        /// </summary>
        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, interactionRadius);
        }
    }
}