using UnityEngine;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Handles procedural animations for Windgap Academy characters
    /// This allows creating dynamic animations through code
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class ProceduralAnimator : MonoBehaviour
    {
        [Header("Head Look")]
        [SerializeField] private Transform headBone;
        [SerializeField] private float maxLookAngle = 60f;
        [SerializeField] private float lookSpeed = 5f;
        
        [Header("Hand Movement")]
        [SerializeField] private Transform leftHandBone;
        [SerializeField] private Transform rightHandBone;
        [SerializeField] private float handMovementSpeed = 3f;
        
        // Target positions
        private Vector3 headLookTarget;
        private Vector3 leftHandTarget;
        private Vector3 rightHandTarget;
        
        // Weight values for blending
        private float headLookWeight = 0f;
        private float leftHandWeight = 0f;
        private float rightHandWeight = 0f;
        
        // Components
        private Animator animator;
        
        private void Awake()
        {
            animator = GetComponent<Animator>();
            
            // Initialize targets to current positions
            if (headBone != null)
                headLookTarget = headBone.position + headBone.forward;
                
            if (leftHandBone != null)
                leftHandTarget = leftHandBone.position;
                
            if (rightHandBone != null)
                rightHandTarget = rightHandBone.position;
        }
        
        private void OnAnimatorIK(int layerIndex)
        {
            if (animator == null) return;
            
            // Head look IK
            if (headBone != null && headLookWeight > 0)
            {
                animator.SetLookAtPosition(headLookTarget);
                animator.SetLookAtWeight(headLookWeight);
            }
            
            // Hand IK
            if (leftHandBone != null && leftHandWeight > 0)
            {
                animator.SetIKPosition(AvatarIKGoal.LeftHand, leftHandTarget);
                animator.SetIKPositionWeight(AvatarIKGoal.LeftHand, leftHandWeight);
            }
            
            if (rightHandBone != null && rightHandWeight > 0)
            {
                animator.SetIKPosition(AvatarIKGoal.RightHand, rightHandTarget);
                animator.SetIKPositionWeight(AvatarIKGoal.RightHand, rightHandWeight);
            }
        }
        
        /// <summary>
        /// Make the character look at a position
        /// </summary>
        /// <param name="target">Target position</param>
        /// <param name="weight">Blend weight (0-1)</param>
        public void LookAt(Vector3 target, float weight = 1f)
        {
            headLookTarget = target;
            headLookWeight = Mathf.Clamp01(weight);
        }
        
        /// <summary>
        /// Stop looking at a target
        /// </summary>
        public void StopLooking()
        {
            headLookWeight = 0f;
        }
        
        /// <summary>
        /// Move the left hand to a position
        /// </summary>
        /// <param name="target">Target position</param>
        /// <param name="weight">Blend weight (0-1)</param>
        public void MoveLeftHandTo(Vector3 target, float weight = 1f)
        {
            leftHandTarget = target;
            leftHandWeight = Mathf.Clamp01(weight);
        }
        
        /// <summary>
        /// Move the right hand to a position
        /// </summary>
        /// <param name="target">Target position</param>
        /// <param name="weight">Blend weight (0-1)</param>
        public void MoveRightHandTo(Vector3 target, float weight = 1f)
        {
            rightHandTarget = target;
            rightHandWeight = Mathf.Clamp01(weight);
        }
        
        /// <summary>
        /// Reset hand positions
        /// </summary>
        public void ResetHandPositions()
        {
            leftHandWeight = 0f;
            rightHandWeight = 0f;
        }
        
        /// <summary>
        /// Make the character point at something with right hand
        /// </summary>
        /// <param name="target">Target to point at</param>
        public void PointAt(Vector3 target)
        {
            // Look at target
            LookAt(target, 0.8f);
            
            // Move right hand to pointing position
            Vector3 pointingDirection = (target - transform.position).normalized;
            Vector3 handPosition = transform.position + (transform.right * 0.3f) + (transform.up * 1.4f) + (pointingDirection * 0.5f);
            
            MoveRightHandTo(handPosition, 0.9f);
        }
        
        /// <summary>
        /// Stop pointing
        /// </summary>
        public void StopPointing()
        {
            StopLooking();
            ResetHandPositions();
        }
    }
}