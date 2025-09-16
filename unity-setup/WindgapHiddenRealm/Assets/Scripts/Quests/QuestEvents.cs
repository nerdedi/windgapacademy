using UnityEngine;
using UnityEngine.Events;

namespace WindgapAcademy.Quests
{
    /// <summary>
    /// Events for quest progress and completion, for accessibility hooks
    /// </summary>
    [System.Serializable]
    public class QuestEvents : MonoBehaviour
    {
        public UnityEvent onQuestStarted;
        public UnityEvent onQuestCompleted;
        public UnityEvent onObjectiveCompleted;

        public void QuestStarted()
        {
            onQuestStarted?.Invoke();
        }

        public void QuestCompleted()
        {
            onQuestCompleted?.Invoke();
        }

        public void ObjectiveCompleted()
        {
            onObjectiveCompleted?.Invoke();
        }
    }
}
