using UnityEngine;
using System;
using System.Collections.Generic;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Manages emote animations for characters
    /// Allows characters to show emotions through animations
    /// </summary>
    [RequireComponent(typeof(AnimationController))]
    public class EmoteSystem : MonoBehaviour
    {
        [Serializable]
        public struct EmoteDefinition
        {
            public string emoteName;
            public string animationName;
            public float duration;
        }
        
        [Header("Emote Definitions")]
        [SerializeField] private EmoteDefinition[] emotes;
        
        // Dictionary for quick lookup
        private Dictionary<string, EmoteDefinition> emoteMap = new Dictionary<string, EmoteDefinition>();
        
        // Components
        private AnimationController animationController;
        
        private void Awake()
        {
            animationController = GetComponent<AnimationController>();
            
            // Build the emote map
            foreach (var emote in emotes)
            {
                emoteMap[emote.emoteName.ToLower()] = emote;
            }
        }
        
        /// <summary>
        /// Play an emote animation
        /// </summary>
        /// <param name="emoteName">Name of the emote to play</param>
        /// <returns>True if the emote was found and played</returns>
        public bool PlayEmote(string emoteName)
        {
            emoteName = emoteName.ToLower();
            
            if (emoteMap.TryGetValue(emoteName, out EmoteDefinition emote))
            {
                animationController.PlayAnimationWithDuration(emote.animationName, emote.duration);
                
                // Log the emote for debugging
                Debug.Log($"Playing emote: {emoteName} (Animation: {emote.animationName}, Duration: {emote.duration}s)");
                
                return true;
            }
            
            Debug.LogWarning($"Emote '{emoteName}' not found!");
            return false;
        }
        
        /// <summary>
        /// Get all available emotes
        /// </summary>
        /// <returns>Array of emote names</returns>
        public string[] GetAvailableEmotes()
        {
            string[] emoteNames = new string[emoteMap.Count];
            int index = 0;
            
            foreach (var emote in emoteMap.Keys)
            {
                emoteNames[index++] = emote;
            }
            
            return emoteNames;
        }
        
        /// <summary>
        /// Play a random emote
        /// </summary>
        public void PlayRandomEmote()
        {
            if (emotes.Length == 0)
                return;
                
            int randomIndex = UnityEngine.Random.Range(0, emotes.Length);
            PlayEmote(emotes[randomIndex].emoteName);
        }
    }
}