# Unity Project Transfer Guide for Windgap Academy

This guide explains how to use the Unity Project Transfer script to set up a new Unity project with the same settings and assets as your existing project.

## Overview

The Unity Project Transfer script allows you to:

1. Create a new Unity project with the same configuration as your existing project
2. Copy essential settings and assets
3. Set up the integration with Windgap Academy React application
4. Configure building and deployment

## Prerequisites

- An existing Unity project (source project)
- Location for a new Unity project (target project)
- The Windgap Academy codebase checked out

## Using the Transfer Script

The `transfer-unity-project.sh` script automates the process of transferring essential components from your existing Unity project to a new one.

### What the Script Transfers

- **Project Settings**: Core Unity configuration files
- **Package Information**: Package manifests to ensure the same dependencies
- **Character Assets**: Creative Characters FREE assets
- **Sample Scene**: Basic scene setup
- **VS Code Configuration**: Editor settings for optimal Unity development
- **Integration Scripts**: React-Unity communication scripts
- **Build Scripts**: Automated WebGL build setup
- **Deployment Configuration**: Custom deployment scripts

### Running the Transfer

```bash
# Navigate to the Windgap Academy root directory
cd /workspaces/windgapacademy

# Run the transfer script
bash scripts/transfer-unity-project.sh
```

You'll be prompted to:

1. Enter the path to your source Unity project (existing project)
2. Enter the path to your target Unity project (where to create the new project)
3. Choose which components to transfer (assets, scenes, etc.)

### After Running the Transfer

1. **Open your new Unity project**
2. **Wait for Unity to import assets** (this might take some time)
3. **Build the project** using the menu item: Windgap > Build WebGL
4. **Deploy the build** using the provided deployment script
5. **Test the integration** at http://localhost:3000/unity-builds/test.html

## Project Structure

The transferred project will have the following structure:

```
Target Unity Project/
├── Assets/
│   ├── _Project/
│   │   └── Scripts/
│   │       ├── Core/
│   │       ├── Characters/
│   │       │   └── CharacterManager.cs
│   │       ├── Animation/
│   │       │   └── AnimationManager.cs
│   │       └── Integration/
│   │           ├── ReactBridgeManager.cs
│   │           └── StorylineManager.cs
│   ├── Editor/
│   │   └── WindgapBuildScript.cs
│   ├── ithappy/
│   │   └── Creative_Characters_FREE/
│   └── Scenes/
│       └── SampleScene.unity
├── Packages/
│   ├── manifest.json
│   └── packages-lock.json
├── ProjectSettings/
│   └── (Various project settings)
└── .vscode/
    ├── launch.json
    ├── settings.json
    └── extensions.json
```

## Using the Unity Experience in React

Once your Unity project is built and deployed, you can use it in your React components:

```jsx
import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";

const MyComponent = () => {
  return (
    <EnhancedUnityPlayer
      buildUrl="/unity-builds/windgap-academy"
      width={800}
      height={450}
      onUnityLoaded={() => console.log("Unity loaded")}
      initialState={{
        character: "Winnie",
        startAnimation: "Idle",
      }}
    />
  );
};
```

## Troubleshooting

- **Import errors**: Some assets might require additional dependencies. Install them through the Unity Package Manager.
- **Build fails**: Check the Unity console for errors. You might need to update project settings.
- **Missing scripts**: Ensure all scripts are in the correct location and have proper namespace declarations.
- **Deployment issues**: Check file paths in the deployment script.

## Additional Resources

For more detailed information, refer to:

- `/workspaces/windgapacademy/unity-integration/README.md`
- `/workspaces/windgapacademy/UNITY_INTEGRATION.md`
- `/workspaces/windgapacademy/unity-implementation-guide.md`
