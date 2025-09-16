#!/bin/bash
# Unity project cleanup and optimization script for VS Code

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Unity Project Cleanup and Optimization${NC}"

# Check if we're in a Unity project
UNITY_PROJECT_DIR="/workspaces/windgapacademy/unity-setup/WindgapHiddenRealm"
if [ ! -d "$UNITY_PROJECT_DIR" ]; then
  echo -e "${RED}Error: Unity project directory not found at $UNITY_PROJECT_DIR${NC}"
  echo "Please specify the correct Unity project path:"
  read -p "> " UNITY_PROJECT_DIR
  
  if [ ! -d "$UNITY_PROJECT_DIR" ]; then
    echo -e "${RED}Error: Invalid directory. Exiting.${NC}"
    exit 1
  fi
fi

echo -e "${YELLOW}Unity project: $UNITY_PROJECT_DIR${NC}"
echo -e "${YELLOW}Select an action:${NC}"
echo "1) Clean temporary files (Library, Temp, Logs, obj)"
echo "2) Create optimized .vscode settings for this project"
echo "3) Open this project in VS Code with optimized settings"
echo "4) All of the above"
echo "q) Quit"

read -p "Enter choice [1-4 or q]: " choice

# Function to clean temporary files
clean_temp_files() {
  echo -e "${YELLOW}Cleaning temporary files...${NC}"
  
  # Create a list of directories to clean
  CLEAN_DIRS=(
    "$UNITY_PROJECT_DIR/Library"
    "$UNITY_PROJECT_DIR/Temp"
    "$UNITY_PROJECT_DIR/Logs"
    "$UNITY_PROJECT_DIR/obj"
  )
  
  for dir in "${CLEAN_DIRS[@]}"; do
    if [ -d "$dir" ]; then
      echo "Removing $dir"
      rm -rf "$dir"
    fi
  done
  
  echo -e "${GREEN}Temporary files cleaned.${NC}"
}

# Function to create optimized VS Code settings
create_vscode_settings() {
  echo -e "${YELLOW}Creating optimized VS Code settings...${NC}"
  
  # Create .vscode directory if it doesn't exist
  VSCODE_DIR="$UNITY_PROJECT_DIR/.vscode"
  mkdir -p "$VSCODE_DIR"
  
  # Create settings.json
  cat > "$VSCODE_DIR/settings.json" << EOL
{
  "files.exclude": {
    "**/.DS_Store": true,
    "**/.git": true,
    "**/.hg": true,
    "**/.svn": true,
    "**/CVS": true,
    "**/Thumbs.db": true,
    "**/*.meta": true,
    "**/*.cs.meta": false,
    "**/Library": true,
    "**/Logs": true,
    "**/obj": true,
    "**/Temp": true,
    "**/*.csproj": true,
    "**/*.sln": true
  },
  "files.watcherExclude": {
    "**/Library/**": true,
    "**/Logs/**": true,
    "**/obj/**": true,
    "**/Packages/**": true,
    "**/Temp/**": true,
    "**/Assets/AssetStoreTools/**": true
  },
  "search.exclude": {
    "**/Library": true,
    "**/Logs": true,
    "**/obj": true,
    "**/Packages": true,
    "**/Temp": true,
    "**/*.asset": true
  },
  "omnisharp.useModernNet": true,
  "omnisharp.enableRoslynAnalyzers": true,
  "omnisharp.useGlobalMono": "always",
  "csharp.referencesCodeLens.enabled": false,
  "editor.formatOnSave": true,
  "explorer.compactFolders": false,
  "workbench.editor.highlightModifiedTabs": true,
  "debug.inlineValues": "on",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true
}
EOL
  
  # Create extensions.json with recommended extensions
  cat > "$VSCODE_DIR/extensions.json" << EOL
{
  "recommendations": [
    "ms-dotnettools.csharp",
    "unity.unity-debug",
    "kleber-swf.unity-code-snippets",
    "visualstudioexptteam.vscodeintellicode"
  ]
}
EOL
  
  echo -e "${GREEN}VS Code settings created.${NC}"
}

# Function to open the project in VS Code
open_in_vscode() {
  echo -e "${YELLOW}Opening Unity project in VS Code...${NC}"
  code "$UNITY_PROJECT_DIR"
  echo -e "${GREEN}Project opened in VS Code.${NC}"
}

# Handle user choice
case $choice in
  1)
    clean_temp_files
    ;;
  2)
    create_vscode_settings
    ;;
  3)
    open_in_vscode
    ;;
  4)
    clean_temp_files
    create_vscode_settings
    open_in_vscode
    ;;
  q|Q)
    echo -e "${GREEN}Exiting...${NC}"
    exit 0
    ;;
  *)
    echo -e "${YELLOW}Invalid option. Please try again.${NC}"
    ;;
esac

echo -e "${GREEN}Done!${NC}"