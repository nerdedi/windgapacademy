using UnityEngine;

namespace WindgapAcademy.Quests
{
    /// <summary>
    /// Accessibility hooks for quest system (e.g., screen reader, haptics)
    /// </summary>
    public class QuestAccessibility : MonoBehaviour
    {
        public void AnnounceQuest(string questName, string description)
        {
            // Integrate with screen reader or TTS system
            Debug.Log($"[Accessibility] Quest: {questName} - {description}");
        }

        public void AnnounceObjective(string objectiveDesc)
        {
            // Integrate with screen reader or TTS system
            Debug.Log($"[Accessibility] Objective: {objectiveDesc}");
        }

        public void AnnounceCompletion(string questName)
        {
            // Integrate with screen reader or TTS system
            Debug.Log($"[Accessibility] Quest Completed: {questName}");
        }
    }
}
