# Unity Integration Automation for Windgap Academy

This guide explains how to use the automation scripts to integrate your Unity project with the Windgap Academy React application.

## Available Scripts

We provide several scripts to help with Unity integration:

1. **`automate-unity-integration.sh`** - Sets up a Unity project for integration with Windgap Academy
2. **`setup-unity-vscode.sh`** - Configures VS Code for optimal Unity development
3. **`transfer-unity-project.sh`** - Transfers an existing Unity project to a new location with proper configuration
4. To set up animation rigging for your characters:

   ```bash
   bash /workspaces/windgapacademy/scripts/setup-animation-rigging.sh
   ```

5. To set up the Input System for character controls:
   ```bash
   bash /workspaces/windgapacademy/scripts/setup-input-system.sh
   ```

The scripts will guide you through the process and create the necessary files and configurations.

## Prerequisites

- Unity 2023.2 LTS or later installed
- A Unity project with the Creative Characters FREE asset or similar characters
- The Windgap Academy codebase checked out
- A local development server running for the React app

## Using the Automation Script

The `automate-unity-integration.sh` script handles the tedious parts of setting up the Unity-React integration.

### What the Script Does

1. **Creates necessary folders** in your Unity project
2. **Copies integration scripts** from Windgap Academy to your Unity project
3. **Sets up VS Code configuration** for optimal Unity development experience
4. **Creates a build script** in your Unity project to easily build for WebGL
5. **Sets up a deployment script** to copy your Unity build to the React project
6. **Provides guidance** on next steps

### Running the Automation

```bash
# Navigate to the Windgap Academy root directory
cd /workspaces/windgapacademy

# Run the automation script
bash scripts/automate-unity-integration.sh
```

You'll be prompted to:

1. Enter the path to your Unity project
2. Choose whether to create a custom deployment script

### After Running the Automation

1. **Open your Unity project**
2. **Import the necessary assets** if you haven't already
3. **Build the project** using the menu item: Windgap > Build WebGL
4. **Deploy the build** using the provided deployment script
5. **Test the integration** at http://localhost:3000/unity-builds/test.html

## Using the Unity Experience in React

Once deployed, you can use the Unity experience in your React components:

```jsx
import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";

const MyComponent = () => {
  const handleUnityLoaded = () => {
    console.log("Unity loaded successfully");
  };

  return (
    <EnhancedUnityPlayer
      buildUrl="/unity-builds/windgap-academy"
      width={800}
      height={450}
      onUnityLoaded={handleUnityLoaded}
      initialState={{
        character: "Winnie",
        startAnimation: "Idle",
      }}
    />
  );
};
```

## VS Code Configuration for Unity

A separate script is provided to configure VS Code for optimal Unity development:

```bash
# Navigate to the Windgap Academy root directory
cd /workspaces/windgapacademy

# Run the VS Code configuration script
bash scripts/setup-unity-vscode.sh
```

This script will:

1. Create the necessary `.vscode` folder in your Unity project
2. Set up optimal VS Code settings for Unity development
3. Configure the debugger for Unity
4. Add recommended extensions for Unity development

You can run this script separately if you only need to set up VS Code for your Unity project without the full integration setup.

## Troubleshooting

- **Unity scripts not found**: Ensure the unity-integration/unity-scripts directory exists
- **Build fails**: Check the Unity console for errors
- **Integration not working**: Verify file paths and check browser console for errors
- **Performance issues**: Reduce quality settings in Unity or adjust the memory size

For more detailed information, refer to:

- `/workspaces/windgapacademy/unity-integration/README.md`
- `/workspaces/windgapacademy/UNITY_INTEGRATION.md`
- `/workspaces/windgapacademy/unity-implementation-guide.md`
- `/workspaces/windgapacademy/docs/animation-rigging-guide.md`

## Complete Project Transfer

For transferring an existing Unity project with all its settings and assets, see the dedicated guide:

- `/workspaces/windgapacademy/docs/unity-project-transfer-guide.md`

You can use the transfer script:

```bash
# Navigate to the Windgap Academy root directory
cd /workspaces/windgapacademy

# Run the transfer script
bash scripts/transfer-unity-project.sh
```

This is particularly useful if you want to base your new project on an existing one with Creative Characters FREE assets already set up.
