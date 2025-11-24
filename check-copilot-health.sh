#!/bin/bash

# Quick Copilot health check script
# Run this to verify Copilot configuration

echo "🔍 GitHub Copilot Health Check"
echo "==============================="
echo ""

# Check 1: .copilotignore exists
if [ -f ".copilotignore" ]; then
    echo "✅ .copilotignore file exists"
    IGNORE_COUNT=$(wc -l < .copilotignore)
    echo "   └─ Ignoring $IGNORE_COUNT patterns"
else
    echo "❌ .copilotignore file missing"
fi

# Check 2: VS Code settings
if [ -f ".vscode/settings.json" ]; then
    echo "✅ VS Code settings.json exists"

    if grep -q "github.copilot" .vscode/settings.json 2>/dev/null; then
        echo "   └─ Copilot settings configured"
    else
        echo "   ⚠️  No Copilot settings found"
    fi
else
    echo "❌ .vscode/settings.json missing"
fi

# Check 3: Large directories
echo ""
echo "📊 Large directories (potential slowdowns):"
du -sh node_modules freespeech backend dist 2>/dev/null | while read -r size dir; do
    echo "   $size - $dir"
done

# Check 4: Workspace files
echo ""
WORKSPACE_COUNT=$(find . -maxdepth 1 -name "*.code-workspace" | wc -l)
echo "📁 Workspace files: $WORKSPACE_COUNT found"
if [ "$WORKSPACE_COUNT" -gt 3 ]; then
    echo "   ⚠️  Multiple workspace files may cause confusion"
fi

# Check 5: Git status (for context size)
echo ""
if command -v git &> /dev/null; then
    CHANGED_FILES=$(git status --short 2>/dev/null | wc -l)
    echo "📝 Git changes: $CHANGED_FILES files modified"
    if [ "$CHANGED_FILES" -gt 50 ]; then
        echo "   ⚠️  Large number of changes may slow indexing"
    fi
fi

echo ""
echo "==============================="
echo "🎯 Quick Actions:"
echo ""
echo "If Copilot is slow or failing:"
echo "  1. Run: ./fix-copilot-chat.sh"
echo "  2. Reload Window: Ctrl+Shift+P → 'Developer: Reload Window'"
echo "  3. Check logs: View → Output → GitHub Copilot Chat"
echo ""
echo "For full guide, see: COPILOT_TROUBLESHOOTING.md"
echo "==============================="
