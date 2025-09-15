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
