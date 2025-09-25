using UnityEngine;

/// <summary>
/// Example implementation of a complete learning station that demonstrates
/// how to create an interactive educational element in the Windgap Academy environment.
/// </summary>
public class ExampleLearningStation : MonoBehaviour, IEducationalInteractable
{
    [Header("Station Configuration")]
    [SerializeField] private string stationId = "example-station-001";
    [SerializeField] private string stationName = "Introduction to Programming";
    [SerializeField] private string stationDescription = "Learn the basics of programming concepts.";
    [SerializeField] private LearningStationType stationType = LearningStationType.TextLesson;
    [SerializeField] private DifficultyLevel difficultyLevel = DifficultyLevel.Beginner;
    [SerializeField] private SubjectArea subject = SubjectArea.Programming;

    [Header("Interaction Settings")]
    [SerializeField] private float interactionDistance = 2.0f;
    [SerializeField] private GameObject interactionPrompt;
    [SerializeField] private GameObject activeEffects;
    [SerializeField] private GameObject completedEffects;

    [Header("Content")]
    [SerializeField] [TextArea(3, 10)] private string lessonContent = "Welcome to Programming 101!";
    [SerializeField] private string[] quizQuestions;
    [SerializeField] private string[] quizAnswers;
    [SerializeField] private string videoUrl;

    // State tracking
    private bool isCompleted = false;
    private bool isActive = false;
    private StudentCharacterController currentStudent;

    private void Start()
    {
        // Initialize the station
        if (interactionPrompt) interactionPrompt.SetActive(false);
        if (activeEffects) activeEffects.SetActive(false);
        if (completedEffects) completedEffects.SetActive(false);

        // Register with the academy manager
        WindgapAcademyManager.Instance?.RegisterLearningStation(this);
    }

    private void Update()
    {
        // Check for nearby students and show interaction prompt
        if (currentStudent != null && !isActive && !isCompleted)
        {
            bool inRange = IsInInteractionRange(currentStudent.transform);
            if (interactionPrompt) interactionPrompt.SetActive(inRange);
        }
    }

    // Implementation of IEducationalInteractable interface

    public string GetInteractableId()
    {
        return stationId;
    }

    public string GetInteractableName()
    {
        return stationName;
    }

    public string GetInteractableDescription()
    {
        return stationDescription;
    }

    public bool IsInInteractionRange(Transform studentTransform)
    {
        if (studentTransform == null) return false;

        float distance = Vector3.Distance(transform.position, studentTransform.position);
        return distance <= interactionDistance;
    }

    public void OnInteractionStart(StudentCharacterController studentController)
    {
        if (isCompleted || isActive) return;

        currentStudent = studentController;
        isActive = true;

        // Activate station effects
        if (interactionPrompt) interactionPrompt.SetActive(false);
        if (activeEffects) activeEffects.SetActive(true);

        // Notify the student controller
        studentController.SetInteractingWithStation(true, this);

        // Notify the academy manager
        WindgapAcademyManager.Instance?.OnStationInteractionStarted(this, studentController);

        // Display content based on station type
        DisplayContent();
    }

    public void OnInteractionEnd(StudentCharacterController studentController)
    {
        if (!isActive) return;

        isActive = false;

        // Deactivate station effects
        if (activeEffects) activeEffects.SetActive(false);

        // Notify the student controller
        studentController.SetInteractingWithStation(false, null);

        // Notify the academy manager
        WindgapAcademyManager.Instance?.OnStationInteractionEnded(this, studentController);
    }

    public void OnContentCompleted(StudentCharacterController studentController)
    {
        if (isCompleted) return;

        isCompleted = true;
        isActive = false;

        // Activate completion effects
        if (activeEffects) activeEffects.SetActive(false);
        if (completedEffects) completedEffects.SetActive(true);

        // Notify the student controller
        studentController.SetInteractingWithStation(false, null);

        // Notify the academy manager
        WindgapAcademyManager.Instance?.OnStationCompleted(this, studentController);
    }

    /// <summary>
    /// Displays the appropriate content based on station type
    /// </summary>
    private void DisplayContent()
    {
        // Access UI Manager to display content
        WindgapAcademyUI uiManager = WindgapAcademyManager.Instance?.GetUIManager();
        if (uiManager == null) return;

        switch (stationType)
        {
            case LearningStationType.TextLesson:
                uiManager.ShowTextLesson(stationName, lessonContent, this);
                break;

            case LearningStationType.VideoLesson:
                uiManager.ShowVideoLesson(stationName, videoUrl, this);
                break;

            case LearningStationType.Quiz:
                uiManager.ShowQuiz(stationName, quizQuestions, quizAnswers, this);
                break;

            case LearningStationType.InteractiveDemo:
                uiManager.ShowInteractiveDemo(stationName, this);
                break;

            default:
                uiManager.ShowTextLesson(stationName, "Content not implemented for this station type.", this);
                break;
        }
    }

    // Unity editor visualization for easy placement
    private void OnDrawGizmosSelected()
    {
        // Draw interaction range
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, interactionDistance);

        // Draw label
        Gizmos.color = Color.white;
        #if UNITY_EDITOR
        UnityEditor.Handles.Label(transform.position + Vector3.up * 2, stationName);
        #endif
    }
}
