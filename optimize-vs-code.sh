#!/bin/bash

# Script to optimize VS Code performance by disabling unused extensions
# and cleaning up additional large files

echo "=== VS Code Performance Optimization ==="
echo

echo "=== Disabling unused Unity and development extensions ==="
# Disable Unity-related extensions
code --disable-extension amlovey.shaderlabvscodefree --remote cli
code --disable-extension blennster.unity-code-snippets-improved --remote cli
code --disable-extension coldthunder11.unity-quick-docs --remote cli
code --disable-extension fabriciohod.unity-dev-pack --remote cli
code --disable-extension jorgeserrano.vscode-csharp-snippets --remote cli
code --disable-extension kleber-swf.unity-code-snippets --remote cli
code --disable-extension litefeel.shaderlabformatter --remote cli
code --disable-extension newyellow.unity-shader-formatter --remote cli
code --disable-extension pradeeppurigoswami.unity-code --remote cli
code --disable-extension ptd.vscode-unitymeta --remote cli
code --disable-extension shinganeuler.vscode-unity-debug --remote cli
code --disable-extension slevesque.shader --remote cli
code --disable-extension tobiah.unity-tools --remote cli
code --disable-extension unity.unity-debug --remote cli
code --disable-extension visualstudiotoolsforunity.vstuc --remote cli
code --disable-extension walkme.games-dev-extension-pack --remote cli
code --disable-extension yclepticstudios.unity-snippets --remote cli
code --disable-extension jacqueslucke.blender-development --remote cli

# Disable unused language servers and extensions
code --disable-extension ms-dotnettools.csdevkit --remote cli
code --disable-extension ms-dotnettools.csharp --remote cli
code --disable-extension ms-dotnettools.vscode-dotnet-runtime --remote cli
code --disable-extension ms-vscode.cpptools-extension-pack --remote cli
code --disable-extension ms-vscode.cpptools-themes --remote cli
code --disable-extension ms-vscode.cpptools --remote cli
code --disable-extension ms-vscode.makefile-tools --remote cli
code --disable-extension ms-vscode.powershell --remote cli
code --disable-extension redhat.java --remote cli
code --disable-extension vscjava.vscode-gradle --remote cli
code --disable-extension vscjava.vscode-java-debug --remote cli
code --disable-extension vscjava.vscode-java-dependency --remote cli
code --disable-extension vscjava.vscode-java-pack --remote cli
code --disable-extension vscjava.vscode-java-test --remote cli
code --disable-extension vscjava.vscode-maven --remote cli
code --disable-extension rust-lang.rust-analyzer --remote cli
code --disable-extension bmewburn.vscode-intelephense-client --remote cli
code --disable-extension xdebug.php-debug --remote cli
code --disable-extension wholroyd.jinja --remote cli

echo

echo "=== Cleaning up Git repository to reduce size ==="
echo "Running git gc to clean up the repository"
cd /workspaces/windgapacademy
git gc --aggressive

echo

echo "=== Removing large zip files ==="
find /workspaces/windgapacademy/backend -name "*.zip" -size +10M -exec rm -f {} \;

echo

echo "=== Cleaning Jest cache ==="
rm -rf /workspaces/windgapacademy/node_modules/.cache/jest
rm -rf /tmp/jest_*

echo

echo "=== Clearing browser cache files ==="
rm -rf /workspaces/windgapacademy/.cache/*

echo

echo "=== Cleaning up temporary VS Code files ==="
rm -rf /home/vscode/.vscode-remote/data/User/workspaceStorage/*Cache*
rm -rf /home/vscode/.vscode-remote/data/logs/*/exthost*

echo

echo "=== Optimization complete ==="
echo "Please reload VS Code window for changes to take effect."
echo "Run 'code --list-extensions' to see currently active extensions."
