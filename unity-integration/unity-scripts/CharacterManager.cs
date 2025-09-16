using UnityEngine;
using System;
using System.Collections.Generic;

/// <summary>
/// CharacterManager handles character selection and management in the Windgap Academy
/// </summary>
[AddComponentMenu("Windgap/CharacterManager")]
public class CharacterManager : MonoBehaviour
{
    // References to character prefabs
    [SerializeField] private GameObject winniePrefab;
    [SerializeField] private GameObject andyPrefab;
    [SerializeField] private GameObject daisyPrefab;
    [SerializeField] private GameObject nataliePrefab;
    
    // Currently active character
    private GameObject activeCharacter;
    private string activeCharacterName = "Winnie";
    
    // Character prefab dictionary
    private Dictionary<string, GameObject> characterPrefabs = new Dictionary<string, GameObject>();
    
    // Initialize on Awake
    private void Awake()
    {
        // Initialize character prefabs dictionary
        characterPrefabs["Winnie"] = winniePrefab;
        characterPrefabs["Andy"] = andyPrefab;
        characterPrefabs["Daisy"] = daisyPrefab;
        characterPrefabs["Natalie"] = nataliePrefab;
        
        // Set default character
        SetActiveCharacter("Winnie");
    }
    
    /// <summary>
    /// Set the active character by name
    /// </summary>
    /// <param name="characterName">Character name (Winnie, Andy, Daisy, Natalie)</param>
    public void SetActiveCharacter(string characterName)
    {
        // Validate character name
        if (!characterPrefabs.ContainsKey(characterName))
        {
            Debug.LogWarning($"Character '{characterName}' not found. Using default.");
            characterName = "Winnie";
        }
        
        // Deactivate current character if exists
        if (activeCharacter != null)
        {
            Destroy(activeCharacter);
        }
        
        // Instantiate new character
        GameObject prefab = characterPrefabs[characterName];
        if (prefab != null)
        {
            activeCharacter = Instantiate(prefab, Vector3.zero, Quaternion.identity);
            activeCharacterName = characterName;
            
            // Notify ReactBridgeManager
            if (ReactBridgeManager.Instance != null)
            {
                ReactBridgeManager.Instance.SendToReact("CHARACTER_CHANGED", new { character = characterName });
            }
        }
        else
        {
            Debug.LogError($"Character prefab for '{characterName}' is null.");
        }
    }
    
    /// <summary>
    /// Get the name of the currently active character
    /// </summary>
    /// <returns>Active character name</returns>
    public string GetActiveCharacterName()
    {
        return activeCharacterName;
    }
    
    /// <summary>
    /// Get the GameObject of the currently active character
    /// </summary>
    /// <returns>Active character GameObject</returns>
    public GameObject GetActiveCharacter()
    {
        return activeCharacter;
    }
}