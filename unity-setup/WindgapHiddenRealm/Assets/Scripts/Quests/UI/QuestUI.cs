using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

namespace WindgapAcademy.Quests.UI
{
    /// <summary>
    /// Handles quest UI display and accessibility features
    /// </summary>
    public class QuestUI : MonoBehaviour
    {
        public GameObject questPanel;
        public TMP_Text questTitleText;
        public TMP_Text questDescriptionText;
        public TMP_Text objectivesText;
        public Button closeButton;

        private void Start()
        {
            if (closeButton != null)
                closeButton.onClick.AddListener(HidePanel);
        }

        public void ShowQuest(Quests.Quest quest)
        {
            questPanel.SetActive(true);
            questTitleText.text = quest.questName;
            questDescriptionText.text = quest.description;
            objectivesText.text = GetObjectivesText(quest.objectives);
        }

        public void HidePanel()
        {
            questPanel.SetActive(false);
        }

        private string GetObjectivesText(List<Quests.QuestObjective> objectives)
        {
            string result = "";
            foreach (var obj in objectives)
            {
                result += (obj.isCompleted ? "<color=green>✔</color> " : "<color=red>✗</color> ") + obj.description + "\n";
            }
            return result;
        }
    }
}
