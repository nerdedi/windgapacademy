// JavaScript loader for Unity WebGL build
// This file simulates the Unity WebGL loader behavior for development

var createUnityInstance = (function () {
  return function (canvas, config, progressCallback) {
    var buildUrl = config.dataUrl.substring(0, config.dataUrl.lastIndexOf("/"));
    console.log("Creating Unity instance with build URL:", buildUrl);

    // Simulate loading progress
    var loadingInterval = setInterval(function () {
      var progress = Math.min(1.0, progressCallback.lastProgress + 0.1);
      progressCallback(progress);
      progressCallback.lastProgress = progress;

      if (progress >= 1.0) {
        clearInterval(loadingInterval);
        completeLoading();
      }
    }, 100);
    progressCallback.lastProgress = 0;

    // Create mock Unity instance
    var unityInstance = {
      // Mock methods that would be available in a real Unity WebGL build
      SendMessage: function (gameObjectName, methodName, parameter) {
        console.log("SendMessage to Unity:", gameObjectName, methodName, parameter);

        // Simulate receiving a message from Unity
        setTimeout(function () {
          simulateUnityResponse(gameObjectName, methodName, parameter);
        }, 500);
      },
      SetFullscreen: function (fullscreen) {
        console.log("Set fullscreen:", fullscreen);
      },
      Quit: function () {
        console.log("Unity instance quit");
      },
    };

    // Complete loading callback
    function completeLoading() {
      // Store the instance in the canvas parent for global access
      canvas.parentNode.__unityInstance = unityInstance;
      console.log("Unity instance ready");
    }

    // Simulate responses from Unity based on messages sent
    function simulateUnityResponse(gameObjectName, methodName, parameter) {
      if (gameObjectName === "ReactBridgeManager" && methodName === "ReceiveFromReact") {
        try {
          var message = JSON.parse(parameter);

          switch (message.actionType) {
            case "START_ANIMATION":
              console.log(
                "Simulating animation:",
                message.animationName,
                "for character:",
                message.characterName,
              );

              // Simulate animation completion after a delay
              setTimeout(function () {
                if (window.unityToReact && window.unityToReact.onAnimationComplete) {
                  window.unityToReact.onAnimationComplete(
                    JSON.stringify({
                      animationName: message.animationName,
                      character: message.characterName,
                    }),
                  );
                }
              }, 2000); // Animation lasts 2 seconds in this simulation
              break;

            case "SET_CHARACTER":
              console.log("Simulating character change:", message.characterName);

              // Simulate character changed event
              if (window.unityToReact && window.unityToReact.onCharacterChanged) {
                window.unityToReact.onCharacterChanged(
                  JSON.stringify({
                    character: message.characterName,
                  }),
                );
              }
              break;

            case "START_STORY":
              console.log("Simulating story start:", message.storyId || "default");

              // Simulate first story node
              if (window.unityToReact && window.unityToReact.onStoryNode) {
                window.unityToReact.onStoryNode(
                  JSON.stringify({
                    id: "welcome-1",
                    characterName: "Winnie",
                    dialogText:
                      "Hello and welcome to Windgap Academy! I'm Winnie, and I'll be your guide through this learning journey.",
                    animationName: "Talk",
                    isChoicePoint: false,
                    nextNodeIds: ["welcome-2"],
                  }),
                );

                // Simulate more story nodes after delays
                setTimeout(function () {
                  if (window.unityToReact && window.unityToReact.onStoryNode) {
                    window.unityToReact.onStoryNode(
                      JSON.stringify({
                        id: "welcome-2",
                        characterName: "Winnie",
                        dialogText:
                          "At Windgap, we believe that learning should be engaging, interactive, and fun!",
                        animationName: "Celebrate",
                        isChoicePoint: false,
                        nextNodeIds: ["welcome-3"],
                      }),
                    );
                  }
                }, 3000);

                setTimeout(function () {
                  if (window.unityToReact && window.unityToReact.onStoryNode) {
                    window.unityToReact.onStoryNode(
                      JSON.stringify({
                        id: "welcome-3",
                        characterName: "Winnie",
                        dialogText:
                          "Would you like to meet the other characters who will help you on your learning journey?",
                        animationName: "Talk",
                        isChoicePoint: true,
                        nextNodeIds: ["welcome-4", "welcome-5"],
                      }),
                    );
                  }
                }, 6000);
              }
              break;

            case "INITIALIZE":
              console.log("Initializing Unity with state:", message.state);

              // Simulate initialized event
              if (window.unityToReact && window.unityToReact.onMessage) {
                window.unityToReact.onMessage(
                  "INITIALIZED",
                  JSON.stringify({
                    success: true,
                  }),
                );
              }
              break;

            default:
              console.log("Unknown action type:", message.actionType);
              break;
          }
        } catch (error) {
          console.error("Error processing message to Unity:", error);
        }
      } else if (gameObjectName === "StorylineManager" && methodName === "MakeChoice") {
        var choiceIndex = parseInt(parameter);
        console.log("Simulating story choice:", choiceIndex);

        // Simulate choice result
        if (choiceIndex === 0) {
          // First choice: meet other characters
          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryNode) {
              window.unityToReact.onStoryNode(
                JSON.stringify({
                  id: "welcome-4",
                  characterName: "Winnie",
                  dialogText: "Great! Let's introduce you to the team.",
                  animationName: "Celebrate",
                  isChoicePoint: false,
                  nextNodeIds: ["intro-andy-1"],
                }),
              );
            }
          }, 1000);

          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryNode) {
              window.unityToReact.onStoryNode(
                JSON.stringify({
                  id: "intro-andy-1",
                  characterName: "Andy",
                  dialogText:
                    "Hi there! I'm Andy. I'm a technology enthusiast and I'll be guiding you through all the computer skills and problem-solving activities.",
                  animationName: "Talk",
                  isChoicePoint: false,
                  nextNodeIds: ["intro-andy-2"],
                }),
              );
            }
          }, 3000);

          // More story nodes would continue here...

          // Eventually end the story
          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryComplete) {
              window.unityToReact.onStoryComplete(
                JSON.stringify({
                  storyId: "welcome-to-windgap",
                  title: "Welcome to Windgap Academy",
                }),
              );
            }
          }, 15000);
        } else {
          // Second choice: explore later
          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryNode) {
              window.unityToReact.onStoryNode(
                JSON.stringify({
                  id: "welcome-5",
                  characterName: "Winnie",
                  dialogText: "No problem! Take your time to explore, and you can meet them later.",
                  animationName: "Talk",
                  isChoicePoint: false,
                  nextNodeIds: ["welcome-end"],
                }),
              );
            }
          }, 1000);

          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryNode) {
              window.unityToReact.onStoryNode(
                JSON.stringify({
                  id: "welcome-end",
                  characterName: "Winnie",
                  dialogText:
                    "Now you know our team! We're all excited to embark on this learning adventure with you. Feel free to explore the academy and start your journey whenever you're ready!",
                  animationName: "Celebrate",
                  isChoicePoint: false,
                  nextNodeIds: [],
                }),
              );
            }
          }, 3000);

          // End the story
          setTimeout(function () {
            if (window.unityToReact && window.unityToReact.onStoryComplete) {
              window.unityToReact.onStoryComplete(
                JSON.stringify({
                  storyId: "welcome-to-windgap",
                  title: "Welcome to Windgap Academy",
                }),
              );
            }
          }, 5000);
        }
      }
    }

    return Promise.resolve(unityInstance);
  };
})();
