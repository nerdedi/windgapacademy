using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy
{
    /// <summary>
    /// Advanced animation management system for Windgap Academy characters
    /// Handles animation blending, queuing, and event-driven animations
    /// </summary>
    public class CharacterAnimationManager : MonoBehaviour
    {
        [Header("Animation Settings")]
        public float defaultBlendTime = 0.2f;
        public int maxQueuedAnimations = 5;
        public bool allowAnimationInterruption = true;
        
        [Header("Facial Animation")]
        public SkinnedMeshRenderer facialRenderer;
        public string[] blendShapeNames;
        
        // Components
        private Animator animator;
        private CharacterController characterController;
        
        // Animation State
        private Queue<AnimationRequest> animationQueue;
        private AnimationRequest currentAnimation;
        private Dictionary<string, AnimationClip> animationClips;
        private Dictionary<string, float> blendShapeTargets;
        
        // Animation Events
        public event Action<string> OnAnimationStarted;
        public event Action<string> OnAnimationCompleted;
        public event Action<string> OnAnimationInterrupted;
        
        // Coroutines
        private Coroutine currentAnimationCoroutine;
        private Coroutine blendShapeCoroutine;
        
        public void Initialize(CharacterController controller)
        {
            characterController = controller;
            animator = GetComponent<Animator>();
            
            animationQueue = new Queue<AnimationRequest>();
            animationClips = new Dictionary<string, AnimationClip>();
            blendShapeTargets = new Dictionary<string, float>();
            
            LoadAnimationClips();
            InitializeBlendShapes();
            
            Debug.Log($"Animation Manager initialized for {controller.GetCharacterId()}");
        }
        
        #region Animation Playback
        
        public void PlayAnimation(string animationName, Dictionary<string, object> parameters = null, bool immediate = false)
        {
            var request = new AnimationRequest
            {
                animationName = animationName,
                parameters = parameters ?? new Dictionary<string, object>(),
                blendTime = defaultBlendTime,
                priority = AnimationPriority.Normal,
                immediate = immediate
            };
            
            if (immediate || currentAnimation == null)
            {
                PlayAnimationImmediate(request);
            }
            else
            {
                QueueAnimation(request);
            }
        }
        
        public void PlayAnimationWithPriority(string animationName, AnimationPriority priority, Dictionary<string, object> parameters = null)
        {
            var request = new AnimationRequest
            {
                animationName = animationName,
                parameters = parameters ?? new Dictionary<string, object>(),
                blendTime = defaultBlendTime,
                priority = priority,
                immediate = priority == AnimationPriority.Critical
            };
            
            if (priority == AnimationPriority.Critical)
            {
                InterruptCurrentAnimation();
                PlayAnimationImmediate(request);
            }
            else if (priority == AnimationPriority.High && allowAnimationInterruption)
            {
                InterruptCurrentAnimation();
                PlayAnimationImmediate(request);
            }
            else
            {
                QueueAnimation(request);
            }
        }
        
        private void PlayAnimationImmediate(AnimationRequest request)
        {
            if (currentAnimationCoroutine != null)
            {
                StopCoroutine(currentAnimationCoroutine);
            }
            
            currentAnimation = request;
            currentAnimationCoroutine = StartCoroutine(PlayAnimationCoroutine(request));
        }
        
        private IEnumerator PlayAnimationCoroutine(AnimationRequest request)
        {
            OnAnimationStarted?.Invoke(request.animationName);
            
            // Set animation parameters
            ApplyAnimationParameters(request);
            
            // Play animation
            if (animator != null)
            {
                animator.CrossFade(request.animationName, request.blendTime);
            }
            
            // Wait for animation to complete
            yield return new WaitForSeconds(GetAnimationLength(request.animationName));
            
            // Animation completed
            OnAnimationCompleted?.Invoke(request.animationName);
            currentAnimation = null;
            
            // Play next queued animation
            PlayNextQueuedAnimation();
        }
        
        private void QueueAnimation(AnimationRequest request)
        {
            if (animationQueue.Count < maxQueuedAnimations)
            {
                animationQueue.Enqueue(request);
            }
            else
            {
                Debug.LogWarning($"Animation queue full, dropping animation: {request.animationName}");
            }
        }
        
        private void PlayNextQueuedAnimation()
        {
            if (animationQueue.Count > 0)
            {
                var nextRequest = animationQueue.Dequeue();
                PlayAnimationImmediate(nextRequest);
            }
        }
        
        private void InterruptCurrentAnimation()
        {
            if (currentAnimation != null)
            {
                OnAnimationInterrupted?.Invoke(currentAnimation.animationName);
                
                if (currentAnimationCoroutine != null)
                {
                    StopCoroutine(currentAnimationCoroutine);
                }
                
                currentAnimation = null;
            }
        }
        
        #endregion
        
        #region Facial Animation & Blend Shapes
        
        public void SetBlendShape(string blendShapeName, float value, float duration = 0.5f)
        {
            if (facialRenderer != null && blendShapeTargets.ContainsKey(blendShapeName))
            {
                blendShapeTargets[blendShapeName] = Mathf.Clamp01(value);
                
                if (blendShapeCoroutine != null)
                {
                    StopCoroutine(blendShapeCoroutine);
                }
                
                blendShapeCoroutine = StartCoroutine(BlendShapeCoroutine(blendShapeName, value, duration));
            }
        }
        
        public void SetEmotion(EmotionalState emotion, float intensity = 1.0f)
        {
            // Map emotions to blend shapes
            switch (emotion)
            {
                case EmotionalState.Happy:
                    SetBlendShape("Smile", intensity);
                    SetBlendShape("EyeSquint", intensity * 0.3f);
                    break;
                    
                case EmotionalState.Sad:
                    SetBlendShape("Frown", intensity);
                    SetBlendShape("EyebrowDown", intensity * 0.5f);
                    break;
                    
                case EmotionalState.Surprised:
                    SetBlendShape("EyeWide", intensity);
                    SetBlendShape("MouthOpen", intensity * 0.7f);
                    SetBlendShape("EyebrowUp", intensity);
                    break;
                    
                case EmotionalState.Confused:
                    SetBlendShape("EyebrowAsymmetry", intensity);
                    SetBlendShape("MouthTwist", intensity * 0.5f);
                    break;
                    
                case EmotionalState.Thinking:
                    SetBlendShape("EyeSquint", intensity * 0.4f);
                    SetBlendShape("MouthPucker", intensity * 0.3f);
                    break;
            }
        }
        
        private IEnumerator BlendShapeCoroutine(string blendShapeName, float targetValue, float duration)
        {
            if (facialRenderer == null) yield break;
            
            int blendShapeIndex = facialRenderer.sharedMesh.GetBlendShapeIndex(blendShapeName);
            if (blendShapeIndex < 0) yield break;
            
            float startValue = facialRenderer.GetBlendShapeWeight(blendShapeIndex);
            float elapsedTime = 0f;
            
            while (elapsedTime < duration)
            {
                elapsedTime += Time.deltaTime;
                float progress = elapsedTime / duration;
                float currentValue = Mathf.Lerp(startValue, targetValue * 100f, progress);
                
                facialRenderer.SetBlendShapeWeight(blendShapeIndex, currentValue);
                yield return null;
            }
            
            facialRenderer.SetBlendShapeWeight(blendShapeIndex, targetValue * 100f);
        }
        
        private void InitializeBlendShapes()
        {
            if (facialRenderer != null && facialRenderer.sharedMesh != null)
            {
                var mesh = facialRenderer.sharedMesh;
                for (int i = 0; i < mesh.blendShapeCount; i++)
                {
                    string shapeName = mesh.GetBlendShapeName(i);
                    blendShapeTargets[shapeName] = 0f;
                }
            }
        }
        
        #endregion
        
        #region Animation Utilities
        
        private void LoadAnimationClips()
        {
            // Load animation clips from Resources or Animator Controller
            if (animator != null && animator.runtimeAnimatorController != null)
            {
                var clips = animator.runtimeAnimatorController.animationClips;
                foreach (var clip in clips)
                {
                    animationClips[clip.name] = clip;
                }
            }
        }
        
        private float GetAnimationLength(string animationName)
        {
            if (animationClips.ContainsKey(animationName))
            {
                return animationClips[animationName].length;
            }
            
            // Default duration if clip not found
            return 1.0f;
        }
        
        private void ApplyAnimationParameters(AnimationRequest request)
        {
            if (animator == null) return;
            
            foreach (var parameter in request.parameters)
            {
                string paramName = parameter.Key;
                object value = parameter.Value;
                
                // Apply parameter based on type
                if (value is float floatValue)
                {
                    animator.SetFloat(paramName, floatValue);
                }
                else if (value is bool boolValue)
                {
                    animator.SetBool(paramName, boolValue);
                }
                else if (value is int intValue)
                {
                    animator.SetInteger(paramName, intValue);
                }
                else if (value is string && paramName == "Trigger")
                {
                    animator.SetTrigger(value.ToString());
                }
            }
        }
        
        #endregion
        
        #region Public Interface
        
        public bool IsPlayingAnimation() => currentAnimation != null;
        public string GetCurrentAnimationName() => currentAnimation?.animationName ?? "None";
        public int GetQueuedAnimationCount() => animationQueue.Count;
        
        public void ClearAnimationQueue()
        {
            animationQueue.Clear();
        }
        
        public void StopAllAnimations()
        {
            InterruptCurrentAnimation();
            ClearAnimationQueue();
        }
        
        #endregion
    }
    
    #region Data Classes
    
    [Serializable]
    public class AnimationRequest
    {
        public string animationName;
        public Dictionary<string, object> parameters;
        public float blendTime;
        public AnimationPriority priority;
        public bool immediate;
    }
    
    public enum AnimationPriority
    {
        Low = 0,
        Normal = 1,
        High = 2,
        Critical = 3
    }
    
    #endregion
}