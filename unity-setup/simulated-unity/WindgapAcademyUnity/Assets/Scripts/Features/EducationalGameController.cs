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
