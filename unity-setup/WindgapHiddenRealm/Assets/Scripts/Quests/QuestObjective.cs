using System;
using UnityEngine;

namespace WindgapHiddenRealm.Quests
{
    [Serializable]
    public class QuestObjective
    {
        [SerializeField] private string id;
        [SerializeField] private string description;
        [SerializeField] private int currentProgress;
        [SerializeField] private int targetProgress;
        [SerializeField] private bool isHidden;
        [SerializeField] private bool isOptional;
        [SerializeField] private bool isCompleted;

        public string Id => id;
        public string Description => description;
        public int CurrentProgress => currentProgress;
        public int TargetProgress => targetProgress;
        public bool IsHidden => isHidden;
        public bool IsOptional => isOptional;
        public bool IsCompleted => isCompleted;

        public event Action<QuestObjective> OnProgressUpdated;
        public event Action<QuestObjective> OnCompleted;

        public QuestObjective(string id, string description, int targetProgress, bool isHidden = false, bool isOptional = false)
        {
            this.id = id;
            this.description = description;
            this.targetProgress = targetProgress;
            this.isHidden = isHidden;
            this.isOptional = isOptional;
            this.currentProgress = 0;
            this.isCompleted = false;
        }

        public void UpdateProgress(int progress)
        {
            if (isCompleted)
                return;

            currentProgress = Mathf.Clamp(progress, 0, targetProgress);
            OnProgressUpdated?.Invoke(this);

            if (currentProgress >= targetProgress)
            {
                isCompleted = true;
                OnCompleted?.Invoke(this);
            }
        }

        public void SetComplete()
        {
            if (!isCompleted)
            {
                currentProgress = targetProgress;
                isCompleted = true;
                OnProgressUpdated?.Invoke(this);
                OnCompleted?.Invoke(this);
            }
        }

        public void Reveal()
        {
            isHidden = false;
        }

        public float GetProgressPercentage()
        {
            if (targetProgress == 0)
                return 0f;

            return (float)currentProgress / targetProgress;
        }
    }
}