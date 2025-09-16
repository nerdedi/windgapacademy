import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";
import StorylineManager from "../unity-integration/StorylineManager";
import "./CharacterAnimationPlayer.css";

/**
 * Component for displaying character animations with interactive storylines
 */
const CharacterAnimationPlayer = ({
  characterName = "Winnie",
  width = 800,
  height = 450,
  storylineId = "welcome-to-windgap",
  onAnimationComplete = () => {},
  onStoryNodeChange = () => {},
  onStoryComplete = () => {},
  onCharacterChange = () => {},
}) => {
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const [currentStoryNode, setCurrentStoryNode] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(characterName);

  // Set initial character when component props change
  useEffect(() => {
    if (characterName !== currentCharacter && isUnityLoaded) {
      handleSetCharacter(characterName);
    }
  }, [characterName, isUnityLoaded, currentCharacter]);

  // Handle Unity loading completion
  const handleUnityLoaded = useCallback(() => {
    console.log("Unity player loaded successfully");
    setIsUnityLoaded(true);
  }, []);

  // Handle Unity messages
  const handleUnityMessage = useCallback(
    (actionType, data) => {
      console.log(`Received message from Unity: ${actionType}`, data);

      switch (actionType) {
        case "ANIMATION_COMPLETE":
          setCurrentAnimation("");
          onAnimationComplete(data.animationName, data.character);
          break;

        case "CHARACTER_CHANGED":
          setCurrentCharacter(data.character);
          onCharacterChange(data.character);
          break;

        case "STORY_NODE":
          setCurrentStoryNode(data);
          onStoryNodeChange(data);
          break;

        case "STORY_COMPLETE":
          setCurrentStoryNode(null);
          onStoryComplete(data);
          break;

        default:
          // Handle other message types as needed
          break;
      }
    },
    [onAnimationComplete, onCharacterChange, onStoryNodeChange, onStoryComplete],
  );

  // Handle playing animation
  const handlePlayAnimation = useCallback(
    (animationName) => {
      if (!isUnityLoaded || currentAnimation) return;

      const unityPlayer = document.querySelector("canvas")?.parentNode?.__unityInstance;
      if (!unityPlayer) return;

      unityPlayer.SendMessage(
        "ReactBridgeManager",
        "ReceiveFromReact",
        JSON.stringify({
          actionType: "START_ANIMATION",
          characterName: currentCharacter,
          animationName: animationName,
        }),
      );

      setCurrentAnimation(animationName);
    },
    [isUnityLoaded, currentAnimation, currentCharacter],
  );

  // Handle setting character
  const handleSetCharacter = useCallback(
    (character) => {
      if (!isUnityLoaded) return;

      const unityPlayer = document.querySelector("canvas")?.parentNode?.__unityInstance;
      if (!unityPlayer) return;

      unityPlayer.SendMessage(
        "ReactBridgeManager",
        "ReceiveFromReact",
        JSON.stringify({
          actionType: "SET_CHARACTER",
          characterName: character,
        }),
      );

      setCurrentCharacter(character);
    },
    [isUnityLoaded],
  );

  // Handle starting story
  const handleStartStory = useCallback(() => {
    if (!isUnityLoaded) return;

    const unityPlayer = document.querySelector("canvas")?.parentNode?.__unityInstance;
    if (!unityPlayer) return;

    unityPlayer.SendMessage(
      "ReactBridgeManager",
      "ReceiveFromReact",
      JSON.stringify({
        actionType: "START_STORY",
        storyId: storylineId,
      }),
    );
  }, [isUnityLoaded, storylineId]);

  // Handle story choice
  const handleMakeChoice = useCallback(
    (choiceIndex) => {
      if (!isUnityLoaded || !currentStoryNode || !currentStoryNode.isChoicePoint) return;

      const unityPlayer = document.querySelector("canvas")?.parentNode?.__unityInstance;
      if (!unityPlayer) return;

      unityPlayer.SendMessage("StorylineManager", "MakeChoice", choiceIndex.toString());
    },
    [isUnityLoaded, currentStoryNode],
  );

  return (
    <Box className="character-animation-player">
      <Box className="unity-player-container">
        <EnhancedUnityPlayer
          buildUrl="/unity-builds/windgap-academy-animations"
          width={width}
          height={height}
          onUnityLoaded={handleUnityLoaded}
          onUnityMessage={handleUnityMessage}
          initialState={{
            character: characterName,
            startAnimation: "Idle",
          }}
        />
      </Box>

      {isUnityLoaded && (
        <Grid container spacing={2} className="animation-controls">
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              Animation Controls
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box className="animation-buttons">
              <Button
                variant="contained"
                onClick={() => handlePlayAnimation("Talk")}
                disabled={currentAnimation !== ""}
              >
                Talk
              </Button>

              <Button
                variant="contained"
                onClick={() => handlePlayAnimation("Walk")}
                disabled={currentAnimation !== ""}
              >
                Walk
              </Button>

              <Button
                variant="contained"
                onClick={() => handlePlayAnimation("Jump")}
                disabled={currentAnimation !== ""}
              >
                Jump
              </Button>

              <Button
                variant="contained"
                onClick={() => handlePlayAnimation("Celebrate")}
                disabled={currentAnimation !== ""}
              >
                Celebrate
              </Button>

              <Button
                variant="contained"
                onClick={() => handlePlayAnimation("Think")}
                disabled={currentAnimation !== ""}
              >
                Think
              </Button>

              <Button variant="contained" color="primary" onClick={handleStartStory}>
                Start Story
              </Button>
            </Box>
          </Grid>

          {currentStoryNode && currentStoryNode.isChoicePoint && (
            <Grid item xs={12}>
              <Paper elevation={2} className="story-choices">
                <Typography variant="h6" component="h4" gutterBottom>
                  Make a choice:
                </Typography>

                <Box className="choice-buttons">
                  {currentStoryNode.nextNodeIds.map((nodeId, index) => {
                    // Get the node that this choice leads to
                    const story = StorylineManager.getStory(storylineId);
                    const nextNode = story ? story.nodes.find((node) => node.id === nodeId) : null;

                    // Create a preview of the choice
                    const choicePreview = nextNode
                      ? nextNode.dialogText.substring(0, 30) +
                        (nextNode.dialogText.length > 30 ? "..." : "")
                      : `Choice ${index + 1}`;

                    return (
                      <Button
                        key={nodeId}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleMakeChoice(index)}
                        className="choice-button"
                      >
                        {choicePreview}
                      </Button>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default CharacterAnimationPlayer;
