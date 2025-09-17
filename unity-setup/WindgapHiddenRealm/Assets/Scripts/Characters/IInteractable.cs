using UnityEngine;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Interface for objects that can be interacted with by characters.
    /// Implement this interface on any GameObject that should be interactable.
    /// </summary>
    public interface IInteractable
    {
        /// <summary>
        /// Called when the interactable object is highlighted (player looks at or approaches it)
        /// </summary>
        void OnHighlight();
        
        /// <summary>
        /// Called when the interactable object is no longer highlighted
        /// </summary>
        void OnUnhighlight();
        
        /// <summary>
        /// Called when a character interacts with this object
        /// </summary>
        /// <param name="character">The character that initiated the interaction</param>
        void OnInteract(CharacterManager character);
        
        /// <summary>
        /// Returns whether this interaction has a positive effect on the character
        /// </summary>
        /// <returns>True if the interaction is positive</returns>
        bool IsPositiveInteraction();
        
        /// <summary>
        /// Returns whether this interaction has a negative effect on the character
        /// </summary>
        /// <returns>True if the interaction is negative</returns>
        bool IsNegativeInteraction();
    }
}