using UnityEngine;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// Unity UI integration for Windgap Academy.
/// This component handles educational UI elements that display content, progress, and feedback.
/// </summary>
public class WindgapAcademyUI : MonoBehaviour
{
    [Header("UI Elements")]
    [SerializeField] private Canvas mainCanvas;
    [SerializeField] private GameObject progressPanel;
    [SerializeField] private GameObject lessonPanel;
    [SerializeField] private GameObject interactionPanel;
    [SerializeField] private GameObject feedbackPanel;

    [Header("Progress Display")]
    [SerializeField] private Slider progressBar;
    [SerializeField] private TextMeshProUGUI progressText;
    [SerializeField] private TextMeshProUGUI lessonTitleText;
    [SerializeField] private TextMeshProUGUI studentNameText;

    [Header("Lesson Content")]
    [SerializeField] private TextMeshProUGUI lessonTitle;
    [SerializeField] private TextMeshProUGUI lessonDescription;
    [SerializeField] private Image lessonImage;

    [Header("Feedback Elements")]
    [SerializeField] private TextMeshProUGUI feedbackText;
    [SerializeField] private Image feedbackIcon;
    [SerializeField] private Sprite correctSprite;
    [SerializeField] private Sprite incorrectSprite;
    [SerializeField] private Sprite completedSprite;

    // Singleton pattern
    public static WindgapAcademyUI Instance { get; private set; }

    private void Awake()
    {
        // Singleton setup
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
    }

    private void Start()
    {
        // Initialize UI
        HideAllPanels();
        ShowProgressPanel(true);
    }

    /// <summary>
    /// Updates the progress bar and text
    /// </summary>
    public void UpdateProgress(float progress)
    {
        if (progressBar != null)
            progressBar.value = progress / 100f;

        if (progressText != null)
            progressText.text = $"{Mathf.RoundToInt(progress)}%";
    }

    /// <summary>
    /// Sets the lesson information
    /// </summary>
    public void SetLessonInfo(string title, string studentName)
    {
        if (lessonTitleText != null)
            lessonTitleText.text = title;

        if (studentNameText != null)
            studentNameText.text = studentName;
    }

    /// <summary>
    /// Shows lesson content
    /// </summary>
    public void ShowLessonContent(string title, string description, Sprite image = null)
    {
        ShowPanel(lessonPanel);

        if (lessonTitle != null)
            lessonTitle.text = title;

        if (lessonDescription != null)
            lessonDescription.text = description;

        if (lessonImage != null && image != null)
        {
            lessonImage.sprite = image;
            lessonImage.gameObject.SetActive(true);
        }
        else if (lessonImage != null)
        {
            lessonImage.gameObject.SetActive(false);
        }
    }

    /// <summary>
    /// Shows interaction UI for a specific learning station
    /// </summary>
    public void ShowInteractionUI(string interactionType, string stationName)
    {
        ShowPanel(interactionPanel);

        // Configure UI based on interaction type
        // This would be implemented specifically for each interaction type
    }

    /// <summary>
    /// Shows feedback to the student
    /// </summary>
    public void ShowFeedback(string message, FeedbackType type, float duration = 3f)
    {
        ShowPanel(feedbackPanel);

        if (feedbackText != null)
            feedbackText.text = message;

        if (feedbackIcon != null)
        {
            switch (type)
            {
                case FeedbackType.Correct:
                    feedbackIcon.sprite = correctSprite;
                    break;
                case FeedbackType.Incorrect:
                    feedbackIcon.sprite = incorrectSprite;
                    break;
                case FeedbackType.Completed:
                    feedbackIcon.sprite = completedSprite;
                    break;
            }
        }

        // Auto-hide after duration
        Invoke(nameof(HideFeedback), duration);
    }

    /// <summary>
    /// Hide feedback panel
    /// </summary>
    public void HideFeedback()
    {
        feedbackPanel.SetActive(false);
    }

    /// <summary>
    /// Show a specific panel and hide others
    /// </summary>
    private void ShowPanel(GameObject panel)
    {
        // Hide all panels first
        progressPanel.SetActive(false);
        lessonPanel.SetActive(false);
        interactionPanel.SetActive(false);
        feedbackPanel.SetActive(false);

        // Show requested panel
        if (panel != null)
            panel.SetActive(true);
    }

    /// <summary>
    /// Hide all UI panels
    /// </summary>
    private void HideAllPanels()
    {
        progressPanel.SetActive(false);
        lessonPanel.SetActive(false);
        interactionPanel.SetActive(false);
        feedbackPanel.SetActive(false);
    }

    /// <summary>
    /// Show or hide progress panel
    /// </summary>
    public void ShowProgressPanel(bool show)
    {
        progressPanel.SetActive(show);
    }

    /// <summary>
    /// Handle the completion of an activity
    /// </summary>
    public void OnActivityCompleted(string activityId, float overallProgress)
    {
        // Update progress display
        UpdateProgress(overallProgress);

        // Show feedback
        ShowFeedback("Activity completed!", FeedbackType.Correct);
    }

    /// <summary>
    /// Handle the completion of the entire lesson
    /// </summary>
    public void OnLessonCompleted(float score)
    {
        UpdateProgress(100f);

        // Show completion feedback
        ShowFeedback($"Lesson completed! Score: {score}%", FeedbackType.Completed, 5f);
    }
}

/// <summary>
/// Types of feedback that can be shown to the student
/// </summary>
public enum FeedbackType
{
    Correct,
    Incorrect,
    Completed
}
