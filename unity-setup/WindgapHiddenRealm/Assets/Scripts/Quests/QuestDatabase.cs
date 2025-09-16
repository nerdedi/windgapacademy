using System.Collections.Generic;
using UnityEngine;

namespace WindgapHiddenRealm.Quests
{
    [CreateAssetMenu(fileName = "QuestDatabase", menuName = "Windgap/Quests/Quest Database")]
    public class QuestDatabase : ScriptableObject
    {
        [SerializeField] private List<QuestData> quests = new List<QuestData>();
        
        private Dictionary<string, QuestData> questLookup = new Dictionary<string, QuestData>();
        
        public void Initialize()
        {
            questLookup.Clear();
            foreach (var quest in quests)
            {
                questLookup[quest.id] = quest;
            }
        }
        
        public Quest GetQuest(string questId)
        {
            if (questLookup.Count == 0)
            {
                Initialize();
            }
            
            if (questLookup.TryGetValue(questId, out QuestData questData))
            {
                return CreateQuestFromData(questData);
            }
            
            Debug.LogWarning($"Quest with ID {questId} not found in database");
            return null;
        }
        
        public List<Quest> GetAllQuests()
        {
            List<Quest> result = new List<Quest>();
            foreach (var questData in quests)
            {
                result.Add(CreateQuestFromData(questData));
            }
            return result;
        }
        
        private Quest CreateQuestFromData(QuestData data)
        {
            Quest quest = new Quest(data.id, data.title, data.description, data.experienceReward, data.questType);
            
            // Add item rewards
            foreach (var item in data.itemRewards)
            {
                quest.AddItemReward(item);
            }
            
            // Add prerequisite quests
            foreach (var prereq in data.prerequisiteQuestIds)
            {
                quest.AddPrerequisiteQuest(prereq);
            }
            
            // Add objectives
            foreach (var objectiveData in data.objectives)
            {
                QuestObjective objective = new QuestObjective(
                    objectiveData.id,
                    objectiveData.description,
                    objectiveData.targetProgress,
                    objectiveData.isHidden,
                    objectiveData.isOptional
                );
                
                quest.AddObjective(objective);
            }
            
            return quest;
        }
    }
    
    [System.Serializable]
    public class QuestData
    {
        public string id;
        public string title;
        public string description;
        public int experienceReward;
        public List<string> itemRewards = new List<string>();
        public QuestType questType;
        public List<QuestObjectiveData> objectives = new List<QuestObjectiveData>();
        public List<string> prerequisiteQuestIds = new List<string>();
    }
    
    [System.Serializable]
    public class QuestObjectiveData
    {
        public string id;
        public string description;
        public int targetProgress = 1;
        public bool isHidden = false;
        public bool isOptional = false;
    }
}