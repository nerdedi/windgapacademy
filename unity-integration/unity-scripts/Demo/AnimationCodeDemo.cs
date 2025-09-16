using UnityEngine;
using WindgapAcademy.Animation;

namespace WindgapAcademy.Demo
{
    /// <summary>
    /// Demonstrates how to use code to control animations
    /// This script shows practical examples of animation through code
    /// </summary>
    public class AnimationCodeDemo : MonoBehaviour
    {
        [Header("Character References")]
        [SerializeField] private AnimationController characterAnimator;
        [SerializeField] private AnimationSequencePlayer sequencePlayer;
        [SerializeField] private ProceduralAnimator proceduralAnimator;
        [SerializeField] private EmoteSystem emoteSystem;
        
        [Header("Demo Settings")]
        [SerializeField] private KeyCode playTalkKey = KeyCode.T;
        [SerializeField] private KeyCode playWalkKey = KeyCode.W;
        [SerializeField] private KeyCode playCelebrateKey = KeyCode.C;
        [SerializeField] private KeyCode playSequenceKey = KeyCode.S;
        [SerializeField] private KeyCode pointAtKey = KeyCode.P;
        [SerializeField] private KeyCode randomEmoteKey = KeyCode.E;
        
        [Header("Point Target")]
        [SerializeField] private Transform pointTarget;
        
        private void Update()
        {
            // Simple animation triggering
            if (Input.GetKeyDown(playTalkKey))
            {
                characterAnimator.PlayAnimationWithDuration("talk", 3.0f);
                Debug.Log("Playing talk animation for 3 seconds");
            }
            
            if (Input.GetKeyDown(playWalkKey))
            {
                characterAnimator.PlayAnimation("walk");
                Debug.Log("Playing walk animation");
            }
            
            if (Input.GetKeyDown(playCelebrateKey))
            {
                characterAnimator.PlayAnimationWithDuration("celebrate", 2.0f);
                Debug.Log("Playing celebrate animation for 2 seconds");
            }
            
            // Animation sequence
            if (Input.GetKeyDown(playSequenceKey))
            {
                PlayAnimationSequence();
            }
            
            // Procedural animation
            if (Input.GetKeyDown(pointAtKey))
            {
                if (proceduralAnimator != null && pointTarget != null)
                {
                    proceduralAnimator.PointAt(pointTarget.position);
                    Debug.Log("Pointing at target");
                    
                    // Stop pointing after 3 seconds
                    Invoke("StopPointing", 3.0f);
                }
            }
            
            // Emote system
            if (Input.GetKeyDown(randomEmoteKey))
            {
                if (emoteSystem != null)
                {
                    emoteSystem.PlayRandomEmote();
                }
            }
        }
        
        /// <summary>
        /// Play a sequence of animations
        /// </summary>
        private void PlayAnimationSequence()
        {
            if (sequencePlayer != null)
            {
                Debug.Log("Playing animation sequence");
                
                sequencePlayer.StartSequence()
                    .Then("idle", 1.0f)        // Start with idle for 1 second
                    .Then("talk", 2.0f)        // Talk for 2 seconds
                    .Then("think", 2.0f)       // Think for 2 seconds
                    .Then("celebrate", 1.5f)   // Celebrate for 1.5 seconds
                    .EndWithIdle();            // Return to idle
            }
        }
        
        /// <summary>
        /// Stop the pointing animation
        /// </summary>
        private void StopPointing()
        {
            if (proceduralAnimator != null)
            {
                proceduralAnimator.StopPointing();
                Debug.Log("Stopped pointing");
            }
        }
        
        /// <summary>
        /// Set up a character greeting sequence via code
        /// This method could be called from a trigger or other event
        /// </summary>
        public void PlayGreeting()
        {
            if (sequencePlayer != null && characterAnimator != null)
            {
                // Look at camera/player
                if (Camera.main != null && proceduralAnimator != null)
                {
                    proceduralAnimator.LookAt(Camera.main.transform.position);
                }
                
                // Play greeting sequence
                sequencePlayer.StartSequence()
                    .Then("idle", 0.5f)
                    .Then("talk", 3.0f)
                    .Then("celebrate", 1.0f)
                    .EndWithIdle();
                    
                Debug.Log("Playing greeting sequence");
            }
        }
        
        /// <summary>
        /// Example of triggering an animation in response to an event
        /// </summary>
        /// <param name="eventName">Name of the event that occurred</param>
        public void OnGameEvent(string eventName)
        {
            if (characterAnimator == null) return;
            
            switch (eventName)
            {
                case "PlayerNearby":
                    characterAnimator.PlayAnimation("idle");
                    break;
                    
                case "QuestionAsked":
                    characterAnimator.PlayAnimationWithDuration("think", 2.0f);
                    break;
                    
                case "CorrectAnswer":
                    characterAnimator.PlayAnimationWithDuration("celebrate", 1.5f);
                    break;
                    
                case "IncorrectAnswer":
                    // Play a sequence for incorrect answer
                    if (sequencePlayer != null)
                    {
                        sequencePlayer.StartSequence()
                            .Then("think", 1.0f)
                            .Then("talk", 2.0f)
                            .EndWithIdle();
                    }
                    break;
            }
        }
    }
}