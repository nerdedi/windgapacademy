using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace WindgapHiddenRealm.Quests
{
    public class QuestGiver : MonoBehaviour
    {
        [SerializeField] private List<string> availableQuestIds = new List<string>();
        [SerializeField] private float interactionDistance = 3f;
        [SerializeField] private LayerMask playerLayer;
        [SerializeField] private GameObject questAvailableIndicator;
        [SerializeField] private GameObject questCompletableIndicator;
        
        [Header("Events")]
        [SerializeField] private UnityEvent onQuestOffered;
        [SerializeField] private UnityEvent onQuestAccepted;
        [SerializeField] private UnityEvent onQuestCompleted;
        
        private QuestManager questManager;
        private bool isPlayerInRange = false;
        private GameObject currentPlayer;
        
        private void Start()
        {
            questManager = QuestManager.Instance;
            UpdateIndicators();
        }
        
        private void Update()
        {
            CheckForPlayerInRange();
            
            if (isPlayerInRange && Input.GetKeyDown(KeyCode.E))
            {
                InteractWithPlayer();
            }
        }
        
        private void CheckForPlayerInRange()
        {
            Collider[] hitColliders = Physics.OverlapSphere(transform.position, interactionDistance, playerLayer);
            
            if (hitColliders.Length > 0)
            {
                if (!isPlayerInRange)
                {
                    isPlayerInRange = true;
                    currentPlayer = hitColliders[0].gameObject;
                    // Show interaction prompt
                    ShowInteractionPrompt(true);
                }
            }
            else
            {
                if (isPlayerInRange)
                {
                    isPlayerInRange = false;
                    currentPlayer = null;
                    // Hide interaction prompt
                    ShowInteractionPrompt(false);
                }
            }
        }
        
        private void ShowInteractionPrompt(bool show)
        {
            // Implement UI prompt logic
        }
        
        private void InteractWithPlayer()
        {
            if (HasCompletableQuests())
            {
                CompleteQuests();
            }
            else if (HasAvailableQuests())
            {
                OfferQuests();
            }
            else
            {
                // Generic dialogue
                Debug.Log("NPC has no quests to offer");
            }
        }
        
        private bool HasAvailableQuests()
        {
            List<string> completedQuestIds = new List<string>();
            foreach (var quest in questManager.GetCompletedQuests())
            {
                completedQuestIds.Add(quest.Id);
            }
            
            foreach (var questId in availableQuestIds)
            {
                Quest quest = questManager.GetQuestById(questId);
                if (quest != null && quest.CanBeStarted(completedQuestIds))
                {
                    return true;
                }
            }
            
            return false;
        }
        
        private bool HasCompletableQuests()
        {
            foreach (var quest in questManager.GetActiveQuests())
            {
                if (availableQuestIds.Contains(quest.Id) && 
                    quest.Status == QuestStatus.InProgress && 
                    quest.GetCompletionPercentage() >= 1.0f)
                {
                    return true;
                }
            }
            
            return false;
        }
        
        private void OfferQuests()
        {
            // This would typically open a UI with available quests
            Debug.Log("Offering quests to player");
            onQuestOffered.Invoke();
            
            // For simplicity, we're auto-accepting the first available quest
            List<string> completedQuestIds = new List<string>();
            foreach (var quest in questManager.GetCompletedQuests())
            {
                completedQuestIds.Add(quest.Id);
            }
            
            foreach (var questId in availableQuestIds)
            {
                Quest quest = questManager.GetQuestById(questId);
                if (quest != null && quest.CanBeStarted(completedQuestIds))
                {
                    if (questManager.StartQuest(questId))
                    {
                        Debug.Log($"Started quest: {quest.Title}");
                        onQuestAccepted.Invoke();
                        UpdateIndicators();
                        break;
                    }
                }
            }
        }
        
        private void CompleteQuests()
        {
            // Complete all quests that are ready to be turned in
            foreach (var quest in questManager.GetActiveQuests())
            {
                if (availableQuestIds.Contains(quest.Id) && 
                    quest.Status == QuestStatus.InProgress && 
                    quest.GetCompletionPercentage() >= 1.0f)
                {
                    questManager.CompleteQuest(quest.Id);
                    Debug.Log($"Completed quest: {quest.Title}");
                    onQuestCompleted.Invoke();
                }
            }
            
            UpdateIndicators();
        }
        
        private void UpdateIndicators()
        {
            bool hasAvailable = HasAvailableQuests();
            bool hasCompletable = HasCompletableQuests();
            
            if (questAvailableIndicator != null)
            {
                questAvailableIndicator.SetActive(hasAvailable && !hasCompletable);
            }
            
            if (questCompletableIndicator != null)
            {
                questCompletableIndicator.SetActive(hasCompletable);
            }
        }
        
        // Used to add new quests to this NPC
        public void AddQuestToPool(string questId)
        {
            if (!availableQuestIds.Contains(questId))
            {
                availableQuestIds.Add(questId);
                UpdateIndicators();
            }
        }
        
        // Used to remove quests from this NPC
        public void RemoveQuestFromPool(string questId)
        {
            if (availableQuestIds.Contains(questId))
            {
                availableQuestIds.Remove(questId);
                UpdateIndicators();
            }
        }
        
        private void OnDrawGizmosSelected()
        {
            // Draw interaction range
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, interactionDistance);
        }
    }
}