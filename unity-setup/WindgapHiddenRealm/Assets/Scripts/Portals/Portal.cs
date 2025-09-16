using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// Represents a portal for transitioning between realms
    /// </summary>
    public class Portal : MonoBehaviour
    {
        [Header("Portal Properties")]
        public string destinationRealm;
        public Vector3 destinationPosition;
        public Color portalColor = Color.magenta;
        public float activationRadius = 2.0f;
        public bool isActive = true;
        public AudioClip portalActivateSound;
        public AudioClip portalTransitionSound;
        
        [Header("Accessibility Options")]
        public bool useVisualPulse = true;
        public bool useAudioCues = true;
        public bool useHighContrast = false;
        public bool useLargeInteractionZone = false;
        
        // Components
        private Light portalLight;
        private ParticleSystem portalParticles;
        private AudioSource portalAudio;
        private Renderer portalRenderer;
        
        // Internal state
        private Transform playerTransform;
        private bool isTransitioning = false;
        
        private void Awake()
        {
            playerTransform = GameObject.FindGameObjectWithTag("Player")?.transform;
            SetupVisualComponents();
            SetupAudioComponents();
        }
        
        private void SetupVisualComponents()
        {
            portalRenderer = GetComponent<Renderer>();
            if (portalRenderer == null)
            {
                GameObject visualObj = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                visualObj.transform.SetParent(transform);
                visualObj.transform.localPosition = Vector3.zero;
                visualObj.transform.localScale = new Vector3(1, 2, 1);
                portalRenderer = visualObj.GetComponent<Renderer>();
            }
            Material portalMaterial = new Material(Shader.Find("Standard"));
            portalMaterial.EnableKeyword("_EMISSION");
            portalMaterial.color = portalColor;
            portalMaterial.SetColor("_EmissionColor", portalColor * (useHighContrast ? 2f : 0.5f));
            portalRenderer.material = portalMaterial;
            GameObject lightObj = new GameObject("PortalLight");
            lightObj.transform.SetParent(transform);
            lightObj.transform.localPosition = Vector3.zero;
            portalLight = lightObj.AddComponent<Light>();
            portalLight.color = portalColor;
            portalLight.intensity = useHighContrast ? 2f : 1f;
            portalLight.range = useLargeInteractionZone ? 5f : 2.5f;
            portalLight.type = LightType.Point;
            GameObject particleObj = new GameObject("PortalParticles");
            particleObj.transform.SetParent(transform);
            particleObj.transform.localPosition = Vector3.zero;
            portalParticles = particleObj.AddComponent<ParticleSystem>();
            var main = portalParticles.main;
            main.startLifetime = 1.5f;
            main.startSize = 0.2f;
            main.startColor = portalColor;
            main.loop = true;
            var emission = portalParticles.emission;
            emission.rateOverTime = useHighContrast ? 20 : 10;
            portalParticles.Play();
        }
        private void SetupAudioComponents()
        {
            portalAudio = GetComponent<AudioSource>();
            if (portalAudio == null && useAudioCues)
            {
                portalAudio = gameObject.AddComponent<AudioSource>();
                portalAudio.spatialBlend = 1.0f;
                portalAudio.playOnAwake = false;
                portalAudio.loop = false;
            }
        }
        private void Update()
        {
            if (!isActive || isTransitioning || playerTransform == null) return;
            float radius = useLargeInteractionZone ? activationRadius * 2f : activationRadius;
            float distance = Vector3.Distance(transform.position, playerTransform.position);
            if (distance <= radius)
            {
                StartCoroutine(TransitionPlayer());
            }
            if (useVisualPulse && portalLight != null)
            {
                float pulse = 0.8f + 0.2f * Mathf.Sin(Time.time * 2f);
                portalLight.intensity = (useHighContrast ? 2f : 1f) * pulse;
            }
        }
        private IEnumerator TransitionPlayer()
        {
            isTransitioning = true;
            if (portalAudio != null && portalActivateSound != null && useAudioCues)
            {
                portalAudio.PlayOneShot(portalActivateSound);
            }
            yield return new WaitForSeconds(0.5f);
            if (portalAudio != null && portalTransitionSound != null && useAudioCues)
            {
                portalAudio.PlayOneShot(portalTransitionSound);
            }
            // Simulate realm transition (in a real game, load new scene or move player)
            if (playerTransform != null)
            {
                playerTransform.position = destinationPosition;
            }
            yield return new WaitForSeconds(0.5f);
            isTransitioning = false;
        }
        private void OnDrawGizmosSelected()
        {
            Gizmos.color = portalColor;
            float radius = useLargeInteractionZone ? activationRadius * 2f : activationRadius;
            Gizmos.DrawWireSphere(transform.position, radius);
        }
        public void SetAccessibilityOptions(bool visualPulse, bool audioCues, bool highContrast, bool largeZone)
        {
            useVisualPulse = visualPulse;
            useAudioCues = audioCues;
            useHighContrast = highContrast;
            useLargeInteractionZone = largeZone;
            if (portalLight != null)
            {
                portalLight.intensity = useHighContrast ? 2f : 1f;
                portalLight.range = useLargeInteractionZone ? 5f : 2.5f;
            }
            if (portalParticles != null)
            {
                var emission = portalParticles.emission;
                emission.rateOverTime = useHighContrast ? 20 : 10;
            }
        }
    }
}