using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// Represents a portal instance in the game world
    /// </summary>
    public class PortalInstance : MonoBehaviour
    {
        // Portal identity
        [Header("Portal Identity")]
        [SerializeField] private string portalID = System.Guid.NewGuid().ToString();
        [SerializeField] private string portalName = "Portal";
        [SerializeField] private string sourceRealm = "Physical";
        [SerializeField] private string destinationRealm = "Hidden";
        
        // Portal visual properties
        [Header("Visual Properties")]
        [SerializeField] private Color portalColor = new Color(0.5f, 0f, 1f);
        [SerializeField] private float portalSize = 2.0f;
        [SerializeField] private float rotationSpeed = 30.0f;
        [SerializeField] private bool useParticleEffects = true;
        [SerializeField] private float pulseRate = 1.0f;
        [SerializeField] private float pulseAmount = 0.2f;
        
        // Portal interaction properties
        [Header("Interaction Properties")]
        [SerializeField] private bool isActive = true;
        [SerializeField] private bool requiresToken = false;
        [SerializeField] private string requiredTokenType = "";
        [SerializeField] private int requiredTokenAmount = 1;
        [SerializeField] private float interactionRadius = 2.0f;
        [SerializeField] private float transitionDuration = 2.0f;
        [SerializeField] private bool autoActivate = false;
        
        // Portal audio properties
        [Header("Audio Properties")]
        [SerializeField] private AudioClip idleSound;
        [SerializeField] private AudioClip activationSound;
        [SerializeField] private float soundVolume = 0.5f;
        
        // Accessibility options
        [Header("Accessibility Options")]
        [SerializeField] private bool useReducedEffects = false;
        [SerializeField] private bool useHighContrastVisuals = false;
        [SerializeField] private bool useSoundEffects = true;
        [SerializeField] private bool useTextualCues = true;
        
        // Events
        public UnityEvent OnPortalActivated;
        public UnityEvent<bool> OnTokenCheckResult;
        
        // Components
        private MeshRenderer portalRenderer;
        private Light portalLight;
        private ParticleSystem portalParticles;
        private AudioSource portalAudio;
        private Transform portalTransform;
        
        // Portal state
        private bool isPlayerNearby = false;
        private bool isTransitioning = false;
        private float currentPulse = 0f;
        
        // Property getters
        public string PortalID => portalID;
        public string SourceRealm => sourceRealm;
        public string DestinationRealm => destinationRealm;
        public float TransitionDuration => transitionDuration;
        
        private void Awake()
        {
            // Initialize components
            InitializeComponents();
            
            // Initialize events
            if (OnPortalActivated == null)
                OnPortalActivated = new UnityEvent();
                
            if (OnTokenCheckResult == null)
                OnTokenCheckResult = new UnityEvent<bool>();
        }
        
        private void Start()
        {
            // Register with portal manager
            PortalManager.Instance.RegisterPortal(this);
        }
        
        private void OnDestroy()
        {
            // Unregister from portal manager
            if (PortalManager.Instance != null)
            {
                PortalManager.Instance.UnregisterPortal(portalID);
            }
        }
        
        /// <summary>
        /// Initializes required components
        /// </summary>
        private void InitializeComponents()
        {
            // Create portal visuals if needed
            if (portalRenderer == null)
            {
                // Create portal mesh (in a real implementation, this would be a proper model)
                GameObject visualObj = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                visualObj.transform.SetParent(transform);
                visualObj.transform.localPosition = Vector3.zero;
                visualObj.transform.localScale = Vector3.one * portalSize;
                
                // Get renderer
                portalRenderer = visualObj.GetComponent<MeshRenderer>();
                
                // Create portal material
                Material portalMaterial = new Material(Shader.Find("Standard"));
                portalMaterial.EnableKeyword("_EMISSION");
                portalMaterial.color = portalColor;
                portalMaterial.SetColor("_EmissionColor", portalColor * 0.5f);
                
                // Apply material
                portalRenderer.material = portalMaterial;
                
                // Make slightly transparent
                portalRenderer.material.renderQueue = 3000; // Transparent queue
                Color color = portalRenderer.material.color;
                portalRenderer.material.color = new Color(color.r, color.g, color.b, 0.8f);
                
                // Store transform
                portalTransform = visualObj.transform;
            }
            
            // Create portal light
            if (portalLight == null)
            {
                GameObject lightObj = new GameObject("PortalLight");
                lightObj.transform.SetParent(transform);
                lightObj.transform.localPosition = Vector3.zero;
                
                portalLight = lightObj.AddComponent<Light>();
                portalLight.color = portalColor;
                portalLight.intensity = useReducedEffects ? 0.5f : 1.0f;
                portalLight.range = portalSize * 2.0f;
                portalLight.type = LightType.Point;
            }
            
            // Create portal particles
            if (portalParticles == null && useParticleEffects)
            {
                GameObject particleObj = new GameObject("PortalParticles");
                particleObj.transform.SetParent(transform);
                particleObj.transform.localPosition = Vector3.zero;
                
                portalParticles = particleObj.AddComponent<ParticleSystem>();
                
                // Configure particle system
                var main = portalParticles.main;
                main.startLifetime = 2.0f;
                main.startSize = 0.2f;
                main.startColor = portalColor;
                main.loop = true;
                
                // Shape module
                var shape = portalParticles.shape;
                shape.shapeType = ParticleSystemShapeType.Sphere;
                shape.radius = portalSize * 0.5f;
                
                // Emission module
                var emission = portalParticles.emission;
                emission.rateOverTime = useReducedEffects ? 10 : 20;
                
                // Start particle system if portal is active
                if (isActive)
                {
                    portalParticles.Play();
                }
                else
                {
                    portalParticles.Stop();
                }
            }
            
            // Create audio source
            if (portalAudio == null && useSoundEffects)
            {
                portalAudio = GetComponent<AudioSource>();
                if (portalAudio == null)
                {
                    portalAudio = gameObject.AddComponent<AudioSource>();
                    portalAudio.spatialBlend = 1.0f; // 3D sound
                    portalAudio.playOnAwake = false;
                    portalAudio.loop = true;
                    portalAudio.volume = useReducedEffects ? soundVolume * 0.5f : soundVolume;
                    
                    // Play idle sound if active
                    if (isActive && idleSound != null)
                    {
                        portalAudio.clip = idleSound;
                        portalAudio.Play();
                    }
                }
            }
        }
        
        private void Update()
        {
            // Skip if transitioning
            if (isTransitioning)
                return;
                
            // Rotate the portal
            if (portalTransform != null)
            {
                portalTransform.Rotate(Vector3.up, rotationSpeed * Time.deltaTime);
            }
            
            // Pulse the portal
            if (portalLight != null)
            {
                currentPulse = (currentPulse + Time.deltaTime * pulseRate) % 1.0f;
                float pulseValue = 1.0f + Mathf.Sin(currentPulse * Mathf.PI * 2) * pulseAmount;
                
                portalLight.intensity = (useReducedEffects ? 0.5f : 1.0f) * pulseValue;
                
                // Also pulse size if active
                if (portalTransform != null && isActive)
                {
                    float pulseSizeValue = 1.0f + Mathf.Sin(currentPulse * Mathf.PI * 2) * (pulseAmount * 0.5f);
                    portalTransform.localScale = Vector3.one * portalSize * pulseSizeValue;
                }
            }
            
            // Check for auto activation
            if (autoActivate && isPlayerNearby && isActive && !isTransitioning)
            {
                ActivatePortal();
            }
        }
        
        /// <summary>
        /// Handles player entering the portal trigger area
        /// </summary>
        private void OnTriggerEnter(Collider other)
        {
            // Check if the other object is the player
            if (other.CompareTag("Player"))
            {
                isPlayerNearby = true;
                
                // Display portal info if using textual cues
                if (useTextualCues)
                {
                    DisplayPortalInfo();
                }
            }
        }
        
        /// <summary>
        /// Handles player exiting the portal trigger area
        /// </summary>
        private void OnTriggerExit(Collider other)
        {
            // Check if the other object is the player
            if (other.CompareTag("Player"))
            {
                isPlayerNearby = false;
                
                // Hide portal info
                HidePortalInfo();
            }
        }
        
        /// <summary>
        /// Displays portal information to the player
        /// </summary>
        private void DisplayPortalInfo()
        {
            // In a real implementation, this would show UI elements
            string portalInfo = $"Portal to {destinationRealm} Realm";
            
            if (requiresToken)
            {
                portalInfo += $"\nRequires {requiredTokenAmount} {requiredTokenType} Tokens";
            }
            
            // Show info in console for now
            Debug.Log(portalInfo);
        }
        
        /// <summary>
        /// Hides portal information
        /// </summary>
        private void HidePortalInfo()
        {
            // In a real implementation, this would hide UI elements
            Debug.Log("Portal info hidden");
        }
        
        /// <summary>
        /// Activates the portal to initiate realm transition
        /// </summary>
        public void ActivatePortal()
        {
            if (!isActive || isTransitioning)
                return;
                
            // Check if token is required
            if (requiresToken)
            {
                bool hasToken = CheckForRequiredTokens();
                if (!hasToken)
                {
                    // Notify token check result
                    OnTokenCheckResult.Invoke(false);
                    return;
                }
                
                // Notify token check result
                OnTokenCheckResult.Invoke(true);
            }
            
            // Play activation sound
            if (useSoundEffects && portalAudio != null && activationSound != null)
            {
                portalAudio.Stop();
                portalAudio.loop = false;
                portalAudio.PlayOneShot(activationSound, useReducedEffects ? soundVolume * 0.5f : soundVolume);
            }
            
            // Notify portal activated
            OnPortalActivated.Invoke();
            
            // Mark as transitioning
            isTransitioning = true;
            
            // Initiate transition through portal manager
            PortalManager.Instance.InitiatePortalTransition(portalID);
            
            // Reset transitioning state after delay
            StartCoroutine(ResetTransitionState(transitionDuration + 1.0f));
        }
        
        /// <summary>
        /// Checks if the player has required tokens
        /// </summary>
        private bool CheckForRequiredTokens()
        {
            // In a real implementation, this would check the player's token inventory
            // For now, we'll return true to allow transition
            return true;
        }
        
        /// <summary>
        /// Resets the transition state after delay
        /// </summary>
        private IEnumerator ResetTransitionState(float delay)
        {
            yield return new WaitForSeconds(delay);
            
            isTransitioning = false;
            
            // Restore idle sound
            if (useSoundEffects && portalAudio != null && idleSound != null && isActive)
            {
                portalAudio.clip = idleSound;
                portalAudio.loop = true;
                portalAudio.Play();
            }
        }
        
        /// <summary>
        /// Sets the portal active state
        /// </summary>
        public void SetActive(bool active)
        {
            isActive = active;
            
            // Update visuals
            if (portalRenderer != null)
            {
                Color color = portalRenderer.material.color;
                portalRenderer.material.color = new Color(color.r, color.g, color.b, active ? 0.8f : 0.3f);
                
                // Update emission
                portalRenderer.material.SetColor("_EmissionColor", portalColor * (active ? 0.5f : 0.1f));
            }
            
            // Update particles
            if (portalParticles != null)
            {
                if (active)
                {
                    portalParticles.Play();
                }
                else
                {
                    portalParticles.Stop();
                }
            }
            
            // Update audio
            if (portalAudio != null && idleSound != null)
            {
                if (active)
                {
                    portalAudio.clip = idleSound;
                    portalAudio.loop = true;
                    portalAudio.Play();
                }
                else
                {
                    portalAudio.Stop();
                }
            }
        }
        
        /// <summary>
        /// Sets accessibility options for the portal
        /// </summary>
        public void SetAccessibilityOptions(bool reducedEffects, bool highContrastVisuals, bool soundEffects, bool textualCues)
        {
            useReducedEffects = reducedEffects;
            useHighContrastVisuals = highContrastVisuals;
            useSoundEffects = soundEffects;
            useTextualCues = textualCues;
            
            // Update components
            if (portalLight != null)
            {
                portalLight.intensity = useReducedEffects ? 0.5f : 1.0f;
            }
            
            if (portalParticles != null)
            {
                var emission = portalParticles.emission;
                emission.rateOverTime = useReducedEffects ? 10 : 20;
            }
            
            if (portalAudio != null)
            {
                portalAudio.volume = useReducedEffects ? soundVolume * 0.5f : soundVolume;
            }
            
            if (portalRenderer != null && useHighContrastVisuals)
            {
                // Increase emission intensity for high contrast
                portalRenderer.material.SetColor("_EmissionColor", portalColor * (isActive ? 1.0f : 0.2f));
            }
        }
        
        /// <summary>
        /// Draws the interaction radius in the editor
        /// </summary>
        private void OnDrawGizmosSelected()
        {
            Gizmos.color = portalColor;
            Gizmos.DrawWireSphere(transform.position, interactionRadius);
        }
    }
}