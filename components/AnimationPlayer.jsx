import React, { useState, useCallback } from "react";
import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer.jsx";
import "../unity-integration/EnhancedUnityPlayer.css";

/**
 * A component for displaying character animations and interactive stories
 * using Unity WebGL integration
 */
const AnimationPlayer = ({
  characterName = "Winnie",
  width = 800,
  height = 450,
  onAnimationComplete = () => {},
  onStoryNodeChange = () => {},
  onStoryComplete = () => {},
}) => {
  const [currentCharacter, setCurrentCharacter] = useState(characterName);
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const [currentStoryNode, setCurrentStoryNode] = useState(null);

  // Handle Unity loading completion
  const handleUnityLoaded = useCallback(() => {
    console.log("Unity player loaded successfully");
    setIsUnityLoaded(true);
  }, []);

  // Handle animation completion
  const handleAnimationComplete = useCallback(
    (animationName, character) => {
      console.log(`Animation completed: ${animationName} for ${character}`);
      setCurrentAnimation("");
      onAnimationComplete(animationName, character);
    },
    [onAnimationComplete],
  );

  // Handle messages from Unity
  const handleUnityMessage = useCallback(
    (actionType, data) => {
      console.log(`Received message from Unity: ${actionType}`, data);

      switch (actionType) {
        case "CHARACTER_CHANGED":
          setCurrentCharacter(data.character);
          break;
        case "STORY_NODE":
          setCurrentStoryNode(data);
          onStoryNodeChange(data);
          break;
        case "STORY_COMPLETE":
          setCurrentStoryNode(null);
          onStoryComplete();
          break;
        default:
          // Handle other message types as needed
          break;
      }
    },
    [onStoryNodeChange, onStoryComplete],
  );

  return (
    <div className="animation-player">
      <EnhancedUnityPlayer
        buildUrl="/unity-builds/windgap-academy-animations"
        width={width}
        height={height}
        onUnityLoaded={handleUnityLoaded}
        onAnimationComplete={handleAnimationComplete}
        onUnityMessage={handleUnityMessage}
        initialState={{
          character: characterName,
          startAnimation: "Idle",
        }}
      />

      {isUnityLoaded && (
        <div className="animation-controls">
          <h3>Animation Controls</h3>
          <div className="animation-buttons">
            <button
              onClick={() => {
                const unityPlayer = document.querySelector("canvas").parentNode.__unityInstance;
                unityPlayer.SendMessage(
                  "ReactBridgeManager",
                  "ReceiveFromReact",
                  JSON.stringify({
                    actionType: "START_ANIMATION",
                    characterName: currentCharacter,
                    animationName: "Talk",
                  }),
                );
                setCurrentAnimation("Talk");
              }}
              disabled={currentAnimation !== ""}
            >
              Play Talk Animation
            </button>

            <button
              onClick={() => {
                const unityPlayer = document.querySelector("canvas").parentNode.__unityInstance;
                unityPlayer.SendMessage(
                  "ReactBridgeManager",
                  "ReceiveFromReact",
                  JSON.stringify({
                    actionType: "START_ANIMATION",
                    characterName: currentCharacter,
                    animationName: "Walk",
                  }),
                );
                setCurrentAnimation("Walk");
              }}
              disabled={currentAnimation !== ""}
            >
              Play Walk Animation
            </button>

            <button
              onClick={() => {
                const unityPlayer = document.querySelector("canvas").parentNode.__unityInstance;
                unityPlayer.SendMessage(
                  "ReactBridgeManager",
                  "ReceiveFromReact",
                  JSON.stringify({
                    actionType: "START_STORY",
                  }),
                );
              }}
            >
              Start Story
            </button>
          </div>

          {currentStoryNode && currentStoryNode.isChoicePoint && (
            <div className="story-choices">
              <h4>Make a choice:</h4>
              {currentStoryNode.nextNodeIds.map((nodeId, index) => (
                <button
                  key={nodeId}
                  onClick={() => {
                    const unityPlayer = document.querySelector("canvas").parentNode.__unityInstance;
                    unityPlayer.SendMessage("StorylineManager", "MakeChoice", index.toString());
                  }}
                >
                  Choice {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimationPlayer;
