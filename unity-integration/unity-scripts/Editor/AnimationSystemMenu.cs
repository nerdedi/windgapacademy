using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

namespace WindgapAcademy.Animation
{
    /// <summary>
    /// Menu items for the Windgap Academy Animation System.
    /// Provides quick access to common tasks and documentation.
    /// </summary>
    public static class AnimationSystemMenu
    {
        [MenuItem("Windgap Academy/Animation System/Open Setup Wizard")]
        private static void OpenSetupWizard()
        {
            AnimationSystemSetupWizard.ShowWindow();
        }

        [MenuItem("Windgap Academy/Animation System/Quick Setup Selected Character")]
        private static void QuickSetupSelectedCharacter()
        {
            if (Selection.activeGameObject == null)
            {
                EditorUtility.DisplayDialog("No Character Selected", 
                    "Please select a character GameObject in the Hierarchy or Project view.", "OK");
                return;
            }

            GameObject character = Selection.activeGameObject;
            
            // Check if this is likely a character
            if (character.GetComponent<Animator>() == null && 
                character.GetComponentInChildren<SkinnedMeshRenderer>() == null)
            {
                bool proceed = EditorUtility.DisplayDialog("Warning", 
                    "The selected GameObject doesn't appear to be a character (no Animator or SkinnedMeshRenderer found). " +
                    "Do you want to proceed anyway?", "Yes", "No");
                
                if (!proceed)
                {
                    return;
                }
            }
            
            // Add the necessary components
            QuickSetupCharacter(character);
            
            // Save the changes
            EditorUtility.SetDirty(character);
            AssetDatabase.SaveAssets();
        }

        [MenuItem("Windgap Academy/Animation System/Create New Demo Scene")]
        private static void CreateNewDemoScene()
        {
            // Create a new scene for the demo
            string scenePath = "Assets/Scenes/AnimationDemo.unity";
            
            // Check if the scenes folder exists
            if (!Directory.Exists("Assets/Scenes"))
            {
                Directory.CreateDirectory("Assets/Scenes");
            }
            
            // Check if the scene already exists
            if (File.Exists(scenePath))
            {
                bool overwrite = EditorUtility.DisplayDialog("Scene Already Exists", 
                    "The AnimationDemo scene already exists. Do you want to overwrite it?", 
                    "Overwrite", "Cancel");
                
                if (!overwrite)
                {
                    return;
                }
            }
            
            // Create a new scene
            UnityEngine.SceneManagement.Scene scene = EditorSceneManager.NewScene(
                NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            
            // Set up the demo scene
            SetupDemoScene();
            
            // Save the scene
            EditorSceneManager.SaveScene(scene, scenePath);
            Debug.Log($"Created new demo scene at {scenePath}");
        }

        [MenuItem("Windgap Academy/Animation System/Open Documentation")]
        private static void OpenDocumentation()
        {
            string[] docPaths = new string[]
            {
                "Assets/Documentation/unity-code-animation-guide.md",
                "Assets/Documentation/animation-rigging-guide.md",
                "Assets/Docs/unity-code-animation-guide.md",
                "Assets/Docs/animation-rigging-guide.md"
            };
            
            foreach (string path in docPaths)
            {
                if (File.Exists(path))
                {
                    AssetDatabase.OpenAsset(AssetDatabase.LoadAssetAtPath<TextAsset>(path));
                    return;
                }
            }
            
            // If documentation not found in Assets, check in the project root
            string projectPath = Application.dataPath.Substring(0, Application.dataPath.Length - 7);
            string[] externalDocPaths = new string[]
            {
                Path.Combine(projectPath, "docs/unity-code-animation-guide.md"),
                Path.Combine(projectPath, "docs/animation-rigging-guide.md")
            };
            
            foreach (string path in externalDocPaths)
            {
                if (File.Exists(path))
                {
                    System.Diagnostics.Process.Start(path);
                    return;
                }
            }
            
            Debug.LogWarning("Documentation not found. Please import the documentation files first.");
            
            // Offer to create documentation
            bool createDocs = EditorUtility.DisplayDialog("Documentation Not Found", 
                "Documentation files not found. Would you like to create them now?", 
                "Create Documentation", "Cancel");
            
            if (createDocs)
            {
                CreateDocumentation();
            }
        }

        private static void QuickSetupCharacter(GameObject character)
        {
            Debug.Log($"Setting up animation system for {character.name}...");
            
            // Make sure we have an Animator component
            Animator animator = character.GetComponent<Animator>();
            if (animator == null)
            {
                animator = character.AddComponent<Animator>();
                Debug.Log($"Added Animator component to {character.name}");
            }
            
            // Add the Animation Controller component
            if (character.GetComponent<AnimationController>() == null)
            {
                character.AddComponent<AnimationController>();
                Debug.Log($"Added AnimationController to {character.name}");
            }
            
            // Add the Animation Sequence Player
            if (character.GetComponent<AnimationSequencePlayer>() == null)
            {
                character.AddComponent<AnimationSequencePlayer>();
                Debug.Log($"Added AnimationSequencePlayer to {character.name}");
            }
            
            // Add the Procedural Animator
            if (character.GetComponent<ProceduralAnimator>() == null)
            {
                character.AddComponent<ProceduralAnimator>();
                Debug.Log($"Added ProceduralAnimator to {character.name}");
            }
            
            // Add the Emote System
            if (character.GetComponent<EmoteSystem>() == null)
            {
                character.AddComponent<EmoteSystem>();
                Debug.Log($"Added EmoteSystem to {character.name}");
            }
            
            // Add the React Animation Manager
            if (character.GetComponent<ReactAnimationManager>() == null)
            {
                character.AddComponent<ReactAnimationManager>();
                Debug.Log($"Added ReactAnimationManager to {character.name}");
            }
            
            Debug.Log($"Successfully set up animation system for {character.name}");
        }

        private static void SetupDemoScene()
        {
            // Create a demo controller
            GameObject demoController = new GameObject("AnimationDemoController");
            demoController.AddComponent<AnimationDemoController>();
            
            // Create UI for controlling animations
            GameObject canvasGO = new GameObject("DemoCanvas");
            Canvas canvas = canvasGO.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasGO.AddComponent<UnityEngine.UI.CanvasScaler>();
            canvasGO.AddComponent<UnityEngine.UI.GraphicRaycaster>();
            
            // Add a panel for controls
            GameObject panelGO = new GameObject("ControlPanel");
            panelGO.transform.parent = canvasGO.transform;
            UnityEngine.UI.Image panel = panelGO.AddComponent<UnityEngine.UI.Image>();
            panel.color = new Color(0.1f, 0.1f, 0.1f, 0.8f);
            RectTransform panelRect = panel.GetComponent<RectTransform>();
            panelRect.anchorMin = new Vector2(0, 0);
            panelRect.anchorMax = new Vector2(1, 0.2f);
            panelRect.offsetMin = new Vector2(10, 10);
            panelRect.offsetMax = new Vector2(-10, 0);
            
            // Add a title
            GameObject titleGO = new GameObject("Title");
            titleGO.transform.parent = panelGO.transform;
            UnityEngine.UI.Text title = titleGO.AddComponent<UnityEngine.UI.Text>();
            title.text = "Animation System Demo";
            title.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            title.fontSize = 24;
            title.color = Color.white;
            title.alignment = TextAnchor.MiddleCenter;
            RectTransform titleRect = title.GetComponent<RectTransform>();
            titleRect.anchorMin = new Vector2(0, 0.7f);
            titleRect.anchorMax = new Vector2(1, 1);
            titleRect.offsetMin = Vector2.zero;
            titleRect.offsetMax = Vector2.zero;
            
            // Add a instructions
            GameObject instructionsGO = new GameObject("Instructions");
            instructionsGO.transform.parent = panelGO.transform;
            UnityEngine.UI.Text instructions = instructionsGO.AddComponent<UnityEngine.UI.Text>();
            instructions.text = "Import a character model and use the Windgap Academy menu to add animation components.";
            instructions.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            instructions.fontSize = 14;
            instructions.color = Color.white;
            instructions.alignment = TextAnchor.MiddleCenter;
            RectTransform instructionsRect = instructions.GetComponent<RectTransform>();
            instructionsRect.anchorMin = new Vector2(0, 0.3f);
            instructionsRect.anchorMax = new Vector2(1, 0.7f);
            instructionsRect.offsetMin = Vector2.zero;
            instructionsRect.offsetMax = Vector2.zero;
            
            Debug.Log("Demo scene setup complete. Import your character models to begin testing.");
        }

        private static void CreateDocumentation()
        {
            // Create the Documentation directory if it doesn't exist
            if (!Directory.Exists("Assets/Documentation"))
            {
                Directory.CreateDirectory("Assets/Documentation");
            }
            
            // Create the animation guide
            string animationGuidePath = "Assets/Documentation/unity-code-animation-guide.md";
            string animationGuideContent = CreateAnimationGuideContent();
            File.WriteAllText(animationGuidePath, animationGuideContent);
            
            // Create the rigging guide
            string riggingGuidePath = "Assets/Documentation/animation-rigging-guide.md";
            string riggingGuideContent = CreateRiggingGuideContent();
            File.WriteAllText(riggingGuidePath, riggingGuideContent);
            
            // Refresh the asset database
            AssetDatabase.Refresh();
            
            Debug.Log($"Created documentation at {animationGuidePath} and {riggingGuidePath}");
            
            // Open the animation guide
            AssetDatabase.OpenAsset(AssetDatabase.LoadAssetAtPath<TextAsset>(animationGuidePath));
        }

        private static string CreateAnimationGuideContent()
        {
            return @"# Unity Code Animation Guide for Windgap Academy

## Overview

This guide explains how to use the code-based animation system for Windgap Academy. The system allows you to control character animations programmatically from both Unity C# scripts and React frontend components.

## Components

The animation system consists of the following components:

1. **AnimationController** - Core component for playing and managing animations
2. **AnimationSequencePlayer** - Creates sequences of animations programmatically
3. **ProceduralAnimator** - Handles IK-based procedural animations
4. **EmoteSystem** - Manages character emote animations
5. **ReactAnimationManager** - Interfaces with React to control animations

## Setup

### Automatic Setup

The easiest way to set up the animation system is to use the Windgap Academy Animation System Setup Wizard:

1. Open the wizard by selecting **Windgap Academy > Animation System > Setup Wizard** from the menu
2. Select the character models you want to set up
3. Configure the options as needed
4. Click **Setup Animation System**

### Manual Setup

If you prefer to set up the system manually, you can add the components directly to your character:

1. Select your character in the Hierarchy
2. Add the following components:
   - Animation Controller
   - Animation Sequence Player
   - Procedural Animator
   - Emote System
   - React Animation Manager

## Using the Animation System

### Playing Animations

```csharp
// Get the animation controller
AnimationController animController = GetComponent<AnimationController>();

// Play a simple animation
animController.PlayAnimation(""talk"");

// Play an animation with duration
animController.PlayAnimationWithDuration(""celebrate"", 2.0f);

// Play a random animation from a list
string[] animations = new string[] { ""think"", ""confused"", ""question"" };
animController.PlayRandomAnimation(animations);
```

### Creating Animation Sequences

```csharp
// Get the sequence player
AnimationSequencePlayer sequencePlayer = GetComponent<AnimationSequencePlayer>();

// Create a sequence
sequencePlayer.StartSequence()
    .Then(""talk"", 2.0f)
    .Then(""think"", 1.5f)
    .Then(""celebrate"", 1.0f)
    .EndWithIdle();
```

### Using Procedural Animations

```csharp
// Get the procedural animator
ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();

// Make character look at something
procAnimator.LookAt(targetPosition);

// Point at something
procAnimator.PointAt(targetPosition);

// Move hands
procAnimator.MoveLeftHandTo(targetPosition, 1.0f);
procAnimator.MoveRightHandTo(targetPosition, 1.0f);
```

### Using the Emote System

```csharp
// Get the emote system
EmoteSystem emoteSystem = GetComponent<EmoteSystem>();

// Play an emote
emoteSystem.PlayEmote(""happy"");

// Play a random emote
string[] emotes = new string[] { ""happy"", ""sad"", ""surprised"" };
emoteSystem.PlayRandomEmote(emotes);
```

## Integration with React

The React Animation Manager component handles communication between Unity and React. In your React code, you can trigger animations using the following:

```javascript
import { sendToUnity } from '../unity-integration/UnityBridge';

// Play an animation
sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
  actionType: 'START_ANIMATION',
  characterName: 'Winnie',
  animationName: 'talk',
  duration: 3.0
});
```

## Demo Scene

To see the animation system in action:

1. Select **Windgap Academy > Animation System > Create New Demo Scene** from the menu
2. Import your character models
3. Use the **Quick Setup Selected Character** option to set up your characters
4. Press Play to run the demo

## Troubleshooting

If you encounter issues with the animation system:

- Make sure your character has an Animator component with a valid controller
- Check if your animation clips are properly configured
- Verify that the character's rig is properly set up for IK-based animations
- Check the console for any error messages

For additional help, contact the Windgap Academy development team.
";
        }

        private static string CreateRiggingGuideContent()
        {
            return @"# Animation Rigging Guide for Windgap Academy

## Overview

This guide explains how to use the Animation Rigging package to set up procedural animations for your characters in Windgap Academy.

## Prerequisites

- Unity 2019.3 or later
- Animation Rigging package installed
- A character model with a properly configured rig

## Setting Up Animation Rigging

### Automatic Setup

The Windgap Academy Animation System Setup Wizard can automatically set up Animation Rigging for your characters:

1. Open the wizard by selecting **Windgap Academy > Animation System > Setup Wizard** from the menu
2. Select your character models
3. Make sure the **Add IK Rigging for Procedural Animation** option is checked
4. Click **Setup Animation System**

### Manual Setup

If you prefer to set up Animation Rigging manually:

1. Select your character in the Hierarchy
2. Add a **Rig** component
3. Add a **RigBuilder** component
4. Create a new GameObject as a child of your character called ""Constraints""
5. Add constraint components to this GameObject (such as MultiAimConstraint, TwoBoneIKConstraint, etc.)
6. Configure the constraints as needed
7. Add the **ProceduralAnimator** component to your character

## Common Constraints

### Head Look-At

To make your character's head look at targets:

1. Create a target GameObject (e.g., ""HeadLookTarget"")
2. Add a **MultiAimConstraint** component to your character's head bone
3. Assign the target GameObject to the **Source Objects** list
4. Set the **Weight** to control the influence (0-1)

### Hand IK

To control your character's hands:

1. Create target GameObjects for each hand (e.g., ""LeftHandTarget"", ""RightHandTarget"")
2. Add **TwoBoneIKConstraint** components to your character's arms
3. Configure the **Root**, **Mid**, and **Tip** bones
4. Assign the target GameObjects to the **Target** property
5. Set the **Weight** to control the influence (0-1)

## Using the ProceduralAnimator

The ProceduralAnimator component provides a high-level API for working with Animation Rigging:

```csharp
// Get the procedural animator
ProceduralAnimator procAnimator = GetComponent<ProceduralAnimator>();

// Make character look at something
procAnimator.LookAt(targetPosition);

// Point at something
procAnimator.PointAt(targetPosition);

// Move hands
procAnimator.MoveLeftHandTo(targetPosition, 1.0f);
procAnimator.MoveRightHandTo(targetPosition, 1.0f);
```

## Blending with Animations

Animation Rigging works alongside traditional animations. You can:

1. Play animations using the AnimationController component
2. Apply procedural modifications using the ProceduralAnimator component
3. The Animation Rigging system will blend the two together

For example:

```csharp
// Play a talking animation
animController.PlayAnimation(""talk"");

// While the character is talking, make them look at the player
procAnimator.LookAt(playerPosition);
```

## Advanced Techniques

### Creating Dynamic Targets

You can create dynamic targets that move over time:

```csharp
// Create a coroutine that moves the hand target
IEnumerator MoveHandTarget()
{
    Vector3 startPos = rightHandTarget.transform.position;
    Vector3 endPos = new Vector3(1, 1, 1);
    float duration = 2.0f;
    float elapsed = 0;
    
    while (elapsed < duration)
    {
        rightHandTarget.transform.position = Vector3.Lerp(startPos, endPos, elapsed / duration);
        elapsed += Time.deltaTime;
        yield return null;
    }
    
    rightHandTarget.transform.position = endPos;
}

// Start the coroutine
StartCoroutine(MoveHandTarget());
```

### Layer Masking

You can apply constraints to specific parts of the body using layer masks:

1. Create different Rig components for different body parts
2. Assign them to different layers in the RigBuilder
3. Control their weights independently

## Troubleshooting

If you encounter issues with Animation Rigging:

- Make sure your character's bones are properly mapped in the Animator
- Check if the constraint source objects are properly assigned
- Verify that the weights are set correctly
- Check if the constraint is activated in the RigBuilder

For additional help, contact the Windgap Academy development team.
";
        }

        // Empty class to satisfy compiler - in a real implementation this would be a full class
        private class AnimationDemoController : MonoBehaviour { }
    }
}