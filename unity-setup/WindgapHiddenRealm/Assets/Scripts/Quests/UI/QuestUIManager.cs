using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace WindgapHiddenRealm.Quests.UI
{
    public class QuestUIManager : MonoBehaviour
    {
        [Header("UI References")]
        [SerializeField] private GameObject questLogPanel;
        [SerializeField] private GameObject questListContent;
        [SerializeField] private GameObject questDetailPanel;
        [SerializeField] private GameObject questPrefab;
        [SerializeField] private GameObject objectivePrefab;
        
        [Header("UI Components")]
        [SerializeField] private TextMeshProUGUI questTitleText;
        [SerializeField] private TextMeshProUGUI questDescriptionText;
        [SerializeField] private TextMeshProUGUI questRewardsText;
        [SerializeField] private Transform objectivesContainer;
        [SerializeField] private Button closeButton;
        [SerializeField] private Button trackQuestButton;
        [SerializeField] private Button abandonQuestButton;
        
        [Header("Tab UI")]
        [SerializeField] private Button activeQuestsTabButton;
        [SerializeField] private Button completedQuestsTabButton;
        [SerializeField] private Button availableQuestsTabButton;
        
        // Current state
        private List<Quest> displayedQuests = new List<Quest>();
        private Quest selectedQuest;
        private QuestListTab currentTab = QuestListTab.Active;
        
        private QuestManager questManager;
        private List<GameObject> questUIItems = new List<GameObject>();
        private List<GameObject> objectiveUIItems = new List<GameObject>();
        
        private void Awake()
        {
            questManager = QuestManager.Instance;
            
            // Initialize UI
            closeButton.onClick.AddListener(CloseQuestLog);
            trackQuestButton.onClick.AddListener(TrackSelectedQuest);
            abandonQuestButton.onClick.AddListener(AbandonSelectedQuest);
            
            // Tab buttons
            activeQuestsTabButton.onClick.AddListener(() => SwitchTab(QuestListTab.Active));
            completedQuestsTabButton.onClick.AddListener(() => SwitchTab(QuestListTab.Completed));
            availableQuestsTabButton.onClick.AddListener(() => SwitchTab(QuestListTab.Available));
            
            // Subscribe to quest events
            questManager.OnQuestAdded += OnQuestAdded;
            questManager.OnQuestStarted += OnQuestStarted;
            questManager.OnQuestCompleted += OnQuestCompleted;
            questManager.OnQuestFailed += OnQuestFailed;
            questManager.OnObjectiveCompleted += OnObjectiveCompleted;
            questManager.OnObjectiveUpdated += OnObjectiveUpdated;
            
            // Hide panels initially
            questLogPanel.SetActive(false);
            questDetailPanel.SetActive(false);
        }
        
        private void OnDestroy()
        {
            // Unsubscribe from events
            if (questManager != null)
            {
                questManager.OnQuestAdded -= OnQuestAdded;
                questManager.OnQuestStarted -= OnQuestStarted;
                questManager.OnQuestCompleted -= OnQuestCompleted;
                questManager.OnQuestFailed -= OnQuestFailed;
                questManager.OnObjectiveCompleted -= OnObjectiveCompleted;
                questManager.OnObjectiveUpdated -= OnObjectiveUpdated;
            }
        }
        
        public void ToggleQuestLog()
        {
            questLogPanel.SetActive(!questLogPanel.activeSelf);
            
            if (questLogPanel.activeSelf)
            {
                RefreshQuestList();
            }
            else
            {
                questDetailPanel.SetActive(false);
            }
        }
        
        public void CloseQuestLog()
        {
            questLogPanel.SetActive(false);
            questDetailPanel.SetActive(false);
        }
        
        public void SwitchTab(QuestListTab tab)
        {
            currentTab = tab;
            RefreshQuestList();
            
            // Update tab button states
            activeQuestsTabButton.interactable = tab != QuestListTab.Active;
            completedQuestsTabButton.interactable = tab != QuestListTab.Completed;
            availableQuestsTabButton.interactable = tab != QuestListTab.Available;
        }
        
        private void RefreshQuestList()
        {
            // Clear current quest items
            ClearQuestList();
            
            // Get quests based on selected tab
            switch (currentTab)
            {
                case QuestListTab.Active:
                    displayedQuests = questManager.GetActiveQuests();
                    break;
                case QuestListTab.Completed:
                    displayedQuests = questManager.GetCompletedQuests();
                    break;
                case QuestListTab.Available:
                    displayedQuests = questManager.GetAvailableQuests();
                    break;
            }
            
            // Create UI items for each quest
            foreach (var quest in displayedQuests)
            {
                CreateQuestListItem(quest);
            }
            
            // Hide details panel if no quests available
            if (displayedQuests.Count == 0)
            {
                questDetailPanel.SetActive(false);
                selectedQuest = null;
            }
        }
        
        private void ClearQuestList()
        {
            foreach (var item in questUIItems)
            {
                Destroy(item);
            }
            questUIItems.Clear();
        }
        
        private void CreateQuestListItem(Quest quest)
        {
            GameObject questItem = Instantiate(questPrefab, questListContent.transform);
            questUIItems.Add(questItem);
            
            // Set up quest item UI
            TextMeshProUGUI titleText = questItem.transform.Find("TitleText").GetComponent<TextMeshProUGUI>();
            TextMeshProUGUI typeText = questItem.transform.Find("TypeText").GetComponent<TextMeshProUGUI>();
            Image progressBar = questItem.transform.Find("ProgressBar").GetComponent<Image>();
            Button questButton = questItem.GetComponent<Button>();
            
            // Set data
            titleText.text = quest.Title;
            typeText.text = quest.QuestType.ToString();
            progressBar.fillAmount = quest.GetCompletionPercentage();
            
            // Color coding based on quest type
            Color questColor = GetQuestTypeColor(quest.QuestType);
            progressBar.color = questColor;
            
            // Set up button
            questButton.onClick.AddListener(() => SelectQuest(quest));
        }
        
        private void SelectQuest(Quest quest)
        {
            selectedQuest = quest;
            DisplayQuestDetails(quest);
        }
        
        private void DisplayQuestDetails(Quest quest)
        {
            questDetailPanel.SetActive(true);
            
            // Set basic info
            questTitleText.text = quest.Title;
            questDescriptionText.text = quest.Description;
            
            // Set rewards text
            string rewards = $"XP: {quest.ExperienceReward}";
            if (quest.ItemRewards.Count > 0)
            {
                rewards += "\nItems:";
                foreach (var item in quest.ItemRewards)
                {
                    rewards += $"\n- {item}";
                }
            }
            questRewardsText.text = rewards;
            
            // Clear previous objectives
            ClearObjectives();
            
            // Add objectives
            foreach (var objective in quest.Objectives)
            {
                if (!objective.IsHidden || quest.Status == QuestStatus.Completed)
                {
                    CreateObjectiveItem(objective);
                }
            }
            
            // Set button states based on quest status
            UpdateActionButtons(quest);
        }
        
        private void ClearObjectives()
        {
            foreach (var item in objectiveUIItems)
            {
                Destroy(item);
            }
            objectiveUIItems.Clear();
        }
        
        private void CreateObjectiveItem(QuestObjective objective)
        {
            GameObject objectiveItem = Instantiate(objectivePrefab, objectivesContainer);
            objectiveUIItems.Add(objectiveItem);
            
            TextMeshProUGUI descText = objectiveItem.transform.Find("DescriptionText").GetComponent<TextMeshProUGUI>();
            TextMeshProUGUI progressText = objectiveItem.transform.Find("ProgressText").GetComponent<TextMeshProUGUI>();
            Image progressBar = objectiveItem.transform.Find("ProgressBar").GetComponent<Image>();
            
            // Set data
            descText.text = objective.Description;
            progressText.text = $"{objective.CurrentProgress}/{objective.TargetProgress}";
            progressBar.fillAmount = objective.GetProgressPercentage();
            
            // Visual cue for completion
            if (objective.IsCompleted)
            {
                progressBar.color = Color.green;
            }
            else if (objective.IsOptional)
            {
                progressBar.color = Color.yellow;
            }
        }
        
        private void UpdateActionButtons(Quest quest)
        {
            // Track button only for active quests
            trackQuestButton.gameObject.SetActive(quest.Status == QuestStatus.InProgress);
            
            // Abandon button only for active quests
            abandonQuestButton.gameObject.SetActive(quest.Status == QuestStatus.InProgress);
        }
        
        private void TrackSelectedQuest()
        {
            if (selectedQuest != null && selectedQuest.Status == QuestStatus.InProgress)
            {
                // Implement quest tracking logic (e.g., highlight in HUD)
                Debug.Log($"Tracking quest: {selectedQuest.Title}");
            }
        }
        
        private void AbandonSelectedQuest()
        {
            if (selectedQuest != null && selectedQuest.Status == QuestStatus.InProgress)
            {
                // Implement quest abandonment logic
                questManager.FailQuest(selectedQuest.Id);
                RefreshQuestList();
            }
        }
        
        private Color GetQuestTypeColor(QuestType type)
        {
            switch (type)
            {
                case QuestType.Main:
                    return new Color(1f, 0.8f, 0.2f); // Gold
                case QuestType.Side:
                    return new Color(0.2f, 0.6f, 1f); // Blue
                case QuestType.Daily:
                    return new Color(0.2f, 0.8f, 0.2f); // Green
                case QuestType.Special:
                    return new Color(0.8f, 0.2f, 0.8f); // Purple
                case QuestType.Achievement:
                    return new Color(1f, 0.4f, 0.2f); // Orange
                default:
                    return Color.gray;
            }
        }
        
        #region Event Handlers
        private void OnQuestAdded(Quest quest)
        {
            if (currentTab == QuestListTab.Available)
            {
                RefreshQuestList();
            }
        }
        
        private void OnQuestStarted(Quest quest)
        {
            RefreshQuestList();
        }
        
        private void OnQuestCompleted(Quest quest)
        {
            RefreshQuestList();
        }
        
        private void OnQuestFailed(Quest quest)
        {
            RefreshQuestList();
        }
        
        private void OnObjectiveCompleted(Quest quest, QuestObjective objective)
        {
            if (selectedQuest == quest)
            {
                DisplayQuestDetails(quest);
            }
            else if (currentTab == QuestListTab.Active)
            {
                RefreshQuestList();
            }
        }
        
        private void OnObjectiveUpdated(Quest quest, QuestObjective objective, int progress)
        {
            if (selectedQuest == quest)
            {
                DisplayQuestDetails(quest);
            }
            else if (currentTab == QuestListTab.Active)
            {
                RefreshQuestList();
            }
        }
        #endregion
    }
    
    public enum QuestListTab
    {
        Active,
        Completed,
        Available
    }
}