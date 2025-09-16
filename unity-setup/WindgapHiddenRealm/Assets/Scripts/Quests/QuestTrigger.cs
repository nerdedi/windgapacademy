using UnityEngine;
using UnityEngine.Events;

namespace WindgapHiddenRealm.Quests
{
    public class QuestTrigger : MonoBehaviour
    {
        [SerializeField] private string questId;
        [SerializeField] private string objectiveId;
        [SerializeField] private int progressValue = 1;
        [SerializeField] private bool destroyAfterTriggered = true;
        [SerializeField] private bool requiresActivation = false;
        [SerializeField] private bool onlyIfQuestActive = true;
        [SerializeField] private LayerMask triggerLayers;
        
        [Header("Events")]
        [SerializeField] private UnityEvent onTriggerActivated;
        
        private QuestManager questManager;
        private bool hasBeenTriggered = false;
        
        private void Start()
        {
            questManager = QuestManager.Instance;
        }
        
        private void OnTriggerEnter(Collider other)
        {
            if (!requiresActivation && !hasBeenTriggered && IsInLayerMask(other.gameObject.layer))
            {
                TriggerQuestUpdate();
            }
        }
        
        public void Activate()
        {
            if (!hasBeenTriggered && requiresActivation)
            {
                TriggerQuestUpdate();
            }
        }
        
        private void TriggerQuestUpdate()
        {
            if (string.IsNullOrEmpty(questId) || string.IsNullOrEmpty(objectiveId))
            {
                Debug.LogWarning("Quest Trigger is missing questId or objectiveId");
                return;
            }
            
            Quest quest = questManager.GetQuestById(questId);
            
            if (quest == null)
            {
                Debug.LogWarning($"Quest with ID {questId} not found");
                return;
            }
            
            if (onlyIfQuestActive && quest.Status != QuestStatus.InProgress)
            {
                return;
            }
            
            questManager.UpdateObjective(questId, objectiveId, progressValue);
            hasBeenTriggered = true;
            onTriggerActivated.Invoke();
            
            if (destroyAfterTriggered)
            {
                Destroy(gameObject);
            }
        }
        
        private bool IsInLayerMask(int layer)
        {
            return ((1 << layer) & triggerLayers) != 0;
        }
    }
}