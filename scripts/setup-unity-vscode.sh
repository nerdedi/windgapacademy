#!/bin/bash

# Configure Unity VS Code Integration
# This script helps set up the VS Code configuration for Unity

echo "🚀 Windgap Academy - Unity VS Code Configuration 🚀"
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

# Step 2: Create VS Code configuration
echo -e "\n${BLUE}Step 2: Setting up VS Code Configuration${NC}"
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

# Step 3: Final instructions
echo -e "\n${BLUE}Step 3: Next Steps${NC}"
echo -e "${GREEN}✅ Unity VS Code configuration completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Open your Unity project in VS Code"
echo "2. Install the recommended extension: Visual Studio Tools for Unity"
echo "3. In Unity, ensure External Script Editor is set to VS Code"
echo "   - Edit > Preferences > External Tools > External Script Editor"
echo ""
echo -e "${YELLOW}Happy developing!${NC}"