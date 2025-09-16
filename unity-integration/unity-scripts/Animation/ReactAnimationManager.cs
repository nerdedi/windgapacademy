using UnityEngine;
using System.Collections.Generic;
using System;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Manages animations that can be triggered from React
    /// This is the main entry point for animation control from the web interface
    /// </summary>
    public class ReactAnimationManager : MonoBehaviour
    {
        [Serializable]
        public class CharacterEntry
        {
            public string characterId;
            public GameObject characterObject;
        }
        
        [Header("Character Mapping")]
        [SerializeField] private CharacterEntry[] characters;
        
        // Dictionary for quick character lookup
        private Dictionary<string, GameObject> characterMap = new Dictionary<string, GameObject>();
        
        // Singleton instance
        public static ReactAnimationManager Instance { get; private set; }
        
        private void Awake()
        {
            // Set up singleton
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            
            Instance = this;
            
            // Build character map
            foreach (var character in characters)
            {
                if (character.characterObject != null)
                {
                    characterMap[character.characterId.ToLower()] = character.characterObject;
                }
            }
        }
        
        /// <summary>
        /// Process animation message from React
        /// </summary>
        /// <param name="data">Animation data with characterId, animationName, and optional parameters</param>
        public void ProcessAnimationMessage(Dictionary<string, object> data)
        {
            if (data == null || !data.ContainsKey("characterId") || !data.ContainsKey("animationName"))
            {
                Debug.LogError("Invalid animation message: missing characterId or animationName");
                return;
            }
            
            string characterId = data["characterId"].ToString().ToLower();
            string animationName = data["animationName"].ToString().ToLower();
            
            // Get optional duration parameter
            float duration = 0f;
            if (data.ContainsKey("duration") && data["duration"] != null)
            {
                float.TryParse(data["duration"].ToString(), out duration);
            }
            
            // Play the animation
            PlayCharacterAnimation(characterId, animationName, duration);
        }
        
        /// <summary>
        /// Play animation on a specific character
        /// </summary>
        /// <param name="characterId">ID of the character</param>
        /// <param name="animationName">Name of the animation</param>
        /// <param name="duration">Optional duration (0 = play full animation)</param>
        public void PlayCharacterAnimation(string characterId, string animationName, float duration = 0f)
        {
            characterId = characterId.ToLower();
            
            if (characterMap.TryGetValue(characterId, out GameObject character))
            {
                AnimationController animController = character.GetComponent<AnimationController>();
                
                if (animController != null)
                {
                    if (duration > 0)
                    {
                        animController.PlayAnimationWithDuration(animationName, duration);
                    }
                    else
                    {
                        animController.PlayAnimation(animationName);
                    }
                    
                    Debug.Log($"Playing animation '{animationName}' on character '{characterId}'");
                    
                    // Send message to React that animation started
                    if (ReactBridgeManager.Instance != null)
                    {
                        ReactBridgeManager.Instance.SendAnimationStarted(animationName, characterId);
                    }
                }
                else
                {
                    Debug.LogWarning($"Character '{characterId}' does not have an AnimationController component");
                }
            }
            else
            {
                Debug.LogWarning($"Character '{characterId}' not found in character map");
            }
        }
        
        /// <summary>
        /// Play an emote on a specific character
        /// </summary>
        /// <param name="characterId">ID of the character</param>
        /// <param name="emoteName">Name of the emote</param>
        public void PlayCharacterEmote(string characterId, string emoteName)
        {
            characterId = characterId.ToLower();
            
            if (characterMap.TryGetValue(characterId, out GameObject character))
            {
                EmoteSystem emoteSystem = character.GetComponent<EmoteSystem>();
                
                if (emoteSystem != null)
                {
                    emoteSystem.PlayEmote(emoteName);
                    Debug.Log($"Playing emote '{emoteName}' on character '{characterId}'");
                }
                else
                {
                    Debug.LogWarning($"Character '{characterId}' does not have an EmoteSystem component");
                }
            }
            else
            {
                Debug.LogWarning($"Character '{characterId}' not found in character map");
            }
        }
        
        /// <summary>
        /// Play an animation sequence on a specific character
        /// </summary>
        /// <param name="characterId">ID of the character</param>
        /// <param name="sequence">Array of animation names and durations</param>
        public void PlayAnimationSequence(string characterId, Dictionary<string, float>[] sequence)
        {
            characterId = characterId.ToLower();
            
            if (characterMap.TryGetValue(characterId, out GameObject character))
            {
                AnimationSequencePlayer sequencePlayer = character.GetComponent<AnimationSequencePlayer>();
                
                if (sequencePlayer != null)
                {
                    var builder = sequencePlayer.StartSequence();
                    
                    foreach (var step in sequence)
                    {
                        if (step.ContainsKey("animation") && step.ContainsKey("duration"))
                        {
                            string animation = step["animation"].ToString();
                            float duration = (float)step["duration"];
                            
                            builder.Then(animation, duration);
                        }
                    }
                    
                    builder.EndWithIdle();
                    Debug.Log($"Playing animation sequence on character '{characterId}'");
                }
                else
                {
                    Debug.LogWarning($"Character '{characterId}' does not have an AnimationSequencePlayer component");
                }
            }
            else
            {
                Debug.LogWarning($"Character '{characterId}' not found in character map");
            }
        }
    }
}