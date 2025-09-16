using UnityEngine;
using System.Collections.Generic;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Manages sequences of animations for Windgap Academy characters
    /// This allows creating complex chains of animations through code
    /// </summary>
    [RequireComponent(typeof(AnimationController))]
    public class AnimationSequencePlayer : MonoBehaviour
    {
        // Reference to the animation controller
        private AnimationController animationController;
        
        // Queue for animation sequences
        private Queue<AnimationStep> animationQueue = new Queue<AnimationStep>();
        
        // Currently running sequence
        private bool isPlayingSequence = false;
        
        private void Awake()
        {
            animationController = GetComponent<AnimationController>();
        }
        
        /// <summary>
        /// Start a new animation sequence
        /// </summary>
        /// <returns>A new sequence builder</returns>
        public SequenceBuilder StartSequence()
        {
            return new SequenceBuilder(this);
        }
        
        /// <summary>
        /// Add an animation step to the queue
        /// </summary>
        public void QueueAnimation(string animationName, float duration)
        {
            animationQueue.Enqueue(new AnimationStep(animationName, duration));
            
            // Start playing the sequence if not already playing
            if (!isPlayingSequence)
            {
                isPlayingSequence = true;
                PlayNextInSequence();
            }
        }
        
        /// <summary>
        /// Play the next animation in the sequence
        /// </summary>
        private void PlayNextInSequence()
        {
            if (animationQueue.Count == 0)
            {
                isPlayingSequence = false;
                return;
            }
            
            AnimationStep step = animationQueue.Dequeue();
            animationController.PlayAnimation(step.AnimationName);
            
            // Schedule next animation
            Invoke("PlayNextInSequence", step.Duration);
        }
        
        /// <summary>
        /// Clear the animation queue
        /// </summary>
        public void ClearSequence()
        {
            animationQueue.Clear();
            CancelInvoke("PlayNextInSequence");
            isPlayingSequence = false;
            
            // Return to idle
            animationController.PlayAnimation("idle");
        }
        
        /// <summary>
        /// Represents a single step in an animation sequence
        /// </summary>
        public struct AnimationStep
        {
            public string AnimationName { get; private set; }
            public float Duration { get; private set; }
            
            public AnimationStep(string animationName, float duration)
            {
                AnimationName = animationName;
                Duration = duration;
            }
        }
        
        /// <summary>
        /// Builder class for creating animation sequences
        /// </summary>
        public class SequenceBuilder
        {
            private AnimationSequencePlayer player;
            
            public SequenceBuilder(AnimationSequencePlayer player)
            {
                this.player = player;
                
                // Clear any existing sequence
                player.ClearSequence();
            }
            
            /// <summary>
            /// Add an animation to the sequence
            /// </summary>
            /// <param name="animationName">Name of the animation</param>
            /// <param name="duration">Duration to play in seconds</param>
            /// <returns>The sequence builder for chaining</returns>
            public SequenceBuilder Then(string animationName, float duration)
            {
                player.QueueAnimation(animationName, duration);
                return this;
            }
            
            /// <summary>
            /// End the sequence with an idle animation
            /// </summary>
            public void EndWithIdle()
            {
                player.QueueAnimation("idle", 0);
            }
        }
    }
}