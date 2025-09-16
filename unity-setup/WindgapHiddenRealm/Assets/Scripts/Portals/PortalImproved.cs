using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// Represents a portal for transitioning between realms with comprehensive accessibility options
    /// </summary>
    [AddComponentMenu("Windgap Academy/Portals/Portal")]
    public class PortalImproved : MonoBehaviour
    {
        [Serializable]
        public class PortalConfiguration
        {
            [Tooltip("The name of the destination realm")]
            public string destinationRealm;
            
            [Tooltip("The position where the player will be teleported")]
            public Vector3 destinationPosition;
            
            [Tooltip("The main color of the portal effects")]
            public Color portalColor = Color.magenta;
            
            [Tooltip("The distance at which the portal activates")]
            [Range(0.5f, 10f)]
            public float activationRadius = 2.0f;
            
            [Tooltip("Whether the portal can be used")]
            public bool isActive = true;
            
            [Tooltip("Whether the portal can only be used once")]
            public bool oneTimeUse = false;
        }
        
        [Serializable]
        public class AccessibilityOptions
        {
            [Tooltip("Whether to use pulsing visual effects")]
            public bool useVisualPulse = true;
            
            [Tooltip("Whether to play audio feedback")]
            public bool useAudioCues = true;
            
            [Tooltip("Whether to use high contrast visuals")]
            public bool useHighContrast = false;
            
            [Tooltip("Whether to increase the interaction zone size")]
            public bool useLargeInteractionZone = false;
            
            [Tooltip("Speed of visual pulse effect")]
            [Range(0.5f, 5f)]
            public float visualPulseSpeed = 2f;
            
            [Tooltip("Volume multiplier for audio cues")]
            [Range(0f, 2f)]
            public float audioCueVolume = 1f;
        }
        
        [Serializable]
        public class AudioConfiguration
        {
            [Tooltip("Sound played when player enters portal radius")]
            public AudioClip portalActivateSound;
            
            [Tooltip("Sound played during teleportation")]
            public AudioClip portalTransitionSound;
            
            [Tooltip("Sound played when hovering near portal")]
            public AudioClip portalAmbientSound;
            
            [Tooltip("Whether to loop the ambient sound")]
            public bool loopAmbientSound = true;
        }
        
        [Header("Portal Configuration")]
        [SerializeField] private PortalConfiguration configuration;
        
        [Header("Accessibility")]
        [SerializeField] private AccessibilityOptions accessibilityOptions;
        
        [Header("Audio")]
        [SerializeField] private AudioConfiguration audioConfiguration;
        
        // Events
        public event Action<string, Vector3> OnPortalActivated;
        public event Action<string> OnPortalEnter;
        public event Action<string> OnPortalExit;
        
        // Components - kept private and accessed through properties
        private Light _portalLight;
        private ParticleSystem _portalParticles;
        private AudioSource _portalAudio;
        private Renderer _portalRenderer;
        
        // Cached references
        private Transform _playerTransform;
        private bool _isTransitioning = false;
        private bool _playerInRange = false;
        private Coroutine _pulseCoroutine;
        
        // Properties with controlled access
        public bool IsActive 
        { 
            get => configuration.isActive;
            set => configuration.isActive = value;
        }
        
        public Color PortalColor
        {
            get => configuration.portalColor;
            set
            {
                configuration.portalColor = value;
                UpdateVisualComponents();
            }
        }
        
        /// <summary>
        /// Initializes components and caches references
        /// </summary>
        private void Awake()
        {
            // Validate configuration
            if (configuration == null)
            {
                configuration = new PortalConfiguration();
                Debug.LogWarning($"Portal on {gameObject.name} had no configuration. Using defaults.");
            }
            
            if (accessibilityOptions == null)
            {
                accessibilityOptions = new AccessibilityOptions();
                Debug.LogWarning($"Portal on {gameObject.name} had no accessibility options. Using defaults.");
            }
            
            // Get player reference (ideally this would use a service locator or player registry)
            _playerTransform = GameObject.FindGameObjectWithTag("Player")?.transform;
            
            // Initialize components
            SetupVisualComponents();
            SetupAudioComponents();
        }
        
        /// <summary>
        /// Sets up visual components for the portal
        /// </summary>
        private void SetupVisualComponents()
        {
            // Setup renderer
            _portalRenderer = GetComponent<Renderer>();
            if (_portalRenderer == null)
            {
                GameObject visualObj = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                visualObj.transform.SetParent(transform);
                visualObj.transform.localPosition = Vector3.zero;
                visualObj.transform.localScale = new Vector3(1, 2, 1);
                _portalRenderer = visualObj.GetComponent<Renderer>();
                
                // Remove collider - we'll use trigger volumes instead
                Collider collider = visualObj.GetComponent<Collider>();
                if (collider != null)
                {
                    Destroy(collider);
                }
            }
            
            // Setup material
            // Better practice would be to use a shared material or MaterialPropertyBlock
            Material portalMaterial = new Material(Shader.Find("Standard"));
            portalMaterial.EnableKeyword("_EMISSION");
            portalMaterial.color = configuration.portalColor;
            portalMaterial.SetColor("_EmissionColor", configuration.portalColor * 
                (accessibilityOptions.useHighContrast ? 2f : 0.5f));
            _portalRenderer.material = portalMaterial;
            
            // Setup light
            GameObject lightObj = new GameObject("PortalLight");
            lightObj.transform.SetParent(transform);
            lightObj.transform.localPosition = Vector3.zero;
            _portalLight = lightObj.AddComponent<Light>();
            _portalLight.color = configuration.portalColor;
            _portalLight.intensity = accessibilityOptions.useHighContrast ? 2f : 1f;
            _portalLight.range = accessibilityOptions.useLargeInteractionZone ? 
                configuration.activationRadius * 2.5f : configuration.activationRadius * 1.25f;
            _portalLight.type = LightType.Point;
            
            // Setup particles
            GameObject particleObj = new GameObject("PortalParticles");
            particleObj.transform.SetParent(transform);
            particleObj.transform.localPosition = Vector3.zero;
            _portalParticles = particleObj.AddComponent<ParticleSystem>();
            var main = _portalParticles.main;
            main.startLifetime = 1.5f;
            main.startSize = 0.2f;
            main.startColor = configuration.portalColor;
            main.loop = true;
            var emission = _portalParticles.emission;
            emission.rateOverTime = accessibilityOptions.useHighContrast ? 20 : 10;
            _portalParticles.Play();
            
            // Setup trigger volume
            SphereCollider triggerVolume = gameObject.AddComponent<SphereCollider>();
            triggerVolume.isTrigger = true;
            triggerVolume.radius = configuration.activationRadius * 
                (accessibilityOptions.useLargeInteractionZone ? 2f : 1f);
            
            // Start visual pulse if enabled
            if (accessibilityOptions.useVisualPulse)
            {
                StartVisualPulse();
            }
        }
        
        /// <summary>
        /// Sets up audio components for the portal
        /// </summary>
        private void SetupAudioComponents()
        {
            if (!accessibilityOptions.useAudioCues)
            {
                return;
            }
            
            _portalAudio = GetComponent<AudioSource>();
            if (_portalAudio == null)
            {
                _portalAudio = gameObject.AddComponent<AudioSource>();
                _portalAudio.spatialBlend = 1.0f; // Full 3D sound
                _portalAudio.playOnAwake = false;
                _portalAudio.loop = false;
                _portalAudio.volume = accessibilityOptions.audioCueVolume;
                _portalAudio.rolloffMode = AudioRolloffMode.Linear;
                _portalAudio.minDistance = configuration.activationRadius * 0.5f;
                _portalAudio.maxDistance = configuration.activationRadius * 
                    (accessibilityOptions.useLargeInteractionZone ? 3f : 2f);
            }
            
            // Play ambient sound if available
            if (audioConfiguration != null && 
                audioConfiguration.portalAmbientSound != null && 
                audioConfiguration.loopAmbientSound)
            {
                _portalAudio.clip = audioConfiguration.portalAmbientSound;
                _portalAudio.loop = true;
                _portalAudio.Play();
            }
        }
        
        /// <summary>
        /// Handles player detection and portal visual effects
        /// </summary>
        private void Update()
        {
            if (!configuration.isActive || _isTransitioning || _playerTransform == null) 
            {
                return;
            }
            
            float radius = accessibilityOptions.useLargeInteractionZone ? 
                configuration.activationRadius * 2f : configuration.activationRadius;
                
            float distance = Vector3.Distance(transform.position, _playerTransform.position);
            
            // Only check for activation if not already triggered by collider
            if (distance <= radius && !_playerInRange)
            {
                _playerInRange = true;
                OnPortalEnter?.Invoke(configuration.destinationRealm);
            }
            else if (distance > radius && _playerInRange)
            {
                _playerInRange = false;
                OnPortalExit?.Invoke(configuration.destinationRealm);
            }
        }
        
        /// <summary>
        /// Triggered when a collider enters the portal's trigger zone
        /// </summary>
        private void OnTriggerEnter(Collider other)
        {
            if (!configuration.isActive || _isTransitioning) 
            {
                return;
            }
            
            if (other.CompareTag("Player"))
            {
                StartCoroutine(TransitionPlayer());
            }
        }
        
        /// <summary>
        /// Starts the visual pulse effect coroutine
        /// </summary>
        private void StartVisualPulse()
        {
            if (_pulseCoroutine != null)
            {
                StopCoroutine(_pulseCoroutine);
            }
            
            _pulseCoroutine = StartCoroutine(PulseEffect());
        }
        
        /// <summary>
        /// Coroutine that creates a pulsing light effect
        /// </summary>
        private IEnumerator PulseEffect()
        {
            if (_portalLight == null)
            {
                yield break;
            }
            
            float baseIntensity = accessibilityOptions.useHighContrast ? 2f : 1f;
            
            while (accessibilityOptions.useVisualPulse)
            {
                float pulse = 0.8f + 0.2f * Mathf.Sin(Time.time * accessibilityOptions.visualPulseSpeed);
                _portalLight.intensity = baseIntensity * pulse;
                yield return null;
            }
            
            // Reset to base intensity if pulse is disabled
            _portalLight.intensity = baseIntensity;
        }
        
        /// <summary>
        /// Transitions the player to the destination
        /// </summary>
        private IEnumerator TransitionPlayer()
        {
            _isTransitioning = true;
            
            // Play activation sound
            if (_portalAudio != null && 
                audioConfiguration != null && 
                audioConfiguration.portalActivateSound != null && 
                accessibilityOptions.useAudioCues)
            {
                _portalAudio.PlayOneShot(
                    audioConfiguration.portalActivateSound, 
                    accessibilityOptions.audioCueVolume
                );
            }
            
            // Notify listeners
            OnPortalActivated?.Invoke(configuration.destinationRealm, configuration.destinationPosition);
            
            yield return new WaitForSeconds(0.5f);
            
            // Play transition sound
            if (_portalAudio != null && 
                audioConfiguration != null && 
                audioConfiguration.portalTransitionSound != null && 
                accessibilityOptions.useAudioCues)
            {
                _portalAudio.PlayOneShot(
                    audioConfiguration.portalTransitionSound, 
                    accessibilityOptions.audioCueVolume
                );
            }
            
            // Move player
            if (_playerTransform != null)
            {
                _playerTransform.position = configuration.destinationPosition;
            }
            
            // Handle one-time use
            if (configuration.oneTimeUse)
            {
                configuration.isActive = false;
                
                // Optional: visual feedback for deactivation
                if (_portalLight != null)
                {
                    _portalLight.intensity = 0.2f;
                }
                
                if (_portalParticles != null)
                {
                    var emission = _portalParticles.emission;
                    emission.rateOverTime = 2;
                }
            }
            
            yield return new WaitForSeconds(0.5f);
            _isTransitioning = false;
        }
        
        /// <summary>
        /// Draws debug visualization in the editor
        /// </summary>
        private void OnDrawGizmosSelected()
        {
            if (configuration == null)
            {
                return;
            }
            
            Gizmos.color = configuration.portalColor;
            float radius = accessibilityOptions != null && accessibilityOptions.useLargeInteractionZone ? 
                configuration.activationRadius * 2f : configuration.activationRadius;
            Gizmos.DrawWireSphere(transform.position, radius);
            
            // Draw line to destination
            Gizmos.DrawLine(transform.position, configuration.destinationPosition);
            Gizmos.DrawSphere(configuration.destinationPosition, 0.5f);
        }
        
        /// <summary>
        /// Updates the portal's accessibility options
        /// </summary>
        public void SetAccessibilityOptions(
            bool visualPulse, 
            bool audioCues, 
            bool highContrast, 
            bool largeZone)
        {
            // Store previous settings to check for changes
            bool previousPulse = accessibilityOptions.useVisualPulse;
            bool previousHighContrast = accessibilityOptions.useHighContrast;
            bool previousLargeZone = accessibilityOptions.useLargeInteractionZone;
            
            // Update settings
            accessibilityOptions.useVisualPulse = visualPulse;
            accessibilityOptions.useAudioCues = audioCues;
            accessibilityOptions.useHighContrast = highContrast;
            accessibilityOptions.useLargeInteractionZone = largeZone;
            
            // Update light
            if (_portalLight != null)
            {
                _portalLight.intensity = accessibilityOptions.useHighContrast ? 2f : 1f;
                _portalLight.range = accessibilityOptions.useLargeInteractionZone ? 
                    configuration.activationRadius * 2.5f : configuration.activationRadius * 1.25f;
            }
            
            // Update particles
            if (_portalParticles != null)
            {
                var emission = _portalParticles.emission;
                emission.rateOverTime = accessibilityOptions.useHighContrast ? 20 : 10;
            }
            
            // Update audio
            if (_portalAudio != null)
            {
                _portalAudio.volume = accessibilityOptions.audioCueVolume;
                
                // Stop audio if audio cues are disabled
                if (!accessibilityOptions.useAudioCues && _portalAudio.isPlaying)
                {
                    _portalAudio.Stop();
                }
                // Start ambient audio if it was just enabled
                else if (accessibilityOptions.useAudioCues && 
                        !_portalAudio.isPlaying && 
                        audioConfiguration != null && 
                        audioConfiguration.portalAmbientSound != null && 
                        audioConfiguration.loopAmbientSound)
                {
                    _portalAudio.clip = audioConfiguration.portalAmbientSound;
                    _portalAudio.loop = true;
                    _portalAudio.Play();
                }
            }
            
            // Update collider for interaction zone
            SphereCollider triggerCollider = GetComponent<SphereCollider>();
            if (triggerCollider != null)
            {
                triggerCollider.radius = configuration.activationRadius * 
                    (accessibilityOptions.useLargeInteractionZone ? 2f : 1f);
            }
            
            // Update visual pulse
            if (previousPulse != accessibilityOptions.useVisualPulse)
            {
                if (accessibilityOptions.useVisualPulse)
                {
                    StartVisualPulse();
                }
                else if (_pulseCoroutine != null)
                {
                    StopCoroutine(_pulseCoroutine);
                    _pulseCoroutine = null;
                    
                    // Reset light intensity
                    if (_portalLight != null)
                    {
                        _portalLight.intensity = accessibilityOptions.useHighContrast ? 2f : 1f;
                    }
                }
            }
            
            // Update material emission if high contrast changed
            if (previousHighContrast != accessibilityOptions.useHighContrast && _portalRenderer != null)
            {
                Material mat = _portalRenderer.material;
                if (mat != null)
                {
                    mat.SetColor("_EmissionColor", configuration.portalColor * 
                        (accessibilityOptions.useHighContrast ? 2f : 0.5f));
                }
            }
        }
        
        /// <summary>
        /// Updates all visual components to match current settings
        /// </summary>
        private void UpdateVisualComponents()
        {
            if (_portalRenderer != null && _portalRenderer.material != null)
            {
                _portalRenderer.material.color = configuration.portalColor;
                _portalRenderer.material.SetColor("_EmissionColor", configuration.portalColor * 
                    (accessibilityOptions.useHighContrast ? 2f : 0.5f));
            }
            
            if (_portalLight != null)
            {
                _portalLight.color = configuration.portalColor;
            }
            
            if (_portalParticles != null)
            {
                var main = _portalParticles.main;
                main.startColor = configuration.portalColor;
            }
        }
        
        /// <summary>
        /// Set advanced accessibility options with more granular control
        /// </summary>
        public void SetAdvancedAccessibilityOptions(
            bool visualPulse,
            float pulseSpeed,
            bool audioCues,
            float volume,
            bool highContrast,
            bool largeZone)
        {
            accessibilityOptions.useVisualPulse = visualPulse;
            accessibilityOptions.visualPulseSpeed = pulseSpeed;
            accessibilityOptions.useAudioCues = audioCues;
            accessibilityOptions.audioCueVolume = volume;
            accessibilityOptions.useHighContrast = highContrast;
            accessibilityOptions.useLargeInteractionZone = largeZone;
            
            // Apply all settings
            SetAccessibilityOptions(
                visualPulse,
                audioCues,
                highContrast,
                largeZone
            );
        }
    }
}