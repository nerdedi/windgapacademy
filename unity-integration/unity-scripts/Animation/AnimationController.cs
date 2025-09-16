using UnityEngine;
using System.Collections.Generic;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Controls animations for Windgap Academy characters
    /// Provides methods to trigger specific animations from code
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class AnimationController : MonoBehaviour
    {
        [Header("Animation Parameters")]
        [SerializeField] private string idleAnimName = "Idle";
        [SerializeField] private string talkAnimName = "Talk";
        [SerializeField] private string walkAnimName = "Walk";
        [SerializeField] private string jumpAnimName = "Jump";
        [SerializeField] private string celebrateAnimName = "Celebrate";
        [SerializeField] private string thinkAnimName = "Think";
        
        [Header("Animation Transitions")]
        [SerializeField] private float crossFadeDuration = 0.25f;
        
        // Animation states dictionary
        private Dictionary<string, int> animationStates = new Dictionary<string, int>();
        
        // Components
        private Animator animator;
        
        // Current animation tracking
        private string currentAnimation = string.Empty;
        
        private void Awake()
        {
            animator = GetComponent<Animator>();
            
            // Cache animation state hashes for faster lookup
            animationStates.Add("idle", Animator.StringToHash(idleAnimName));
            animationStates.Add("talk", Animator.StringToHash(talkAnimName));
            animationStates.Add("walk", Animator.StringToHash(walkAnimName));
            animationStates.Add("jump", Animator.StringToHash(jumpAnimName));
            animationStates.Add("celebrate", Animator.StringToHash(celebrateAnimName));
            animationStates.Add("think", Animator.StringToHash(thinkAnimName));
        }
        
        private void Start()
        {
            // Start with idle animation
            PlayAnimation("idle");
        }
        
        /// <summary>
        /// Play an animation by name
        /// </summary>
        /// <param name="animationName">Name of the animation to play (idle, talk, walk, jump, celebrate, think)</param>
        public void PlayAnimation(string animationName)
        {
            animationName = animationName.ToLower();
            
            if (animationStates.TryGetValue(animationName, out int stateHash))
            {
                // Don't play the same animation again if it's already playing
                if (currentAnimation == animationName)
                    return;
                    
                animator.CrossFade(stateHash, crossFadeDuration);
                currentAnimation = animationName;
                
                // Send animation started event to the ReactBridgeManager if it exists
                if (ReactBridgeManager.Instance != null)
                {
                    ReactBridgeManager.Instance.SendAnimationStarted(animationName, gameObject.name);
                }
                
                Debug.Log($"Playing animation: {animationName}");
            }
            else
            {
                Debug.LogWarning($"Animation '{animationName}' not found!");
            }
        }
        
        /// <summary>
        /// Play animation with optional duration and then return to idle
        /// </summary>
        /// <param name="animationName">Animation to play</param>
        /// <param name="duration">Duration in seconds before returning to idle (0 = don't return)</param>
        public void PlayAnimationWithDuration(string animationName, float duration)
        {
            PlayAnimation(animationName);
            
            if (duration > 0)
            {
                // Use coroutine to return to idle after duration
                StartCoroutine(ReturnToIdleAfterDelay(duration));
            }
        }
        
        private System.Collections.IEnumerator ReturnToIdleAfterDelay(float delay)
        {
            yield return new WaitForSeconds(delay);
            PlayAnimation("idle");
        }
        
        /// <summary>
        /// Check if an animation is currently playing
        /// </summary>
        public bool IsPlaying(string animationName)
        {
            return currentAnimation == animationName.ToLower();
        }
        
        /// <summary>
        /// Get the current animation name
        /// </summary>
        public string GetCurrentAnimation()
        {
            return currentAnimation;
        }
        
        /// <summary>
        /// Called by Animation Events at the end of animations
        /// </summary>
        public void OnAnimationComplete()
        {
            // If the current animation is not idle, return to idle
            if (currentAnimation != "idle")
            {
                PlayAnimation("idle");
                
                // Send animation completed event to the ReactBridgeManager
                if (ReactBridgeManager.Instance != null)
                {
                    ReactBridgeManager.Instance.SendAnimationCompleted(currentAnimation, gameObject.name);
                }
            }
        }
        
        /// <summary>
        /// Play a random animation from a list
        /// </summary>
        public void PlayRandomAnimation(params string[] animations)
        {
            if (animations == null || animations.Length == 0)
                return;
                
            int randomIndex = Random.Range(0, animations.Length);
            PlayAnimation(animations[randomIndex]);
        }
    }
}