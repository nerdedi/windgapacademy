#!/bin/bash
# Script to deploy Unity WebGL builds to the Windgap Academy web app

# Paths
UNITY_BUILD_PATH="/workspaces/windgapacademy/unity-setup/simulated-unity/WebGLBuild"
WEB_APP_UNITY_PATH="/workspaces/windgapacademy/public/unity-builds/windgap-academy-game"

# Create destination directory if it doesn't exist
mkdir -p "$WEB_APP_UNITY_PATH"

# Copy the Unity WebGL build to the web app public directory
echo "Copying Unity WebGL build to web app..."
cp -r "$UNITY_BUILD_PATH"/* "$WEB_APP_UNITY_PATH"

# Create .htaccess file for proper MIME types
cat > "$WEB_APP_UNITY_PATH/.htaccess" << HTACCESS
# Unity WebGL build MIME types
AddType application/wasm .wasm
AddType application/javascript .js
AddType application/octet-stream .data
AddType application/json .json
AddType text/html .html
AddType text/css .css
AddType image/png .png
AddType image/jpg .jpg
AddType image/jpeg .jpeg
AddType image/gif .gif
AddType image/ico .ico

# Enable CORS
Header set Access-Control-Allow-Origin "*"
HTACCESS

# Update permissions
chmod -R 755 "$WEB_APP_UNITY_PATH"

echo "Unity WebGL build deployed successfully to the web app!"
echo "The game is now available at: /unity-builds/windgap-academy-game/"
