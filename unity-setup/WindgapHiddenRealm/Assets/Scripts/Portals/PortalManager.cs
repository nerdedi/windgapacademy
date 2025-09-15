using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// Manages the portal transition system for moving between different realms
    /// </summary>
    public class PortalManager : MonoBehaviour
    {
        // Singleton instance
        private static PortalManager _instance;
        public static PortalManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<PortalManager>();
                    if (_instance == null)
                    {
                        GameObject obj = new GameObject("PortalManager");
                        _instance = obj.AddComponent<PortalManager>();
                    }
                }
                return _instance;
            }
        }
        
        // Portal registry
        private Dictionary<string, PortalInstance> portalRegistry = new Dictionary<string, PortalInstance>();
        
        // Current realm and active portals
        [SerializeField] private string currentRealm = "Physical";
        [SerializeField] private List<string> availableRealms = new List<string>() { "Physical", "Hidden", "Ember", "Reflection" };
        
        // Transition settings
        [Header("Transition Settings")]
        public float defaultTransitionDuration = 2.0f;
        public Color transitionColor = Color.black;
        public AnimationCurve transitionCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        
        // Accessibility options
        [Header("Accessibility Options")]
        public bool useReducedEffects = false;
        public bool useHighContrast = false;
        public bool useSoundEffects = true;
        public bool useHapticFeedback = false;
        public bool showWarningBeforeTransition = true;
        public float preTransitionDelay = 1.0f;
        
        // Audio settings
        [Header("Audio Settings")]
        public AudioClip portalOpenSound;
        public AudioClip portalTransitionSound;
        public AudioClip portalCloseSound;
        public float soundVolume = 1.0f;
        
        // Events
        public UnityEvent<string, string> OnBeforeRealmTransition;
        public UnityEvent<string, string> OnAfterRealmTransition;
        
        // Components
        private AudioSource audioSource;
        private PortalTransitionEffect transitionEffect;
        
        private void Awake()
        {
            // Ensure singleton behavior
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            
            _instance = this;
            DontDestroyOnLoad(gameObject);
            
            // Initialize components
            InitializeComponents();
            
            // Initialize events
            if (OnBeforeRealmTransition == null)
                OnBeforeRealmTransition = new UnityEvent<string, string>();
                
            if (OnAfterRealmTransition == null)
                OnAfterRealmTransition = new UnityEvent<string, string>();
        }
        
        /// <summary>
        /// Initializes required components
        /// </summary>
        private void InitializeComponents()
        {
            // Create audio source
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null && useSoundEffects)
            {
                audioSource = gameObject.AddComponent<AudioSource>();
                audioSource.spatialBlend = 0f; // 2D sound
                audioSource.playOnAwake = false;
                audioSource.volume = useReducedEffects ? soundVolume * 0.5f : soundVolume;
            }
            
            // Create transition effect
            GameObject effectObj = new GameObject("TransitionEffect");
            effectObj.transform.SetParent(transform);
            transitionEffect = effectObj.AddComponent<PortalTransitionEffect>();
            transitionEffect.Initialize(transitionColor, useReducedEffects, useHighContrast);
        }
        
        /// <summary>
        /// Registers a portal in the system
        /// </summary>
        public void RegisterPortal(PortalInstance portal)
        {
            if (portal == null || string.IsNullOrEmpty(portal.PortalID))
                return;
                
            // Register the portal
            portalRegistry[portal.PortalID] = portal;
            
            Debug.Log($"Portal '{portal.PortalID}' registered in the {portal.SourceRealm} realm");
        }
        
        /// <summary>
        /// Unregisters a portal from the system
        /// </summary>
        public void UnregisterPortal(string portalID)
        {
            if (string.IsNullOrEmpty(portalID) || !portalRegistry.ContainsKey(portalID))
                return;
                
            portalRegistry.Remove(portalID);
        }
        
        /// <summary>
        /// Initiates a transition through a specific portal
        /// </summary>
        public void InitiatePortalTransition(string portalID)
        {
            if (string.IsNullOrEmpty(portalID) || !portalRegistry.ContainsKey(portalID))
            {
                Debug.LogWarning($"Portal '{portalID}' not found");
                return;
            }
            
            PortalInstance portal = portalRegistry[portalID];
            
            // Check if the portal is active in the current realm
            if (portal.SourceRealm != currentRealm)
            {
                Debug.LogWarning($"Portal '{portalID}' is not in the current realm");
                return;
            }
            
            // Start the transition
            StartCoroutine(TransitionToRealm(portal.SourceRealm, portal.DestinationRealm, portal.TransitionDuration));
        }
        
        /// <summary>
        /// Initiates a direct transition between realms
        /// </summary>
        public void InitiateDirectRealmTransition(string destinationRealm)
        {
            if (string.IsNullOrEmpty(destinationRealm) || !availableRealms.Contains(destinationRealm))
            {
                Debug.LogWarning($"Realm '{destinationRealm}' not found");
                return;
            }
            
            // Start the transition
            StartCoroutine(TransitionToRealm(currentRealm, destinationRealm, defaultTransitionDuration));
        }
        
        /// <summary>
        /// Handles the transition between realms
        /// </summary>
        private IEnumerator TransitionToRealm(string sourceRealm, string destinationRealm, float duration)
        {
            // Notify pre-transition
            OnBeforeRealmTransition.Invoke(sourceRealm, destinationRealm);
            
            // Show warning if enabled
            if (showWarningBeforeTransition)
            {
                // TODO: Implement warning UI
                Debug.Log($"Preparing to transition from {sourceRealm} to {destinationRealm}");
                yield return new WaitForSeconds(preTransitionDelay);
            }
            
            // Play portal open sound
            if (useSoundEffects && audioSource != null && portalOpenSound != null)
            {
                audioSource.PlayOneShot(portalOpenSound, useReducedEffects ? soundVolume * 0.5f : soundVolume);
            }
            
            // Start transition effect
            transitionEffect.StartTransition(duration * 0.5f, true);
            
            // Wait for fade out
            yield return new WaitForSeconds(duration * 0.5f);
            
            // Play transition sound
            if (useSoundEffects && audioSource != null && portalTransitionSound != null)
            {
                audioSource.PlayOneShot(portalTransitionSound, useReducedEffects ? soundVolume * 0.5f : soundVolume);
            }
            
            // Apply haptic feedback if enabled
            if (useHapticFeedback)
            {
                // TODO: Implement haptic feedback
            }
            
            // Update current realm
            currentRealm = destinationRealm;
            
            // TODO: Load the new realm scene or activate/deactivate objects
            
            // Wait a short moment
            yield return new WaitForSeconds(0.5f);
            
            // End transition effect
            transitionEffect.StartTransition(duration * 0.5f, false);
            
            // Play portal close sound
            if (useSoundEffects && audioSource != null && portalCloseSound != null)
            {
                audioSource.PlayOneShot(portalCloseSound, useReducedEffects ? soundVolume * 0.5f : soundVolume);
            }
            
            // Wait for fade in
            yield return new WaitForSeconds(duration * 0.5f);
            
            // Notify post-transition
            OnAfterRealmTransition.Invoke(sourceRealm, destinationRealm);
            
            Debug.Log($"Transitioned from {sourceRealm} to {destinationRealm}");
        }
        
        /// <summary>
        /// Gets the current realm
        /// </summary>
        public string GetCurrentRealm()
        {
            return currentRealm;
        }
        
        /// <summary>
        /// Gets all available realms
        /// </summary>
        public List<string> GetAvailableRealms()
        {
            return new List<string>(availableRealms);
        }
        
        /// <summary>
        /// Gets all portal IDs in the specified realm
        /// </summary>
        public List<string> GetPortalsInRealm(string realm)
        {
            List<string> portalIDs = new List<string>();
            
            foreach (var kvp in portalRegistry)
            {
                if (kvp.Value.SourceRealm == realm)
                {
                    portalIDs.Add(kvp.Key);
                }
            }
            
            return portalIDs;
        }
        
        /// <summary>
        /// Sets accessibility options for portal transitions
        /// </summary>
        public void SetAccessibilityOptions(bool reducedEffects, bool highContrast, bool soundEffects, bool hapticFeedback, bool showWarning, float warningDelay)
        {
            useReducedEffects = reducedEffects;
            useHighContrast = highContrast;
            useSoundEffects = soundEffects;
            useHapticFeedback = hapticFeedback;
            showWarningBeforeTransition = showWarning;
            preTransitionDelay = warningDelay;
            
            // Update components
            if (audioSource != null)
            {
                audioSource.volume = useReducedEffects ? soundVolume * 0.5f : soundVolume;
            }
            
            if (transitionEffect != null)
            {
                transitionEffect.UpdateAccessibilitySettings(useReducedEffects, useHighContrast);
            }
        }
    }
}