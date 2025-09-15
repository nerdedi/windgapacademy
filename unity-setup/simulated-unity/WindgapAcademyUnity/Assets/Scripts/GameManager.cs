using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    // Singleton instance
    public static GameManager Instance { get; private set; }

    // Educational game settings
    public bool isAccessibilityEnabled = true;
    public float gameDifficulty = 1.0f;
    public int currentLevel = 1;
    
    // Character references
    public GameObject playerCharacter;
    public List<GameObject> npcCharacters;
    
    // UI references
    public GameObject mainMenu;
    public GameObject gameUI;
    public GameObject pauseMenu;
    
    // Educational metrics
    private int correctAnswers = 0;
    private int incorrectAnswers = 0;
    private float totalPlayTime = 0f;

    private void Awake()
    {
        // Singleton pattern implementation
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        Debug.Log("Windgap Academy Game Manager initialized!");
        InitializeGame();
    }

    private void Update()
    {
        // Update play time tracking
        if (Time.timeScale > 0)
        {
            totalPlayTime += Time.deltaTime;
        }
        
        // Check for pause input
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            TogglePause();
        }
    }

    public void InitializeGame()
    {
        // Initialize game systems
        Debug.Log("Game initialized with difficulty: " + gameDifficulty);
        
        // Load player preferences
        LoadPlayerPreferences();
        
        // Initialize UI
        SetActiveUI(mainMenu);
    }

    public void StartLevel(int levelNumber)
    {
        currentLevel = levelNumber;
        Debug.Log("Starting level " + levelNumber);
        
        // Initialize level-specific content
        SetActiveUI(gameUI);
        
        // Reset level metrics
        correctAnswers = 0;
        incorrectAnswers = 0;
    }

    public void RecordAnswer(bool isCorrect)
    {
        if (isCorrect)
        {
            correctAnswers++;
        }
        else
        {
            incorrectAnswers++;
        }
        
        // Log for educational analytics
        Debug.Log("Answer recorded. Correct: " + correctAnswers + " Incorrect: " + incorrectAnswers);
    }

    public float GetAccuracy()
    {
        int totalAnswers = correctAnswers + incorrectAnswers;
        return totalAnswers > 0 ? (float)correctAnswers / totalAnswers : 0f;
    }

    private void LoadPlayerPreferences()
    {
        // Load saved settings
        isAccessibilityEnabled = PlayerPrefs.GetInt("AccessibilityEnabled", 1) == 1;
        gameDifficulty = PlayerPrefs.GetFloat("GameDifficulty", 1.0f);
    }

    private void SavePlayerPreferences()
    {
        // Save current settings
        PlayerPrefs.SetInt("AccessibilityEnabled", isAccessibilityEnabled ? 1 : 0);
        PlayerPrefs.SetFloat("GameDifficulty", gameDifficulty);
        PlayerPrefs.Save();
    }

    private void SetActiveUI(GameObject uiElement)
    {
        // Disable all UI elements
        if (mainMenu != null) mainMenu.SetActive(false);
        if (gameUI != null) gameUI.SetActive(false);
        if (pauseMenu != null) pauseMenu.SetActive(false);
        
        // Enable the requested UI element
        if (uiElement != null)
        {
            uiElement.SetActive(true);
        }
    }

    public void TogglePause()
    {
        bool isPaused = Time.timeScale == 0;
        
        if (isPaused)
        {
            // Resume game
            Time.timeScale = 1;
            SetActiveUI(gameUI);
        }
        else
        {
            // Pause game
            Time.timeScale = 0;
            SetActiveUI(pauseMenu);
        }
    }

    public void QuitGame()
    {
        SavePlayerPreferences();
        Debug.Log("Game session ended. Total play time: " + totalPlayTime + " seconds");
        
        // In editor, this doesn't do anything
        Application.Quit();
    }
}
