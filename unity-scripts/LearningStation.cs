using UnityEngine;
using System.Collections;

/// <summary>
/// Component for creating educational learning stations in the Windgap Academy environment.
/// These stations represent interactive educational content that students can engage with.
/// </summary>
public class LearningStation : MonoBehaviour, IEducationalInteractable
{
    [Header("Station Information")]
    [SerializeField] private string stationId;
    [SerializeField] private string stationName;
    [SerializeField] private string stationDescription;
    [SerializeField] private LearningStationType stationType;
    [SerializeField] private string associatedLessonId;

    [Header("Interaction")]
    [SerializeField] private float interactionDistance = 2f;
    [SerializeField] private GameObject interactionPrompt;
    [SerializeField] private GameObject activeFx;
    [SerializeField] private GameObject completedFx;

    [Header("Content")]
    [SerializeField] private GameObject contentCanvas;
    [SerializeField] private GameObject[] contentObjects;

    private bool isActive = false;
    private bool isCompleted = false;
    private bool playerInRange = false;
    private GameObject currentInteractor = null;

    // Define different types of learning stations
    public enum LearningStationType
    {
        Quiz,
        Simulation,
        Video,
        Reading,
        Interactive3D,
        Game,
        Discussion
    }

    private void Start()
    {
        // Initialize station
        SetInteractionPromptVisible(false);
        SetContentVisible(false);
        SetActiveFxVisible(false);
        SetCompletedFxVisible(false);
    }

    private void Update()
    {
        // Check if player is in range to show interaction prompt
        if (playerInRange && !isCompleted && !isActive)
        {
            SetInteractionPromptVisible(true);
        }
        else
        {
            SetInteractionPromptVisible(false);
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        // Check if player entered interaction zone
        if (other.CompareTag("Player"))
        {
            playerInRange = true;
            currentInteractor = other.gameObject;
        }
    }

    private void OnTriggerExit(Collider other)
    {
        // Check if player left interaction zone
        if (other.CompareTag("Player"))
        {
            playerInRange = false;

            // If player leaves while active, deactivate
            if (isActive && currentInteractor == other.gameObject)
            {
                DeactivateStation();
            }

            currentInteractor = null;
        }
    }

    /// <summary>
    /// Implement IEducationalInteractable interface
    /// </summary>
    public void Interact(GameObject interactor)
    {
        if (isCompleted)
            return;

        currentInteractor = interactor;

        // Activate or deactivate based on current state
        if (!isActive)
        {
            ActivateStation();
        }
        else
        {
            DeactivateStation();
        }
    }

    /// <summary>
    /// Returns the type of interaction for tracking
    /// </summary>
    public string GetInteractionType()
    {
        return "LearningStation_" + stationType.ToString();
    }

    /// <summary>
    /// Activate this learning station
    /// </summary>
    public void ActivateStation()
    {
        isActive = true;

        // Show content
        SetContentVisible(true);
        SetActiveFxVisible(true);
        SetInteractionPromptVisible(false);

        // Send message to WindgapAcademyManager
        WindgapAcademyManager.Instance.StartActivity(stationId);

        // Disable player movement if needed
        if (currentInteractor != null)
        {
            StudentCharacterController controller = currentInteractor.GetComponent<StudentCharacterController>();
            if (controller != null)
            {
                controller.StartEducationalActivity(stationType.ToString());
            }
        }

        // Start specific activity based on type
        StartActivity();
    }

    /// <summary>
    /// Deactivate this learning station
    /// </summary>
    public void DeactivateStation()
    {
        if (!isActive)
            return;

        isActive = false;

        // Hide content
        SetContentVisible(false);
        SetActiveFxVisible(false);

        // Re-enable player movement
        if (currentInteractor != null)
        {
            StudentCharacterController controller = currentInteractor.GetComponent<StudentCharacterController>();
            if (controller != null)
            {
                controller.EndEducationalActivity();
            }
        }
    }

    /// <summary>
    /// Mark this station as completed
    /// </summary>
    public void CompleteStation()
    {
        isCompleted = true;
        isActive = false;

        // Hide content and show completed effect
        SetContentVisible(false);
        SetActiveFxVisible(false);
        SetCompletedFxVisible(true);

        // Re-enable player movement
        if (currentInteractor != null)
        {
            StudentCharacterController controller = currentInteractor.GetComponent<StudentCharacterController>();
            if (controller != null)
            {
                controller.EndEducationalActivity();
            }
        }

        // Notify WindgapAcademyManager that this activity is complete
        WindgapAcademyManager.Instance.CompleteActivity(stationId);
    }

    /// <summary>
    /// Start the specific educational activity based on station type
    /// </summary>
    private void StartActivity()
    {
        switch (stationType)
        {
            case LearningStationType.Quiz:
                StartQuiz();
                break;

            case LearningStationType.Simulation:
                StartSimulation();
                break;

            case LearningStationType.Video:
                StartVideo();
                break;

            case LearningStationType.Reading:
                StartReading();
                break;

            case LearningStationType.Interactive3D:
                StartInteractive3D();
                break;

            case LearningStationType.Game:
                StartGame();
                break;

            case LearningStationType.Discussion:
                StartDiscussion();
                break;
        }
    }

    // Helper methods to control visibility
    private void SetInteractionPromptVisible(bool visible)
    {
        if (interactionPrompt != null)
            interactionPrompt.SetActive(visible);
    }

    private void SetContentVisible(bool visible)
    {
        if (contentCanvas != null)
            contentCanvas.SetActive(visible);

        foreach (GameObject obj in contentObjects)
        {
            if (obj != null)
                obj.SetActive(visible);
        }
    }

    private void SetActiveFxVisible(bool visible)
    {
        if (activeFx != null)
            activeFx.SetActive(visible);
    }

    private void SetCompletedFxVisible(bool visible)
    {
        if (completedFx != null)
            completedFx.SetActive(visible);
    }

    // Specific activity implementations
    private void StartQuiz() { /* Quiz implementation */ }
    private void StartSimulation() { /* Simulation implementation */ }
    private void StartVideo() { /* Video implementation */ }
    private void StartReading() { /* Reading implementation */ }
    private void StartInteractive3D() { /* 3D interactive implementation */ }
    private void StartGame() { /* Educational game implementation */ }
    private void StartDiscussion() { /* Discussion implementation */ }
}
