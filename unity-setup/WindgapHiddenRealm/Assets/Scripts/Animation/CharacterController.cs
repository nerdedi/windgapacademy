using UnityEngine;
using WindgapAcademy.Characters;

namespace WindgapAcademy
{
    /// <summary>
    /// Compatibility class to bridge between the animation system and character system
    /// </summary>
    public class CharacterController : MonoBehaviour
    {
        private CharacterInstance characterInstance;

        private void Awake()
        {
            characterInstance = GetComponent<CharacterInstance>();
            if (characterInstance == null)
            {
                Debug.LogError("CharacterController requires a CharacterInstance component on the same GameObject");
            }
        }

        /// <summary>
        /// Returns the character ID for the animation system
        /// </summary>
        public string GetCharacterId()
        {
            return characterInstance != null ? characterInstance.characterId : "Unknown";
        }
    }
}