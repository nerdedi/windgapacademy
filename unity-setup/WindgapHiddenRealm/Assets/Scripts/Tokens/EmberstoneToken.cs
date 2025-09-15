using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Tokens
{
    /// <summary>
    /// Represents a collectable token in the game world
    /// </summary>
    public class EmberstoneToken : MonoBehaviour
    {
        // Token properties
        [Header("Token Properties")]
        public EmberstoneType tokenType;
        public int tokenValue = 1;
        public string tokenSource = "World Collection";
        
        [Header("Visual Properties")]
        public float rotationSpeed = 90.0f;
        public float bobSpeed = 1.0f;
        public float bobHeight = 0.2f;
        public Color tokenColor = Color.white;
        public bool useParticleEffects = true;
        
        // Components
        private Light tokenLight;
        private ParticleSystem tokenParticles;
        private AudioSource tokenAudio;
        private Renderer tokenRenderer;
        
        // Collection properties
        [Header("Collection Properties")]
        public bool autoCollect = false;
        public float autoCollectRadius = 2.0f;
        public float collectionDelay = 0.5f;
        public AudioClip collectionSound;
        
        // Accessibility options
        [Header("Accessibility Options")]
        public bool useLowIntensityEffects = false;
        public bool useHighContrastVisuals = false;
        public bool useVisualPulse = true;
        public bool useAudioCues = true;
        
        // Internal state
        private Vector3 startPosition;
        private Transform playerTransform;
        private bool isCollecting = false;
        
        private void Awake()
        {
            // Cache start position
            startPosition = transform.position;
            
            // Get player transform
            playerTransform = GameObject.FindGameObjectWithTag("Player")?.transform;
            
            // Setup visual components
            SetupVisualComponents();
            
            // Setup audio components
            SetupAudioComponents();
        }
        
        /// <summary>
        /// Sets up the visual components for the token
        /// </summary>
        private void SetupVisualComponents()
        {
            // Get or create mesh renderer
            tokenRenderer = GetComponent<Renderer>();
            if (tokenRenderer == null)
            {
                // In a real implementation, this would be handled differently
                // For this example, we'll just add a placeholder sphere
                GameObject visualObj = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                visualObj.transform.SetParent(transform);
                visualObj.transform.localPosition = Vector3.zero;
                visualObj.transform.localScale = Vector3.one * 0.5f;
                
                tokenRenderer = visualObj.GetComponent<Renderer>();
            }
            
            // Set material color based on token type
            if (tokenRenderer != null)
            {
                Material tokenMaterial = new Material(Shader.Find("Standard"));
                tokenMaterial.EnableKeyword("_EMISSION");
                
                // Set color based on token type
                Color typeColor = GetColorForTokenType(tokenType);
                tokenColor = typeColor;
                
                tokenMaterial.color = tokenColor;
                tokenMaterial.SetColor("_EmissionColor", tokenColor * 0.5f);
                
                tokenRenderer.material = tokenMaterial;
            }
            
            // Create light
            GameObject lightObj = new GameObject("TokenLight");
            lightObj.transform.SetParent(transform);
            lightObj.transform.localPosition = Vector3.zero;
            
            tokenLight = lightObj.AddComponent<Light>();
            tokenLight.color = tokenColor;
            tokenLight.intensity = useLowIntensityEffects ? 0.5f : 1.0f;
            tokenLight.range = 2.0f;
            tokenLight.type = LightType.Point;
            
            // Create particle system
            if (useParticleEffects)
            {
                GameObject particleObj = new GameObject("TokenParticles");
                particleObj.transform.SetParent(transform);
                particleObj.transform.localPosition = Vector3.zero;
                
                tokenParticles = particleObj.AddComponent<ParticleSystem>();
                
                // Configure particle system
                var main = tokenParticles.main;
                main.startLifetime = 1.0f;
                main.startSize = 0.1f;
                main.startColor = tokenColor;
                main.loop = true;
                
                // Shape module
                var shape = tokenParticles.shape;
                shape.shapeType = ParticleSystemShapeType.Sphere;
                shape.radius = 0.3f;
                
                // Emission module
                var emission = tokenParticles.emission;
                emission.rateOverTime = useLowIntensityEffects ? 5 : 10;
                
                // Start particle system
                tokenParticles.Play();
            }
        }
        
        /// <summary>
        /// Sets up the audio components for the token
        /// </summary>
        private void SetupAudioComponents()
        {
            // Create audio source
            tokenAudio = GetComponent<AudioSource>();
            if (tokenAudio == null && useAudioCues)
            {
                tokenAudio = gameObject.AddComponent<AudioSource>();
                tokenAudio.spatialBlend = 1.0f; // 3D sound
                tokenAudio.playOnAwake = false;
                tokenAudio.loop = false;
                tokenAudio.volume = useLowIntensityEffects ? 0.5f : 1.0f;
            }
        }
        
        private void Update()
        {
            // Rotate token
            transform.Rotate(Vector3.up, rotationSpeed * Time.deltaTime);
            
            // Bob up and down
            float bobOffset = Mathf.Sin(Time.time * bobSpeed) * bobHeight;
            transform.position = startPosition + Vector3.up * bobOffset;
            
            // Pulse light if enabled
            if (useVisualPulse && tokenLight != null)
            {
                float pulse = 0.8f + 0.2f * Mathf.Sin(Time.time * 2f);
                tokenLight.intensity = (useLowIntensityEffects ? 0.5f : 1.0f) * pulse;
            }
            
            // Auto-collect if enabled
            if (autoCollect && playerTransform != null && !isCollecting)
            {
                float distance = Vector3.Distance(transform.position, playerTransform.position);
                if (distance <= autoCollectRadius)
                {
                    StartCoroutine(CollectToken());
                }
            }
        }
        
        /// <summary>
        /// Collects the token when triggered
        /// </summary>
        private void OnTriggerEnter(Collider other)
        {
            // Check if the other object is the player
            if (other.CompareTag("Player") && !isCollecting)
            {
                StartCoroutine(CollectToken());
            }
        }
        
        /// <summary>
        /// Collects the token with visual and audio effects
        /// </summary>
        private IEnumerator CollectToken()
        {
            isCollecting = true;
            
            // Play collection sound
            if (tokenAudio != null && collectionSound != null && useAudioCues)
            {
                tokenAudio.PlayOneShot(collectionSound);
            }
            
            // Scale up light intensity briefly
            if (tokenLight != null)
            {
                float originalIntensity = tokenLight.intensity;
                tokenLight.intensity = originalIntensity * 2f;
                
                // Scale down over time
                float timer = 0f;
                while (timer < collectionDelay)
                {
                    float t = timer / collectionDelay;
                    tokenLight.intensity = Mathf.Lerp(originalIntensity * 2f, 0f, t);
                    
                    timer += Time.deltaTime;
                    yield return null;
                }
            }
            
            // Add tokens to player inventory
            EmberstoneManager.Instance.AddTokens(tokenType, tokenValue, tokenSource);
            
            // Destroy the token
            Destroy(gameObject);
        }
        
        /// <summary>
        /// Gets the color for a specific token type
        /// </summary>
        private Color GetColorForTokenType(EmberstoneType type)
        {
            switch (type)
            {
                case EmberstoneType.Knowledge:
                    return new Color(0.0f, 0.5f, 1.0f); // Blue
                    
                case EmberstoneType.Creativity:
                    return new Color(1.0f, 0.5f, 0.0f); // Orange
                    
                case EmberstoneType.Empathy:
                    return new Color(1.0f, 0.0f, 0.5f); // Pink
                    
                case EmberstoneType.Resilience:
                    return new Color(0.5f, 0.0f, 1.0f); // Purple
                    
                case EmberstoneType.Collaboration:
                    return new Color(0.0f, 0.8f, 0.5f); // Teal
                    
                case EmberstoneType.Curiosity:
                    return new Color(1.0f, 0.8f, 0.0f); // Yellow
                    
                case EmberstoneType.Focus:
                    return new Color(0.0f, 1.0f, 0.0f); // Green
                    
                case EmberstoneType.Reflection:
                    return new Color(0.0f, 1.0f, 1.0f); // Cyan
                    
                default:
                    return Color.white;
            }
        }
        
        /// <summary>
        /// Sets accessibility options for the token
        /// </summary>
        public void SetAccessibilityOptions(bool lowIntensity, bool highContrast, bool visualPulse, bool audioCues)
        {
            useLowIntensityEffects = lowIntensity;
            useHighContrastVisuals = highContrast;
            useVisualPulse = visualPulse;
            useAudioCues = audioCues;
            
            // Apply changes to components
            if (tokenLight != null)
            {
                tokenLight.intensity = useLowIntensityEffects ? 0.5f : 1.0f;
            }
            
            if (tokenParticles != null)
            {
                var emission = tokenParticles.emission;
                emission.rateOverTime = useLowIntensityEffects ? 5 : 10;
            }
            
            if (tokenAudio != null)
            {
                tokenAudio.volume = useLowIntensityEffects ? 0.5f : 1.0f;
            }
            
            if (tokenRenderer != null && useHighContrastVisuals)
            {
                // Increase emission intensity for high contrast
                tokenRenderer.material.SetColor("_EmissionColor", tokenColor * 1.5f);
            }
        }
        
        /// <summary>
        /// Draws the auto-collect radius in the editor
        /// </summary>
        private void OnDrawGizmosSelected()
        {
            if (autoCollect)
            {
                Gizmos.color = Color.yellow;
                Gizmos.DrawWireSphere(transform.position, autoCollectRadius);
            }
        }
    }
}