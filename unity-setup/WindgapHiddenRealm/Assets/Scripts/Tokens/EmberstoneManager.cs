using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Tokens
{
    /// <summary>
    /// The Emberstone token system provides the core educational game mechanics
    /// It manages different token types that represent different learning goals and achievements
    /// </summary>
    public class EmberstoneManager : MonoBehaviour
    {
        // Singleton instance
        private static EmberstoneManager _instance;
        public static EmberstoneManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<EmberstoneManager>();
                    if (_instance == null)
                    {
                        GameObject obj = new GameObject("EmberstoneManager");
                        _instance = obj.AddComponent<EmberstoneManager>();
                    }
                }
                return _instance;
            }
        }
        
        // Token collection for the player
        private Dictionary<EmberstoneType, int> tokenInventory = new Dictionary<EmberstoneType, int>();
        
        // Token history for analytics and tracking
        private List<EmberstoneTransaction> tokenHistory = new List<EmberstoneTransaction>();
        
        // Events
        public event Action<EmberstoneType, int, string> OnTokensAdded;
        public event Action<EmberstoneType, int, string> OnTokensRemoved;
        public event Action<EmberstoneType, int> OnTokenBalanceChanged;
        
        private void Awake()
        {
            // Ensure singleton behavior
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            
            _instance = this;
            DontDestroyOnLoad(gameObject);
            
            // Initialize token inventory
            InitializeTokenInventory();
        }
        
        /// <summary>
        /// Initializes the token inventory with zero values for all token types
        /// </summary>
        private void InitializeTokenInventory()
        {
            foreach (EmberstoneType tokenType in Enum.GetValues(typeof(EmberstoneType)))
            {
                tokenInventory[tokenType] = 0;
            }
        }
        
        /// <summary>
        /// Adds tokens to the player's inventory
        /// </summary>
        /// <param name="tokenType">The type of token to add</param>
        /// <param name="amount">The amount of tokens to add</param>
        /// <param name="source">The source of the tokens (quest, challenge, etc.)</param>
        /// <returns>True if tokens were successfully added</returns>
        public bool AddTokens(EmberstoneType tokenType, int amount, string source)
        {
            if (amount <= 0)
            {
                Debug.LogWarning("Cannot add non-positive token amount");
                return false;
            }
            
            // Add tokens to inventory
            if (!tokenInventory.ContainsKey(tokenType))
            {
                tokenInventory[tokenType] = 0;
            }
            
            tokenInventory[tokenType] += amount;
            
            // Record transaction
            EmberstoneTransaction transaction = new EmberstoneTransaction
            {
                TokenType = tokenType,
                Amount = amount,
                Source = source,
                Timestamp = DateTime.Now,
                IsAddition = true
            };
            
            tokenHistory.Add(transaction);
            
            // Trigger events
            OnTokensAdded?.Invoke(tokenType, amount, source);
            OnTokenBalanceChanged?.Invoke(tokenType, tokenInventory[tokenType]);
            
            return true;
        }
        
        /// <summary>
        /// Removes tokens from the player's inventory
        /// </summary>
        /// <param name="tokenType">The type of token to remove</param>
        /// <param name="amount">The amount of tokens to remove</param>
        /// <param name="reason">The reason for removing tokens (purchase, etc.)</param>
        /// <returns>True if tokens were successfully removed</returns>
        public bool RemoveTokens(EmberstoneType tokenType, int amount, string reason)
        {
            if (amount <= 0)
            {
                Debug.LogWarning("Cannot remove non-positive token amount");
                return false;
            }
            
            // Check if player has enough tokens
            if (!tokenInventory.ContainsKey(tokenType) || tokenInventory[tokenType] < amount)
            {
                Debug.LogWarning($"Not enough {tokenType} tokens to remove");
                return false;
            }
            
            // Remove tokens from inventory
            tokenInventory[tokenType] -= amount;
            
            // Record transaction
            EmberstoneTransaction transaction = new EmberstoneTransaction
            {
                TokenType = tokenType,
                Amount = amount,
                Source = reason,
                Timestamp = DateTime.Now,
                IsAddition = false
            };
            
            tokenHistory.Add(transaction);
            
            // Trigger events
            OnTokensRemoved?.Invoke(tokenType, amount, reason);
            OnTokenBalanceChanged?.Invoke(tokenType, tokenInventory[tokenType]);
            
            return true;
        }
        
        /// <summary>
        /// Gets the current balance of a specific token type
        /// </summary>
        /// <param name="tokenType">The type of token to check</param>
        /// <returns>The current balance of the token type</returns>
        public int GetTokenBalance(EmberstoneType tokenType)
        {
            if (!tokenInventory.ContainsKey(tokenType))
            {
                return 0;
            }
            
            return tokenInventory[tokenType];
        }
        
        /// <summary>
        /// Gets all token balances
        /// </summary>
        /// <returns>A dictionary of all token balances</returns>
        public Dictionary<EmberstoneType, int> GetAllTokenBalances()
        {
            return new Dictionary<EmberstoneType, int>(tokenInventory);
        }
        
        /// <summary>
        /// Gets the token history for a specific token type
        /// </summary>
        /// <param name="tokenType">The type of token to check</param>
        /// <returns>A list of token transactions for the specified type</returns>
        public List<EmberstoneTransaction> GetTokenHistory(EmberstoneType tokenType)
        {
            return tokenHistory.FindAll(t => t.TokenType == tokenType);
        }
        
        /// <summary>
        /// Gets all token history
        /// </summary>
        /// <returns>A list of all token transactions</returns>
        public List<EmberstoneTransaction> GetAllTokenHistory()
        {
            return new List<EmberstoneTransaction>(tokenHistory);
        }
        
        /// <summary>
        /// Checks if the player has enough tokens of a specific type
        /// </summary>
        /// <param name="tokenType">The type of token to check</param>
        /// <param name="amount">The amount of tokens to check for</param>
        /// <returns>True if the player has enough tokens</returns>
        public bool HasEnoughTokens(EmberstoneType tokenType, int amount)
        {
            if (!tokenInventory.ContainsKey(tokenType))
            {
                return amount <= 0;
            }
            
            return tokenInventory[tokenType] >= amount;
        }
        
        /// <summary>
        /// Saves the token inventory and history to player prefs
        /// </summary>
        public void SaveTokenData()
        {
            // In a real implementation, this would use a more robust save system
            // For now, we'll just save to PlayerPrefs as a placeholder
            
            // Save token inventory
            foreach (var kvp in tokenInventory)
            {
                PlayerPrefs.SetInt($"TokenInventory_{kvp.Key}", kvp.Value);
            }
            
            // Save token history count
            PlayerPrefs.SetInt("TokenHistoryCount", tokenHistory.Count);
            
            // Save token history (simplified version)
            for (int i = 0; i < tokenHistory.Count; i++)
            {
                var transaction = tokenHistory[i];
                PlayerPrefs.SetInt($"TokenHistory_{i}_Type", (int)transaction.TokenType);
                PlayerPrefs.SetInt($"TokenHistory_{i}_Amount", transaction.Amount);
                PlayerPrefs.SetString($"TokenHistory_{i}_Source", transaction.Source);
                PlayerPrefs.SetString($"TokenHistory_{i}_Timestamp", transaction.Timestamp.ToString());
                PlayerPrefs.SetInt($"TokenHistory_{i}_IsAddition", transaction.IsAddition ? 1 : 0);
            }
            
            PlayerPrefs.Save();
        }
        
        /// <summary>
        /// Loads the token inventory and history from player prefs
        /// </summary>
        public void LoadTokenData()
        {
            // In a real implementation, this would use a more robust save system
            // For now, we'll just load from PlayerPrefs as a placeholder
            
            // Clear existing data
            tokenInventory.Clear();
            tokenHistory.Clear();
            
            // Load token inventory
            foreach (EmberstoneType tokenType in Enum.GetValues(typeof(EmberstoneType)))
            {
                tokenInventory[tokenType] = PlayerPrefs.GetInt($"TokenInventory_{tokenType}", 0);
            }
            
            // Load token history
            int historyCount = PlayerPrefs.GetInt("TokenHistoryCount", 0);
            for (int i = 0; i < historyCount; i++)
            {
                EmberstoneTransaction transaction = new EmberstoneTransaction
                {
                    TokenType = (EmberstoneType)PlayerPrefs.GetInt($"TokenHistory_{i}_Type"),
                    Amount = PlayerPrefs.GetInt($"TokenHistory_{i}_Amount"),
                    Source = PlayerPrefs.GetString($"TokenHistory_{i}_Source"),
                    Timestamp = DateTime.Parse(PlayerPrefs.GetString($"TokenHistory_{i}_Timestamp")),
                    IsAddition = PlayerPrefs.GetInt($"TokenHistory_{i}_IsAddition") == 1
                };
                
                tokenHistory.Add(transaction);
            }
            
            // Notify of token balances
            foreach (var kvp in tokenInventory)
            {
                OnTokenBalanceChanged?.Invoke(kvp.Key, kvp.Value);
            }
        }
        
        /// <summary>
        /// Resets all token data
        /// </summary>
        public void ResetTokenData()
        {
            tokenInventory.Clear();
            tokenHistory.Clear();
            
            InitializeTokenInventory();
            
            // Notify of token balances
            foreach (var kvp in tokenInventory)
            {
                OnTokenBalanceChanged?.Invoke(kvp.Key, kvp.Value);
            }
        }
    }
    
    /// <summary>
    /// Types of Emberstone tokens in the game
    /// </summary>
    public enum EmberstoneType
    {
        Knowledge,    // Earned through learning activities
        Creativity,   // Earned through creative problem-solving
        Empathy,      // Earned through helping others
        Resilience,   // Earned through overcoming challenges
        Collaboration,// Earned through group activities
        Curiosity,    // Earned through exploration
        Focus,        // Earned through sustained attention
        Reflection    // Earned through self-assessment
    }
    
    /// <summary>
    /// Represents a transaction in the token system
    /// </summary>
    [System.Serializable]
    public class EmberstoneTransaction
    {
        public EmberstoneType TokenType;
        public int Amount;
        public string Source;
        public DateTime Timestamp;
        public bool IsAddition;
    }
}