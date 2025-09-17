using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;
using UnityEngine.Animations.Rigging;
using System.Linq;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Editor wizard that automates the setup of the code-based animation system for Windgap Academy.
    /// This provides a one-click solution to add all necessary animation components to character models.
    /// </summary>
    public class AnimationSystemSetupWizard : EditorWindow
    {
        // Wizard configuration
        private string[] characterSearchPaths = new string[] { "Assets/Characters", "Assets/Models", "Assets/Prefabs" };
        private List<GameObject> detectedCharacters = new List<GameObject>();
        private List<bool> characterSelections = new List<bool>();
        private Vector2 scrollPosition;
        private bool createDemoScene = true;
        private bool setupReactBridge = true;
        private bool addDefaultAnimations = true;
        private bool addIKRigs = true;
        private bool addEmoteSystem = true;
        private bool showAdvancedOptions = false;
        private string statusMessage = "";

        // Character definition from React (for compatibility)
        [System.Serializable]
        private class CharacterDefinition
        {
            public string id;
            public string name;
            public string path;
            public AnimationDefinition[] animations;
            public string[] subjects;
        }

        [System.Serializable]
        private class AnimationDefinition
        {
            public string id;
            public string label;
            public string clipName;
        }

        [MenuItem("Windgap Academy/Animation System/Setup Wizard")]
        public static void ShowWindow()
        {
            GetWindow<AnimationSystemSetupWizard>("Animation System Setup");
        }

        private void OnEnable()
        {
            FindCharacterModels();
        }

        private void OnGUI()
        {
            GUILayout.Label("Animation System Setup Wizard", EditorStyles.boldLabel);
            EditorGUILayout.LabelField("This wizard will automatically set up the code-based animation system for your character models.", EditorStyles.wordWrappedLabel);
            EditorGUILayout.Space();

            // Character selection
            EditorGUILayout.LabelField("Select characters to set up:", EditorStyles.boldLabel);
            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition, GUILayout.Height(150));

            if (detectedCharacters.Count == 0)
            {
                EditorGUILayout.HelpBox("No character models detected. Make sure your characters are in one of these folders: " + string.Join(", ", characterSearchPaths), MessageType.Warning);
            }
            else
            {
                for (int i = 0; i < detectedCharacters.Count; i++)
                {
                    if (detectedCharacters[i] != null)
                    {
                        characterSelections[i] = EditorGUILayout.ToggleLeft(detectedCharacters[i].name, characterSelections[i]);
                    }
                }
            }

            EditorGUILayout.EndScrollView();

            if (GUILayout.Button("Refresh Character List"))
            {
                FindCharacterModels();
            }

            EditorGUILayout.Space();

            // Setup options
            EditorGUILayout.LabelField("Setup Options:", EditorStyles.boldLabel);
            addDefaultAnimations = EditorGUILayout.ToggleLeft("Add Default Animation System", addDefaultAnimations);
            addIKRigs = EditorGUILayout.ToggleLeft("Add IK Rigging for Procedural Animation", addIKRigs);
            addEmoteSystem = EditorGUILayout.ToggleLeft("Add Emote System", addEmoteSystem);
            setupReactBridge = EditorGUILayout.ToggleLeft("Setup React-Unity Bridge", setupReactBridge);
            createDemoScene = EditorGUILayout.ToggleLeft("Create Demo Scene", createDemoScene);

            // Advanced options
            showAdvancedOptions = EditorGUILayout.Foldout(showAdvancedOptions, "Advanced Options");
            if (showAdvancedOptions)
            {
                EditorGUI.indentLevel++;
                // Add advanced options here
                EditorGUI.indentLevel--;
            }

            EditorGUILayout.Space();

            // Status message
            if (!string.IsNullOrEmpty(statusMessage))
            {
                EditorGUILayout.HelpBox(statusMessage, MessageType.Info);
            }

            // Setup button
            GUI.enabled = detectedCharacters.Count > 0 && characterSelections.Any(s => s);
            if (GUILayout.Button("Setup Animation System"))
            {
                SetupAnimationSystem();
            }
            GUI.enabled = true;

            EditorGUILayout.Space();
            
            // Help and documentation
            EditorGUILayout.LabelField("Need help?", EditorStyles.boldLabel);
            if (GUILayout.Button("Open Documentation"))
            {
                // Open the documentation
                string docPath = "Assets/Documentation/unity-code-animation-guide.md";
                if (File.Exists(docPath))
                {
                    AssetDatabase.OpenAsset(AssetDatabase.LoadAssetAtPath<TextAsset>(docPath));
                }
                else
                {
                    Debug.LogWarning("Documentation not found at: " + docPath);
                }
            }
        }

        private void FindCharacterModels()
        {
            detectedCharacters.Clear();
            characterSelections.Clear();

            // Search for characters in the project
            foreach (string searchPath in characterSearchPaths)
            {
                if (Directory.Exists(searchPath))
                {
                    string[] guids = AssetDatabase.FindAssets("t:GameObject", new[] { searchPath });
                    foreach (string guid in guids)
                    {
                        string path = AssetDatabase.GUIDToAssetPath(guid);
                        GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                        
                        // Check if this is likely a character (has an Animator component)
                        if (prefab != null && prefab.GetComponent<Animator>() != null)
                        {
                            detectedCharacters.Add(prefab);
                            characterSelections.Add(true);
                        }
                    }
                }
            }

            // Also check if we can detect any GLB models that might be characters
            string[] modelGuids = AssetDatabase.FindAssets("t:Model");
            foreach (string guid in modelGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                if (path.EndsWith(".glb") || path.EndsWith(".fbx"))
                {
                    GameObject model = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                    if (model != null)
                    {
                        // Check if this is likely a character (has SkinnedMeshRenderer or bones)
                        if (model.GetComponentInChildren<SkinnedMeshRenderer>() != null)
                        {
                            detectedCharacters.Add(model);
                            characterSelections.Add(true);
                        }
                    }
                }
            }

            // Try to match with the character definitions from the React component
            // This is just for reference to show matching with the characters defined in CurriculumBuilderWithBlender.tsx
            Dictionary<string, CharacterDefinition> reactCharacters = new Dictionary<string, CharacterDefinition>
            {
                {
                    "winnie",
                    new CharacterDefinition
                    {
                        id = "winnie",
                        name = "Winnie",
                        path = "/assets/characters/winnie/winnie.glb",
                        animations = new[]
                        {
                            new AnimationDefinition { id = "idle", label = "Idle", clipName = "idle" },
                            new AnimationDefinition { id = "teaching", label = "Teaching", clipName = "teaching" },
                            new AnimationDefinition { id = "encourage", label = "Encourage", clipName = "encourage" },
                            new AnimationDefinition { id = "celebrate", label = "Celebrate", clipName = "celebrate" }
                        },
                        subjects = new[] { "Life Skills", "Digital Literacy" }
                    }
                },
                {
                    "natalie",
                    new CharacterDefinition
                    {
                        id = "natalie",
                        name = "Natalie",
                        path = "/assets/characters/natalie/natalie.glb",
                        animations = new[]
                        {
                            new AnimationDefinition { id = "idle", label = "Idle", clipName = "idle" },
                            new AnimationDefinition { id = "teaching", label = "Teaching", clipName = "teaching" }
                        },
                        subjects = new[] { "Employment Skills", "Digital Literacy" }
                    }
                }
            };

            // Match detected characters with React character definitions if possible
            foreach (var character in reactCharacters)
            {
                for (int i = 0; i < detectedCharacters.Count; i++)
                {
                    if (detectedCharacters[i].name.ToLower().Contains(character.Key.ToLower()))
                    {
                        // Mark as already detected
                        // In a more complete implementation, you might want to add metadata about the character
                    }
                }
            }

            statusMessage = $"Found {detectedCharacters.Count} potential character models.";
        }

        private void SetupAnimationSystem()
        {
            int setupCount = 0;
            GameObject demoSceneRoot = null;

            try
            {
                // Create the demo scene if requested
                if (createDemoScene)
                {
                    demoSceneRoot = CreateDemoScene();
                }

                // Set up each selected character
                for (int i = 0; i < detectedCharacters.Count; i++)
                {
                    if (characterSelections[i] && detectedCharacters[i] != null)
                    {
                        GameObject character = detectedCharacters[i];
                        
                        // Create a prefab instance for setup
                        GameObject characterInstance = PrefabUtility.InstantiatePrefab(character) as GameObject;
                        if (characterInstance == null)
                        {
                            // If not a prefab, just instantiate a copy
                            characterInstance = Instantiate(character);
                        }

                        // Set up the animation system on this character
                        SetupCharacterAnimationSystem(characterInstance);
                        
                        // Add to demo scene if created
                        if (demoSceneRoot != null)
                        {
                            characterInstance.transform.parent = demoSceneRoot.transform;
                            characterInstance.transform.localPosition = new Vector3(setupCount * 2.0f, 0, 0);
                            characterInstance.transform.localRotation = Quaternion.identity;
                        }

                        setupCount++;
                    }
                }

                statusMessage = $"Successfully set up animation system for {setupCount} characters.";
                
                // Save all assets
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();
            }
            catch (System.Exception ex)
            {
                Debug.LogError("Error setting up animation system: " + ex.Message);
                statusMessage = "Error: " + ex.Message;
            }
        }

        private void SetupCharacterAnimationSystem(GameObject character)
        {
            // Make sure we have an Animator component
            Animator animator = character.GetComponent<Animator>();
            if (animator == null)
            {
                animator = character.AddComponent<Animator>();
                Debug.Log($"Added Animator component to {character.name}");
            }

            // 1. Add the Animation Controller component
            if (addDefaultAnimations && character.GetComponent<AnimationController>() == null)
            {
                AnimationController animController = character.AddComponent<AnimationController>();
                Debug.Log($"Added AnimationController to {character.name}");
                
                // Set default animation clips if available
                // This would be more sophisticated in a real implementation, mapping to actual animation clips
            }

            // 2. Add the Animation Sequence Player
            if (addDefaultAnimations && character.GetComponent<AnimationSequencePlayer>() == null)
            {
                AnimationSequencePlayer sequencePlayer = character.AddComponent<AnimationSequencePlayer>();
                Debug.Log($"Added AnimationSequencePlayer to {character.name}");
            }

            // 3. Add the Procedural Animator and IK Rigs if requested
            if (addIKRigs)
            {
                // Only add if not already present
                if (character.GetComponent<ProceduralAnimator>() == null)
                {
                    ProceduralAnimator procAnimator = character.AddComponent<ProceduralAnimator>();
                    Debug.Log($"Added ProceduralAnimator to {character.name}");
                }

                // Set up the IK Rig
                SetupIKRig(character);
            }

            // 4. Add the Emote System if requested
            if (addEmoteSystem && character.GetComponent<EmoteSystem>() == null)
            {
                EmoteSystem emoteSystem = character.AddComponent<EmoteSystem>();
                Debug.Log($"Added EmoteSystem to {character.name}");
            }

            // 5. Add the React Animation Manager if requested
            if (setupReactBridge && character.GetComponent<ReactAnimationManager>() == null)
            {
                ReactAnimationManager reactManager = character.AddComponent<ReactAnimationManager>();
                Debug.Log($"Added ReactAnimationManager to {character.name}");
            }
        }

        private void SetupIKRig(GameObject character)
        {
            // Check if we already have a Rig component
            if (character.GetComponent<Rig>() != null)
            {
                Debug.Log($"IK Rig already set up for {character.name}");
                return;
            }

            // Add Rig component
            Rig rig = character.AddComponent<Rig>();
            
            // Create a RigBuilder if it doesn't exist
            RigBuilder rigBuilder = character.GetComponent<RigBuilder>();
            if (rigBuilder == null)
            {
                rigBuilder = character.AddComponent<RigBuilder>();
            }

            // Create a new layer for head look-at constraint
            GameObject headTarget = new GameObject("HeadLookTarget");
            headTarget.transform.parent = character.transform;
            headTarget.transform.localPosition = new Vector3(0, 1.7f, 2f); // Position in front of the character

            // Try to find the head bone
            Transform headBone = FindHeadBone(character);
            if (headBone != null)
            {
                // Create a multi-aim constraint for looking
                GameObject constraintGO = new GameObject("HeadLookConstraint");
                constraintGO.transform.parent = character.transform;
                
                MultiAimConstraint multiAim = constraintGO.AddComponent<MultiAimConstraint>();
                
                // Configure the constraint
                WeightedTransformArray targets = new WeightedTransformArray();
                targets.Add(new WeightedTransform(headTarget.transform, 1f));
                
                multiAim.data.constrainedObject = headBone;
                multiAim.data.sourceObjects = targets;
                multiAim.data.aimAxis = MultiAimConstraintData.Axis.Z;
                multiAim.data.upAxis = MultiAimConstraintData.Axis.Y;
                multiAim.data.maintainOffset = true;
                multiAim.data.offset = Vector3.zero;
                multiAim.data.limits = new Vector2(45f, 45f); // Limit the rotation to 45 degrees
                multiAim.data.weight = 1f;
                
                // Add the constraint to the rig builder
                var layers = new List<RigLayer>();
                foreach (var layer in rigBuilder.layers)
                {
                    layers.Add(layer);
                }
                layers.Add(new RigLayer(rig, true));
                rigBuilder.layers = layers.ToArray();
                
                Debug.Log($"Set up IK head look-at rig for {character.name}");
            }
            else
            {
                Debug.LogWarning($"Could not find head bone for {character.name}, IK setup may be incomplete");
            }

            // Similar setup for hand IK would be added here
        }

        private Transform FindHeadBone(GameObject character)
        {
            // Common head bone names
            string[] headBoneNames = new string[] 
            { 
                "head", "Head", "HEAD", "mixamorig:Head", "Bip01_Head",
                "Armature/Hips/Spine/Chest/Neck/Head", "Armature/Hips/Spine/Spine1/Spine2/Neck/Head"
            };

            // Try to find the head bone by name
            Transform headBone = null;
            
            foreach (string boneName in headBoneNames)
            {
                // Try direct lookup first
                headBone = character.transform.Find(boneName);
                if (headBone != null) return headBone;
                
                // Try searching in children
                headBone = FindChildRecursive(character.transform, boneName);
                if (headBone != null) return headBone;
            }

            // If not found by name, try to find by searching for "head" in the name
            SkinnedMeshRenderer[] renderers = character.GetComponentsInChildren<SkinnedMeshRenderer>();
            foreach (SkinnedMeshRenderer renderer in renderers)
            {
                if (renderer.bones.Length > 0)
                {
                    foreach (Transform bone in renderer.bones)
                    {
                        if (bone.name.ToLower().Contains("head"))
                        {
                            return bone;
                        }
                    }
                }
            }

            // If still not found, look for Animator and try to get the head bone
            Animator animator = character.GetComponent<Animator>();
            if (animator != null)
            {
                Transform head = animator.GetBoneTransform(HumanBodyBones.Head);
                if (head != null) return head;
            }

            return null;
        }

        private Transform FindChildRecursive(Transform parent, string name)
        {
            foreach (Transform child in parent)
            {
                if (child.name == name) return child;
                
                Transform found = FindChildRecursive(child, name);
                if (found != null) return found;
            }
            return null;
        }

        private GameObject CreateDemoScene()
        {
            // Create a new scene root
            GameObject demoRoot = new GameObject("AnimationSystemDemo");
            
            // Add a floor
            GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
            floor.transform.parent = demoRoot.transform;
            floor.transform.localScale = new Vector3(10, 1, 10);
            floor.transform.localPosition = Vector3.zero;
            
            // Add a directional light
            GameObject lightGO = new GameObject("DirectionalLight");
            lightGO.transform.parent = demoRoot.transform;
            Light light = lightGO.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.5f;
            lightGO.transform.rotation = Quaternion.Euler(50, -30, 0);
            
            // Add a camera
            GameObject cameraGO = new GameObject("DemoCamera");
            cameraGO.transform.parent = demoRoot.transform;
            Camera camera = cameraGO.AddComponent<Camera>();
            cameraGO.transform.position = new Vector3(0, 1.7f, -5);
            cameraGO.transform.LookAt(new Vector3(0, 1, 0));
            
            // Add UI for controlling animations
            GameObject canvasGO = new GameObject("DemoCanvas");
            canvasGO.transform.parent = demoRoot.transform;
            Canvas canvas = canvasGO.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasGO.AddComponent<UnityEngine.UI.CanvasScaler>();
            canvasGO.AddComponent<UnityEngine.UI.GraphicRaycaster>();

            // Add a demo script controller
            GameObject controllerGO = new GameObject("DemoController");
            controllerGO.transform.parent = demoRoot.transform;
            controllerGO.AddComponent<AnimationDemoController>();
            
            Debug.Log("Created animation demo scene");
            
            return demoRoot;
        }

        // Adds an empty component to satisfy compiler - in a real implementation this would be a full class
        private class AnimationDemoController : MonoBehaviour { }
    }
}