using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

namespace WindgapAcademy
{
    /// <summary>
    /// Base character controller for all Windgap Academy characters
    /// Handles animations, interactions, and educational behaviors
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class CharacterController : MonoBehaviour
    {
        [Header("Character Settings")]
        public string characterId;
        public CharacterType characterType;
        public float movementSpeed = 2.0f;
        public float rotationSpeed = 180.0f;
        
        [Header("Animation Settings")]
        public float animationBlendTime = 0.2f;
        public bool useRootMotion = true;
        
        [Header("Interaction Settings")]
        public float interactionRange = 2.0f;
        public LayerMask interactionLayers = -1;
        
        [Header("Audio")]
        public AudioSource voiceAudioSource;
        public AudioClip[] voiceClips;
        
        // Components
        protected Animator animator;
        protected CharacterAnimationManager animationManager;
        protected CharacterAI characterAI;
        protected EmotionalSystem emotionalSystem;
        
        // State
        protected CharacterState currentState;
        protected Vector3 targetPosition;
        protected Quaternion targetRotation;
        protected bool isInteracting;
        protected LessonData currentLesson;
        
        // Animation Parameters
        protected readonly int SpeedParam = Animator.StringToHash("Speed");
        protected readonly int IsWalkingParam = Animator.StringToHash("IsWalking");
        protected readonly int EmotionParam = Animator.StringToHash("EmotionState");
        protected readonly int InteractionTrigger = Animator.StringToHash("InteractionTrigger");
        protected readonly int TeachingActionParam = Animator.StringToHash("TeachingAction");
        
        // Events
        public event Action<string> OnAnimationStarted;
        public event Action<string> OnAnimationCompleted;
        public event Action<EmotionalState> OnEmotionChanged;
        public event Action<InteractionData> OnInteractionPerformed;
        
        protected virtual void Awake()
        {
            InitializeComponents();
        }
        
        protected virtual void Start()
        {
            InitializeCharacter();
        }
        
        protected virtual void Update()
        {
            UpdateMovement();
            UpdateAnimations();
            UpdateInteractions();
        }
        
        #region Initialization
        
        protected virtual void InitializeComponents()
        {
            animator = GetComponent<Animator>();
            animationManager = GetComponent<CharacterAnimationManager>() ?? gameObject.AddComponent<CharacterAnimationManager>();
            characterAI = GetComponent<CharacterAI>() ?? gameObject.AddComponent<CharacterAI>();
            emotionalSystem = GetComponent<EmotionalSystem>() ?? gameObject.AddComponent<EmotionalSystem>();
            
            if (voiceAudioSource == null)
            {
                voiceAudioSource = gameObject.AddComponent<AudioSource>();
                voiceAudioSource.spatialBlend = 1.0f; // 3D audio
            }
        }
        
        protected virtual void InitializeCharacter()
        {
            currentState = CharacterState.Idle;
            targetPosition = transform.position;
            targetRotation = transform.rotation;
            
            // Initialize subsystems
            animationManager.Initialize(this);
            characterAI.Initialize(this);
            emotionalSystem.Initialize(this);
            
            // Set initial animation state
            SetAnimationParameter(SpeedParam, 0f);
            SetAnimationParameter(IsWalkingParam, false);
        }
        
        public virtual void InitializeForLesson(LessonData lessonData)
        {
            currentLesson = lessonData;
            characterAI.SetLessonContext(lessonData);
            
            // Character-specific lesson initialization
            OnLessonInitialized(lessonData);
        }
        
        protected virtual void OnLessonInitialized(LessonData lessonData)
        {
            // Override in derived classes for character-specific behavior
        }
        
        #endregion
        
        #region Movement & Navigation
        
        public virtual void MoveTo(Vector3 position, bool immediate = false)
        {
            if (immediate)
            {
                transform.position = position;
                targetPosition = position;
            }
            else
            {
                targetPosition = position;
                ChangeState(CharacterState.Moving);
            }
        }
        
        public virtual void LookAt(Vector3 position, bool immediate = false)
        {
            Vector3 direction = (position - transform.position).normalized;
            direction.y = 0; // Keep on horizontal plane
            
            if (direction != Vector3.zero)
            {
                Quaternion rotation = Quaternion.LookRotation(direction);
                
                if (immediate)
                {
                    transform.rotation = rotation;
                    targetRotation = rotation;
                }
                else
                {
                    targetRotation = rotation;
                }
            }
        }
        
        protected virtual void UpdateMovement()
        {
            if (currentState == CharacterState.Moving)
            {
                // Move towards target
                float distance = Vector3.Distance(transform.position, targetPosition);
                
                if (distance > 0.1f)
                {
                    Vector3 direction = (targetPosition - transform.position).normalized;
                    transform.position += direction * movementSpeed * Time.deltaTime;
                    
                    // Update animation
                    SetAnimationParameter(SpeedParam, movementSpeed);
                    SetAnimationParameter(IsWalkingParam, true);
                    
                    // Face movement direction
                    if (direction != Vector3.zero)
                    {
                        targetRotation = Quaternion.LookRotation(direction);
                    }
                }
                else
                {
                    // Reached target
                    transform.position = targetPosition;
                    ChangeState(CharacterState.Idle);
                    SetAnimationParameter(SpeedParam, 0f);
                    SetAnimationParameter(IsWalkingParam, false);
                }
            }
            
            // Update rotation
            if (Quaternion.Angle(transform.rotation, targetRotation) > 1f)
            {
                transform.rotation = Quaternion.RotateTowards(
                    transform.rotation, 
                    targetRotation, 
                    rotationSpeed * Time.deltaTime
                );
            }
        }
        
        #endregion
        
        #region Animation System
        
        public virtual void TriggerAnimation(string animationName, Dictionary<string, object> parameters = null)
        {
            if (animationManager != null)
            {
                animationManager.PlayAnimation(animationName, parameters);
                OnAnimationStarted?.Invoke(animationName);
            }
        }
        
        public virtual void SetEmotion(EmotionalState emotion, float intensity = 1.0f)
        {
            if (emotionalSystem != null)
            {
                emotionalSystem.SetEmotion(emotion, intensity);
                SetAnimationParameter(EmotionParam, (int)emotion);
                OnEmotionChanged?.Invoke(emotion);
            }
        }
        
        protected virtual void UpdateAnimations()
        {
            // Update animation parameters based on current state
            switch (currentState)
            {
                case CharacterState.Idle:
                    // Idle animations handled by animation controller
                    break;
                    
                case CharacterState.Teaching:
                    // Teaching-specific animation updates
                    UpdateTeachingAnimations();
                    break;
                    
                case CharacterState.Interacting:
                    // Interaction-specific animation updates
                    UpdateInteractionAnimations();
                    break;
            }
        }
        
        protected virtual void UpdateTeachingAnimations()
        {
            // Override in educator characters
        }
        
        protected virtual void UpdateInteractionAnimations()
        {
            // Override in specific character types
        }
        
        protected void SetAnimationParameter(int parameterHash, float value)
        {
            if (animator != null)
            {
                animator.SetFloat(parameterHash, value);
            }
        }
        
        protected void SetAnimationParameter(int parameterHash, bool value)
        {
            if (animator != null)
            {
                animator.SetBool(parameterHash, value);
            }
        }
        
        protected void SetAnimationParameter(int parameterHash, int value)
        {
            if (animator != null)
            {
                animator.SetInteger(parameterHash, value);
            }
        }
        
        protected void TriggerAnimationParameter(int parameterHash)
        {
            if (animator != null)
            {
                animator.SetTrigger(parameterHash);
            }
        }
        
        #endregion
        
        #region Interaction System
        
        protected virtual void UpdateInteractions()
        {
            if (currentState == CharacterState.Interacting)
            {
                // Handle ongoing interactions
                ProcessCurrentInteraction();
            }
        }
        
        public virtual void StartInteraction(InteractionData interactionData)
        {
            if (!isInteracting)
            {
                isInteracting = true;
                ChangeState(CharacterState.Interacting);
                ProcessInteraction(interactionData);
                OnInteractionPerformed?.Invoke(interactionData);
            }
        }
        
        protected virtual void ProcessInteraction(InteractionData interactionData)
        {
            // Override in derived classes for specific interaction behaviors
            StartCoroutine(InteractionCoroutine(interactionData));
        }
        
        protected virtual void ProcessCurrentInteraction()
        {
            // Override in derived classes for ongoing interaction updates
        }
        
        protected virtual IEnumerator InteractionCoroutine(InteractionData interactionData)
        {
            // Play interaction animation
            TriggerAnimation(interactionData.animationName);
            
            // Wait for interaction duration
            yield return new WaitForSeconds(interactionData.duration);
            
            // Complete interaction
            CompleteInteraction();
        }
        
        protected virtual void CompleteInteraction()
        {
            isInteracting = false;
            ChangeState(CharacterState.Idle);
        }
        
        #endregion
        
        #region Audio System
        
        public virtual void PlayVoiceClip(string clipName)
        {
            AudioClip clip = GetVoiceClip(clipName);
            if (clip != null && voiceAudioSource != null)
            {
                voiceAudioSource.PlayOneShot(clip);
            }
        }
        
        public virtual void PlayVoiceClip(int clipIndex)
        {
            if (voiceClips != null && clipIndex >= 0 && clipIndex < voiceClips.Length)
            {
                voiceAudioSource.PlayOneShot(voiceClips[clipIndex]);
            }
        }
        
        protected virtual AudioClip GetVoiceClip(string clipName)
        {
            // Override in derived classes or implement clip lookup system
            return null;
        }
        
        #endregion
        
        #region State Management
        
        protected virtual void ChangeState(CharacterState newState)
        {
            if (currentState != newState)
            {
                OnStateExit(currentState);
                currentState = newState;
                OnStateEnter(newState);
            }
        }
        
        protected virtual void OnStateEnter(CharacterState state)
        {
            // Override in derived classes for state-specific behavior
        }
        
        protected virtual void OnStateExit(CharacterState state)
        {
            // Override in derived classes for state-specific cleanup
        }
        
        #endregion
        
        #region Public Interface
        
        public CharacterState GetCurrentState() => currentState;
        public string GetCharacterId() => characterId;
        public CharacterType GetCharacterType() => characterType;
        public bool IsInteracting() => isInteracting;
        
        #endregion
    }
    
    #region Enums and Data Classes
    
    public enum CharacterType
    {
        Educator,
        Student,
        Mascot,
        NPC
    }
    
    public enum CharacterState
    {
        Idle,
        Moving,
        Teaching,
        Learning,
        Interacting,
        Emoting,
        Disabled
    }
    
    public enum EmotionalState
    {
        Neutral = 0,
        Happy = 1,
        Excited = 2,
        Confused = 3,
        Sad = 4,
        Angry = 5,
        Surprised = 6,
        Thinking = 7,
        Encouraging = 8,
        Proud = 9
    }
    
    [Serializable]
    public class InteractionData
    {
        public string interactionType;
        public string animationName;
        public float duration;
        public Vector3 targetPosition;
        public Dictionary<string, object> parameters;
    }
    
    #endregion
}
