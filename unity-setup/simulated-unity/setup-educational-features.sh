#!/bin/bash
# Script to set up educational features for Unity in Windgap Academy

echo "Setting up educational features for Unity in Windgap Academy..."

# Create directory for educational features
FEATURES_DIR="/workspaces/windgapacademy/unity-setup/simulated-unity/WindgapAcademyUnity/Assets/Scripts/Features"
mkdir -p "$FEATURES_DIR"

# Create accessibility controller
cat > "$FEATURES_DIR/AccessibilityController.cs" << EOL
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
EOL

# Create educational game controller
cat > "$FEATURES_DIR/EducationalGameController.cs" << EOL
using UnityEngine;
using System.Collections.Generic;
using UnityEngine.Events;

/// <summary>
/// Main controller for educational gameplay in Windgap Academy
/// </summary>
public class EducationalGameController : MonoBehaviour
{
    [System.Serializable]
    public class LearningObjective
    {
        public string objectiveId;
        public string description;
        public bool isCompleted;
        public UnityEvent onComplete;
    }
    
    [System.Serializable]
    public class EducationalLevel
    {
        public string levelId;
        public string levelName;
        public string description;
        public List<LearningObjective> objectives;
        public float difficultyRating; // 1-5 scale
        public string[] requiredSkills;
        public string[] teachingConcepts;
        public int recommendedAgeMin;
        public int recommendedAgeMax;
        public bool isUnlocked;
        public bool isCompleted;
    }
    
    [Header("Educational Content")]
    [Tooltip("List of educational levels")]
    public List<EducationalLevel> levels = new List<EducationalLevel>();
    
    [Tooltip("Current active level")]
    public string currentLevelId;
    
    [Header("Learning Analytics")]
    [Tooltip("Track time spent on each objective")]
    public bool trackLearningTime = true;
    
    [Tooltip("Track attempts for each objective")]
    public bool trackAttempts = true;
    
    [Tooltip("Enable adaptive difficulty")]
    public bool adaptiveDifficulty = true;
    
    // Analytics data
    private Dictionary<string, float> objectiveTimeSpent = new Dictionary<string, float>();
    private Dictionary<string, int> objectiveAttempts = new Dictionary<string, int>();
    private Dictionary<string, bool> objectiveSuccess = new Dictionary<string, bool>();
    
    // Timers
    private string currentObjectiveId;
    private float objectiveTimer;
    
    private void Start()
    {
        // Initialize analytics
        foreach (var level in levels)
        {
            foreach (var objective in level.objectives)
            {
                objectiveTimeSpent[objective.objectiveId] = 0;
                objectiveAttempts[objective.objectiveId] = 0;
                objectiveSuccess[objective.objectiveId] = false;
            }
        }
        
        // Start with first level if not specified
        if (string.IsNullOrEmpty(currentLevelId) && levels.Count > 0)
        {
            currentLevelId = levels[0].levelId;
        }
        
        // Log initialization
        Debug.Log("Educational Game Controller initialized with " + levels.Count + " levels.");
    }
    
    private void Update()
    {
        // Track time for current objective
        if (trackLearningTime && !string.IsNullOrEmpty(currentObjectiveId))
        {
            objectiveTimer += Time.deltaTime;
            objectiveTimeSpent[currentObjectiveId] = objectiveTimer;
        }
    }
    
    /// <summary>
    /// Starts a specific educational level
    /// </summary>
    public void StartLevel(string levelId)
    {
        EducationalLevel level = GetLevelById(levelId);
        
        if (level != null && level.isUnlocked)
        {
            currentLevelId = levelId;
            Debug.Log("Starting educational level: " + level.levelName);
            
            // Reset objectives if level was previously completed
            if (level.isCompleted)
            {
                foreach (var objective in level.objectives)
                {
                    objective.isCompleted = false;
                }
                level.isCompleted = false;
            }
            
            // Send analytics event
            SendAnalyticsEvent("level_started", new Dictionary<string, object>
            {
                { "level_id", levelId },
                { "level_name", level.levelName },
                { "difficulty", level.difficultyRating }
            });
        }
        else
        {
            Debug.LogWarning("Cannot start level " + levelId + ": Level not found or locked");
        }
    }
    
    /// <summary>
    /// Starts tracking time for a specific learning objective
    /// </summary>
    public void StartObjective(string objectiveId)
    {
        if (objectiveTimeSpent.ContainsKey(objectiveId))
        {
            currentObjectiveId = objectiveId;
            objectiveTimer = objectiveTimeSpent[objectiveId];
            
            // Increment attempts counter
            if (trackAttempts)
            {
                objectiveAttempts[objectiveId]++;
            }
            
            Debug.Log("Starting objective: " + objectiveId + " (Attempt #" + objectiveAttempts[objectiveId] + ")");
        }
    }
    
    /// <summary>
    /// Completes a learning objective
    /// </summary>
    public void CompleteObjective(string objectiveId, bool success)
    {
        // Find the objective
        LearningObjective objective = null;
        EducationalLevel parentLevel = null;
        
        foreach (var level in levels)
        {
            foreach (var obj in level.objectives)
            {
                if (obj.objectiveId == objectiveId)
                {
                    objective = obj;
                    parentLevel = level;
                    break;
                }
            }
            if (objective != null) break;
        }
        
        if (objective != null)
        {
            // Update objective status
            objective.isCompleted = success;
            objectiveSuccess[objectiveId] = success;
            
            // Stop tracking time
            if (currentObjectiveId == objectiveId)
            {
                currentObjectiveId = null;
            }
            
            // Log completion
            Debug.Log("Objective " + objectiveId + " completed with " + (success ? "success" : "failure") + 
                      " in " + objectiveTimeSpent[objectiveId] + " seconds after " + 
                      objectiveAttempts[objectiveId] + " attempts");
            
            // Trigger completion events
            if (success && objective.onComplete != null)
            {
                objective.onComplete.Invoke();
            }
            
            // Check if level is completed
            if (parentLevel != null && success)
            {
                CheckLevelCompletion(parentLevel);
            }
            
            // Send analytics event
            SendAnalyticsEvent("objective_completed", new Dictionary<string, object>
            {
                { "objective_id", objectiveId },
                { "success", success },
                { "time_spent", objectiveTimeSpent[objectiveId] },
                { "attempts", objectiveAttempts[objectiveId] },
                { "level_id", parentLevel?.levelId }
            });
        }
    }
    
    /// <summary>
    /// Checks if all objectives in a level are completed
    /// </summary>
    private void CheckLevelCompletion(EducationalLevel level)
    {
        bool allCompleted = true;
        
        foreach (var objective in level.objectives)
        {
            if (!objective.isCompleted)
            {
                allCompleted = false;
                break;
            }
        }
        
        if (allCompleted && !level.isCompleted)
        {
            level.isCompleted = true;
            
            // Unlock next level if there is one
            int currentIndex = levels.IndexOf(level);
            if (currentIndex < levels.Count - 1)
            {
                levels[currentIndex + 1].isUnlocked = true;
            }
            
            Debug.Log("Level " + level.levelId + " (" + level.levelName + ") completed!");
            
            // Send analytics event
            SendAnalyticsEvent("level_completed", new Dictionary<string, object>
            {
                { "level_id", level.levelId },
                { "level_name", level.levelName },
                { "difficulty", level.difficultyRating }
            });
            
            // Send message to web platform
            #if UNITY_WEBGL && !UNITY_EDITOR
            SendLevelCompletionToWeb(level.levelId);
            #endif
        }
    }
    
    /// <summary>
    /// Gets a level by its ID
    /// </summary>
    private EducationalLevel GetLevelById(string levelId)
    {
        foreach (var level in levels)
        {
            if (level.levelId == levelId)
            {
                return level;
            }
        }
        return null;
    }
    
    /// <summary>
    /// Adjusts difficulty based on player performance
    /// </summary>
    public void AdjustDifficulty()
    {
        if (!adaptiveDifficulty) return;
        
        // Calculate success rate for current level
        EducationalLevel currentLevel = GetLevelById(currentLevelId);
        if (currentLevel == null) return;
        
        int totalObjectives = 0;
        int successfulObjectives = 0;
        float totalAttempts = 0;
        
        foreach (var objective in currentLevel.objectives)
        {
            if (objectiveAttempts.ContainsKey(objective.objectiveId) && 
                objectiveAttempts[objective.objectiveId] > 0)
            {
                totalObjectives++;
                totalAttempts += objectiveAttempts[objective.objectiveId];
                
                if (objectiveSuccess[objective.objectiveId])
                {
                    successfulObjectives++;
                }
            }
        }
        
        if (totalObjectives > 0)
        {
            float successRate = (float)successfulObjectives / totalObjectives;
            float averageAttempts = totalAttempts / totalObjectives;
            
            // Adjust difficulty based on success rate and attempts
            if (successRate > 0.8f && averageAttempts < 1.5f)
            {
                // Too easy - increase difficulty
                IncreaseDifficulty();
            }
            else if (successRate < 0.4f || averageAttempts > 3f)
            {
                // Too hard - decrease difficulty
                DecreaseDifficulty();
            }
        }
    }
    
    /// <summary>
    /// Increases game difficulty
    /// </summary>
    private void IncreaseDifficulty()
    {
        // Implementation would depend on specific game mechanics
        Debug.Log("Increasing difficulty - player is doing well!");
    }
    
    /// <summary>
    /// Decreases game difficulty
    /// </summary>
    private void DecreaseDifficulty()
    {
        // Implementation would depend on specific game mechanics
        Debug.Log("Decreasing difficulty - player is struggling");
    }
    
    /// <summary>
    /// Sends analytics event (would connect to backend in real implementation)
    /// </summary>
    private void SendAnalyticsEvent(string eventName, Dictionary<string, object> eventData)
    {
        string eventDataString = "{ ";
        foreach (var item in eventData)
        {
            eventDataString += "'" + item.Key + "': '" + item.Value + "', ";
        }
        eventDataString += "}";
        
        Debug.Log("Analytics Event: " + eventName + " - Data: " + eventDataString);
        
        // In a real implementation, this would send data to a server
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendAnalyticsToWeb(eventName, JsonUtility.ToJson(eventData));
        #endif
    }
    
    /// <summary>
    /// Gets a summary of learning progress
    /// </summary>
    public string GetLearningProgressSummary()
    {
        int totalObjectives = 0;
        int completedObjectives = 0;
        int unlockedLevels = 0;
        int completedLevels = 0;
        
        foreach (var level in levels)
        {
            if (level.isUnlocked) unlockedLevels++;
            if (level.isCompleted) completedLevels++;
            
            foreach (var objective in level.objectives)
            {
                totalObjectives++;
                if (objective.isCompleted) completedObjectives++;
            }
        }
        
        float completionPercentage = totalObjectives > 0 ? 
            (float)completedObjectives / totalObjectives * 100 : 0;
        
        return string.Format(
            "Learning Progress: {0}% complete\n" +
            "Objectives: {1}/{2} completed\n" +
            "Levels: {3}/{4} completed, {5}/{4} unlocked",
            completionPercentage.ToString("F1"),
            completedObjectives, totalObjectives,
            completedLevels, levels.Count,
            unlockedLevels
        );
    }
    
    // External JavaScript functions for WebGL builds
    #if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendLevelCompletionToWeb(string levelId);
    
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendAnalyticsToWeb(string eventName, string eventData);
    #endif
}
EOL

# Create adaptive difficulty controller
cat > "$FEATURES_DIR/AdaptiveDifficultyController.cs" << EOL
using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Manages adaptive difficulty for educational games
/// </summary>
public class AdaptiveDifficultyController : MonoBehaviour
{
    [System.Serializable]
    public class PerformanceMetric
    {
        public string metricName;
        public float weight = 1.0f;
        [HideInInspector]
        public float currentValue;
        [HideInInspector]
        public float historicalAverage;
    }
    
    [System.Serializable]
    public class DifficultyParameter
    {
        public string parameterName;
        public float minValue = 0.0f;
        public float maxValue = 1.0f;
        public float defaultValue = 0.5f;
        [HideInInspector]
        public float currentValue;
    }
    
    [Header("Adaptive Settings")]
    [Tooltip("Enable adaptive difficulty")]
    public bool adaptiveDifficultyEnabled = true;
    
    [Tooltip("How quickly the system adapts (0-1)")]
    [Range(0, 1)]
    public float adaptationRate = 0.3f;
    
    [Tooltip("Performance metrics to track")]
    public List<PerformanceMetric> performanceMetrics = new List<PerformanceMetric>();
    
    [Tooltip("Difficulty parameters to adjust")]
    public List<DifficultyParameter> difficultyParameters = new List<DifficultyParameter>();
    
    [Header("Analytics")]
    [Tooltip("Enable logging of difficulty adjustments")]
    public bool logDifficultyChanges = true;
    
    // Performance history
    private Dictionary<string, Queue<float>> metricHistory = new Dictionary<string, Queue<float>>();
    private int historySize = 10;
    
    // Last adjustment time
    private float lastAdjustmentTime;
    private float adjustmentInterval = 30f; // seconds
    
    private void Start()
    {
        // Initialize difficulty parameters to default values
        foreach (var param in difficultyParameters)
        {
            param.currentValue = param.defaultValue;
        }
        
        // Initialize metric history
        foreach (var metric in performanceMetrics)
        {
            metricHistory[metric.metricName] = new Queue<float>();
            metric.currentValue = 0.5f; // Start at midpoint
            metric.historicalAverage = 0.5f;
        }
        
        Debug.Log("Adaptive Difficulty Controller initialized with " + 
                 performanceMetrics.Count + " metrics and " + 
                 difficultyParameters.Count + " difficulty parameters.");
    }
    
    private void Update()
    {
        if (!adaptiveDifficultyEnabled) return;
        
        // Check if it's time to adjust difficulty
        if (Time.time - lastAdjustmentTime >= adjustmentInterval)
        {
            AdjustDifficulty();
            lastAdjustmentTime = Time.time;
        }
    }
    
    /// <summary>
    /// Records a performance metric value
    /// </summary>
    public void RecordMetric(string metricName, float value)
    {
        // Find the metric
        PerformanceMetric metric = null;
        foreach (var m in performanceMetrics)
        {
            if (m.metricName == metricName)
            {
                metric = m;
                break;
            }
        }
        
        if (metric != null)
        {
            // Update current value
            metric.currentValue = value;
            
            // Add to history
            Queue<float> history = metricHistory[metricName];
            history.Enqueue(value);
            
            // Maintain history size
            if (history.Count > historySize)
            {
                history.Dequeue();
            }
            
            // Update historical average
            float sum = 0;
            foreach (float v in history)
            {
                sum += v;
            }
            metric.historicalAverage = sum / history.Count;
            
            if (logDifficultyChanges)
            {
                Debug.Log("Recorded metric " + metricName + ": " + value + 
                         " (Average: " + metric.historicalAverage + ")");
            }
        }
    }
    
    /// <summary>
    /// Adjusts difficulty based on performance metrics
    /// </summary>
    private void AdjustDifficulty()
    {
        if (performanceMetrics.Count == 0) return;
        
        // Calculate overall performance score (-1 to 1, where positive means doing well)
        float performanceScore = 0;
        float totalWeight = 0;
        
        foreach (var metric in performanceMetrics)
        {
            performanceScore += (metric.currentValue - 0.5f) * 2 * metric.weight;
            totalWeight += metric.weight;
        }
        
        if (totalWeight > 0)
        {
            performanceScore /= totalWeight;
        }
        
        // Adjust difficulty parameters based on performance
        foreach (var param in difficultyParameters)
        {
            // Adjust in opposite direction of performance
            // (doing well → increase difficulty, struggling → decrease difficulty)
            float adjustment = -performanceScore * adaptationRate;
            
            // Apply adjustment
            param.currentValue = Mathf.Clamp(
                param.currentValue + adjustment, 
                param.minValue, 
                param.maxValue
            );
            
            if (logDifficultyChanges)
            {
                Debug.Log("Adjusted " + param.parameterName + " to " + param.currentValue + 
                         " based on performance score " + performanceScore);
            }
        }
        
        // Send analytics
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendDifficultyAdjustmentToWeb(performanceScore, GetDifficultySettingsJson());
        #endif
    }
    
    /// <summary>
    /// Gets the current value of a difficulty parameter
    /// </summary>
    public float GetParameterValue(string parameterName)
    {
        foreach (var param in difficultyParameters)
        {
            if (param.parameterName == parameterName)
            {
                return param.currentValue;
            }
        }
        
        Debug.LogWarning("Difficulty parameter not found: " + parameterName);
        return 0.5f; // Default middle value
    }
    
    /// <summary>
    /// Forces a specific difficulty level (0-1 range)
    /// </summary>
    public void SetOverallDifficulty(float difficulty)
    {
        difficulty = Mathf.Clamp01(difficulty);
        
        foreach (var param in difficultyParameters)
        {
            float normalizedRange = param.maxValue - param.minValue;
            param.currentValue = param.minValue + (normalizedRange * difficulty);
        }
        
        Debug.Log("Overall difficulty set to " + difficulty);
    }
    
    /// <summary>
    /// Gets current difficulty settings as JSON
    /// </summary>
    private string GetDifficultySettingsJson()
    {
        string json = "{ \"parameters\": [";
        
        for (int i = 0; i < difficultyParameters.Count; i++)
        {
            var param = difficultyParameters[i];
            json += string.Format("{{ \"name\": \"{0}\", \"value\": {1} }}", 
                                param.parameterName, 
                                param.currentValue);
            
            if (i < difficultyParameters.Count - 1)
            {
                json += ", ";
            }
        }
        
        json += "]}";
        return json;
    }
    
    // External JavaScript function for WebGL builds
    #if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendDifficultyAdjustmentToWeb(float performanceScore, string difficultySettings);
    #endif
}
EOL

# Make the scripts executable
chmod +x "$FEATURES_DIR"/*.cs

echo "Educational features for Unity have been set up successfully!"
echo "The following educational components were created:"
echo "1. AccessibilityController - Manages accessibility features for the educational games"
echo "2. EducationalGameController - Manages educational content, objectives, and learning analytics"
echo "3. AdaptiveDifficultyController - Provides adaptive difficulty based on player performance"
echo ""
echo "These scripts can be attached to GameObjects in Unity to enable educational features."