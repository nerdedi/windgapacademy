using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

namespace WindgapAcademy
{
    /// <summary>
    /// Main game manager for Windgap Academy Unity integration
    /// Handles communication with React frontend and manages game state
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        [Header("Game Settings")]
        public bool debugMode = true;
        public float gameSpeed = 1.0f;
        
        [Header("Character References")]
        public CharacterController natalieController;
        public CharacterController daisyController;
        public CharacterController andyController;
        public CharacterController winnieController;
        
        [Header("Scene Management")]
        public SceneTransitionManager sceneManager;
        public AudioManager audioManager;
        public UIManager uiManager;
        
        // Game State
        private GameState currentGameState;
        private LessonData currentLesson;
        private Dictionary<string, object> gameData;
        
        // Events
        public static event Action<GameState> OnGameStateChanged;
        public static event Action<LessonData> OnLessonStarted;
        public static event Action<LessonResult> OnLessonCompleted;
        
        private void Awake()
        {
            // Singleton pattern
            if (FindObjectsOfType<GameManager>().Length > 1)
            {
                Destroy(gameObject);
                return;
            }
            
            DontDestroyOnLoad(gameObject);
            InitializeGame();
        }
        
        private void InitializeGame()
        {
            gameData = new Dictionary<string, object>();
            currentGameState = GameState.Loading;
            
            // Initialize subsystems
            if (audioManager != null) audioManager.Initialize();
            if (uiManager != null) uiManager.Initialize();
            
            Debug.Log("Windgap Academy Game Manager Initialized");
        }
        
        #region React Communication Methods
        
        /// <summary>
        /// Called from React to start a lesson
        /// </summary>
        public void StartLesson(string lessonDataJson)
        {
            try
            {
                var lessonData = JsonConvert.DeserializeObject<LessonData>(lessonDataJson);
                StartCoroutine(StartLessonCoroutine(lessonData));
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to start lesson: {e.Message}");
                SendMessageToReact("LESSON_ERROR", new { error = e.Message });
            }
        }
        
        /// <summary>
        /// Called from React to update game settings
        /// </summary>
        public void UpdateGameSettings(string settingsJson)
        {
            try
            {
                var settings = JsonConvert.DeserializeObject<GameSettings>(settingsJson);
                ApplyGameSettings(settings);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to update settings: {e.Message}");
            }
        }
        
        /// <summary>
        /// Called from React to trigger character animations
        /// </summary>
        public void TriggerCharacterAnimation(string animationDataJson)
        {
            try
            {
                var animData = JsonConvert.DeserializeObject<CharacterAnimationData>(animationDataJson);
                TriggerAnimation(animData);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to trigger animation: {e.Message}");
            }
        }
        
        /// <summary>
        /// Called from React to pause/resume game
        /// </summary>
        public void SetGamePaused(string pausedJson)
        {
            try
            {
                var pauseData = JsonConvert.DeserializeObject<PauseData>(pausedJson);
                SetPaused(pauseData.isPaused);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to set pause state: {e.Message}");
            }
        }
        
        #endregion
        
        #region Lesson Management
        
        private IEnumerator StartLessonCoroutine(LessonData lessonData)
        {
            currentLesson = lessonData;
            ChangeGameState(GameState.LessonStarting);
            
            // Notify React that lesson is starting
            SendMessageToReact("LESSON_STARTING", new { lessonId = lessonData.lessonId });
            
            // Load lesson environment
            if (sceneManager != null)
            {
                yield return sceneManager.LoadLessonScene(lessonData.sceneId);
            }
            
            // Initialize characters for lesson
            InitializeCharactersForLesson(lessonData);
            
            // Start lesson
            ChangeGameState(GameState.LessonActive);
            OnLessonStarted?.Invoke(lessonData);
            
            // Notify React that lesson has started
            SendMessageToReact("LESSON_STARTED", new 
            { 
                lessonId = lessonData.lessonId,
                characters = GetActiveCharacters(),
                environment = lessonData.sceneId
            });
        }
        
        private void InitializeCharactersForLesson(LessonData lessonData)
        {
            // Activate required characters
            if (lessonData.characters.Contains("natalie") && natalieController != null)
            {
                natalieController.gameObject.SetActive(true);
                natalieController.InitializeForLesson(lessonData);
            }
            
            if (lessonData.characters.Contains("daisy") && daisyController != null)
            {
                daisyController.gameObject.SetActive(true);
                daisyController.InitializeForLesson(lessonData);
            }
            
            if (lessonData.characters.Contains("andy") && andyController != null)
            {
                andyController.gameObject.SetActive(true);
                andyController.InitializeForLesson(lessonData);
            }
            
            if (lessonData.characters.Contains("winnie") && winnieController != null)
            {
                winnieController.gameObject.SetActive(true);
                winnieController.InitializeForLesson(lessonData);
            }
        }
        
        public void CompleteLessonStep(LessonStepResult stepResult)
        {
            // Update lesson progress
            currentLesson.currentStep++;
            
            // Send progress update to React
            SendMessageToReact("LESSON_PROGRESS", new 
            {
                currentStep = currentLesson.currentStep,
                totalSteps = currentLesson.totalSteps,
                score = stepResult.score,
                timeElapsed = Time.time - currentLesson.startTime
            });
            
            // Check if lesson is complete
            if (currentLesson.currentStep >= currentLesson.totalSteps)
            {
                CompleteLessonCoroutine();
            }
        }
        
        private void CompleteLessonCoroutine()
        {
            var lessonResult = new LessonResult
            {
                lessonId = currentLesson.lessonId,
                finalScore = CalculateFinalScore(),
                completionTime = Time.time - currentLesson.startTime,
                achievements = GetEarnedAchievements()
            };
            
            ChangeGameState(GameState.LessonComplete);
            OnLessonCompleted?.Invoke(lessonResult);
            
            // Send completion data to React
            SendMessageToReact("LESSON_COMPLETE", lessonResult);
        }
        
        #endregion
        
        #region Animation Management
        
        private void TriggerAnimation(CharacterAnimationData animData)
        {
            CharacterController character = GetCharacterController(animData.characterId);
            if (character != null)
            {
                character.TriggerAnimation(animData.animationName, animData.parameters);
            }
        }
        
        private CharacterController GetCharacterController(string characterId)
        {
            return characterId.ToLower() switch
            {
                "natalie" => natalieController,
                "daisy" => daisyController,
                "andy" => andyController,
                "winnie" => winnieController,
                _ => null
            };
        }
        
        #endregion
        
        #region Utility Methods
        
        private void ChangeGameState(GameState newState)
        {
            if (currentGameState != newState)
            {
                currentGameState = newState;
                OnGameStateChanged?.Invoke(newState);
                
                if (debugMode)
                {
                    Debug.Log($"Game State Changed: {newState}");
                }
            }
        }
        
        private void ApplyGameSettings(GameSettings settings)
        {
            gameSpeed = settings.gameSpeed;
            Time.timeScale = gameSpeed;
            
            if (audioManager != null)
            {
                audioManager.SetMasterVolume(settings.audioVolume);
            }
        }
        
        private void SetPaused(bool isPaused)
        {
            Time.timeScale = isPaused ? 0f : gameSpeed;
            ChangeGameState(isPaused ? GameState.Paused : GameState.LessonActive);
        }
        
        private List<string> GetActiveCharacters()
        {
            var activeCharacters = new List<string>();
            
            if (natalieController != null && natalieController.gameObject.activeInHierarchy)
                activeCharacters.Add("natalie");
            if (daisyController != null && daisyController.gameObject.activeInHierarchy)
                activeCharacters.Add("daisy");
            if (andyController != null && andyController.gameObject.activeInHierarchy)
                activeCharacters.Add("andy");
            if (winnieController != null && winnieController.gameObject.activeInHierarchy)
                activeCharacters.Add("winnie");
                
            return activeCharacters;
        }
        
        private int CalculateFinalScore()
        {
            // Implement scoring logic based on lesson performance
            return 100; // Placeholder
        }
        
        private List<string> GetEarnedAchievements()
        {
            // Implement achievement logic
            return new List<string> { "lesson_complete" }; // Placeholder
        }
        
        /// <summary>
        /// Send message to React frontend
        /// </summary>
        private void SendMessageToReact(string messageType, object data)
        {
            var message = new
            {
                type = messageType,
                payload = data,
                timestamp = DateTime.UtcNow.ToString("O")
            };
            
            string jsonMessage = JsonConvert.SerializeObject(message);
            
            #if UNITY_WEBGL && !UNITY_EDITOR
            Application.ExternalCall("unityMessageHandler", jsonMessage);
            #else
            if (debugMode)
            {
                Debug.Log($"Message to React: {jsonMessage}");
            }
            #endif
        }
        
        #endregion
    }
    
    #region Data Classes
    
    [Serializable]
    public class LessonData
    {
        public string lessonId;
        public string sceneId;
        public List<string> characters;
        public int totalSteps;
        public int currentStep;
        public float startTime;
        public Dictionary<string, object> customData;
    }
    
    [Serializable]
    public class GameSettings
    {
        public float gameSpeed = 1.0f;
        public float audioVolume = 1.0f;
        public bool subtitlesEnabled = true;
        public string language = "en";
    }
    
    [Serializable]
    public class CharacterAnimationData
    {
        public string characterId;
        public string animationName;
        public Dictionary<string, object> parameters;
    }
    
    [Serializable]
    public class PauseData
    {
        public bool isPaused;
    }
    
    [Serializable]
    public class LessonStepResult
    {
        public int stepNumber;
        public int score;
        public bool isCorrect;
        public float timeToComplete;
    }
    
    [Serializable]
    public class LessonResult
    {
        public string lessonId;
        public int finalScore;
        public float completionTime;
        public List<string> achievements;
    }
    
    public enum GameState
    {
        Loading,
        MainMenu,
        LessonStarting,
        LessonActive,
        LessonComplete,
        Paused,
        Error
    }
    
    #endregion
}
