using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// UI component for portal information display
    /// </summary>
    public class PortalUI : MonoBehaviour
    {
        [Header("UI References")]
        public GameObject portalInfoPanel;
        public TextMeshProUGUI portalNameText;
        public TextMeshProUGUI destinationText;
        public TextMeshProUGUI requirementsText;
        public Image portalIcon;
        public Button activateButton;
        
        [Header("Animation Settings")]
        public float showAnimationDuration = 0.5f;
        public float hideAnimationDuration = 0.3f;
        public AnimationCurve animationCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        
        [Header("Accessibility Options")]
        public bool useAnimations = true;
        public bool useHighContrast = false;
        public bool useLargeText = false;
        public bool useScreenReader = false;
        
        // References
        private PortalInstance currentPortal;
        private CanvasGroup canvasGroup;
        private RectTransform rectTransform;
        
        private void Awake()
        {
            // Get or add canvas group
            canvasGroup = GetComponent<CanvasGroup>();
            if (canvasGroup == null)
            {
                canvasGroup = gameObject.AddComponent<CanvasGroup>();
            }
            
            // Get rect transform
            rectTransform = GetComponent<RectTransform>();
            
            // Hide initially
            canvasGroup.alpha = 0f;
            portalInfoPanel.SetActive(false);
            
            // Setup button
            if (activateButton != null)
            {
                activateButton.onClick.AddListener(OnActivateButtonClicked);
            }
            
            // Apply accessibility settings
            ApplyAccessibilitySettings();
        }
        
        /// <summary>
        /// Shows the portal UI for a specific portal
        /// </summary>
        public void ShowPortalUI(PortalInstance portal)
        {
            if (portal == null)
                return;
                
            currentPortal = portal;
            
            // Update UI elements
            if (portalNameText != null)
            {
                portalNameText.text = portal.PortalID; // In a real implementation, this would use a friendly name
            }
            
            if (destinationText != null)
            {
                destinationText.text = $"To: {portal.DestinationRealm} Realm";
            }
            
            if (requirementsText != null)
            {
                requirementsText.text = "No special requirements"; // In a real implementation, this would show token requirements
            }
            
            // Show the panel
            portalInfoPanel.SetActive(true);
            
            // Animate if enabled
            if (useAnimations)
            {
                StartCoroutine(AnimatePanel(true));
            }
            else
            {
                canvasGroup.alpha = 1f;
            }
            
            // Announce to screen reader if enabled
            if (useScreenReader)
            {
                string announcement = $"Portal to {portal.DestinationRealm} Realm. Press E to activate.";
                // In a real implementation, this would use the appropriate accessibility API
                Debug.Log($"Screen Reader: {announcement}");
            }
        }
        
        /// <summary>
        /// Hides the portal UI
        /// </summary>
        public void HidePortalUI()
        {
            // Animate if enabled
            if (useAnimations)
            {
                StartCoroutine(AnimatePanel(false));
            }
            else
            {
                canvasGroup.alpha = 0f;
                portalInfoPanel.SetActive(false);
            }
            
            currentPortal = null;
        }
        
        /// <summary>
        /// Animates the panel showing/hiding
        /// </summary>
        private IEnumerator AnimatePanel(bool show)
        {
            float duration = show ? showAnimationDuration : hideAnimationDuration;
            float startAlpha = canvasGroup.alpha;
            float targetAlpha = show ? 1f : 0f;
            
            // Starting position offset for slide effect
            Vector2 startAnchoredPosition = rectTransform.anchoredPosition;
            Vector2 targetAnchoredPosition = startAnchoredPosition;
            
            if (show)
            {
                // Start below target position
                rectTransform.anchoredPosition = new Vector2(startAnchoredPosition.x, startAnchoredPosition.y - 50f);
            }
            else
            {
                // End below current position
                targetAnchoredPosition = new Vector2(startAnchoredPosition.x, startAnchoredPosition.y - 50f);
            }
            
            float timer = 0f;
            while (timer < duration)
            {
                timer += Time.deltaTime;
                float t = timer / duration;
                float curvedT = animationCurve.Evaluate(t);
                
                // Animate alpha
                canvasGroup.alpha = Mathf.Lerp(startAlpha, targetAlpha, curvedT);
                
                // Animate position
                rectTransform.anchoredPosition = Vector2.Lerp(
                    show ? new Vector2(startAnchoredPosition.x, startAnchoredPosition.y - 50f) : startAnchoredPosition,
                    show ? startAnchoredPosition : targetAnchoredPosition,
                    curvedT
                );
                
                yield return null;
            }
            
            // Ensure final state
            canvasGroup.alpha = targetAlpha;
            rectTransform.anchoredPosition = show ? startAnchoredPosition : targetAnchoredPosition;
            
            // Hide panel if fully transparent
            if (!show)
            {
                portalInfoPanel.SetActive(false);
            }
        }
        
        /// <summary>
        /// Handles the activate button click
        /// </summary>
        private void OnActivateButtonClicked()
        {
            if (currentPortal != null)
            {
                currentPortal.ActivatePortal();
            }
        }
        
        /// <summary>
        /// Applies accessibility settings to UI elements
        /// </summary>
        private void ApplyAccessibilitySettings()
        {
            // Apply text size
            if (useLargeText)
            {
                if (portalNameText != null)
                    portalNameText.fontSize *= 1.5f;
                    
                if (destinationText != null)
                    destinationText.fontSize *= 1.5f;
                    
                if (requirementsText != null)
                    requirementsText.fontSize *= 1.5f;
            }
            
            // Apply high contrast
            if (useHighContrast)
            {
                if (portalNameText != null)
                    portalNameText.color = Color.white;
                    
                if (destinationText != null)
                    destinationText.color = Color.white;
                    
                if (requirementsText != null)
                    requirementsText.color = Color.white;
                    
                // Apply high contrast to panel background
                Image panelImage = portalInfoPanel.GetComponent<Image>();
                if (panelImage != null)
                {
                    panelImage.color = new Color(0.1f, 0.1f, 0.1f, 0.9f);
                }
            }
        }
        
        /// <summary>
        /// Sets accessibility options for the UI
        /// </summary>
        public void SetAccessibilityOptions(bool animations, bool highContrast, bool largeText, bool screenReader)
        {
            useAnimations = animations;
            useHighContrast = highContrast;
            useLargeText = largeText;
            useScreenReader = screenReader;
            
            ApplyAccessibilitySettings();
        }
    }
}