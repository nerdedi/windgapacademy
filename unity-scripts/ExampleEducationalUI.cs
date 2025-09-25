using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

/// <summary>
/// Example implementation of a Windgap Academy UI element that demonstrates
/// how to create UI components for educational content in Unity.
/// </summary>
public class ExampleEducationalUI : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private GameObject lessonPanel;
    [SerializeField] private TextMeshProUGUI lessonTitle;
    [SerializeField] private TextMeshProUGUI lessonContent;
    [SerializeField] private Button continueButton;
    [SerializeField] private Button closeButton;

    [Header("Quiz UI")]
    [SerializeField] private GameObject quizPanel;
    [SerializeField] private TextMeshProUGUI quizQuestionText;
    [SerializeField] private Button[] answerButtons;
    [SerializeField] private TextMeshProUGUI[] answerTexts;
    [SerializeField] private TextMeshProUGUI feedbackText;

    [Header("Progress Tracking")]
    [SerializeField] private Slider progressBar;
    [SerializeField] private TextMeshProUGUI progressText;
    [SerializeField] private GameObject achievementNotification;
    [SerializeField] private TextMeshProUGUI achievementText;

    [Header("Animation")]
    [SerializeField] private Animation panelAnimation;
    [SerializeField] private string showAnimationName = "ShowPanel";
    [SerializeField] private string hideAnimationName = "HidePanel";

    private IEducationalInteractable currentInteractable;

    // Initialization
    private void Start()
    {
        // Set up button listeners
        if (continueButton) continueButton.onClick.AddListener(OnContinueClicked);
        if (closeButton) closeButton.onClick.AddListener(OnCloseClicked);

        // Set up answer button listeners
        for (int i = 0; i < answerButtons.Length; i++)
        {
            int index = i; // Capture index for callback
            answerButtons[i].onClick.AddListener(() => OnAnswerSelected(index));
        }

        // Hide all panels initially
        HideAllPanels();
    }

    // Example method to display a text lesson
    public void ShowTextLesson(string title, string content, IEducationalInteractable source)
    {
        HideAllPanels();

        currentInteractable = source;

        // Set up lesson panel content
        lessonTitle.text = title;
        lessonContent.text = content;

        // Show the panel with animation
        lessonPanel.SetActive(true);
        if (panelAnimation != null)
        {
            panelAnimation.Stop();
            panelAnimation.Play(showAnimationName);
        }
    }

    // Example method to display a quiz
    public void ShowQuiz(string title, string question, string[] answers, IEducationalInteractable source)
    {
        HideAllPanels();

        currentInteractable = source;

        // Set up quiz panel content
        quizQuestionText.text = question;

        // Set up answer buttons
        for (int i = 0; i < answerTexts.Length; i++)
        {
            if (i < answers.Length)
            {
                answerButtons[i].gameObject.SetActive(true);
                answerTexts[i].text = answers[i];
            }
            else
            {
                answerButtons[i].gameObject.SetActive(false);
            }
        }

        // Clear feedback
        feedbackText.text = "";

        // Show the panel with animation
        quizPanel.SetActive(true);
        if (panelAnimation != null)
        {
            panelAnimation.Stop();
            panelAnimation.Play(showAnimationName);
        }
    }

    // Example method to update progress
    public void UpdateProgress(float progress)
    {
        progressBar.value = progress;
        progressText.text = $"{progress:P0} Complete";

        // Show achievement notification at milestones
        if (progress >= 0.25f && progress < 0.3f)
        {
            ShowAchievement("Starting Your Journey! 25% Complete");
        }
        else if (progress >= 0.5f && progress < 0.55f)
        {
            ShowAchievement("Halfway There! 50% Complete");
        }
        else if (progress >= 0.75f && progress < 0.8f)
        {
            ShowAchievement("Almost Done! 75% Complete");
        }
        else if (progress >= 1.0f)
        {
            ShowAchievement("Congratulations! Course Complete!");
        }
    }

    // Button event handlers
    private void OnContinueClicked()
    {
        // Mark current content as completed
        if (currentInteractable != null)
        {
            StudentCharacterController student = FindObjectOfType<StudentCharacterController>();
            if (student != null)
            {
                currentInteractable.OnContentCompleted(student);
            }
        }

        // Hide the panel
        HideCurrentPanel();
    }

    private void OnCloseClicked()
    {
        // End interaction without completion
        if (currentInteractable != null)
        {
            StudentCharacterController student = FindObjectOfType<StudentCharacterController>();
            if (student != null)
            {
                currentInteractable.OnInteractionEnd(student);
            }
        }

        // Hide the panel
        HideCurrentPanel();
    }

    private void OnAnswerSelected(int index)
    {
        // Example quiz logic
        // In a real implementation, this would check if the answer is correct
        bool isCorrect = (index == 0); // Example: first answer is always correct

        if (isCorrect)
        {
            feedbackText.text = "Correct!";
            feedbackText.color = Color.green;

            // Enable continue button to mark as complete
            continueButton.gameObject.SetActive(true);
        }
        else
        {
            feedbackText.text = "Try again!";
            feedbackText.color = Color.red;
        }
    }

    // Helper methods
    private void HideAllPanels()
    {
        if (lessonPanel) lessonPanel.SetActive(false);
        if (quizPanel) quizPanel.SetActive(false);
        if (achievementNotification) achievementNotification.SetActive(false);
    }

    private void HideCurrentPanel()
    {
        if (panelAnimation != null)
        {
            panelAnimation.Stop();
            panelAnimation.Play(hideAnimationName);
            StartCoroutine(DisablePanelAfterAnimation());
        }
        else
        {
            HideAllPanels();
        }
    }

    private IEnumerator DisablePanelAfterAnimation()
    {
        // Wait for animation to complete
        yield return new WaitForSeconds(panelAnimation[hideAnimationName].length);

        // Disable panels
        HideAllPanels();
    }

    private void ShowAchievement(string achievement)
    {
        achievementText.text = achievement;
        achievementNotification.SetActive(true);

        // Automatically hide after a few seconds
        StartCoroutine(HideAchievementAfter(5f));
    }

    private IEnumerator HideAchievementAfter(float delay)
    {
        yield return new WaitForSeconds(delay);
        achievementNotification.SetActive(false);
    }
}
