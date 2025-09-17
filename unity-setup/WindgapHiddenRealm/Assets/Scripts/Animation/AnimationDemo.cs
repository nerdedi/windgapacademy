using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy
{
    /// <summary>
    /// Demonstrates how to use the CharacterAnimationManager
    /// </summary>
    public class AnimationDemo : MonoBehaviour
    {
        [Header("Character References")]
        public GameObject characterPrefab;
        public Transform spawnPoint;
        
        [Header("Animation Settings")]
        public string[] animationsToDemo;
        public float delayBetweenAnimations = 2.0f;
        
        // References
        private GameObject characterInstance;
        private CharacterAnimationManager animationManager;
        
        void Start()
        {
            // Spawn character
            if (characterPrefab != null && spawnPoint != null)
            {
                characterInstance = Instantiate(characterPrefab, spawnPoint.position, spawnPoint.rotation);
                
                // Get or add animation manager
                animationManager = characterInstance.GetComponent<CharacterAnimationManager>();
                if (animationManager == null)
                {
                    animationManager = characterInstance.AddComponent<CharacterAnimationManager>();
                }
                
                // Add character controller if needed
                CharacterController controller = characterInstance.GetComponent<CharacterController>();
                if (controller == null)
                {
                    controller = characterInstance.AddComponent<CharacterController>();
                }
                
                // Initialize the animation manager
                animationManager.Initialize(controller);
                
                // Start the demo after a short delay
                StartCoroutine(RunAnimationDemo());
            }
            else
            {
                Debug.LogError("Character prefab or spawn point not assigned!");
            }
        }
        
        private IEnumerator RunAnimationDemo()
        {
            // Wait for everything to initialize
            yield return new WaitForSeconds(1.0f);
            
            Debug.Log("Starting animation demo...");
            
            // Demo facial expressions
            yield return StartCoroutine(DemoEmotions());
            
            // Demo animation sequences
            if (animationsToDemo != null && animationsToDemo.Length > 0)
            {
                foreach (var animName in animationsToDemo)
                {
                    Debug.Log($"Playing animation: {animName}");
                    animationManager.PlayAnimation(animName);
                    
                    // Wait for animation to complete plus delay
                    yield return new WaitForSeconds(
                        animationManager.defaultBlendTime + 
                        animationManager.GetCurrentAnimationName() != "None" ? 2.0f : 0 + 
                        delayBetweenAnimations
                    );
                }
            }
            
            Debug.Log("Animation demo completed!");
        }
        
        private IEnumerator DemoEmotions()
        {
            Debug.Log("Demonstrating emotions...");
            
            // Cycle through all emotions
            animationManager.SetEmotion(EmotionalState.Happy, 1.0f);
            yield return new WaitForSeconds(2.0f);
            
            animationManager.SetEmotion(EmotionalState.Sad, 1.0f);
            yield return new WaitForSeconds(2.0f);
            
            animationManager.SetEmotion(EmotionalState.Surprised, 1.0f);
            yield return new WaitForSeconds(2.0f);
            
            animationManager.SetEmotion(EmotionalState.Confused, 1.0f);
            yield return new WaitForSeconds(2.0f);
            
            animationManager.SetEmotion(EmotionalState.Thinking, 1.0f);
            yield return new WaitForSeconds(2.0f);
            
            // Reset to neutral
            animationManager.SetEmotion(EmotionalState.Neutral, 1.0f);
            yield return new WaitForSeconds(1.0f);
        }
    }
}