using System.Collections;
using UnityEngine;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Defines the emotional states a character can have
    /// </summary>
    public enum EmotionalState
    {
        Neutral,
        Happy,
        Sad,
        Angry,
        Scared,
        Surprised,
        Confused,
        Excited
    }

    /// <summary>
    /// Manages a character's emotional state and related animations
    /// </summary>
    public class CharacterEmotionalState : MonoBehaviour
    {
        [Header("Animation Settings")]
        [SerializeField] private Animator animator;
        [SerializeField] private float emotionTransitionSpeed = 0.5f;
        [SerializeField] private float emotionDuration = 3f;
        
        // Emotion blending weights
        private float neutralWeight = 1f;
        private float happyWeight = 0f;
        private float sadWeight = 0f;
        private float angryWeight = 0f;
        private float scaredWeight = 0f;
        private float surprisedWeight = 0f;
        private float confusedWeight = 0f;
        private float excitedWeight = 0f;
        
        // Animation layer index for facial expressions
        private int facialLayerIndex = 1;
        
        // Current emotional state
        private EmotionalState currentState = EmotionalState.Neutral;
        
        // Coroutine reference for emotion transitions
        private Coroutine emotionCoroutine;
        
        // Animation parameter hashes
        private int neutralHash;
        private int happyHash;
        private int sadHash;
        private int angryHash;
        private int scaredHash;
        private int surprisedHash;
        private int confusedHash;
        private int excitedHash;
        
        private void Awake()
        {
            // Get animator if not assigned
            if (animator == null)
            {
                animator = GetComponent<Animator>();
            }
            
            // Cache animation parameter hashes
            neutralHash = Animator.StringToHash("Neutral");
            happyHash = Animator.StringToHash("Happy");
            sadHash = Animator.StringToHash("Sad");
            angryHash = Animator.StringToHash("Angry");
            scaredHash = Animator.StringToHash("Scared");
            surprisedHash = Animator.StringToHash("Surprised");
            confusedHash = Animator.StringToHash("Confused");
            excitedHash = Animator.StringToHash("Excited");
        }
        
        /// <summary>
        /// Change the character's emotional state
        /// </summary>
        /// <param name="state">The new emotional state</param>
        /// <param name="instant">Whether to change instantly or transition smoothly</param>
        /// <param name="duration">How long the emotion should last before returning to neutral (-1 for permanent)</param>
        public void SetEmotionalState(EmotionalState state, bool instant = false, float duration = -1f)
        {
            // If already in this state, do nothing
            if (state == currentState) return;
            
            // Stop any ongoing emotion transition
            if (emotionCoroutine != null)
            {
                StopCoroutine(emotionCoroutine);
            }
            
            // Set the new state
            currentState = state;
            
            if (instant)
            {
                // Reset all weights
                neutralWeight = 0f;
                happyWeight = 0f;
                sadWeight = 0f;
                angryWeight = 0f;
                scaredWeight = 0f;
                surprisedWeight = 0f;
                confusedWeight = 0f;
                excitedWeight = 0f;
                
                // Set the new state weight to 1
                switch (state)
                {
                    case EmotionalState.Neutral:
                        neutralWeight = 1f;
                        break;
                    case EmotionalState.Happy:
                        happyWeight = 1f;
                        break;
                    case EmotionalState.Sad:
                        sadWeight = 1f;
                        break;
                    case EmotionalState.Angry:
                        angryWeight = 1f;
                        break;
                    case EmotionalState.Scared:
                        scaredWeight = 1f;
                        break;
                    case EmotionalState.Surprised:
                        surprisedWeight = 1f;
                        break;
                    case EmotionalState.Confused:
                        confusedWeight = 1f;
                        break;
                    case EmotionalState.Excited:
                        excitedWeight = 1f;
                        break;
                }
                
                // Apply weights to animator
                UpdateAnimatorWeights();
            }
            else
            {
                // Start a coroutine to smoothly transition to the new state
                emotionCoroutine = StartCoroutine(TransitionToEmotionalState(state, duration));
            }
        }
        
        /// <summary>
        /// Coroutine to smoothly transition to a new emotional state
        /// </summary>
        private IEnumerator TransitionToEmotionalState(EmotionalState state, float duration)
        {
            // Target weights for each state
            float targetNeutral = state == EmotionalState.Neutral ? 1f : 0f;
            float targetHappy = state == EmotionalState.Happy ? 1f : 0f;
            float targetSad = state == EmotionalState.Sad ? 1f : 0f;
            float targetAngry = state == EmotionalState.Angry ? 1f : 0f;
            float targetScared = state == EmotionalState.Scared ? 1f : 0f;
            float targetSurprised = state == EmotionalState.Surprised ? 1f : 0f;
            float targetConfused = state == EmotionalState.Confused ? 1f : 0f;
            float targetExcited = state == EmotionalState.Excited ? 1f : 0f;
            
            // Track transition time
            float transitionTime = 0f;
            
            // Store initial weights
            float initialNeutral = neutralWeight;
            float initialHappy = happyWeight;
            float initialSad = sadWeight;
            float initialAngry = angryWeight;
            float initialScared = scaredWeight;
            float initialSurprised = surprisedWeight;
            float initialConfused = confusedWeight;
            float initialExcited = excitedWeight;
            
            // Smoothly transition to the new weights
            while (transitionTime < emotionTransitionSpeed)
            {
                transitionTime += Time.deltaTime;
                float t = transitionTime / emotionTransitionSpeed;
                
                // Lerp all weights
                neutralWeight = Mathf.Lerp(initialNeutral, targetNeutral, t);
                happyWeight = Mathf.Lerp(initialHappy, targetHappy, t);
                sadWeight = Mathf.Lerp(initialSad, targetSad, t);
                angryWeight = Mathf.Lerp(initialAngry, targetAngry, t);
                scaredWeight = Mathf.Lerp(initialScared, targetScared, t);
                surprisedWeight = Mathf.Lerp(initialSurprised, targetSurprised, t);
                confusedWeight = Mathf.Lerp(initialConfused, targetConfused, t);
                excitedWeight = Mathf.Lerp(initialExcited, targetExcited, t);
                
                // Update animator
                UpdateAnimatorWeights();
                
                yield return null;
            }
            
            // Ensure exact target weights
            neutralWeight = targetNeutral;
            happyWeight = targetHappy;
            sadWeight = targetSad;
            angryWeight = targetAngry;
            scaredWeight = targetScared;
            surprisedWeight = targetSurprised;
            confusedWeight = targetConfused;
            excitedWeight = targetExcited;
            
            // Update animator once more
            UpdateAnimatorWeights();
            
            // If duration is specified, return to neutral after delay
            if (duration > 0f)
            {
                yield return new WaitForSeconds(duration);
                emotionCoroutine = StartCoroutine(TransitionToEmotionalState(EmotionalState.Neutral, -1f));
            }
        }
        
        /// <summary>
        /// Apply the current weights to the animator
        /// </summary>
        private void UpdateAnimatorWeights()
        {
            if (animator != null)
            {
                animator.SetLayerWeight(facialLayerIndex, 1f);
                
                animator.SetFloat(neutralHash, neutralWeight);
                animator.SetFloat(happyHash, happyWeight);
                animator.SetFloat(sadHash, sadWeight);
                animator.SetFloat(angryHash, angryWeight);
                animator.SetFloat(scaredHash, scaredWeight);
                animator.SetFloat(surprisedHash, surprisedWeight);
                animator.SetFloat(confusedHash, confusedWeight);
                animator.SetFloat(excitedHash, excitedWeight);
            }
        }
    }
}