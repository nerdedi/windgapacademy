// Simulated Unity Loader for Windgap Academy
var UnityLoader = {
  instantiate: function (containerElementId, buildJson, onProgress) {
    // Create a mock Unity instance
    var unityInstance = {
      SetFullscreen: function (fullscreen) {
        console.log("Setting fullscreen mode: " + fullscreen);
        var container = document.getElementById(containerElementId);
        if (fullscreen) {
          if (container.requestFullscreen) container.requestFullscreen();
          else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
          else if (container.msRequestFullscreen) container.msRequestFullscreen();
        }
      },
      SendMessage: function (gameObjectName, methodName, parameter) {
        console.log(
          "Unity SendMessage: " + gameObjectName + "." + methodName + "(" + parameter + ")",
        );
        // This would normally call into the Unity WebGL instance
      },
      Module: {
        splashScreenStyle: "Dark",
      },
      container: document.getElementById(containerElementId),
    };

    // Simulate loading progress
    var progress = 0;
    var interval = setInterval(function () {
      progress += 0.1;
      if (progress > 1) {
        progress = 1;
        clearInterval(interval);
        console.log("Unity content loaded!");

        // Add placeholder content to the container
        var container = document.getElementById(containerElementId);
        container.innerHTML =
          '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #333; color: white; font-family: Arial;">' +
          '<div style="text-align: center;">' +
          "<h2>Windgap Academy Unity Simulation</h2>" +
          "<p>This is a simulated Unity WebGL build for demonstration purposes.</p>" +
          "<button onclick=\"unityInstance.SendMessage('GameManager', 'StartLevel', 1)\" style=\"padding: 10px; margin: 10px; background: #4CAF50; color: white; border: none; cursor: pointer;\">Start Game</button>" +
          "</div></div>";
      }
      if (onProgress) onProgress(unityInstance, progress);
    }, 200);

    // Create a simulated build JSON file
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildJson, true);
    xhr.responseType = "text";
    xhr.onload = function () {
      if (xhr.status === 404) {
        // Create and write the build JSON file if it doesn't exist
        var buildJsonContent = {
          name: "Windgap Academy WebGL",
          productVersion: "1.0.0",
          dataUrl: "WebGLBuild.data",
          wasmCodeUrl: "WebGLBuild.wasm",
          wasmFrameworkUrl: "WebGLBuild.wasm.framework.js",
          asmCodeUrl: "WebGLBuild.asm.js",
          asmMemoryUrl: "WebGLBuild.asm.mem",
          asmFrameworkUrl: "WebGLBuild.asm.framework.js",
          TOTAL_MEMORY: 268435456,
          graphicsAPI: ["WebGL 2.0", "WebGL 1.0"],
          webglContextAttributes: { preserveDrawingBuffer: false },
          splashScreenStyle: "Dark",
          backgroundColor: "#231F20",
          developmentBuild: false,
          multithreading: false,
          unityVersion: "2022.3.20f1",
        };

        // Write the build JSON to the file system (in a real scenario)
        console.log("Created simulated build configuration: ", buildJsonContent);
      }
    };
    xhr.send();

    return unityInstance;
  },
};
