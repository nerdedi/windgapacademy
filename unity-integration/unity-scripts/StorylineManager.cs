using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// StorylineManager handles interactive stories in the Windgap Academy
/// </summary>
[AddComponentMenu("Windgap/StorylineManager")]
public class StorylineManager : MonoBehaviour
{
    // Reference to other managers
    [SerializeField] private CharacterManager characterManager;
    [SerializeField] private AnimationManager animationManager;
    
    // Story data
    [Serializable]
    public class StoryNode
    {
        public string id;
        public string characterName;
        public string dialogText;
        public string animationName;
        public bool isChoicePoint;
        public List<string> nextNodeIds = new List<string>();
    }
    
    [Serializable]
    public class Story
    {
        public string id;
        public string title;
        public string startNodeId;
        public List<StoryNode> nodes = new List<StoryNode>();
    }
    
    [SerializeField] private List<Story> stories = new List<Story>();
    
    // Current story state
    private Story currentStory;
    private StoryNode currentNode;
    private Coroutine storyCoroutine;
    
    // Dictionary for faster node lookup
    private Dictionary<string, Dictionary<string, StoryNode>> storyNodesMap = new Dictionary<string, Dictionary<string, StoryNode>>();
    
    // Initialize on Awake
    private void Awake()
    {
        // Find references if not set in inspector
        if (characterManager == null)
            characterManager = FindObjectOfType<CharacterManager>();
            
        if (animationManager == null)
            animationManager = FindObjectOfType<AnimationManager>();
            
        // Initialize story nodes dictionary
        InitializeStoryNodesMap();
    }
    
    /// <summary>
    /// Initialize the story nodes dictionary from inspector list
    /// </summary>
    private void InitializeStoryNodesMap()
    {
        foreach (Story story in stories)
        {
            Dictionary<string, StoryNode> nodesDict = new Dictionary<string, StoryNode>();
            
            foreach (StoryNode node in story.nodes)
            {
                nodesDict[node.id] = node;
            }
            
            storyNodesMap[story.id] = nodesDict;
        }
    }
    
    /// <summary>
    /// Start a story by ID
    /// </summary>
    /// <param name="storyId">Story ID to start</param>
    public void StartStory(string storyId)
    {
        // Find the story
        Story story = stories.Find(s => s.id == storyId);
        
        if (story == null)
        {
            Debug.LogWarning($"Story with ID '{storyId}' not found. Using default.");
            story = stories.Count > 0 ? stories[0] : null;
            
            if (story == null)
            {
                Debug.LogError("No stories available.");
                return;
            }
        }
        
        // Stop current story if running
        if (storyCoroutine != null)
        {
            StopCoroutine(storyCoroutine);
            storyCoroutine = null;
        }
        
        // Set current story
        currentStory = story;
        
        // Start story coroutine
        storyCoroutine = StartCoroutine(PlayStoryCoroutine(story.startNodeId));
    }
    
    /// <summary>
    /// Make a choice in the current story
    /// </summary>
    /// <param name="choiceIndex">Index of the choice made</param>
    public void MakeChoice(string choiceIndexStr)
    {
        // Parse choice index
        if (!int.TryParse(choiceIndexStr, out int choiceIndex))
        {
            Debug.LogError($"Invalid choice index: {choiceIndexStr}");
            return;
        }
        
        // Validate current state
        if (currentNode == null || !currentNode.isChoicePoint)
        {
            Debug.LogWarning("No choice point active.");
            return;
        }
        
        // Validate choice index
        if (choiceIndex < 0 || choiceIndex >= currentNode.nextNodeIds.Count)
        {
            Debug.LogError($"Choice index out of range: {choiceIndex}");
            return;
        }
        
        // Get next node ID
        string nextNodeId = currentNode.nextNodeIds[choiceIndex];
        
        // Continue story with the chosen node
        storyCoroutine = StartCoroutine(PlayStoryCoroutine(nextNodeId));
    }
    
    /// <summary>
    /// Play through a story from a given node
    /// </summary>
    private IEnumerator PlayStoryCoroutine(string nodeId)
    {
        // Get the nodes dictionary for the current story
        if (!storyNodesMap.ContainsKey(currentStory.id))
        {
            Debug.LogError($"Story nodes map not found for story: {currentStory.id}");
            yield break;
        }
        
        Dictionary<string, StoryNode> nodesDict = storyNodesMap[currentStory.id];
        
        // Process nodes until the end or a choice point
        bool storyComplete = false;
        
        while (!storyComplete)
        {
            // Get the current node
            if (!nodesDict.ContainsKey(nodeId))
            {
                Debug.LogError($"Node with ID '{nodeId}' not found in story: {currentStory.id}");
                storyComplete = true;
                break;
            }
            
            StoryNode node = nodesDict[nodeId];
            currentNode = node;
            
            // Set active character if specified
            if (!string.IsNullOrEmpty(node.characterName) && characterManager != null)
            {
                characterManager.SetActiveCharacter(node.characterName);
            }
            
            // Play animation if specified
            if (!string.IsNullOrEmpty(node.animationName) && animationManager != null)
            {
                animationManager.PlayAnimation(node.characterName, node.animationName);
            }
            
            // Send node info to React
            if (ReactBridgeManager.Instance != null)
            {
                ReactBridgeManager.Instance.SendToReact("STORY_NODE", node);
            }
            
            // If this is a choice point, wait for player input
            if (node.isChoicePoint)
            {
                break;
            }
            
            // Wait for dialog to be read (approximation based on text length)
            float readTime = Mathf.Max(2.0f, node.dialogText.Length * 0.05f);
            yield return new WaitForSeconds(readTime);
            
            // Move to the next node if available
            if (node.nextNodeIds.Count > 0)
            {
                nodeId = node.nextNodeIds[0];
            }
            else
            {
                storyComplete = true;
            }
        }
        
        // Story complete if we reached the end
        if (storyComplete)
        {
            currentNode = null;
            
            // Notify completion
            if (ReactBridgeManager.Instance != null)
            {
                ReactBridgeManager.Instance.SendToReact("STORY_COMPLETE", new { 
                    storyId = currentStory.id,
                    title = currentStory.title
                });
            }
        }
    }
}