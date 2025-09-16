using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// ReactBridgeManager handles communication between Unity and React
/// This script should be attached to a GameObject in your Unity scene
/// </summary>
[AddComponentMenu("Windgap/ReactBridgeManager")]
public class ReactBridgeManager : MonoBehaviour
{
    // References to other managers
    [SerializeField] private CharacterManager characterManager;
    [SerializeField] private StorylineManager storylineManager;
    [SerializeField] private AnimationManager animationManager;
    
    // Singleton instance
    private static ReactBridgeManager _instance;
    public static ReactBridgeManager Instance { get { return _instance; } }
    
    // Initialize on Awake
    private void Awake()
    {
        // Singleton pattern
        if (_instance != null && _instance != this)
        {
            Destroy(this.gameObject);
        }
        else
        {
            _instance = this;
            DontDestroyOnLoad(this.gameObject);
        }
        
        // Find references if not set in inspector
        if (characterManager == null)
            characterManager = FindObjectOfType<CharacterManager>();
            
        if (storylineManager == null)
            storylineManager = FindObjectOfType<StorylineManager>();
            
        if (animationManager == null)
            animationManager = FindObjectOfType<AnimationManager>();
    }
    
    /// <summary>
    /// Receive message from React
    /// </summary>
    /// <param name="jsonMessage">JSON string containing the message data</param>
    public void ReceiveFromReact(string jsonMessage)
    {
        try
        {
            // Parse the JSON message
            ReactMessage message = JsonUtility.FromJson<ReactMessage>(jsonMessage);
            
            // Process the message based on action type
            switch (message.actionType)
            {
                case "INITIALIZE":
                    HandleInitialize(message);
                    break;
                    
                case "START_ANIMATION":
                    HandleStartAnimation(message);
                    break;
                    
                case "SET_CHARACTER":
                    HandleSetCharacter(message);
                    break;
                    
                case "START_STORY":
                    HandleStartStory(message);
                    break;
                    
                case "START_GAME":
                    HandleStartGame(message);
                    break;
                    
                case "SET_GAME_STATE":
                    HandleSetGameState(message);
                    break;
                    
                default:
                    Debug.LogWarning($"Unknown action type: {message.actionType}");
                    break;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Error processing message from React: {e.Message}");
        }
    }
    
    /// <summary>
    /// Send message to React
    /// </summary>
    /// <param name="actionType">Type of action</param>
    /// <param name="data">Data object to send</param>
    public void SendToReact(string actionType, object data)
    {
        // Convert data to JSON
        string jsonData = JsonUtility.ToJson(data);
        
        // Call the JavaScript function
        SendMessageToReact(actionType, jsonData);
    }
    
    /// <summary>
    /// Send message to React (JavaScript function)
    /// </summary>
    /// <param name="actionType">Type of action</param>
    /// <param name="jsonData">JSON string containing the data</param>
    private void SendMessageToReact(string actionType, string jsonData)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        // Call JavaScript function in WebGL build
        SendToReactJS(actionType, jsonData);
        #else
        // Log message in non-WebGL builds or Editor
        Debug.Log($"[UNITY] Sending to React: {actionType} - {jsonData}");
        #endif
    }
    
    #if UNITY_WEBGL && !UNITY_EDITOR
    // Import JavaScript function from Unity's browser interface
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendToReactJS(string actionType, string jsonData);
    #endif
    
    #region Message Handlers
    
    private void HandleInitialize(ReactMessage message)
    {
        // Extract initial state
        if (message.state != null)
        {
            // Set initial character if specified
            if (!string.IsNullOrEmpty(message.state.character))
            {
                if (characterManager != null)
                {
                    characterManager.SetActiveCharacter(message.state.character);
                }
            }
            
            // Start initial animation if specified
            if (!string.IsNullOrEmpty(message.state.startAnimation))
            {
                if (animationManager != null && characterManager != null)
                {
                    string character = message.state.character ?? characterManager.GetActiveCharacterName();
                    animationManager.PlayAnimation(character, message.state.startAnimation);
                }
            }
        }
        
        // Send confirmation back to React
        SendToReact("INITIALIZED", new { success = true });
    }
    
    private void HandleStartAnimation(ReactMessage message)
    {
        if (animationManager != null)
        {
            animationManager.PlayAnimation(message.characterName, message.animationName);
        }
    }
    
    private void HandleSetCharacter(ReactMessage message)
    {
        if (characterManager != null)
        {
            characterManager.SetActiveCharacter(message.characterName);
            
            // Notify React that character has changed
            SendToReact("CHARACTER_CHANGED", new { character = message.characterName });
        }
    }
    
    private void HandleStartStory(ReactMessage message)
    {
        if (storylineManager != null)
        {
            string storyId = message.storyId ?? "default";
            storylineManager.StartStory(storyId);
        }
    }
    
    private void HandleStartGame(ReactMessage message)
    {
        // Implementation for starting games
        Debug.Log($"Starting game: {message.gameType}");
    }
    
    private void HandleSetGameState(ReactMessage message)
    {
        // Implementation for setting game state
        Debug.Log("Setting game state");
    }
    
    #endregion
    
    #region Data Classes
    
    [Serializable]
    public class ReactMessage
    {
        public string actionType;
        public string characterName;
        public string animationName;
        public string storyId;
        public string gameType;
        public InitialState state;
    }
    
    [Serializable]
    public class InitialState
    {
        public string character;
        public string startAnimation;
    }
    
    #endregion
}