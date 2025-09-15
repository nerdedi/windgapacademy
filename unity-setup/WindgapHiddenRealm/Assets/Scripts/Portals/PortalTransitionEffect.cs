using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace WindgapAcademy.Portals
{
    /// <summary>
    /// Handles the visual transition effect when moving between realms
    /// </summary>
    public class PortalTransitionEffect : MonoBehaviour
    {
        // Transition components
        private Canvas transitionCanvas;
        private Image transitionPanel;
        
        // Transition properties
        private Color transitionColor = Color.black;
        private bool useReducedEffects = false;
        private bool useHighContrast = false;
        
        // State
        private bool isTransitioning = false;
        
        /// <summary>
        /// Initializes the transition effect
        /// </summary>
        public void Initialize(Color color, bool reducedEffects, bool highContrast)
        {
            transitionColor = color;
            useReducedEffects = reducedEffects;
            useHighContrast = highContrast;
            
            // Create canvas
            GameObject canvasObj = new GameObject("TransitionCanvas");
            canvasObj.transform.SetParent(transform);
            
            transitionCanvas = canvasObj.AddComponent<Canvas>();
            transitionCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            transitionCanvas.sortingOrder = 9999; // Ensure it renders on top
            
            // Add canvas scaler
            CanvasScaler scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            
            // Create panel
            GameObject panelObj = new GameObject("TransitionPanel");
            panelObj.transform.SetParent(transitionCanvas.transform);
            
            // Set panel properties
            RectTransform panelRect = panelObj.AddComponent<RectTransform>();
            panelRect.anchorMin = Vector2.zero;
            panelRect.anchorMax = Vector2.one;
            panelRect.offsetMin = Vector2.zero;
            panelRect.offsetMax = Vector2.zero;
            
            // Add image component
            transitionPanel = panelObj.AddComponent<Image>();
            
            // Apply color with high contrast if needed
            Color effectiveColor = useHighContrast ? Color.black : transitionColor;
            transitionPanel.color = new Color(effectiveColor.r, effectiveColor.g, effectiveColor.b, 0f);
            
            // Hide initially
            transitionCanvas.gameObject.SetActive(false);
        }
        
        /// <summary>
        /// Starts the transition effect
        /// </summary>
        /// <param name="duration">Duration of the transition in seconds</param>
        /// <param name="fadeIn">True for fade in, false for fade out</param>
        public void StartTransition(float duration, bool fadeIn)
        {
            // Ensure canvas is created
            if (transitionCanvas == null || transitionPanel == null)
            {
                Initialize(Color.black, false, false);
            }
            
            // Stop any ongoing transition
            StopAllCoroutines();
            
            // Enable canvas
            transitionCanvas.gameObject.SetActive(true);
            
            // Start transition coroutine
            StartCoroutine(TransitionCoroutine(duration, fadeIn));
        }
        
        /// <summary>
        /// Handles the transition animation
        /// </summary>
        private IEnumerator TransitionCoroutine(float duration, bool fadeIn)
        {
            isTransitioning = true;
            
            // Apply color with high contrast if needed
            Color effectiveColor = useHighContrast ? Color.black : transitionColor;
            
            // Initial and target alpha
            float startAlpha = fadeIn ? 0f : 1f;
            float endAlpha = fadeIn ? 1f : 0f;
            
            // Reduced effects version has reduced opacity
            if (useReducedEffects && fadeIn)
            {
                endAlpha = 0.8f;
            }
            
            // Set initial alpha
            transitionPanel.color = new Color(effectiveColor.r, effectiveColor.g, effectiveColor.b, startAlpha);
            
            // Animate alpha
            float timer = 0f;
            while (timer < duration)
            {
                timer += Time.deltaTime;
                float t = timer / duration;
                
                // Smooth the transition
                float alpha = Mathf.Lerp(startAlpha, endAlpha, t);
                transitionPanel.color = new Color(effectiveColor.r, effectiveColor.g, effectiveColor.b, alpha);
                
                yield return null;
            }
            
            // Ensure final state
            transitionPanel.color = new Color(effectiveColor.r, effectiveColor.g, effectiveColor.b, endAlpha);
            
            // Hide canvas if fully transparent
            if (endAlpha <= 0f)
            {
                transitionCanvas.gameObject.SetActive(false);
            }
            
            isTransitioning = false;
        }
        
        /// <summary>
        /// Updates accessibility settings
        /// </summary>
        public void UpdateAccessibilitySettings(bool reducedEffects, bool highContrast)
        {
            useReducedEffects = reducedEffects;
            useHighContrast = highContrast;
            
            // Update color if panel exists
            if (transitionPanel != null)
            {
                Color effectiveColor = useHighContrast ? Color.black : transitionColor;
                float currentAlpha = transitionPanel.color.a;
                transitionPanel.color = new Color(effectiveColor.r, effectiveColor.g, effectiveColor.b, currentAlpha);
            }
        }
        
        /// <summary>
        /// Gets the transition state
        /// </summary>
        public bool IsTransitioning()
        {
            return isTransitioning;
        }
    }
}