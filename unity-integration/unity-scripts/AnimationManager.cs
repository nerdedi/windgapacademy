using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// AnimationManager handles character animations in the Windgap Academy
/// </summary>
[AddComponentMenu("Windgap/AnimationManager")]
public class AnimationManager : MonoBehaviour
{
    // Reference to CharacterManager
    [SerializeField] private CharacterManager characterManager;
    
    // Animation clip references
    [System.Serializable]
    public class CharacterAnimations
    {
        public string characterName;
        public AnimationClip idleAnimation;
        public AnimationClip talkAnimation;
        public AnimationClip walkAnimation;
        public AnimationClip jumpAnimation;
        public AnimationClip celebrateAnimation;
        public AnimationClip thinkAnimation;
        // Add more animations as needed
    }
    
    [SerializeField] private List<CharacterAnimations> characterAnimationsList = new List<CharacterAnimations>();
    
    // Dictionary to store animations by character and name
    private Dictionary<string, Dictionary<string, AnimationClip>> animationsMap = new Dictionary<string, Dictionary<string, AnimationClip>>();
    
    // Currently playing animation
    private string currentAnimationName;
    private Coroutine currentAnimationCoroutine;
    
    // Initialize on Awake
    private void Awake()
    {
        // Find reference if not set in inspector
        if (characterManager == null)
            characterManager = FindObjectOfType<CharacterManager>();
            
        // Initialize animation dictionary
        InitializeAnimationMap();
    }
    
    /// <summary>
    /// Initialize the animation dictionary from inspector list
    /// </summary>
    private void InitializeAnimationMap()
    {
        foreach (CharacterAnimations characterAnims in characterAnimationsList)
        {
            Dictionary<string, AnimationClip> animsDict = new Dictionary<string, AnimationClip>();
            
            // Add all animations to dictionary
            if (characterAnims.idleAnimation != null)
                animsDict["Idle"] = characterAnims.idleAnimation;
                
            if (characterAnims.talkAnimation != null)
                animsDict["Talk"] = characterAnims.talkAnimation;
                
            if (characterAnims.walkAnimation != null)
                animsDict["Walk"] = characterAnims.walkAnimation;
                
            if (characterAnims.jumpAnimation != null)
                animsDict["Jump"] = characterAnims.jumpAnimation;
                
            if (characterAnims.celebrateAnimation != null)
                animsDict["Celebrate"] = characterAnims.celebrateAnimation;
                
            if (characterAnims.thinkAnimation != null)
                animsDict["Think"] = characterAnims.thinkAnimation;
            
            // Add to main dictionary
            animationsMap[characterAnims.characterName] = animsDict;
        }
    }
    
    /// <summary>
    /// Play an animation for a character
    /// </summary>
    /// <param name="characterName">Character name</param>
    /// <param name="animationName">Animation name</param>
    public void PlayAnimation(string characterName, string animationName)
    {
        // Ensure character manager is available
        if (characterManager == null)
        {
            Debug.LogError("CharacterManager reference is missing");
            return;
        }
        
        // Get active character if not specified
        if (string.IsNullOrEmpty(characterName))
        {
            characterName = characterManager.GetActiveCharacterName();
        }
        
        // Check if animations exist for this character
        if (!animationsMap.ContainsKey(characterName))
        {
            Debug.LogWarning($"No animations found for character: {characterName}");
            return;
        }
        
        // Check if the specific animation exists
        Dictionary<string, AnimationClip> characterAnims = animationsMap[characterName];
        if (!characterAnims.ContainsKey(animationName))
        {
            Debug.LogWarning($"Animation '{animationName}' not found for character: {characterName}");
            return;
        }
        
        // Stop current animation if playing
        if (currentAnimationCoroutine != null)
        {
            StopCoroutine(currentAnimationCoroutine);
        }
        
        // Play the new animation
        AnimationClip clip = characterAnims[animationName];
        currentAnimationName = animationName;
        
        // Start animation coroutine
        currentAnimationCoroutine = StartCoroutine(PlayAnimationCoroutine(characterName, animationName, clip));
    }
    
    /// <summary>
    /// Play animation coroutine
    /// </summary>
    private IEnumerator PlayAnimationCoroutine(string characterName, string animationName, AnimationClip clip)
    {
        // Get the character's animator
        GameObject character = characterManager.GetActiveCharacter();
        if (character == null)
        {
            Debug.LogError("Active character is null");
            yield break;
        }
        
        Animator animator = character.GetComponent<Animator>();
        if (animator == null)
        {
            Debug.LogError("Character has no Animator component");
            yield break;
        }
        
        // Play the animation
        animator.Play(animationName);
        
        // Wait for the animation to complete
        float animationLength = clip.length;
        yield return new WaitForSeconds(animationLength);
        
        // Notify completion
        if (ReactBridgeManager.Instance != null)
        {
            ReactBridgeManager.Instance.SendToReact("ANIMATION_COMPLETE", new { 
                animationName = animationName,
                character = characterName
            });
        }
        
        // Reset to idle if not already
        if (animationName != "Idle")
        {
            PlayAnimation(characterName, "Idle");
        }
        
        currentAnimationCoroutine = null;
    }
}