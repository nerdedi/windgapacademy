#!/bin/bash

# Unity Project Transfer Script for Windgap Academy
# This script helps transfer essential components from an existing Unity project to a new one

echo "🚀 Windgap Academy - Unity Project Transfer 🚀"
echo "====================================================="

# Define paths
SOURCE_UNITY_PROJECT=""
TARGET_UNITY_PROJECT=""
WINDGAP_ROOT="/workspaces/windgapacademy"
UNITY_SCRIPTS_PATH="$WINDGAP_ROOT/unity-integration/unity-scripts"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Ask for source and target Unity project paths
echo -e "${BLUE}Step 1: Project Locations${NC}"
echo "Please enter the absolute path to your SOURCE Unity project (existing project):"
read -p "> " SOURCE_UNITY_PROJECT

if [ ! -d "$SOURCE_UNITY_PROJECT" ]; then
    echo -e "${RED}Error: The specified source Unity project path does not exist.${NC}"
    exit 1
fi

echo "Please enter the absolute path to your TARGET Unity project (where to transfer):"
read -p "> " TARGET_UNITY_PROJECT

if [ ! -d "$TARGET_UNITY_PROJECT" ]; then
    echo -e "${YELLOW}Target directory does not exist. Create it? (y/n)${NC}"
    read -p "> " CREATE_TARGET
    
    if [ "$CREATE_TARGET" == "y" ] || [ "$CREATE_TARGET" == "Y" ]; then
        mkdir -p "$TARGET_UNITY_PROJECT"
        echo -e "${GREEN}Created target directory.${NC}"
    else
        echo -e "${RED}Cannot continue without target directory.${NC}"
        exit 1
    fi
fi

# Step 2: Create necessary Unity project structure
echo -e "\n${BLUE}Step 2: Creating Project Structure${NC}"

# Create basic Unity project structure
mkdir -p "$TARGET_UNITY_PROJECT/Assets"
mkdir -p "$TARGET_UNITY_PROJECT/Packages"
mkdir -p "$TARGET_UNITY_PROJECT/ProjectSettings"
mkdir -p "$TARGET_UNITY_PROJECT/.vscode"

# Create necessary directories in Unity project
mkdir -p "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Core"
mkdir -p "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Characters"
mkdir -p "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Animation"
mkdir -p "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Integration"
mkdir -p "$TARGET_UNITY_PROJECT/Assets/Scenes"
mkdir -p "$TARGET_UNITY_PROJECT/Assets/Editor"

echo -e "${GREEN}✅ Created basic project structure${NC}"

# Step 3: Copy essential files
echo -e "\n${BLUE}Step 3: Copying Essential Files${NC}"

# Copy Package information
if [ -f "$SOURCE_UNITY_PROJECT/Packages/manifest.json" ]; then
    echo "Copying Packages/manifest.json..."
    cp "$SOURCE_UNITY_PROJECT/Packages/manifest.json" "$TARGET_UNITY_PROJECT/Packages/"
fi

if [ -f "$SOURCE_UNITY_PROJECT/Packages/packages-lock.json" ]; then
    echo "Copying Packages/packages-lock.json..."
    cp "$SOURCE_UNITY_PROJECT/Packages/packages-lock.json" "$TARGET_UNITY_PROJECT/Packages/"
fi

# Copy specific packages configuration if available
echo "Checking for specific packages configuration..."
PACKAGES_TO_CHECK=(
    "com.unity.visualscripting"
    "com.unity.animation.rigging"
    "com.unity.testtools.codecoverage"
    "com.unity.formats.fbx"
    "com.unity.mathematics"
    "com.unity.multiplayer.center"
    "com.unity.ugui"
)

for pkg in "${PACKAGES_TO_CHECK[@]}"; do
    if [ -d "$SOURCE_UNITY_PROJECT/ProjectSettings/Packages/$pkg" ]; then
        echo "Copying package settings for $pkg..."
        mkdir -p "$TARGET_UNITY_PROJECT/ProjectSettings/Packages/$pkg"
        cp -r "$SOURCE_UNITY_PROJECT/ProjectSettings/Packages/$pkg"/* "$TARGET_UNITY_PROJECT/ProjectSettings/Packages/$pkg/" 2>/dev/null
    fi
done

# Copy Project Settings
echo "Copying ProjectSettings..."
if [ -d "$SOURCE_UNITY_PROJECT/ProjectSettings" ]; then
    cp "$SOURCE_UNITY_PROJECT/ProjectSettings"/* "$TARGET_UNITY_PROJECT/ProjectSettings/" 2>/dev/null
fi

# Copy VS Code configuration
echo "Copying VS Code configuration..."
if [ -f "$SOURCE_UNITY_PROJECT/.vscode/launch.json" ]; then
    cp "$SOURCE_UNITY_PROJECT/.vscode/launch.json" "$TARGET_UNITY_PROJECT/.vscode/"
fi

if [ -f "$SOURCE_UNITY_PROJECT/.vscode/settings.json" ]; then
    cp "$SOURCE_UNITY_PROJECT/.vscode/settings.json" "$TARGET_UNITY_PROJECT/.vscode/"
fi

if [ -f "$SOURCE_UNITY_PROJECT/.vscode/extensions.json" ]; then
    cp "$SOURCE_UNITY_PROJECT/.vscode/extensions.json" "$TARGET_UNITY_PROJECT/.vscode/"
fi

echo -e "${GREEN}✅ Copied essential project files${NC}"

# Step 4: Copy Character Assets (if the user wants)
echo -e "\n${BLUE}Step 4: Copying Character Assets${NC}"
echo "Would you like to copy the Creative Characters FREE assets? (y/n)"
read -p "> " COPY_CHARACTERS

if [ "$COPY_CHARACTERS" == "y" ] || [ "$COPY_CHARACTERS" == "Y" ]; then
    # Check if source contains Creative Characters FREE
    if [ -d "$SOURCE_UNITY_PROJECT/Assets/ithappy/Creative_Characters_FREE" ]; then
        mkdir -p "$TARGET_UNITY_PROJECT/Assets/ithappy"
        echo "Copying Creative Characters FREE assets..."
        cp -r "$SOURCE_UNITY_PROJECT/Assets/ithappy/Creative_Characters_FREE" "$TARGET_UNITY_PROJECT/Assets/ithappy/"
        echo -e "${GREEN}✅ Copied Creative Characters FREE assets${NC}"
    else
        echo -e "${YELLOW}Warning: Creative Characters FREE assets not found in source project${NC}"
    fi
fi

# Step 5: Copy Sample Scene and Input System
echo -e "\n${BLUE}Step 5: Copying Sample Scene and Input System${NC}"
echo "Would you like to copy the Sample Scene and Input System? (y/n)"
read -p "> " COPY_SCENE

if [ "$COPY_SCENE" == "y" ] || [ "$COPY_SCENE" == "Y" ]; then
    # Create the Scenes directory if it doesn't exist
    mkdir -p "$TARGET_UNITY_PROJECT/Assets/Scenes"
    
    # Copy SampleScene.unity
    if [ -f "$SOURCE_UNITY_PROJECT/Assets/Scenes/SampleScene.unity" ]; then
        echo "Copying SampleScene.unity..."
        cp "$SOURCE_UNITY_PROJECT/Assets/Scenes/SampleScene.unity" "$TARGET_UNITY_PROJECT/Assets/Scenes/"
        
        # Copy meta file if it exists
        if [ -f "$SOURCE_UNITY_PROJECT/Assets/Scenes/SampleScene.unity.meta" ]; then
            cp "$SOURCE_UNITY_PROJECT/Assets/Scenes/SampleScene.unity.meta" "$TARGET_UNITY_PROJECT/Assets/Scenes/"
        fi
        
        echo -e "${GREEN}✅ Copied Sample Scene${NC}"
    else
        echo -e "${YELLOW}Warning: Sample Scene not found in source project${NC}"
    fi
    
    # Copy InputSystem_Actions.inputactions
    if [ -f "$SOURCE_UNITY_PROJECT/Assets/Scenes/InputSystem_Actions.inputactions" ]; then
        echo "Copying InputSystem_Actions.inputactions..."
        cp "$SOURCE_UNITY_PROJECT/Assets/Scenes/InputSystem_Actions.inputactions" "$TARGET_UNITY_PROJECT/Assets/Scenes/"
        
        # Copy meta file if it exists
        if [ -f "$SOURCE_UNITY_PROJECT/Assets/Scenes/InputSystem_Actions.inputactions.meta" ]; then
            cp "$SOURCE_UNITY_PROJECT/Assets/Scenes/InputSystem_Actions.inputactions.meta" "$TARGET_UNITY_PROJECT/Assets/Scenes/"
        fi
        
        echo -e "${GREEN}✅ Copied Input System Actions${NC}"
    else
        echo -e "${YELLOW}Warning: Input System Actions not found in source project${NC}"
    fi
    
    # Copy Scenes.meta if it exists
    if [ -f "$SOURCE_UNITY_PROJECT/Assets/Scenes.meta" ]; then
        cp "$SOURCE_UNITY_PROJECT/Assets/Scenes.meta" "$TARGET_UNITY_PROJECT/Assets/"
    fi
fi

# Step 6: Copy integration scripts from Windgap
echo -e "\n${BLUE}Step 6: Copying Integration Scripts${NC}"
if [ -d "$UNITY_SCRIPTS_PATH" ]; then
    # Copy scripts to Unity project
    echo "Copying ReactBridgeManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/ReactBridgeManager.cs" "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Integration/"
    
    echo "Copying CharacterManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/CharacterManager.cs" "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Characters/"
    
    echo "Copying AnimationManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/AnimationManager.cs" "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Animation/"
    
    echo "Copying StorylineManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/StorylineManager.cs" "$TARGET_UNITY_PROJECT/Assets/_Project/Scripts/Integration/"
    
    echo -e "${GREEN}✅ Successfully copied integration scripts to Unity project${NC}"
else
    echo -e "${RED}Error: Unity scripts directory not found at $UNITY_SCRIPTS_PATH${NC}"
    echo "Please make sure the unity-integration/unity-scripts directory exists"
fi

# Step 7: Create build script for Unity
echo -e "\n${BLUE}Step 7: Creating Unity Build Script${NC}"
BUILD_SCRIPT_PATH="$TARGET_UNITY_PROJECT/Assets/Editor"
mkdir -p "$BUILD_SCRIPT_PATH"

echo "Creating Unity build script..."
cat > "$BUILD_SCRIPT_PATH/WindgapBuildScript.cs" << 'EOF'
using UnityEditor;
using UnityEngine;
using System.IO;

namespace WindgapAcademy.Editor
{
    public class WindgapBuildScript
    {
        [MenuItem("Windgap/Build WebGL")]
        public static void BuildWebGL()
        {
            // Set the build settings
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;
            PlayerSettings.WebGL.memorySize = 512;
            
            // Define the build path
            string buildPath = Path.Combine(Application.dataPath, "../Builds/WebGL/windgap-academy");
            
            // Make sure the directory exists
            if (!Directory.Exists(buildPath))
            {
                Directory.CreateDirectory(buildPath);
            }
            
            // Get scenes in build
            string[] scenes = new string[EditorBuildSettings.scenes.Length];
            for (int i = 0; i < scenes.Length; i++)
            {
                scenes[i] = EditorBuildSettings.scenes[i].path;
            }
            
            // Build the project
            BuildPipeline.BuildPlayer(scenes, buildPath, BuildTarget.WebGL, BuildOptions.None);
            
            Debug.Log("WebGL build completed at: " + buildPath);
            EditorUtility.RevealInFinder(buildPath);
        }
        
        [MenuItem("Windgap/Export Integration Package")]
        public static void ExportIntegrationPackage()
        {
            // Define paths for integration files
            string[] exportPaths = new string[]
            {
                "Assets/_Project/Scripts/Core",
                "Assets/_Project/Scripts/Characters",
                "Assets/_Project/Scripts/Animation",
                "Assets/_Project/Scripts/Integration",
                "Assets/Editor/WindgapBuildScript.cs"
            };
            
            // Export package
            string packagePath = Path.Combine(Application.dataPath, "../WindgapIntegration.unitypackage");
            AssetDatabase.ExportPackage(exportPaths, packagePath, ExportPackageOptions.Recurse);
            
            Debug.Log("Integration package exported to: " + packagePath);
            EditorUtility.RevealInFinder(packagePath);
        }
    }
}
EOF

echo -e "${GREEN}✅ Created Unity build script at $BUILD_SCRIPT_PATH/WindgapBuildScript.cs${NC}"

# Step 8: Create custom deployment script
echo -e "\n${BLUE}Step 8: Setting up Deployment Process${NC}"
echo "Would you like to create a custom deployment script for your specific Unity project? (y/n)"
read -p "> " CREATE_DEPLOY_SCRIPT

if [ "$CREATE_DEPLOY_SCRIPT" == "y" ] || [ "$CREATE_DEPLOY_SCRIPT" == "Y" ]; then
    # Create custom deploy script
    DEPLOY_SCRIPT_PATH="$WINDGAP_ROOT/scripts/deploy-my-unity-build.sh"
    
    cat > "$DEPLOY_SCRIPT_PATH" << EOF
#!/bin/bash

# Deploy Unity WebGL Build to Windgap Academy React Project
UNITY_PROJECT_PATH="$TARGET_UNITY_PROJECT"
UNITY_BUILD_PATH="\$UNITY_PROJECT_PATH/Builds/WebGL/windgap-academy"
PUBLIC_PATH="$WINDGAP_ROOT/public/unity-builds/windgap-academy"

# Create public directory if it doesn't exist
mkdir -p "\$PUBLIC_PATH"

# Check if Unity build exists
if [ -d "\$UNITY_BUILD_PATH" ]; then
    echo "Copying Unity WebGL build to React public directory..."
    
    # Copy Unity WebGL files
    cp -r "\$UNITY_BUILD_PATH/Build" "\$PUBLIC_PATH/"
    cp -r "\$UNITY_BUILD_PATH/TemplateData" "\$PUBLIC_PATH/"
    
    echo "Unity WebGL build successfully deployed to React project!"
else
    echo "Error: Unity WebGL build not found at \$UNITY_BUILD_PATH"
    echo "Please build the Unity project first using the WebGL build option"
    exit 1
fi
EOF
    
    chmod +x "$DEPLOY_SCRIPT_PATH"
    echo -e "${GREEN}✅ Created custom deploy script at $DEPLOY_SCRIPT_PATH${NC}"
else
    echo "You can use the existing deploy script after building your Unity project:"
    echo -e "${YELLOW}bash $WINDGAP_ROOT/unity-integration/deploy-unity-animations.sh${NC}"
fi

# Step 9: Create a README in the target project
echo -e "\n${BLUE}Step 9: Creating README${NC}"
README_PATH="$TARGET_UNITY_PROJECT/README.md"

cat > "$README_PATH" << EOF
# Windgap Academy Unity Project

This Unity project is configured for integration with the Windgap Academy React application.

## Project Structure

- \`Assets/_Project/Scripts/Core/\` - Core game functionality
- \`Assets/_Project/Scripts/Characters/\` - Character controllers and management
- \`Assets/_Project/Scripts/Animation/\` - Animation controllers and systems
- \`Assets/_Project/Scripts/Integration/\` - Scripts for React integration

## Building for WebGL

1. Open this project in Unity
2. Use the menu item: Windgap > Build WebGL
3. The build will be output to: \`Builds/WebGL/windgap-academy/\`

## Deploying to React

After building, use the deployment script:
\`\`\`bash
bash $DEPLOY_SCRIPT_PATH
\`\`\`

## Unity Version

This project is configured to use Unity 2023.2 LTS.

## Creative Characters FREE

This project includes the Creative Characters FREE asset package, which provides:
- Character meshes and prefabs
- Animation controllers
- Customization options

## React Integration

The integration scripts provide:
- Bidirectional communication with React
- Character animation control
- Storyline management
- Interactive experiences
EOF

echo -e "${GREEN}✅ Created README in the target project${NC}"

# Step 10: Final instructions
echo -e "\n${BLUE}Step 10: Next Steps${NC}"
echo -e "${GREEN}✅ Unity project transfer completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Open your Unity project at $TARGET_UNITY_PROJECT"
echo "2. Unity might need to re-import assets the first time"
echo "3. Wait for the import process to complete"
echo "4. Build the project using: Windgap > Build WebGL"
echo ""
echo "5. After building, deploy to your React project:"
if [ "$CREATE_DEPLOY_SCRIPT" == "y" ] || [ "$CREATE_DEPLOY_SCRIPT" == "Y" ]; then
    echo "   - Run: bash $DEPLOY_SCRIPT_PATH"
else
    echo "   - Run: bash $WINDGAP_ROOT/unity-integration/deploy-unity-animations.sh"
fi
echo ""
echo "6. Test your integration at:"
echo "   - http://localhost:3000/unity-builds/test.html"
echo ""
echo -e "${YELLOW}Happy developing!${NC}"

echo ""
echo -e "${BLUE}Additional Resources:${NC}"
echo "Available automation scripts:"
echo "1. Animation Rigging Setup: scripts/setup-animation-rigging.sh"
echo "2. Input System Setup: scripts/setup-input-system.sh"
echo ""
echo "Documentation:"
echo "- Unity Automation Guide: docs/unity-automation-guide.md"
echo "- Animation Rigging Guide: docs/animation-rigging-guide.md"
echo "- Input System Guide: docs/unity-input-system-guide.md"