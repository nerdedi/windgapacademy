#!/bin/bash

# Script to fix GitHub Copilot "Chat failed to get ready" errors
# This script clears Copilot cache and provides troubleshooting steps

set -e

echo "🔧 GitHub Copilot Chat Fix Script"
echo "=================================="
echo ""

# Function to find VS Code extensions directory
find_vscode_extensions() {
    if [ -d "$HOME/.vscode-server/extensions" ]; then
        echo "$HOME/.vscode-server/extensions"
    elif [ -d "$HOME/.vscode/extensions" ]; then
        echo "$HOME/.vscode/extensions"
    elif [ -d "$HOME/Library/Application Support/Code/User/globalStorage" ]; then
        echo "$HOME/Library/Application Support/Code/User/globalStorage"
    else
        echo ""
    fi
}

# Step 1: Clear Copilot cache
echo "Step 1: Clearing GitHub Copilot cache..."
EXTENSIONS_DIR=$(find_vscode_extensions)

if [ -n "$EXTENSIONS_DIR" ]; then
    # Clear Copilot-specific caches
    find "$EXTENSIONS_DIR" -name "*github.copilot*" -type d 2>/dev/null | while read -r dir; do
        if [ -d "$dir/cache" ]; then
            echo "  Clearing cache in: $dir/cache"
            rm -rf "$dir/cache"/* 2>/dev/null || true
        fi
    done

    # Clear global storage
    if [ -d "$HOME/.vscode-server/data/User/globalStorage/github.copilot" ]; then
        echo "  Clearing global storage..."
        rm -rf "$HOME/.vscode-server/data/User/globalStorage/github.copilot"/* 2>/dev/null || true
    fi

    echo "  ✅ Cache cleared"
else
    echo "  ⚠️  Could not find VS Code extensions directory"
fi

# Step 2: Check for large files in workspace
echo ""
echo "Step 2: Checking for large directories that might cause issues..."
LARGE_DIRS=$(du -sh /workspaces/windgapacademy/* 2>/dev/null | awk '$1 ~ /[0-9]+M|[0-9]+G/ {print $2}' | grep -v node_modules | head -5)
if [ -n "$LARGE_DIRS" ]; then
    echo "  Large directories found (may slow down Copilot):"
    echo "$LARGE_DIRS" | while read -r dir; do
        echo "    - $(basename "$dir")"
    done
else
    echo "  ✅ No problematic large directories found"
fi

# Step 3: Verify .copilotignore
echo ""
echo "Step 3: Verifying .copilotignore configuration..."
if [ -f "/workspaces/windgapacademy/.copilotignore" ]; then
    echo "  ✅ .copilotignore file exists"
else
    echo "  ⚠️  .copilotignore file not found - creating it now..."
    cat > /workspaces/windgapacademy/.copilotignore << 'EOF'
node_modules/
freespeech/
o3de/
dist/
backend/node_modules/
*.zip
EOF
    echo "  ✅ .copilotignore created"
fi

# Step 4: Check VS Code settings
echo ""
echo "Step 4: Checking VS Code settings..."
if grep -q "github.copilot" /workspaces/windgapacademy/.vscode/settings.json 2>/dev/null; then
    echo "  ✅ Copilot settings configured"
else
    echo "  ⚠️  Copilot settings not found in .vscode/settings.json"
fi

# Step 5: Print troubleshooting instructions
echo ""
echo "=================================="
echo "✅ Automated fixes applied!"
echo ""
echo "📋 Manual Steps (if issue persists):"
echo ""
echo "1. Reload VS Code Window:"
echo "   - Press: Ctrl+Shift+P (or Cmd+Shift+P on Mac)"
echo "   - Type: 'Developer: Reload Window'"
echo "   - Press Enter"
echo ""
echo "2. Check GitHub Authentication:"
echo "   - Press: Ctrl+Shift+P"
echo "   - Type: 'GitHub: Sign Out'"
echo "   - Then: 'GitHub: Sign In'"
echo ""
echo "3. Check Copilot Status:"
echo "   - Look at the bottom-right of VS Code"
echo "   - Click the GitHub Copilot icon"
echo "   - Verify it shows 'Ready'"
echo ""
echo "4. View Copilot Logs (for debugging):"
echo "   - View → Output"
echo "   - Select 'GitHub Copilot Chat' from dropdown"
echo ""
echo "5. If still not working, reinstall extensions:"
echo "   - Uninstall 'GitHub Copilot' and 'GitHub Copilot Chat'"
echo "   - Restart VS Code"
echo "   - Reinstall both extensions"
echo ""
echo "=================================="
echo "🎯 Most Common Fix:"
echo "   Just reload the window (Ctrl+Shift+P → 'Developer: Reload Window')"
echo "=================================="
