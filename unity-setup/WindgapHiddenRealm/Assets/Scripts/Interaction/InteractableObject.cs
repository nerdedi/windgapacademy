using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WindgapAcademy.Characters;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Interaction
{
    /// <summary>
    /// A base class for interactable objects in the game world.
    /// This can be extended for specific types of interactables.
    /// </summary>
    public class InteractableObject : MonoBehaviour, IInteractable
    {
        [Header("Interactable Settings")]
        [SerializeField] protected string interactableName = "Object";
        [SerializeField] protected string interactionPrompt = "Press E to interact";
        [SerializeField] protected bool isPositive = true;
        [SerializeField] protected bool isOneTimeUse = false;
        
        [Header("Visual Feedback")]
        [SerializeField] protected Material highlightMaterial;
        [SerializeField] protected Material normalMaterial;
        [SerializeField] protected Renderer objectRenderer;
        [SerializeField] protected GameObject highlightEffect;
        
        [Header("Audio Feedback")]
        [SerializeField] protected AudioSource audioSource;
        [SerializeField] protected AudioClip interactSound;
        [SerializeField] protected AudioClip highlightSound;
        
        // State tracking
        protected bool isHighlighted = false;
        protected bool hasBeenUsed = false;
        
        protected virtual void Awake()
        {
            // Get renderer if not assigned
            if (objectRenderer == null)
            {
                objectRenderer = GetComponent<Renderer>();
            }
            
            // Get audio source if not assigned
            if (audioSource == null)
            {
                audioSource = GetComponent<AudioSource>();
            }
            
            // Disable highlight effect at start
            if (highlightEffect != null)
            {
                highlightEffect.SetActive(false);
            }
        }
        
        public virtual void OnHighlight()
        {
            if (isHighlighted || (isOneTimeUse && hasBeenUsed)) return;
            
            isHighlighted = true;
            
            // Apply highlight material
            if (objectRenderer != null && highlightMaterial != null)
            {
                objectRenderer.material = highlightMaterial;
            }
            
            // Show highlight effect
            if (highlightEffect != null)
            {
                highlightEffect.SetActive(true);
            }
            
            // Play highlight sound
            if (audioSource != null && highlightSound != null)
            {
                audioSource.PlayOneShot(highlightSound);
            }
            
            // Show interaction prompt
            ShowInteractionPrompt();
        }
        
        public virtual void OnUnhighlight()
        {
            if (!isHighlighted) return;
            
            isHighlighted = false;
            
            // Restore normal material
            if (objectRenderer != null && normalMaterial != null)
            {
                objectRenderer.material = normalMaterial;
            }
            
            // Hide highlight effect
            if (highlightEffect != null)
            {
                highlightEffect.SetActive(false);
            }
            
            // Hide interaction prompt
            HideInteractionPrompt();
        }
        
        public virtual void OnInteract(CharacterManager character)
        {
            if (isOneTimeUse && hasBeenUsed) return;
            
            // Play interaction sound
            if (audioSource != null && interactSound != null)
            {
                audioSource.PlayOneShot(interactSound);
            }
            
            // Mark as used if one-time use
            if (isOneTimeUse)
            {
                hasBeenUsed = true;
                
                // Unhighlight after use
                OnUnhighlight();
            }
            
            // Log interaction
            Debug.Log($"{character.CharacterName} interacted with {interactableName}");
        }
        
        public virtual bool IsPositiveInteraction()
        {
            return isPositive;
        }
        
        public virtual bool IsNegativeInteraction()
        {
            return !isPositive;
        }
        
        protected virtual void ShowInteractionPrompt()
        {
            // This should be implemented by UI manager
            // Could display a floating text or UI element with interaction prompt
            Debug.Log(interactionPrompt);
        }
        
        protected virtual void HideInteractionPrompt()
        {
            // This should be implemented by UI manager
            // Could hide the floating text or UI element
        }
        
        // Reset the interactable (for one-time use objects)
        public virtual void Reset()
        {
            hasBeenUsed = false;
        }
    }
}