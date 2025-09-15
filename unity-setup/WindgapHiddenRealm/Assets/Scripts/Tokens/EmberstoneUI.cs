using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace WindgapAcademy.Tokens
{
    /// <summary>
    /// UI component for displaying Emberstone tokens
    /// </summary>
    public class EmberstoneUI : MonoBehaviour
    {
        [Header("UI References")]
        public Transform tokenContainer;
        public GameObject tokenDisplayPrefab;
        
        [Header("Animation Settings")]
        public float updateAnimationDuration = 0.5f;
        public AnimationCurve updateAnimationCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
        
        [Header("Accessibility Options")]
        public bool useAnimations = true;
        public bool useHighContrast = false;
        public bool useLargeText = false;
        public bool useScreenReader = false;
        
        // Token display objects
        private Dictionary<EmberstoneType, GameObject> tokenDisplays = new Dictionary<EmberstoneType, GameObject>();
        private Dictionary<EmberstoneType, int> currentDisplayValues = new Dictionary<EmberstoneType, int>();
        
        // Components
        private AudioSource uiAudioSource;
        
        private void Awake()
        {
            // Create audio source
            uiAudioSource = GetComponent<AudioSource>();
            if (uiAudioSource == null)
            {
                uiAudioSource = gameObject.AddComponent<AudioSource>();
                uiAudioSource.playOnAwake = false;
                uiAudioSource.spatialBlend = 0f; // 2D sound
            }
            
            // Initialize token displays
            InitializeTokenDisplays();
            
            // Subscribe to token events
            SubscribeToTokenEvents();
        }
        
        /// <summary>
        /// Initializes the token displays
        /// </summary>
        private void InitializeTokenDisplays()
        {
            // Clear existing displays
            foreach (var display in tokenDisplays.Values)
            {
                Destroy(display);
            }
            
            tokenDisplays.Clear();
            currentDisplayValues.Clear();
            
            // Create displays for each token type
            foreach (EmberstoneType tokenType in System.Enum.GetValues(typeof(EmberstoneType)))
            {
                CreateTokenDisplay(tokenType);
            }
            
            // Update initial values
            UpdateAllTokenDisplays();
        }
        
        /// <summary>
        /// Creates a display for a specific token type
        /// </summary>
        private void CreateTokenDisplay(EmberstoneType tokenType)
        {
            // Create from prefab if available, otherwise create manually
            GameObject displayObj;
            
            if (tokenDisplayPrefab != null && tokenContainer != null)
            {
                displayObj = Instantiate(tokenDisplayPrefab, tokenContainer);
            }
            else
            {
                // Create manual display if no prefab is available
                displayObj = new GameObject($"{tokenType}Display");
                displayObj.transform.SetParent(transform);
                
                // Create UI elements (this is a simplified example)
                GameObject iconObj = new GameObject("Icon");
                iconObj.transform.SetParent(displayObj.transform);
                iconObj.AddComponent<RectTransform>().sizeDelta = new Vector2(50, 50);
                Image iconImage = iconObj.AddComponent<Image>();
                iconImage.color = GetColorForTokenType(tokenType);
                
                GameObject textObj = new GameObject("Count");
                textObj.transform.SetParent(displayObj.transform);
                RectTransform textRect = textObj.AddComponent<RectTransform>();
                textRect.sizeDelta = new Vector2(100, 50);
                textRect.anchoredPosition = new Vector2(60, 0);
                
                // Add TextMeshPro component if available, otherwise use regular Text
                if (typeof(TextMeshProUGUI) != null)
                {
                    textObj.AddComponent<TextMeshProUGUI>().text = "0";
                    textObj.GetComponent<TextMeshProUGUI>().fontSize = useLargeText ? 24 : 18;
                    textObj.GetComponent<TextMeshProUGUI>().color = useHighContrast ? Color.white : Color.black;
                }
                else
                {
                    textObj.AddComponent<Text>().text = "0";
                    textObj.GetComponent<Text>().fontSize = useLargeText ? 24 : 18;
                    textObj.GetComponent<Text>().color = useHighContrast ? Color.white : Color.black;
                }
                
                GameObject labelObj = new GameObject("Label");
                labelObj.transform.SetParent(displayObj.transform);
                RectTransform labelRect = labelObj.AddComponent<RectTransform>();
                labelRect.sizeDelta = new Vector2(150, 30);
                labelRect.anchoredPosition = new Vector2(0, -30);
                
                // Add TextMeshPro component if available, otherwise use regular Text
                if (typeof(TextMeshProUGUI) != null)
                {
                    labelObj.AddComponent<TextMeshProUGUI>().text = tokenType.ToString();
                    labelObj.GetComponent<TextMeshProUGUI>().fontSize = useLargeText ? 18 : 14;
                    labelObj.GetComponent<TextMeshProUGUI>().color = useHighContrast ? Color.white : Color.gray;
                }
                else
                {
                    labelObj.AddComponent<Text>().text = tokenType.ToString();
                    labelObj.GetComponent<Text>().fontSize = useLargeText ? 18 : 14;
                    labelObj.GetComponent<Text>().color = useHighContrast ? Color.white : Color.gray;
                }
            }
            
            // Store display object and initial value
            tokenDisplays[tokenType] = displayObj;
            currentDisplayValues[tokenType] = 0;
        }
        
        /// <summary>
        /// Subscribes to token events
        /// </summary>
        private void SubscribeToTokenEvents()
        {
            if (EmberstoneManager.Instance != null)
            {
                EmberstoneManager.Instance.OnTokenBalanceChanged += HandleTokenBalanceChanged;
                EmberstoneManager.Instance.OnTokensAdded += HandleTokensAdded;
            }
        }
        
        /// <summary>
        /// Unsubscribes from token events
        /// </summary>
        private void OnDestroy()
        {
            if (EmberstoneManager.Instance != null)
            {
                EmberstoneManager.Instance.OnTokenBalanceChanged -= HandleTokenBalanceChanged;
                EmberstoneManager.Instance.OnTokensAdded -= HandleTokensAdded;
            }
        }
        
        /// <summary>
        /// Handles token balance changes
        /// </summary>
        private void HandleTokenBalanceChanged(EmberstoneType tokenType, int newBalance)
        {
            UpdateTokenDisplay(tokenType, newBalance);
        }
        
        /// <summary>
        /// Handles tokens being added
        /// </summary>
        private void HandleTokensAdded(EmberstoneType tokenType, int amount, string source)
        {
            // We could add a special animation or effect here
            // For now, we'll just update the display
        }
        
        /// <summary>
        /// Updates all token displays
        /// </summary>
        public void UpdateAllTokenDisplays()
        {
            if (EmberstoneManager.Instance == null)
                return;
                
            Dictionary<EmberstoneType, int> allBalances = EmberstoneManager.Instance.GetAllTokenBalances();
            
            foreach (var kvp in allBalances)
            {
                UpdateTokenDisplay(kvp.Key, kvp.Value, false);
            }
        }
        
        /// <summary>
        /// Updates a specific token display
        /// </summary>
        private void UpdateTokenDisplay(EmberstoneType tokenType, int newValue, bool animate = true)
        {
            if (!tokenDisplays.ContainsKey(tokenType))
                return;
                
            GameObject displayObj = tokenDisplays[tokenType];
            int oldValue = currentDisplayValues.ContainsKey(tokenType) ? currentDisplayValues[tokenType] : 0;
            
            // Update the current value
            currentDisplayValues[tokenType] = newValue;
            
            // Get the text component
            Component textComponent = displayObj.GetComponentInChildren<TextMeshProUGUI>() ?? 
                                     (Component)displayObj.GetComponentInChildren<Text>();
            
            if (textComponent == null)
                return;
                
            // Animate the value change if enabled
            if (useAnimations && animate && oldValue != newValue)
            {
                StartCoroutine(AnimateValueChange(textComponent, oldValue, newValue));
            }
            else
            {
                // Update the text directly
                if (textComponent is TextMeshProUGUI)
                {
                    ((TextMeshProUGUI)textComponent).text = newValue.ToString();
                }
                else if (textComponent is Text)
                {
                    ((Text)textComponent).text = newValue.ToString();
                }
            }
            
            // Add screen reader announcement if enabled
            if (useScreenReader && oldValue != newValue)
            {
                string announcement = $"{tokenType} tokens: {newValue}";
                // In a real implementation, this would use the appropriate accessibility API
                Debug.Log($"Screen Reader: {announcement}");
            }
        }
        
        /// <summary>
        /// Animates a value change
        /// </summary>
        private IEnumerator AnimateValueChange(Component textComponent, int oldValue, int newValue)
        {
            float timer = 0f;
            
            while (timer < updateAnimationDuration)
            {
                timer += Time.deltaTime;
                float t = updateAnimationCurve.Evaluate(timer / updateAnimationDuration);
                
                int currentValue = Mathf.RoundToInt(Mathf.Lerp(oldValue, newValue, t));
                
                // Update the text
                if (textComponent is TextMeshProUGUI)
                {
                    ((TextMeshProUGUI)textComponent).text = currentValue.ToString();
                }
                else if (textComponent is Text)
                {
                    ((Text)textComponent).text = currentValue.ToString();
                }
                
                yield return null;
            }
            
            // Ensure final value is set
            if (textComponent is TextMeshProUGUI)
            {
                ((TextMeshProUGUI)textComponent).text = newValue.ToString();
            }
            else if (textComponent is Text)
            {
                ((Text)textComponent).text = newValue.ToString();
            }
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
        /// Sets accessibility options for the UI
        /// </summary>
        public void SetAccessibilityOptions(bool animations, bool highContrast, bool largeText, bool screenReader)
        {
            useAnimations = animations;
            useHighContrast = highContrast;
            useLargeText = largeText;
            useScreenReader = screenReader;
            
            // Update UI elements with new accessibility settings
            foreach (var tokenType in tokenDisplays.Keys)
            {
                GameObject displayObj = tokenDisplays[tokenType];
                
                // Update text components
                TextMeshProUGUI[] tmpTexts = displayObj.GetComponentsInChildren<TextMeshProUGUI>();
                foreach (var text in tmpTexts)
                {
                    text.fontSize = useLargeText ? (text.name == "Count" ? 24 : 18) : (text.name == "Count" ? 18 : 14);
                    text.color = useHighContrast ? Color.white : (text.name == "Count" ? Color.black : Color.gray);
                }
                
                Text[] texts = displayObj.GetComponentsInChildren<Text>();
                foreach (var text in texts)
                {
                    text.fontSize = useLargeText ? (text.name == "Count" ? 24 : 18) : (text.name == "Count" ? 18 : 14);
                    text.color = useHighContrast ? Color.white : (text.name == "Count" ? Color.black : Color.gray);
                }
            }
        }
    }
}