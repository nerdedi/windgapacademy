using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Handles accessibility-first animations for characters
    /// Provides alternative animation options for different sensory needs
    /// </summary>
    public class AccessibilityAnimationSystem : MonoBehaviour
    {
        [Header("Animation Settings")]
        public Animator animator;
        public RuntimeAnimatorController standardAnimator;
        public RuntimeAnimatorController reducedMotionAnimator;
        
        [Header("Accessibility Options")]
        public bool useReducedMotion = false;
        public bool useLowIntensityEffects = false;
        public bool useHighContrastCues = false;
        public bool useVisualCues = true;
        public bool useAuditoryCues = true;
        
        [Header("Visual Cue Settings")]
        public Color successColor = Color.green;
        public Color warningColor = Color.yellow;
        public Color errorColor = Color.red;
        public Color interactionColor = Color.cyan;
        
        // Components
        private Light visualCueLight;
        private AudioSource auditoryCueSource;
        private ParticleSystem visualCueParticles;
        
        // Internal state
        private Dictionary<string, AnimationClip> standardClips = new Dictionary<string, AnimationClip>();
        private Dictionary<string, AnimationClip> reducedMotionClips = new Dictionary<string, AnimationClip>();
        
        private void Awake()
        {
            // Get or create required components
            if (animator == null)
            {
                animator = GetComponent<Animator>();
                if (animator == null)
                {
                    animator = gameObject.AddComponent<Animator>();
                }
            }
            
            // Cache animation clips
            CacheAnimationClips();
            
            // Set up visual cue light
            if (useVisualCues)
            {
                SetupVisualCueLight();
                SetupVisualCueParticles();
            }
            
            // Set up auditory cue source
            if (useAuditoryCues)
            {
                SetupAuditoryCueSource();
            }
            
            // Apply initial settings
            ApplyAccessibilitySettings();
        }
        
        /// <summary>
        /// Caches animation clips for quick access
        /// </summary>
        private void CacheAnimationClips()
        {
            // Cache standard animation clips
            if (standardAnimator != null)
            {
                foreach (AnimationClip clip in standardAnimator.animationClips)
                {
                    standardClips[clip.name] = clip;
                }
            }
            
            // Cache reduced motion animation clips
            if (reducedMotionAnimator != null)
            {
                foreach (AnimationClip clip in reducedMotionAnimator.animationClips)
                {
                    reducedMotionClips[clip.name] = clip;
                }
            }
        }
        
        /// <summary>
        /// Sets up the visual cue light
        /// </summary>
        private void SetupVisualCueLight()
        {
            GameObject lightObj = new GameObject("VisualCueLight");
            lightObj.transform.SetParent(transform);
            lightObj.transform.localPosition = new Vector3(0, 1.5f, 0);
            
            visualCueLight = lightObj.AddComponent<Light>();
            visualCueLight.type = LightType.Point;
            visualCueLight.range = 1.0f;
            visualCueLight.intensity = 0;
            visualCueLight.color = Color.white;
        }
        
        /// <summary>
        /// Sets up the visual cue particles
        /// </summary>
        private void SetupVisualCueParticles()
        {
            GameObject particleObj = new GameObject("VisualCueParticles");
            particleObj.transform.SetParent(transform);
            particleObj.transform.localPosition = new Vector3(0, 1.0f, 0);
            
            visualCueParticles = particleObj.AddComponent<ParticleSystem>();
            
            // Configure particle system
            var main = visualCueParticles.main;
            main.startLifetime = 1.0f;
            main.startSize = 0.1f;
            main.startColor = Color.white;
            main.playOnAwake = false;
            main.loop = false;
            
            // Emission module
            var emission = visualCueParticles.emission;
            emission.enabled = false;
            
            // Shape module
            var shape = visualCueParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Sphere;
            shape.radius = 0.5f;
        }
        
        /// <summary>
        /// Sets up the auditory cue source
        /// </summary>
        private void SetupAuditoryCueSource()
        {
            auditoryCueSource = GetComponent<AudioSource>();
            if (auditoryCueSource == null)
            {
                auditoryCueSource = gameObject.AddComponent<AudioSource>();
                auditoryCueSource.spatialBlend = 1.0f; // 3D sound
                auditoryCueSource.playOnAwake = false;
            }
        }
        
        /// <summary>
        /// Applies accessibility settings
        /// </summary>
        public void ApplyAccessibilitySettings()
        {
            // Apply reduced motion if enabled
            if (useReducedMotion && reducedMotionAnimator != null)
            {
                animator.runtimeAnimatorController = reducedMotionAnimator;
            }
            else if (standardAnimator != null)
            {
                animator.runtimeAnimatorController = standardAnimator;
            }
            
            // Configure visual cues
            if (visualCueLight != null)
            {
                visualCueLight.enabled = useVisualCues;
                visualCueLight.intensity = useLowIntensityEffects ? 0.5f : 1.0f;
            }
            
            // Configure particle system
            if (visualCueParticles != null)
            {
                var main = visualCueParticles.main;
                main.startSize = useLowIntensityEffects ? 0.05f : 0.1f;
            }
            
            // Configure auditory cues
            if (auditoryCueSource != null)
            {
                auditoryCueSource.enabled = useAuditoryCues;
                auditoryCueSource.volume = useLowIntensityEffects ? 0.5f : 1.0f;
            }
        }
        
        /// <summary>
        /// Sets accessibility options
        /// </summary>
        public void SetAccessibilityOptions(bool reducedMotion, bool lowIntensity, bool highContrast, bool visualCues, bool auditoryCues)
        {
            useReducedMotion = reducedMotion;
            useLowIntensityEffects = lowIntensity;
            useHighContrastCues = highContrast;
            useVisualCues = visualCues;
            useAuditoryCues = auditoryCues;
            
            ApplyAccessibilitySettings();
        }
        
        /// <summary>
        /// Plays a visual cue with the specified color
        /// </summary>
        public void PlayVisualCue(Color color, float duration = 1.0f)
        {
            if (!useVisualCues)
                return;
                
            // Adjust color for high contrast if needed
            if (useHighContrastCues)
            {
                // Increase saturation and value for high contrast
                Color.RGBToHSV(color, out float h, out float s, out float v);
                color = Color.HSVToRGB(h, 1.0f, 1.0f);
            }
            
            // Play light cue
            if (visualCueLight != null)
            {
                StartCoroutine(PlayLightCue(color, duration));
            }
            
            // Play particle cue
            if (visualCueParticles != null)
            {
                var main = visualCueParticles.main;
                main.startColor = color;
                
                visualCueParticles.Play();
            }
        }
        
        /// <summary>
        /// Plays an auditory cue with the specified clip
        /// </summary>
        public void PlayAuditoryCue(AudioClip clip, float volumeScale = 1.0f)
        {
            if (!useAuditoryCues || auditoryCueSource == null || clip == null)
                return;
                
            auditoryCueSource.PlayOneShot(clip, volumeScale * (useLowIntensityEffects ? 0.5f : 1.0f));
        }
        
        /// <summary>
        /// Plays a light cue with the specified color and duration
        /// </summary>
        private IEnumerator PlayLightCue(Color color, float duration)
        {
            if (visualCueLight == null)
                yield break;
                
            // Store original light settings
            float originalIntensity = visualCueLight.intensity;
            Color originalColor = visualCueLight.color;
            
            // Set new light settings
            visualCueLight.color = color;
            visualCueLight.intensity = useLowIntensityEffects ? 0.5f : 1.0f;
            
            // Wait for duration
            float timer = 0f;
            while (timer < duration)
            {
                // Pulse the light intensity
                float pulse = Mathf.Sin(timer / duration * Mathf.PI);
                visualCueLight.intensity = (useLowIntensityEffects ? 0.5f : 1.0f) * pulse;
                
                timer += Time.deltaTime;
                yield return null;
            }
            
            // Restore original light settings
            visualCueLight.color = originalColor;
            visualCueLight.intensity = originalIntensity;
        }
        
        /// <summary>
        /// Plays a predefined success cue
        /// </summary>
        public void PlaySuccessCue(AudioClip successSound = null)
        {
            PlayVisualCue(successColor, 1.0f);
            
            if (successSound != null)
            {
                PlayAuditoryCue(successSound);
            }
        }
        
        /// <summary>
        /// Plays a predefined warning cue
        /// </summary>
        public void PlayWarningCue(AudioClip warningSound = null)
        {
            PlayVisualCue(warningColor, 1.0f);
            
            if (warningSound != null)
            {
                PlayAuditoryCue(warningSound);
            }
        }
        
        /// <summary>
        /// Plays a predefined error cue
        /// </summary>
        public void PlayErrorCue(AudioClip errorSound = null)
        {
            PlayVisualCue(errorColor, 1.0f);
            
            if (errorSound != null)
            {
                PlayAuditoryCue(errorSound);
            }
        }
        
        /// <summary>
        /// Plays a predefined interaction cue
        /// </summary>
        public void PlayInteractionCue(AudioClip interactionSound = null)
        {
            PlayVisualCue(interactionColor, 0.5f);
            
            if (interactionSound != null)
            {
                PlayAuditoryCue(interactionSound);
            }
        }
    }
}