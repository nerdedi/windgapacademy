using UnityEngine;

/// <summary>
/// Interface for educational interactable objects in Windgap Academy.
/// Implemented by elements that students can interact with for learning.
/// </summary>
public interface IEducationalInteractable
{
    /// <summary>
    /// Gets the unique identifier for this interactable object
    /// </summary>
    string GetInteractableId();

    /// <summary>
    /// Gets a user-friendly name for this interactable object
    /// </summary>
    string GetInteractableName();

    /// <summary>
    /// Gets a description of what this interactable object teaches or does
    /// </summary>
    string GetInteractableDescription();

    /// <summary>
    /// Determines if the student is close enough to interact with this object
    /// </summary>
    /// <param name="studentTransform">Transform of the student character</param>
    /// <returns>True if within interaction range</returns>
    bool IsInInteractionRange(Transform studentTransform);

    /// <summary>
    /// Called when the student begins interaction with this object
    /// </summary>
    /// <param name="studentController">Reference to the student controller</param>
    void OnInteractionStart(StudentCharacterController studentController);

    /// <summary>
    /// Called when the student ends interaction with this object
    /// </summary>
    /// <param name="studentController">Reference to the student controller</param>
    void OnInteractionEnd(StudentCharacterController studentController);

    /// <summary>
    /// Called when the student completes the educational content/activity
    /// </summary>
    /// <param name="studentController">Reference to the student controller</param>
    void OnContentCompleted(StudentCharacterController studentController);
}

/// <summary>
/// Enum defining the types of learning stations available in the educational environment
/// </summary>
public enum LearningStationType
{
    TextLesson,
    VideoLesson,
    Quiz,
    InteractiveDemo,
    PracticeActivity,
    Assessment,
    Reflection
}

/// <summary>
/// Enum defining difficulty levels for educational content
/// </summary>
public enum DifficultyLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
}

/// <summary>
/// Enum defining the subjects for educational content
/// </summary>
public enum SubjectArea
{
    Programming,
    WebDevelopment,
    DataScience,
    MachineLearning,
    CloudComputing,
    Cybersecurity,
    DevOps,
    MobileDevelopment,
    GameDevelopment,
    SoftwareEngineering
}
