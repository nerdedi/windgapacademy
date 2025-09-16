#!/bin/bash

# Setup Animation Rigging for Windgap Academy Unity Project
# This script helps set up animation rigging for character animations

echo "🚀 Windgap Academy - Animation Rigging Setup 🚀"
echo "====================================================="

# Define paths
UNITY_PROJECT_PATH=""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Ask for Unity project path
echo -e "${BLUE}Step 1: Unity Project Location${NC}"
echo "Please enter the absolute path to your Unity project:"
read -p "> " UNITY_PROJECT_PATH

if [ ! -d "$UNITY_PROJECT_PATH" ]; then
    echo -e "${RED}Error: The specified Unity project path does not exist.${NC}"
    exit 1
fi

# Step 2: Create animation setup script
echo -e "\n${BLUE}Step 2: Creating Animation Setup Scripts${NC}"

# Create animation setup script
ANIM_SCRIPT_PATH="$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Animation"
mkdir -p "$ANIM_SCRIPT_PATH"

echo "Creating character animator setup script..."
cat > "$ANIM_SCRIPT_PATH/CharacterAnimatorSetup.cs" << 'EOF'
using UnityEngine;
using UnityEngine.Animations.Rigging;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Sets up character animation rigging for Windgap Academy characters
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class CharacterAnimatorSetup : MonoBehaviour
    {
        [Header("Rig Setup")]
        public Transform headTarget;
        public Transform leftHandTarget;
        public Transform rightHandTarget;
        
        [Header("IK Settings")]
        [Range(0f, 1f)] public float headWeight = 1f;
        [Range(0f, 1f)] public float handsWeight = 1f;
        
        private Animator animator;
        private RigBuilder rigBuilder;
        
        private void Awake()
        {
            animator = GetComponent<Animator>();
            
            // Ensure the RigBuilder component is attached
            rigBuilder = GetComponent<RigBuilder>();
            if (rigBuilder == null)
            {
                rigBuilder = gameObject.AddComponent<RigBuilder>();
            }
            
            // Set up the rig layers if not already present
            if (rigBuilder.layers.Count == 0)
            {
                SetupRigLayers();
            }
        }
        
        private void SetupRigLayers()
        {
            // Create a new rig game object
            GameObject rigObject = new GameObject("Character_Rig");
            rigObject.transform.SetParent(transform);
            rigObject.transform.localPosition = Vector3.zero;
            rigObject.transform.localRotation = Quaternion.identity;
            
            // Create the main rig
            Rig mainRig = rigObject.AddComponent<Rig>();
            mainRig.weight = 1f;
            
            // Create rig layer and add to the RigBuilder
            var rigLayer = new RigLayer(mainRig);
            rigBuilder.layers.Add(rigLayer);
            
            // Set up head look-at constraint if target is available
            if (headTarget != null)
            {
                SetupHeadConstraint(rigObject);
            }
            
            // Set up hand constraints if targets are available
            if (leftHandTarget != null && rightHandTarget != null)
            {
                SetupHandConstraints(rigObject);
            }
            
            // Build the rig
            rigBuilder.Build();
        }
        
        private void SetupHeadConstraint(GameObject rigObject)
        {
            // Find the head bone
            Transform headBone = FindBoneRecursive(animator.GetBoneTransform(HumanBodyBones.Head), "Head");
            
            if (headBone != null)
            {
                // Create a multi-aim constraint for the head
                GameObject headConstraintObj = new GameObject("Head_LookAt");
                headConstraintObj.transform.SetParent(rigObject.transform);
                
                // Add the constraint component
                MultiAimConstraint headConstraint = headConstraintObj.AddComponent<MultiAimConstraint>();
                
                // Set up the constraint data
                headConstraint.data.constrainedObject = headBone;
                
                // Add the source object (target)
                var sourceObjects = new WeightedTransformArray();
                sourceObjects.Add(new WeightedTransform(headTarget, 1f));
                headConstraint.data.sourceObjects = sourceObjects;
                
                // Configure the constraint
                headConstraint.data.aimAxis = MultiAimConstraintData.Axis.Z;
                headConstraint.data.upAxis = MultiAimConstraintData.Axis.Y;
                headConstraint.data.maintainOffset = true;
                headConstraint.data.constrainedXAxis = true;
                headConstraint.data.constrainedYAxis = true;
                headConstraint.data.constrainedZAxis = false;
                headConstraint.data.limits = new Vector2(-40f, 40f);
                headConstraint.data.weight = headWeight;
            }
        }
        
        private void SetupHandConstraints(GameObject rigObject)
        {
            // Find the hand bones
            Transform leftHandBone = animator.GetBoneTransform(HumanBodyBones.LeftHand);
            Transform rightHandBone = animator.GetBoneTransform(HumanBodyBones.RightHand);
            
            if (leftHandBone != null)
            {
                // Create a constraint for the left hand
                GameObject leftHandObj = new GameObject("LeftHand_Target");
                leftHandObj.transform.SetParent(rigObject.transform);
                
                // Add the constraint component
                TwoBoneIKConstraint leftHandIK = leftHandObj.AddComponent<TwoBoneIKConstraint>();
                
                // Set up the constraint data
                leftHandIK.data.root = animator.GetBoneTransform(HumanBodyBones.LeftUpperArm);
                leftHandIK.data.mid = animator.GetBoneTransform(HumanBodyBones.LeftLowerArm);
                leftHandIK.data.tip = leftHandBone;
                leftHandIK.data.target = leftHandTarget;
                leftHandIK.data.maintainTargetPositionOffset = false;
                leftHandIK.data.maintainTargetRotationOffset = false;
                leftHandIK.data.weight = handsWeight;
            }
            
            if (rightHandBone != null)
            {
                // Create a constraint for the right hand
                GameObject rightHandObj = new GameObject("RightHand_Target");
                rightHandObj.transform.SetParent(rigObject.transform);
                
                // Add the constraint component
                TwoBoneIKConstraint rightHandIK = rightHandObj.AddComponent<TwoBoneIKConstraint>();
                
                // Set up the constraint data
                rightHandIK.data.root = animator.GetBoneTransform(HumanBodyBones.RightUpperArm);
                rightHandIK.data.mid = animator.GetBoneTransform(HumanBodyBones.RightLowerArm);
                rightHandIK.data.tip = rightHandBone;
                rightHandIK.data.target = rightHandTarget;
                rightHandIK.data.maintainTargetPositionOffset = false;
                rightHandIK.data.maintainTargetRotationOffset = false;
                rightHandIK.data.weight = handsWeight;
            }
        }
        
        private Transform FindBoneRecursive(Transform current, string boneName)
        {
            if (current == null) return null;
            
            if (current.name.Contains(boneName))
            {
                return current;
            }
            
            foreach (Transform child in current)
            {
                Transform found = FindBoneRecursive(child, boneName);
                if (found != null)
                {
                    return found;
                }
            }
            
            return null;
        }
        
        // Method to update rig weights at runtime
        public void UpdateRigWeights(float headWeightValue, float handsWeightValue)
        {
            headWeight = Mathf.Clamp01(headWeightValue);
            handsWeight = Mathf.Clamp01(handsWeightValue);
            
            if (rigBuilder != null && rigBuilder.layers.Count > 0)
            {
                // Update the constraint weights
                foreach (var constraint in GetComponentsInChildren<MultiAimConstraint>())
                {
                    constraint.data.weight = headWeight;
                }
                
                foreach (var constraint in GetComponentsInChildren<TwoBoneIKConstraint>())
                {
                    constraint.data.weight = handsWeight;
                }
            }
        }
    }
}
EOF

# Create animation controller script
cat > "$ANIM_SCRIPT_PATH/AnimationController.cs" << 'EOF'
using UnityEngine;
using System.Collections.Generic;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Controls animations for Windgap Academy characters
    /// Provides methods to trigger specific animations from React
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class AnimationController : MonoBehaviour
    {
        [Header("Animation Parameters")]
        [SerializeField] private string idleAnimName = "Idle";
        [SerializeField] private string talkAnimName = "Talk";
        [SerializeField] private string walkAnimName = "Walk";
        [SerializeField] private string jumpAnimName = "Jump";
        [SerializeField] private string celebrateAnimName = "Celebrate";
        [SerializeField] private string thinkAnimName = "Think";
        
        [Header("Animation Transitions")]
        [SerializeField] private float crossFadeDuration = 0.25f;
        
        // Animation states dictionary
        private Dictionary<string, int> animationStates = new Dictionary<string, int>();
        
        // Components
        private Animator animator;
        
        // Current animation tracking
        private string currentAnimation = string.Empty;
        
        private void Awake()
        {
            animator = GetComponent<Animator>();
            
            // Cache animation state hashes for faster lookup
            animationStates.Add("idle", Animator.StringToHash(idleAnimName));
            animationStates.Add("talk", Animator.StringToHash(talkAnimName));
            animationStates.Add("walk", Animator.StringToHash(walkAnimName));
            animationStates.Add("jump", Animator.StringToHash(jumpAnimName));
            animationStates.Add("celebrate", Animator.StringToHash(celebrateAnimName));
            animationStates.Add("think", Animator.StringToHash(thinkAnimName));
        }
        
        private void Start()
        {
            // Start with idle animation
            PlayAnimation("idle");
        }
        
        /// <summary>
        /// Play an animation by name
        /// </summary>
        /// <param name="animationName">Name of the animation to play (idle, talk, walk, jump, celebrate, think)</param>
        public void PlayAnimation(string animationName)
        {
            animationName = animationName.ToLower();
            
            if (animationStates.TryGetValue(animationName, out int stateHash))
            {
                // Don't play the same animation again if it's already playing
                if (currentAnimation == animationName)
                    return;
                    
                animator.CrossFade(stateHash, crossFadeDuration);
                currentAnimation = animationName;
                
                // Send animation started event to the ReactBridgeManager
                if (ReactBridgeManager.Instance != null)
                {
                    ReactBridgeManager.Instance.SendAnimationStarted(animationName, gameObject.name);
                }
            }
            else
            {
                Debug.LogWarning($"Animation '{animationName}' not found!");
            }
        }
        
        /// <summary>
        /// Check if an animation is currently playing
        /// </summary>
        public bool IsPlaying(string animationName)
        {
            return currentAnimation == animationName.ToLower();
        }
        
        /// <summary>
        /// Get the current animation name
        /// </summary>
        public string GetCurrentAnimation()
        {
            return currentAnimation;
        }
        
        /// <summary>
        /// Called by Animation Events at the end of animations
        /// </summary>
        public void OnAnimationComplete()
        {
            // If the current animation is not idle, return to idle
            if (currentAnimation != "idle")
            {
                PlayAnimation("idle");
                
                // Send animation completed event to the ReactBridgeManager
                if (ReactBridgeManager.Instance != null)
                {
                    ReactBridgeManager.Instance.SendAnimationCompleted(currentAnimation, gameObject.name);
                }
            }
        }
    }
}
EOF

echo -e "${GREEN}✅ Created animation setup scripts${NC}"

# Step 3: Create sample animation targets prefab script
echo -e "\n${BLUE}Step 3: Creating Animation Targets Prefab Script${NC}"

# Create prefab setup script
EDITOR_SCRIPT_PATH="$UNITY_PROJECT_PATH/Assets/Editor"
mkdir -p "$EDITOR_SCRIPT_PATH"

echo "Creating animation targets prefab script..."
cat > "$EDITOR_SCRIPT_PATH/CreateAnimationTargetsPrefab.cs" << 'EOF'
using UnityEngine;
using UnityEditor;
using System.IO;

namespace WindgapAcademy.Editor
{
    public class CreateAnimationTargetsPrefab
    {
        [MenuItem("Windgap/Create Animation Targets")]
        public static void CreateAnimationTargets()
        {
            // Create the targets parent GameObject
            GameObject targetsParent = new GameObject("AnimationTargets");
            
            // Create head target
            GameObject headTarget = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            headTarget.name = "HeadTarget";
            headTarget.transform.SetParent(targetsParent.transform);
            headTarget.transform.localPosition = new Vector3(0, 1.7f, 1f);
            headTarget.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
            
            // Create hand targets
            GameObject leftHandTarget = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leftHandTarget.name = "LeftHandTarget";
            leftHandTarget.transform.SetParent(targetsParent.transform);
            leftHandTarget.transform.localPosition = new Vector3(0.5f, 1.2f, 0.3f);
            leftHandTarget.transform.localScale = new Vector3(0.05f, 0.05f, 0.05f);
            
            GameObject rightHandTarget = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rightHandTarget.name = "RightHandTarget";
            rightHandTarget.transform.SetParent(targetsParent.transform);
            rightHandTarget.transform.localPosition = new Vector3(-0.5f, 1.2f, 0.3f);
            rightHandTarget.transform.localScale = new Vector3(0.05f, 0.05f, 0.05f);
            
            // Create a material for visualization
            Material targetMaterial = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            targetMaterial.color = Color.yellow;
            
            // Apply the material to the targets
            headTarget.GetComponent<Renderer>().material = targetMaterial;
            leftHandTarget.GetComponent<Renderer>().material = targetMaterial;
            rightHandTarget.GetComponent<Renderer>().material = targetMaterial;
            
            // Create directory if it doesn't exist
            string prefabDirectory = "Assets/_Project/Prefabs";
            if (!Directory.Exists(Path.Combine(Application.dataPath, "_Project/Prefabs")))
            {
                Directory.CreateDirectory(Path.Combine(Application.dataPath, "_Project/Prefabs"));
                AssetDatabase.Refresh();
            }
            
            // Create the prefab
            string prefabPath = Path.Combine(prefabDirectory, "AnimationTargets.prefab");
            bool success = false;
            
            PrefabUtility.SaveAsPrefabAsset(targetsParent, prefabPath, out success);
            
            // Cleanup the scene object
            Object.DestroyImmediate(targetsParent);
            
            if (success)
            {
                Debug.Log("Animation targets prefab created at: " + prefabPath);
                
                // Select the prefab in the Project window
                var prefabAsset = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
                Selection.activeObject = prefabAsset;
                EditorGUIUtility.PingObject(prefabAsset);
            }
            else
            {
                Debug.LogError("Failed to create animation targets prefab!");
            }
        }
    }
}
EOF

echo -e "${GREEN}✅ Created animation targets prefab script${NC}"

# Step 4: Final instructions
echo -e "\n${BLUE}Step 4: Next Steps${NC}"
echo -e "${GREEN}✅ Animation rigging setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Open your Unity project"
echo "2. Make sure you have the Animation Rigging package installed:"
echo "   - Window > Package Manager > + > Add package by name > com.unity.animation.rigging"
echo ""
echo "3. Create animation targets for your character:"
echo "   - In Unity, go to the menu: Windgap > Create Animation Targets"
echo "   - This will create a prefab with target objects for head and hands"
echo ""
echo "4. Set up a character with animation rigging:"
echo "   - Add your character model to the scene"
echo "   - Add the CharacterAnimatorSetup component to your character"
echo "   - Drag the created target objects to the respective fields"
echo ""
echo "5. Set up animation controller:"
echo "   - Add the AnimationController component to your character"
echo "   - Configure the animation parameter names to match your animation clips"
echo ""
echo -e "${YELLOW}Happy animating!${NC}"