using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Central system responsible for managing all character-related functionality.
    /// Handles character creation, customization, animations, and interactions.
    /// </summary>
    public class CharacterManager : MonoBehaviour
    {
        // Singleton instance
        public static CharacterManager Instance { get; private set; }

        // Character collections
        private Dictionary<string, CharacterInstance> activeCharacters = new Dictionary<string, CharacterInstance>();
        private Dictionary<string, CharacterDefinition> characterDefinitions = new Dictionary<string, CharacterDefinition>();

        // Player character reference
        public CharacterInstance PlayerCharacter { get; private set; }

        private void Awake()
        {
            // Singleton pattern
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            
            Instance = this;
            DontDestroyOnLoad(gameObject);
            
            // Initialize character definitions
            LoadCharacterDefinitions();
        }

        /// <summary>
        /// Loads all character definitions from Resources folder
        /// </summary>
        private void LoadCharacterDefinitions()
        {
            // In a real implementation, this would load from ScriptableObjects or JSON files
            Debug.Log("Loading character definitions...");
            
            // Placeholder for actual loading code
            // CharacterDefinition[] definitions = Resources.LoadAll<CharacterDefinition>("Characters");
            // foreach (var def in definitions)
            // {
            //     characterDefinitions[def.id] = def;
            // }
        }

        /// <summary>
        /// Creates a new character instance based on the specified definition
        /// </summary>
        public CharacterInstance CreateCharacter(string definitionId, Vector3 position, Quaternion rotation)
        {
            Debug.Log($"Creating character with definition ID: {definitionId}");
            
            // In a real implementation, this would instantiate a character prefab
            // and initialize it with the appropriate definition
            GameObject characterObject = new GameObject($"Character_{definitionId}");
            characterObject.transform.position = position;
            characterObject.transform.rotation = rotation;
            
            CharacterInstance instance = characterObject.AddComponent<CharacterInstance>();
            // instance.Initialize(characterDefinitions[definitionId]);
            
            // Add to active characters
            activeCharacters[instance.characterId] = instance;
            
            return instance;
        }

        /// <summary>
        /// Creates the player character
        /// </summary>
        public CharacterInstance CreatePlayerCharacter(string definitionId, Vector3 position, Quaternion rotation)
        {
            CharacterInstance player = CreateCharacter(definitionId, position, rotation);
            PlayerCharacter = player;
            return player;
        }

        /// <summary>
        /// Gets a character instance by ID
        /// </summary>
        public CharacterInstance GetCharacter(string characterId)
        {
            if (activeCharacters.TryGetValue(characterId, out CharacterInstance character))
            {
                return character;
            }
            
            Debug.LogWarning($"Character with ID {characterId} not found");
            return null;
        }

        /// <summary>
        /// Removes a character instance
        /// </summary>
        public void RemoveCharacter(string characterId)
        {
            if (activeCharacters.TryGetValue(characterId, out CharacterInstance character))
            {
                activeCharacters.Remove(characterId);
                Destroy(character.gameObject);
            }
        }
    }
}