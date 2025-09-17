# Unity Animation System Extension - Installation Guide

This guide explains how to install and use the Unity Animation System Extension for Windgap Academy. The extension provides a one-click solution to set up code-based animations in Unity without any manual configuration.

## Installation Steps

1. **Copy the extension files to your Unity project:**

   Copy the `unity-scripts` folder from this repository to your Unity project's `Assets` folder. You can do this via the file system or by importing the package into Unity.

2. **Open your Unity project**

   Make sure you have the Animation Rigging package installed in your Unity project. You can install it via the Package Manager (Window > Package Manager).

3. **Access the Animation System menu**

   In Unity, navigate to the menu bar and find the `Windgap Academy > Animation System` menu.

4. **Run the Setup Wizard**

   Select `Setup Wizard` from the menu. This will open the Animation System Setup Wizard.

5. **Select characters and configure options**

   The wizard will automatically detect character models in your project. Select the ones you want to set up and configure the options as needed.

6. **Click "Setup Animation System"**

   The wizard will automatically add all necessary components to your character models, set up IK rigging for procedural animations, and configure the React integration bridge.

7. **Test your setup**

   Create a demo scene by selecting `Windgap Academy > Animation System > Create New Demo Scene` from the menu.

## What Gets Installed

The extension installs the following components:

1. **Editor Tools:**
   - Animation System Setup Wizard
   - Quick Setup Menu Items
   - Documentation Generator

2. **Runtime Scripts:**
   - AnimationController.cs
   - AnimationSequencePlayer.cs
   - ProceduralAnimator.cs
   - EmoteSystem.cs
   - ReactAnimationManager.cs

3. **Documentation:**
   - Unity Code Animation Guide
   - Animation Rigging Guide

## Automatic Script Generation

If the animation scripts don't exist in your project, the extension will automatically generate them in the `Assets/Scripts/Animation` folder. This ensures that the editor tools can compile even if you haven't imported the animation scripts yet.

## Integration with React

The extension sets up the connection between Unity and React, allowing you to control animations from your React frontend. This works with the existing characters from the CurriculumBuilderWithBlender component.

To use the animation system from React, import the provided React components:

```jsx
import UnityAnimationBridge from '../components/UnityAnimationBridge';
import EnhancedCharacterAnimationController from '../components/EnhancedCharacterAnimationController';
```

## Troubleshooting

If you encounter issues with the extension:

1. Make sure your character models have proper rigging (bones and skinned mesh renderers)
2. Check if your animation clips are properly configured in the Animator component
3. Verify that the Animation Rigging package is installed in your Unity project
4. Check the console for any error messages from the extension

For additional help, refer to the documentation created by the extension or contact the Windgap Academy development team.