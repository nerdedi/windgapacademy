#!/bin/bash
# Script to open different workspaces in VS Code with optimized settings

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Windgap Academy VS Code Workspace Selector${NC}"
echo -e "${YELLOW}Select which part of the project to open:${NC}"
echo "1) Main development (excludes heavy folders)"
echo "2) Frontend only (src, components)"
echo "3) Backend only"
echo "4) Unity development"
echo "5) Lightweight (fastest loading)"
echo "6) Full project (may be slow to load)"
echo "7) Create custom workspace"
echo "q) Quit"

read -p "Enter choice [1-7 or q]: " choice

case $choice in
    1)
        echo -e "${GREEN}Opening main development workspace...${NC}"
        code main-dev.code-workspace
        ;;
    2)
        echo -e "${GREEN}Opening frontend workspace...${NC}"
        code frontend-dev.code-workspace
        ;;
    3)
        echo -e "${GREEN}Creating and opening backend workspace...${NC}"
        cat > backend-dev.code-workspace << EOL
{
  "folders": [
    {
      "path": "backend"
    },
    {
      "path": "firebase"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/.git": true,
      "**/.DS_Store": true,
      "**/coverage": true,
      "**/dist": true,
      "**/build": true
    }
  }
}
EOL
        code backend-dev.code-workspace
        ;;
    4)
        echo -e "${GREEN}Opening Unity development workspace...${NC}"
        code unity-dev.code-workspace
        ;;
    5)
        echo -e "${GREEN}Opening lightweight workspace (fastest loading)...${NC}"
        code lightweight.code-workspace
        ;;
    6)
        echo -e "${YELLOW}Warning: This may take a while to load.${NC}"
        read -p "Are you sure? (y/n): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            echo -e "${GREEN}Opening full project...${NC}"
            code .
        fi
        ;;
    7)
        echo -e "${GREEN}Creating custom workspace...${NC}"
        echo "Enter the folders to include (space-separated, relative to project root):"
        read -p "> " folders
        
        # Create a temporary array to hold the folder entries
        folder_entries=""
        for folder in $folders; do
            # Add comma if not the first entry
            if [ ! -z "$folder_entries" ]; then
                folder_entries="$folder_entries,"
            fi
            folder_entries="$folder_entries{\"path\": \"$folder\"}"
        done
        
        # Create the workspace file
        cat > custom-workspace.code-workspace << EOL
{
  "folders": [
    $folder_entries
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/.git": true,
      "**/.DS_Store": true,
      "**/coverage": true,
      "**/dist": true,
      "**/build": true
    }
  }
}
EOL
        code custom-workspace.code-workspace
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