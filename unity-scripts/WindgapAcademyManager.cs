using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Main manager for the Windgap Academy learning environment.
/// Handles integration with the React application and manages educational activities.
/// </summary>
public class WindgapAcademyManager : MonoBehaviour
{
    // Singleton instance
    public static WindgapAcademyManager Instance { get; private set; }

    [Header("Student Data")]
    [SerializeField] private string studentName;
    [SerializeField] private string currentLesson;
    [SerializeField] private int studentProgress;

    [Header("Educational Content")]
    [SerializeField] private GameObject[] learningStations;
    [SerializeField] private GameObject[] interactiveElements;

    [Header("Character")]
    [SerializeField] private GameObject studentCharacter;
    [SerializeField] private GameObject educatorCharacter;

    [Header("UI Elements")]
    [SerializeField] private GameObject progressUI;
    [SerializeField] private GameObject lessonUI;

    // Track lesson progress
    private Dictionary<string, bool> completedActivities = new Dictionary<string, bool>();

    private void Awake()
    {
        // Singleton pattern
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        // Initialize communication with React
        RegisterJSCallbacks();

        // Send ready message to React app
        SendMessageToReact("academyLoaded", new { status = "ready" });
    }

    /// <summary>
    /// Registers callbacks for JavaScript to call Unity methods
    /// </summary>
    private void RegisterJSCallbacks()
    {
        // These methods will be called from the React app
        #if UNITY_WEBGL && !UNITY_EDITOR
        WebGLInput.captureAllKeyboardInput = false;
        #endif
    }

    /// <summary>
    /// Called from React to start a specific educational activity
    /// </summary>
    public void StartLesson(string jsonData)
    {
        Debug.Log("Starting lesson with data: " + jsonData);

        // Parse the incoming JSON data
        LessonData data = JsonUtility.FromJson<LessonData>(jsonData);

        // Store the student info
        studentName = data.studentName;
        currentLesson = data.lessonId;

        // Initialize the lesson environment
        SetupLessonEnvironment(data);

        // Send confirmation back to React
        SendMessageToReact("lessonStarted", new { lessonId = data.lessonId, status = "active" });
    }

    /// <summary>
    /// Sets up the educational environment based on lesson data
    /// </summary>
    private void SetupLessonEnvironment(LessonData data)
    {
        // Configure the environment based on lesson type
        switch (data.lessonType)
        {
            case "math":
                ConfigureMathLesson(data);
                break;
            case "science":
                ConfigureScienceLesson(data);
                break;
            case "language":
                ConfigureLanguageLesson(data);
                break;
            default:
                ConfigureDefaultLesson(data);
                break;
        }

        // Activate relevant learning stations
        ActivateLearningStations(data.stations);
    }

    /// <summary>
    /// Activate specific learning stations for this lesson
    /// </summary>
    private void ActivateLearningStations(string[] stationIds)
    {
        foreach (GameObject station in learningStations)
        {
            bool shouldActivate = System.Array.Exists(stationIds, id => station.name == id);
            station.SetActive(shouldActivate);
        }
    }

    /// <summary>
    /// Record activity completion and update progress
    /// </summary>
    public void CompleteActivity(string activityId)
    {
        completedActivities[activityId] = true;

        // Calculate overall progress
        float progress = CalculateOverallProgress();

        // Update UI
        UpdateProgressUI(progress);

        // Send progress to React
        SendMessageToReact("activityCompleted", new {
            activityId = activityId,
            progress = progress,
            completed = completedActivities.Count
        });

        // Check if lesson is complete
        CheckLessonCompletion();
    }

    /// <summary>
    /// Calculate overall lesson progress as percentage
    /// </summary>
    private float CalculateOverallProgress()
    {
        int totalActivities = GetTotalActivitiesCount();
        int completed = completedActivities.Count;

        return (float)completed / totalActivities * 100f;
    }

    /// <summary>
    /// Get total number of activities in current lesson
    /// </summary>
    private int GetTotalActivitiesCount()
    {
        // This would normally be determined by the lesson structure
        // For this example, we'll return a fixed number
        return 5;
    }

    /// <summary>
    /// Check if the lesson is complete
    /// </summary>
    private void CheckLessonCompletion()
    {
        int totalActivities = GetTotalActivitiesCount();

        if (completedActivities.Count >= totalActivities)
        {
            // Lesson is complete
            SendMessageToReact("lessonComplete", new {
                lessonId = currentLesson,
                studentName = studentName,
                score = CalculateScore()
            });
        }
    }

    /// <summary>
    /// Calculate student score for the lesson
    /// </summary>
    private float CalculateScore()
    {
        // This would normally be calculated based on performance
        // For this example, we'll return a fixed score
        return 85.0f;
    }

    /// <summary>
    /// Update the progress UI with current progress
    /// </summary>
    private void UpdateProgressUI(float progress)
    {
        // Update progress UI component
        // This would be implemented with specific UI components
    }

    /// <summary>
    /// Send a message to the React application
    /// </summary>
    private void SendMessageToReact(string eventName, object data)
    {
        string json = JsonUtility.ToJson(data);

        #if UNITY_WEBGL && !UNITY_EDITOR
        SendToReact(eventName, json);
        #else
        Debug.Log($"[REACT EVENT] {eventName}: {json}");
        #endif
    }

    #if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendToReact(string eventName, string jsonData);
    #endif

    // Configure specific lesson types
    private void ConfigureMathLesson(LessonData data) { /* Implementation */ }
    private void ConfigureScienceLesson(LessonData data) { /* Implementation */ }
    private void ConfigureLanguageLesson(LessonData data) { /* Implementation */ }
    private void ConfigureDefaultLesson(LessonData data) { /* Implementation */ }
}

/// <summary>
/// Data structure for lesson information sent from React
/// </summary>
[System.Serializable]
public class LessonData
{
    public string lessonId;
    public string lessonType;
    public string studentName;
    public string difficulty;
    public string[] stations;
}
