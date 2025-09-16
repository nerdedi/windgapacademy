using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace WindgapHiddenRealm.Quests
{
    public class QuestManager : MonoBehaviour
    {
        [SerializeField] private List<Quest> availableQuests = new List<Quest>();
        [SerializeField] private List<Quest> activeQuests = new List<Quest>();
        [SerializeField] private List<Quest> completedQuests = new List<Quest>();
        [SerializeField] private int maxActiveQuests = 10;

        // Events
        public event Action<Quest> OnQuestAdded;
        public event Action<Quest> OnQuestStarted;
        public event Action<Quest> OnQuestCompleted;
        public event Action<Quest> OnQuestFailed;
        public event Action<Quest, QuestObjective> OnObjectiveCompleted;
        public event Action<Quest, QuestObjective, int> OnObjectiveUpdated;

        private static QuestManager _instance;
        public static QuestManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<QuestManager>();
                    if (_instance == null)
                    {
                        GameObject obj = new GameObject("QuestManager");
                        _instance = obj.AddComponent<QuestManager>();
                    }
                }
                return _instance;
            }
        }

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
            
            LoadQuests();
        }

        private void LoadQuests()
        {
            // This would typically load from a data source
            // For now, we'll leave it empty and let quests be added manually
        }

        public void AddQuest(Quest quest)
        {
            if (!availableQuests.Contains(quest) && 
                !activeQuests.Contains(quest) && 
                !completedQuests.Contains(quest))
            {
                availableQuests.Add(quest);
                SubscribeToQuestEvents(quest);
                OnQuestAdded?.Invoke(quest);
            }
        }

        public bool StartQuest(string questId)
        {
            Quest quest = availableQuests.Find(q => q.Id == questId);
            
            if (quest != null && quest.CanBeStarted(GetCompletedQuestIds()) && activeQuests.Count < maxActiveQuests)
            {
                availableQuests.Remove(quest);
                activeQuests.Add(quest);
                quest.StartQuest();
                OnQuestStarted?.Invoke(quest);
                return true;
            }
            
            return false;
        }

        public void CompleteQuest(string questId)
        {
            Quest quest = activeQuests.Find(q => q.Id == questId);
            if (quest != null)
            {
                quest.CompleteQuest();
            }
        }

        public void FailQuest(string questId)
        {
            Quest quest = activeQuests.Find(q => q.Id == questId);
            if (quest != null)
            {
                quest.FailQuest();
            }
        }

        public void UpdateObjective(string questId, string objectiveId, int progressValue)
        {
            Quest quest = activeQuests.Find(q => q.Id == questId);
            if (quest != null)
            {
                quest.UpdateObjective(objectiveId, progressValue);
            }
        }

        public void UpdateObjectiveByType(string objectiveType, int progressValue)
        {
            // Update all active quests with objectives of the specified type
            foreach (var quest in activeQuests)
            {
                foreach (var objective in quest.Objectives.Where(o => o.Id.StartsWith(objectiveType)))
                {
                    quest.UpdateObjective(objective.Id, objective.CurrentProgress + progressValue);
                }
            }
        }

        public List<Quest> GetAvailableQuests()
        {
            return availableQuests.FindAll(q => q.CanBeStarted(GetCompletedQuestIds()));
        }

        public List<Quest> GetActiveQuests()
        {
            return activeQuests;
        }

        public List<Quest> GetCompletedQuests()
        {
            return completedQuests;
        }

        public Quest GetQuestById(string questId)
        {
            Quest quest = availableQuests.Find(q => q.Id == questId);
            if (quest != null) return quest;

            quest = activeQuests.Find(q => q.Id == questId);
            if (quest != null) return quest;

            quest = completedQuests.Find(q => q.Id == questId);
            return quest;
        }

        private List<string> GetCompletedQuestIds()
        {
            return completedQuests.Select(q => q.Id).ToList();
        }

        private void SubscribeToQuestEvents(Quest quest)
        {
            quest.OnQuestStatusChanged += HandleQuestStatusChanged;
            quest.OnObjectiveCompleted += HandleObjectiveCompleted;
            quest.OnQuestCompleted += HandleQuestCompleted;
        }

        private void UnsubscribeFromQuestEvents(Quest quest)
        {
            quest.OnQuestStatusChanged -= HandleQuestStatusChanged;
            quest.OnObjectiveCompleted -= HandleObjectiveCompleted;
            quest.OnQuestCompleted -= HandleQuestCompleted;
        }

        private void HandleQuestStatusChanged(Quest quest)
        {
            switch (quest.Status)
            {
                case QuestStatus.Completed:
                    if (activeQuests.Contains(quest))
                    {
                        activeQuests.Remove(quest);
                        completedQuests.Add(quest);
                        OnQuestCompleted?.Invoke(quest);
                    }
                    break;
                case QuestStatus.Failed:
                    if (activeQuests.Contains(quest))
                    {
                        activeQuests.Remove(quest);
                        OnQuestFailed?.Invoke(quest);
                    }
                    break;
            }
        }

        private void HandleObjectiveCompleted(Quest quest, QuestObjective objective)
        {
            OnObjectiveCompleted?.Invoke(quest, objective);
        }

        private void HandleQuestCompleted(Quest quest)
        {
            // Additional logic when a quest is completed
            // This could include saving progress, granting rewards, etc.
        }

        private void OnDestroy()
        {
            // Unsubscribe from all quest events to prevent memory leaks
            foreach (var quest in availableQuests.Concat(activeQuests).Concat(completedQuests))
            {
                UnsubscribeFromQuestEvents(quest);
            }
        }
    }
}