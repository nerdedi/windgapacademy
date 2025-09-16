using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy.Quests
{
    /// <summary>
    /// Sample quest data for testing and demonstration
    /// </summary>
    public class QuestSampleData : MonoBehaviour
    {
        public List<Quest> GetSampleQuests()
        {
            var quest1 = new Quest("q001", "Find the Emberstone", "Locate and retrieve the lost Emberstone.");
            quest1.objectives.Add(new QuestObjective("o001", "Talk to the village elder."));
            quest1.objectives.Add(new QuestObjective("o002", "Search the forest for clues."));
            quest1.objectives.Add(new QuestObjective("o003", "Retrieve the Emberstone from the cave."));
            quest1.rewards.Add("Emberstone Token");

            var quest2 = new Quest("q002", "Help the Blacksmith", "Gather materials for the blacksmith's repairs.");
            quest2.objectives.Add(new QuestObjective("o004", "Collect 5 iron ores."));
            quest2.objectives.Add(new QuestObjective("o005", "Deliver ores to the blacksmith."));
            quest2.rewards.Add("Blacksmith's Hammer");

            return new List<Quest> { quest1, quest2 };
        }
    }
}
