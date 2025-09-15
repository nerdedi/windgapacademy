using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;

/// <summary>
/// Manages accessibility features for Windgap Academy educational games
/// </summary>
public class AccessibilityController : MonoBehaviour
{
    [Header("Accessibility Settings")]
    [Tooltip("Enable text-to-speech for UI elements")]
    public bool textToSpeechEnabled = true;
    
    [Tooltip("Enable high contrast mode")]
    public bool highContrastMode = false;
    
    [Tooltip("Enable larger UI elements")]
    public bool largeUIMode = false;
    
    [Tooltip("Enable simplified controls")]
    public bool simplifiedControls = false;
    
    [Tooltip("Enable screen reader compatibility")]
    public bool screenReaderMode = false;
    
    [Tooltip("Enable closed captions")]
    public bool closedCaptionsEnabled = true;
    
    [Tooltip("Game speed multiplier (0.5-1.5)")]
    [Range(0.5f, 1.5f)]
    public float gameSpeedMultiplier = 1f;
    
    [Header("References")]
    [Tooltip("UI elements to resize in large UI mode")]
    public List<RectTransform> uiElementsToResize;
    
    [Tooltip("Text elements for high contrast mode")]
    public List<Text> textElements;
    
    [Tooltip("Image elements for high contrast mode")]
    public List<Image> imageElements;
    
    // Original UI scales
    private Dictionary<RectTransform, Vector2> originalScales = new Dictionary<RectTransform, Vector2>();
    
    // Original colors
    private Dictionary<Text, Color> originalTextColors = new Dictionary<Text, Color>();
    private Dictionary<Image, Color> originalImageColors = new Dictionary<Image, Color>();
    
    // High contrast colors
    private Color highContrastTextColor = Color.white;
    private Color highContrastBackgroundColor = Color.black;
    
    private void Awake()
    {
        // Store original UI scales
        foreach (var element in uiElementsToResize)
        {
            if (element != null)
            {
                originalScales[element] = element.sizeDelta;
            }
        }
        
        // Store original colors
        foreach (var text in textElements)
        {
            if (text != null)
            {
                originalTextColors[text] = text.color;
            }
        }
        
        foreach (var image in imageElements)
        {
            if (image != null)
            {
                originalImageColors[image] = image.color;
            }
        }
        
        // Apply initial settings
        ApplyAccessibilitySettings();
    }
    
    /// <summary>
    /// Applies all accessibility settings based on current configuration
    /// </summary>
    public void ApplyAccessibilitySettings()
    {
        ApplyHighContrastMode();
        ApplyLargeUIMode();
        ApplyGameSpeed();
        
        // Log accessibility configuration
        Debug.Log("Accessibility settings applied: " + 
                 "TTS=" + textToSpeechEnabled + ", " +
                 "HighContrast=" + highContrastMode + ", " +
                 "LargeUI=" + largeUIMode + ", " +
                 "SimplifiedControls=" + simplifiedControls + ", " +
                 "ScreenReader=" + screenReaderMode + ", " +
                 "ClosedCaptions=" + closedCaptionsEnabled + ", " +
                 "GameSpeed=" + gameSpeedMultiplier);
    }
    
    /// <summary>
    /// Applies high contrast mode settings
    /// </summary>
    private void ApplyHighContrastMode()
    {
        if (highContrastMode)
        {
            // Apply high contrast to text
            foreach (var text in textElements)
            {
                if (text != null)
                {
                    text.color = highContrastTextColor;
                }
            }
            
            // Apply high contrast to images
            foreach (var image in imageElements)
            {
                if (image != null && image.CompareTag("Background"))
                {
                    image.color = highContrastBackgroundColor;
                }
                else if (image != null)
                {
                    // Increase contrast for non-background images
                    Color originalColor = originalImageColors[image];
                    image.color = new Color(
                        IncreaseContrast(originalColor.r),
                        IncreaseContrast(originalColor.g),
                        IncreaseContrast(originalColor.b),
                        originalColor.a
                    );
                }
            }
        }
        else
        {
            // Restore original colors
            foreach (var text in textElements)
            {
                if (text != null && originalTextColors.ContainsKey(text))
                {
                    text.color = originalTextColors[text];
                }
            }
            
            foreach (var image in imageElements)
            {
                if (image != null && originalImageColors.ContainsKey(image))
                {
                    image.color = originalImageColors[image];
                }
            }
        }
    }
    
    /// <summary>
    /// Applies large UI mode settings
    /// </summary>
    private void ApplyLargeUIMode()
    {
        float scaleFactor = largeUIMode ? 1.5f : 1f;
        
        foreach (var element in uiElementsToResize)
        {
            if (element != null && originalScales.ContainsKey(element))
            {
                element.sizeDelta = originalScales[element] * scaleFactor;
            }
        }
    }
    
    /// <summary>
    /// Applies game speed settings
    /// </summary>
    private void ApplyGameSpeed()
    {
        Time.timeScale = gameSpeedMultiplier;
    }
    
    /// <summary>
    /// Increases the contrast of a color channel value
    /// </summary>
    private float IncreaseContrast(float colorValue)
    {
        // Push colors more toward extremes for higher contrast
        return colorValue > 0.5f ? Mathf.Min(1f, colorValue * 1.2f) : Mathf.Max(0f, colorValue * 0.8f);
    }
    
    /// <summary>
    /// Reads text using text-to-speech (simulated)
    /// </summary>
    public void SpeakText(string text)
    {
        if (textToSpeechEnabled)
        {
            Debug.Log("TTS: " + text);
            // In a real implementation, this would use a text-to-speech system
            #if UNITY_WEBGL && !UNITY_EDITOR
            // Call JavaScript bridge for TTS
            JSTextToSpeech(text);
            #endif
        }
    }
    
    // External JavaScript function for TTS
    #if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void JSTextToSpeech(string text);
    #endif
}
