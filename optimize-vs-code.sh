#!/bin/bash

# Script to optimize VS Code performance by disabling unused extensions
# and cleaning up additional large files

echo "=== VS Code Performance Optimization ==="
echo

echo "=== Disabling unused Unity and development extensions ==="
# Disable Unity-related extensions
code --disable-extension amlovey.shaderlabvscodefree
code --disable-extension blennster.unity-code-snippets-improved
code --disable-extension coldthunder11.unity-quick-docs
code --disable-extension fabriciohod.unity-dev-pack
code --disable-extension jorgeserrano.vscode-csharp-snippets
code --disable-extension kleber-swf.unity-code-snippets
code --disable-extension litefeel.shaderlabformatter
code --disable-extension newyellow.unity-shader-formatter
code --disable-extension pradeeppurigoswami.unity-code
code --disable-extension ptd.vscode-unitymeta
code --disable-extension shinganeuler.vscode-unity-debug
code --disable-extension slevesque.shader
code --disable-extension tobiah.unity-tools
code --disable-extension unity.unity-debug
code --disable-extension visualstudiotoolsforunity.vstuc
code --disable-extension walkme.games-dev-extension-pack
code --disable-extension yclepticstudios.unity-snippets
code --disable-extension jacqueslucke.blender-development

# Disable unused language servers and extensions
code --disable-extension ms-dotnettools.csdevkit
code --disable-extension ms-dotnettools.csharp
code --disable-extension ms-dotnettools.vscode-dotnet-runtime
code --disable-extension ms-vscode.cpptools-extension-pack
code --disable-extension ms-vscode.cpptools-themes
code --disable-extension ms-vscode.cpptools
code --disable-extension ms-vscode.makefile-tools
code --disable-extension ms-vscode.powershell
code --disable-extension redhat.java
code --disable-extension vscjava.vscode-gradle
code --disable-extension vscjava.vscode-java-debug
code --disable-extension vscjava.vscode-java-dependency
code --disable-extension vscjava.vscode-java-pack
code --disable-extension vscjava.vscode-java-test
code --disable-extension vscjava.vscode-maven
code --disable-extension rust-lang.rust-analyzer
code --disable-extension bmewburn.vscode-intelephense-client
code --disable-extension xdebug.php-debug
code --disable-extension wholroyd.jinja

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
