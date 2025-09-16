using System;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapHiddenRealm.Quests
{
    [Serializable]
    public class Quest
    {
        [SerializeField] private string id;
        [SerializeField] private string title;
        [SerializeField] private string description;
        [SerializeField] private int experienceReward;
        [SerializeField] private List<string> itemRewards = new List<string>();
        [SerializeField] private QuestType questType;
        [SerializeField] private List<QuestObjective> objectives = new List<QuestObjective>();
        [SerializeField] private QuestStatus status = QuestStatus.NotStarted;
        [SerializeField] private List<string> prerequisiteQuestIds = new List<string>();

        public string Id => id;
        public string Title => title;
        public string Description => description;
        public int ExperienceReward => experienceReward;
        public List<string> ItemRewards => itemRewards;
        public QuestType QuestType => questType;
        public List<QuestObjective> Objectives => objectives;
        public QuestStatus Status { get => status; private set => status = value; }
        public List<string> PrerequisiteQuestIds => prerequisiteQuestIds;
        
        public event Action<Quest> OnQuestStatusChanged;
        public event Action<Quest, QuestObjective> OnObjectiveCompleted;
        public event Action<Quest> OnQuestCompleted;

        public Quest(string id, string title, string description, int experienceReward, QuestType questType)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.experienceReward = experienceReward;
            this.questType = questType;
            this.status = QuestStatus.NotStarted;
        }

        public void AddObjective(QuestObjective objective)
        {
            objectives.Add(objective);
        }

        public void AddItemReward(string itemId)
        {
            itemRewards.Add(itemId);
        }

        public void AddPrerequisiteQuest(string questId)
        {
            prerequisiteQuestIds.Add(questId);
        }

        public void StartQuest()
        {
            if (Status == QuestStatus.NotStarted)
            {
                Status = QuestStatus.InProgress;
                OnQuestStatusChanged?.Invoke(this);
            }
        }

        public void UpdateObjective(string objectiveId, int progressValue)
        {
            QuestObjective objective = objectives.Find(o => o.Id == objectiveId);
            if (objective != null && Status == QuestStatus.InProgress)
            {
                objective.UpdateProgress(progressValue);
                
                if (objective.IsCompleted)
                {
                    OnObjectiveCompleted?.Invoke(this, objective);
                    CheckQuestCompletion();
                }
            }
        }

        private void CheckQuestCompletion()
        {
            if (objectives.TrueForAll(o => o.IsCompleted))
            {
                CompleteQuest();
            }
        }

        public void CompleteQuest()
        {
            if (Status == QuestStatus.InProgress)
            {
                Status = QuestStatus.Completed;
                OnQuestStatusChanged?.Invoke(this);
                OnQuestCompleted?.Invoke(this);
            }
        }

        public void FailQuest()
        {
            if (Status == QuestStatus.InProgress)
            {
                Status = QuestStatus.Failed;
                OnQuestStatusChanged?.Invoke(this);
            }
        }

        public bool CanBeStarted(List<string> completedQuestIds)
        {
            if (Status != QuestStatus.NotStarted)
                return false;

            // Check if all prerequisites are completed
            foreach (string prerequisiteId in prerequisiteQuestIds)
            {
                if (!completedQuestIds.Contains(prerequisiteId))
                    return false;
            }

            return true;
        }

        public float GetCompletionPercentage()
        {
            if (objectives.Count == 0)
                return 0f;

            int completedCount = 0;
            float totalProgress = 0f;

            foreach (var objective in objectives)
            {
                totalProgress += objective.GetProgressPercentage();
                if (objective.IsCompleted)
                    completedCount++;
            }

            return totalProgress / objectives.Count;
        }
    }

    public enum QuestStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Failed
    }

    public enum QuestType
    {
        Main,
        Side,
        Daily,
        Special,
        Achievement
    }
}