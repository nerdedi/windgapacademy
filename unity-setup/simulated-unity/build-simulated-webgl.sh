#!/bin/bash
# Simulated Unity WebGL Build Process
# This script simulates building a Unity WebGL project

echo "Simulating Unity WebGL build process for Windgap Academy..."

# Create WebGL build directory structure
BUILD_DIR="/workspaces/windgapacademy/unity-setup/simulated-unity/WebGLBuild"
mkdir -p "$BUILD_DIR/Build"
mkdir -p "$BUILD_DIR/TemplateData"

# Create HTML file
cat > "$BUILD_DIR/index.html" << EOL
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Windgap Academy Unity Game</title>
    <link rel="shortcut icon" href="TemplateData/favicon.ico">
    <link rel="stylesheet" href="TemplateData/style.css">
    <script src="TemplateData/UnityProgress.js"></script>
    <script src="Build/UnityLoader.js"></script>
    <script>
      var unityInstance = UnityLoader.instantiate("unityContainer", "Build/WebGLBuild.json", {onProgress: UnityProgress});
    </script>
  </head>
  <body>
    <div class="webgl-content">
      <div id="unityContainer" style="width: 960px; height: 600px"></div>
      <div class="footer">
        <div class="webgl-logo"></div>
        <div class="fullscreen" onclick="unityInstance.SetFullscreen(1)"></div>
        <div class="title">Windgap Academy</div>
      </div>
    </div>
    <script>
      // JavaScript bridge between Unity and the Windgap Academy platform
      function sendScoreToWindgap(score) {
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'UNITY_SCORE',
            data: { score: score }
          }, '*');
        }
      }
      
      function sendCompletionToWindgap(levelId, completed) {
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'UNITY_LEVEL_COMPLETION',
            data: { levelId: levelId, completed: completed }
          }, '*');
        }
      }
      
      // Listen for messages from the parent Windgap platform
      window.addEventListener('message', function(event) {
        // Forward messages to Unity
        if (event.data && event.data.type === 'WINDGAP_TO_UNITY') {
          if (unityInstance) {
            unityInstance.SendMessage('GameManager', 'ReceiveExternalMessage', JSON.stringify(event.data));
          }
        }
      });
    </script>
  </body>
</html>
EOL

# Create CSS file
cat > "$BUILD_DIR/TemplateData/style.css" << EOL
.webgl-content * {border: 0; margin: 0; padding: 0}
.webgl-content {position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);}
.webgl-content .logo, .progress {position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);}
.webgl-content .logo {background: url('progressLogo.Light.png') no-repeat center / contain; width: 154px; height: 130px;}
.webgl-content .progress {height: 18px; width: 141px; margin-top: 90px;}
.webgl-content .progress .empty {background: url('progressEmpty.Light.png') no-repeat right / cover; float: right; width: 100%; height: 100%; display: inline-block;}
.webgl-content .progress .full {background: url('progressFull.Light.png') no-repeat left / cover; float: left; width: 0%; height: 100%; display: inline-block;}
.webgl-content .logo.Dark {background-image: url('progressLogo.Dark.png');}
.webgl-content .progress.Dark .empty {background-image: url('progressEmpty.Dark.png');}
.webgl-content .progress.Dark .full {background-image: url('progressFull.Dark.png');}
.webgl-content .footer {margin-top: 5px; height: 38px; line-height: 38px; font-family: Helvetica, Verdana, Arial, sans-serif; font-size: 18px;}
.webgl-content .footer .webgl-logo, .title, .fullscreen {height: 100%; display: inline-block; background: transparent center no-repeat;}
.webgl-content .footer .webgl-logo {background-image: url('webgl-logo.png'); width: 204px; float: left;}
.webgl-content .footer .title {margin-right: 10px; float: right;}
.webgl-content .footer .fullscreen {background-image: url('fullscreen.png'); width: 38px; float: right;}
EOL

# Create UnityProgress.js
cat > "$BUILD_DIR/TemplateData/UnityProgress.js" << EOL
function UnityProgress(unityInstance, progress) {
  if (!unityInstance.Module)
    return;
  if (!unityInstance.logo) {
    unityInstance.logo = document.createElement("div");
    unityInstance.logo.className = "logo " + unityInstance.Module.splashScreenStyle;
    unityInstance.container.appendChild(unityInstance.logo);
  }
  if (!unityInstance.progress) {    
    unityInstance.progress = document.createElement("div");
    unityInstance.progress.className = "progress " + unityInstance.Module.splashScreenStyle;
    unityInstance.progress.empty = document.createElement("div");
    unityInstance.progress.empty.className = "empty";
    unityInstance.progress.appendChild(unityInstance.progress.empty);
    unityInstance.progress.full = document.createElement("div");
    unityInstance.progress.full.className = "full";
    unityInstance.progress.appendChild(unityInstance.progress.full);
    unityInstance.container.appendChild(unityInstance.progress);
  }
  unityInstance.progress.full.style.width = (100 * progress) + "%";
  unityInstance.progress.empty.style.width = (100 * (1 - progress)) + "%";
  if (progress == 1)
    unityInstance.logo.style.display = unityInstance.progress.style.display = "none";
}
EOL

# Create a simulated Unity loader JS file
cat > "$BUILD_DIR/Build/UnityLoader.js" << EOL
// Simulated Unity Loader for Windgap Academy
var UnityLoader = {
  instantiate: function(containerElementId, buildJson, onProgress) {
    // Create a mock Unity instance
    var unityInstance = {
      SetFullscreen: function(fullscreen) {
        console.log("Setting fullscreen mode: " + fullscreen);
        var container = document.getElementById(containerElementId);
        if (fullscreen) {
          if (container.requestFullscreen) container.requestFullscreen();
          else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
          else if (container.msRequestFullscreen) container.msRequestFullscreen();
        }
      },
      SendMessage: function(gameObjectName, methodName, parameter) {
        console.log("Unity SendMessage: " + gameObjectName + "." + methodName + "(" + parameter + ")");
        // This would normally call into the Unity WebGL instance
      },
      Module: {
        splashScreenStyle: "Dark"
      },
      container: document.getElementById(containerElementId)
    };
    
    // Simulate loading progress
    var progress = 0;
    var interval = setInterval(function() {
      progress += 0.1;
      if (progress > 1) {
        progress = 1;
        clearInterval(interval);
        console.log("Unity content loaded!");
        
        // Add placeholder content to the container
        var container = document.getElementById(containerElementId);
        container.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #333; color: white; font-family: Arial;">' +
                             '<div style="text-align: center;">' +
                             '<h2>Windgap Academy Unity Simulation</h2>' +
                             '<p>This is a simulated Unity WebGL build for demonstration purposes.</p>' +
                             '<button onclick="unityInstance.SendMessage(\'GameManager\', \'StartLevel\', 1)" style="padding: 10px; margin: 10px; background: #4CAF50; color: white; border: none; cursor: pointer;">Start Game</button>' +
                             '</div></div>';
      }
      if (onProgress) onProgress(unityInstance, progress);
    }, 200);
    
    // Create a simulated build JSON file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', buildJson, true);
    xhr.responseType = 'text';
    xhr.onload = function() {
      if (xhr.status === 404) {
        // Create and write the build JSON file if it doesn't exist
        var buildJsonContent = {
          "name": "Windgap Academy WebGL",
          "productVersion": "1.0.0",
          "dataUrl": "WebGLBuild.data",
          "wasmCodeUrl": "WebGLBuild.wasm",
          "wasmFrameworkUrl": "WebGLBuild.wasm.framework.js",
          "asmCodeUrl": "WebGLBuild.asm.js",
          "asmMemoryUrl": "WebGLBuild.asm.mem",
          "asmFrameworkUrl": "WebGLBuild.asm.framework.js",
          "TOTAL_MEMORY": 268435456,
          "graphicsAPI": ["WebGL 2.0", "WebGL 1.0"],
          "webglContextAttributes": {"preserveDrawingBuffer": false},
          "splashScreenStyle": "Dark",
          "backgroundColor": "#231F20",
          "developmentBuild": false,
          "multithreading": false,
          "unityVersion": "2022.3.20f1"
        };
        
        // Write the build JSON to the file system (in a real scenario)
        console.log("Created simulated build configuration: ", buildJsonContent);
      }
    };
    xhr.send();
    
    return unityInstance;
  }
};
EOL

# Create simulated build JSON file
cat > "$BUILD_DIR/Build/WebGLBuild.json" << EOL
{
  "name": "Windgap Academy WebGL",
  "productVersion": "1.0.0",
  "dataUrl": "WebGLBuild.data",
  "wasmCodeUrl": "WebGLBuild.wasm",
  "wasmFrameworkUrl": "WebGLBuild.wasm.framework.js",
  "asmCodeUrl": "WebGLBuild.asm.js",
  "asmMemoryUrl": "WebGLBuild.asm.mem",
  "asmFrameworkUrl": "WebGLBuild.asm.framework.js",
  "TOTAL_MEMORY": 268435456,
  "graphicsAPI": ["WebGL 2.0", "WebGL 1.0"],
  "webglContextAttributes": {"preserveDrawingBuffer": false},
  "splashScreenStyle": "Dark",
  "backgroundColor": "#231F20",
  "developmentBuild": false,
  "multithreading": false,
  "unityVersion": "2022.3.20f1"
}
EOL

# Create empty placeholder files for the build
touch "$BUILD_DIR/Build/WebGLBuild.data"
touch "$BUILD_DIR/Build/WebGLBuild.wasm"
touch "$BUILD_DIR/Build/WebGLBuild.wasm.framework.js"

# Create icons and images for the template
touch "$BUILD_DIR/TemplateData/favicon.ico"
touch "$BUILD_DIR/TemplateData/progressEmpty.Dark.png"
touch "$BUILD_DIR/TemplateData/progressEmpty.Light.png"
touch "$BUILD_DIR/TemplateData/progressFull.Dark.png"
touch "$BUILD_DIR/TemplateData/progressFull.Light.png"
touch "$BUILD_DIR/TemplateData/progressLogo.Dark.png"
touch "$BUILD_DIR/TemplateData/progressLogo.Light.png"
touch "$BUILD_DIR/TemplateData/webgl-logo.png"
touch "$BUILD_DIR/TemplateData/fullscreen.png"

echo "Simulated Unity WebGL build completed successfully!"
echo "You can view the WebGL build by opening $BUILD_DIR/index.html in a browser."