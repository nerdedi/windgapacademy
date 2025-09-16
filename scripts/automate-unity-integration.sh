#!/bin/bash

# Automate Unity Integration Script for Windgap Academy
# This script helps automate the Unity integration process

echo "🚀 Windgap Academy - Unity Integration Automation 🚀"
echo "====================================================="

# Define paths
UNITY_PROJECT_PATH=""
WINDGAP_ROOT="/workspaces/windgapacademy"
UNITY_SCRIPTS_PATH="$WINDGAP_ROOT/unity-integration/unity-scripts"
UNITY_BUILD_NAME="windgap-academy"
PUBLIC_PATH="$WINDGAP_ROOT/public/unity-builds/$UNITY_BUILD_NAME"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Ask for Unity project path
echo -e "${BLUE}Step 1: Unity Project Setup${NC}"
echo "Please enter the absolute path to your Unity project:"
read -p "> " UNITY_PROJECT_PATH

if [ ! -d "$UNITY_PROJECT_PATH" ]; then
    echo -e "${RED}Error: The specified Unity project path does not exist.${NC}"
    exit 1
fi

# Create necessary directories in Unity project
echo -e "\n${BLUE}Creating necessary folders in Unity project...${NC}"
mkdir -p "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Core"
mkdir -p "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Characters"
mkdir -p "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Animation"
mkdir -p "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Integration"

# Step 2: Copy integration scripts to Unity project
echo -e "\n${BLUE}Step 2: Copying Integration Scripts to Unity Project${NC}"
if [ -d "$UNITY_SCRIPTS_PATH" ]; then
    # Copy scripts to Unity project
    echo "Copying ReactBridgeManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/ReactBridgeManager.cs" "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Integration/"
    
    echo "Copying CharacterManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/CharacterManager.cs" "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Characters/"
    
    echo "Copying AnimationManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/AnimationManager.cs" "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Animation/"
    
    echo "Copying StorylineManager.cs to Unity project..."
    cp "$UNITY_SCRIPTS_PATH/StorylineManager.cs" "$UNITY_PROJECT_PATH/Assets/_Project/Scripts/Integration/"
    
    echo -e "${GREEN}✅ Successfully copied integration scripts to Unity project${NC}"
else
    echo -e "${RED}Error: Unity scripts directory not found at $UNITY_SCRIPTS_PATH${NC}"
    echo "Please make sure the unity-integration/unity-scripts directory exists"
    exit 1
fi

# Step 3: Create VS Code configuration for Unity
echo -e "\n${BLUE}Step 3: Setting up VS Code Configuration${NC}"
VSCODE_PATH="$UNITY_PROJECT_PATH/.vscode"
mkdir -p "$VSCODE_PATH"

echo "Creating VS Code configuration files..."

# Create launch.json
cat > "$VSCODE_PATH/launch.json" << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Unity",
            "type": "vstuc",
            "request": "attach"
        }
     ]
}
EOF

# Create settings.json
cat > "$VSCODE_PATH/settings.json" << 'EOF'
{
    "files.exclude": {
        "**/.DS_Store": true,
        "**/.git": true,
        "**/.vs": true,
        "**/.gitmodules": true,
        "**/.vsconfig": true,
        "**/*.booproj": true,
        "**/*.pidb": true,
        "**/*.suo": true,
        "**/*.user": true,
        "**/*.userprefs": true,
        "**/*.unityproj": true,
        "**/*.dll": true,
        "**/*.exe": true,
        "**/*.pdf": true,
        "**/*.mid": true,
        "**/*.midi": true,
        "**/*.wav": true,
        "**/*.gif": true,
        "**/*.ico": true,
        "**/*.jpg": true,
        "**/*.jpeg": true,
        "**/*.png": true,
        "**/*.psd": true,
        "**/*.tga": true,
        "**/*.tif": true,
        "**/*.tiff": true,
        "**/*.3ds": true,
        "**/*.3DS": true,
        "**/*.fbx": true,
        "**/*.FBX": true,
        "**/*.lxo": true,
        "**/*.LXO": true,
        "**/*.ma": true,
        "**/*.MA": true,
        "**/*.obj": true,
        "**/*.OBJ": true,
        "**/*.asset": true,
        "**/*.cubemap": true,
        "**/*.flare": true,
        "**/*.mat": true,
        "**/*.meta": true,
        "**/*.prefab": true,
        "**/*.unity": true,
        "build/": true,
        "Build/": true,
        "Library/": true,
        "library/": true,
        "obj/": true,
        "Obj/": true,
        "Logs/": true,
        "logs/": true,
        "ProjectSettings/": true,
        "UserSettings/": true,
        "temp/": true,
        "Temp/": true
    },
    "files.associations": {
        "*.asset": "yaml",
        "*.meta": "yaml",
        "*.prefab": "yaml",
        "*.unity": "yaml",
    },
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.patterns": {
        "*.sln": "*.csproj",
    },
    "dotnet.defaultSolution": "$(basename \"$UNITY_PROJECT_PATH\").sln"
}
EOF

# Create extensions.json
cat > "$VSCODE_PATH/extensions.json" << 'EOF'
{
    "recommendations": [
      "visualstudiotoolsforunity.vstuc"
    ]
}
EOF

echo -e "${GREEN}✅ Created VS Code configuration files${NC}"

# Step 4: Create build script for Unity
echo -e "\n${BLUE}Step 4: Creating Unity Build Script${NC}"
BUILD_SCRIPT_PATH="$UNITY_PROJECT_PATH/Assets/Editor"
mkdir -p "$BUILD_SCRIPT_PATH"

echo "Creating Unity build script..."
cat > "$BUILD_SCRIPT_PATH/WindgapBuildScript.cs" << 'EOF'
using UnityEditor;
using UnityEngine;
using System.IO;

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
}
EOF

echo -e "${GREEN}✅ Created Unity build script at $BUILD_SCRIPT_PATH/WindgapBuildScript.cs${NC}"
echo "In Unity, you can now build the project by selecting:"
echo -e "${YELLOW}Windgap > Build WebGL${NC} from the menu"

# Step 5: Prepare deployment script
echo -e "\n${BLUE}Step 5: Setting up Deployment Process${NC}"
echo "Would you like to create a custom deployment script for your specific Unity project? (y/n)"
read -p "> " CREATE_DEPLOY_SCRIPT

if [ "$CREATE_DEPLOY_SCRIPT" == "y" ] || [ "$CREATE_DEPLOY_SCRIPT" == "Y" ]; then
    # Create custom deploy script
    DEPLOY_SCRIPT_PATH="$WINDGAP_ROOT/scripts/deploy-my-unity-build.sh"
    
    cat > "$DEPLOY_SCRIPT_PATH" << EOF
#!/bin/bash

# Deploy Unity WebGL Build to Windgap Academy React Project
UNITY_PROJECT_PATH="$UNITY_PROJECT_PATH"
UNITY_BUILD_PATH="\$UNITY_PROJECT_PATH/Builds/WebGL/windgap-academy"
PUBLIC_PATH="$PUBLIC_PATH"

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
    echo "After building in Unity, run this script to deploy to your React project:"
    echo -e "${YELLOW}bash $DEPLOY_SCRIPT_PATH${NC}"
else
    echo "You can use the existing deploy script after building your Unity project:"
    echo -e "${YELLOW}bash $WINDGAP_ROOT/unity-integration/deploy-unity-animations.sh${NC}"
fi

# Step 6: Final instructions
echo -e "\n${BLUE}Step 6: Next Steps${NC}"
echo -e "${GREEN}✅ Unity integration setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Open your Unity project and build it using:"
echo "   - In Unity Editor menu: Windgap > Build WebGL"
echo ""
echo "2. After building, deploy to your React project:"
if [ "$CREATE_DEPLOY_SCRIPT" == "y" ] || [ "$CREATE_DEPLOY_SCRIPT" == "Y" ]; then
    echo "   - Run: bash $DEPLOY_SCRIPT_PATH"
else
    echo "   - Run: bash $WINDGAP_ROOT/unity-integration/deploy-unity-animations.sh"
fi
echo ""
echo "3. Test your integration at:"
echo "   - http://localhost:3000/unity-builds/test.html"
echo ""
echo "4. Access your Unity experience using EnhancedUnityPlayer component:"
echo '   <EnhancedUnityPlayer'
echo '     buildUrl="/unity-builds/windgap-academy"'
echo '     width={800}'
echo '     height={450}'
echo '     onUnityLoaded={() => console.log("Unity loaded")}'
echo '   />'
echo ""
echo -e "${YELLOW}Happy developing!${NC}"