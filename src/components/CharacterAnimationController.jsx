import React, { useState, useCallback, useEffect } from "react";

import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";
import { sendToUnity } from "../unity-integration/UnityBridge";
import "./CharacterAnimationController.css";

/**
 * Component for controlling character animations in Unity from React
 */
const CharacterAnimationController = ({
  characterId = "Winnie",
  width = 800,
  height = 450,
  buildUrl = "/unity-builds/windgap-academy-animations",
}) => {
  // State
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const [animationLog, setAnimationLog] = useState([]);
  const [selectedEmote, setSelectedEmote] = useState("happy");

  // Available animations
  const animations = [
    { name: "talk", label: "Talk", duration: 3.0 },
    { name: "walk", label: "Walk", duration: 0 },
    { name: "jump", label: "Jump", duration: 1.5 },
    { name: "celebrate", label: "Celebrate", duration: 2.0 },
    { name: "think", label: "Think", duration: 2.5 },
  ];

  // Available emotes
  const emotes = [
    { name: "happy", label: "Happy" },
    { name: "sad", label: "Sad" },
    { name: "confused", label: "Confused" },
    { name: "excited", label: "Excited" },
    { name: "surprised", label: "Surprised" },
  ];

  // Animation sequences
  const sequences = [
    {
      name: "greeting",
      label: "Greeting",
      sequence: [
        { animation: "idle", duration: 0.5 },
        { animation: "talk", duration: 2.0 },
        { animation: "celebrate", duration: 1.0 },
      ],
    },
    {
      name: "teaching",
      label: "Teaching",
      sequence: [
        { animation: "talk", duration: 2.0 },
        { animation: "think", duration: 1.5 },
        { animation: "talk", duration: 2.0 },
        { animation: "celebrate", duration: 1.0 },
      ],
    },
  ];

  // Handle Unity loaded
  const handleUnityLoaded = useCallback(() => {
    console.log("Unity loaded successfully");
    setIsUnityLoaded(true);

    // Add to log
    setAnimationLog((prev) => [...prev, "Unity loaded successfully"]);

    // Initialize Unity with the character
    sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
      actionType: "INITIALIZE",
      state: {
        character: characterId,
        startAnimation: "idle",
      },
    });

    // Add to log
    setAnimationLog((prev) => [...prev, `Set character to ${characterId}`]);
  }, [characterId]);

  // Handle Unity messages
  const handleUnityMessage = useCallback((actionType, data) => {
    console.log(`Received message from Unity: ${actionType}`, data);

    if (actionType === "ANIMATION_STARTED") {
      // Add to log
      setAnimationLog((prev) => [
        ...prev,
        `Animation started: ${data.animationName} for ${data.characterName}`,
      ]);
      setCurrentAnimation(data.animationName);
    }

    if (actionType === "ANIMATION_COMPLETED") {
      // Add to log
      setAnimationLog((prev) => [
        ...prev,
        `Animation completed: ${data.animationName} for ${data.characterName}`,
      ]);
      setCurrentAnimation("");
    }
  }, []);

  // Play animation
  const handlePlayAnimation = useCallback(
    (animationName, duration = 0) => {
      if (!isUnityLoaded || currentAnimation) return;

      sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "START_ANIMATION",
        characterName: characterId,
        animationName: animationName,
        duration: duration,
      });

      // Add to log
      setAnimationLog((prev) => [
        ...prev,
        `Requested animation: ${animationName}${duration ? ` (${duration}s)` : ""}`,
      ]);

      // Set current animation
      setCurrentAnimation(animationName);
    },
    [isUnityLoaded, currentAnimation, characterId],
  );

  // Play emote
  const handlePlayEmote = useCallback(() => {
    if (!isUnityLoaded || currentAnimation || !selectedEmote) return;

    sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
      actionType: "PLAY_EMOTE",
      characterId: characterId,
      emoteName: selectedEmote,
    });

    // Add to log
    setAnimationLog((prev) => [...prev, `Requested emote: ${selectedEmote}`]);

    // Set current animation (emotes typically use animations underneath)
    setCurrentAnimation(`emote:${selectedEmote}`);
  }, [isUnityLoaded, currentAnimation, characterId, selectedEmote]);

  // Play sequence
  const handlePlaySequence = useCallback(
    (sequenceName) => {
      if (!isUnityLoaded || currentAnimation) return;

      const sequence = sequences.find((s) => s.name === sequenceName);
      if (!sequence) return;

      sendToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "PLAY_SEQUENCE",
        characterId: characterId,
        sequence: sequence.sequence,
      });

      // Add to log
      setAnimationLog((prev) => [...prev, `Requested sequence: ${sequenceName}`]);

      // Set current animation
      setCurrentAnimation(`sequence:${sequenceName}`);
    },
    [isUnityLoaded, currentAnimation, characterId, sequences],
  );

  // Limit log size
  useEffect(() => {
    if (animationLog.length > 10) {
      setAnimationLog((prev) => prev.slice(prev.length - 10));
    }
  }, [animationLog]);

  return (
    <div className="character-animation-controller">
      <h2>Character Animation Controller</h2>

      <div className="unity-animation-container">
        {/* Unity Player */}
        <div className="unity-player">
          <EnhancedUnityPlayer
            buildUrl={buildUrl}
            width={width}
            height={height}
            onUnityLoaded={handleUnityLoaded}
            onUnityMessage={handleUnityMessage}
            initialState={{
              character: characterId,
              startAnimation: "idle",
            }}
          />
        </div>

        {/* Animation Controls */}
        {isUnityLoaded && (
          <div className="animation-controls">
            <div className="control-section">
              <h3>Basic Animations</h3>
              <div className="button-group">
                {animations.map((animation) => (
                  <button
                    key={animation.name}
                    onClick={() => handlePlayAnimation(animation.name, animation.duration)}
                    disabled={!!currentAnimation}
                    className={currentAnimation === animation.name ? "active" : ""}
                  >
                    {animation.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-section">
              <h3>Emotes</h3>
              <div className="emote-controls">
                <select
                  value={selectedEmote}
                  onChange={(e) => setSelectedEmote(e.target.value)}
                  disabled={!!currentAnimation}
                >
                  {emotes.map((emote) => (
                    <option key={emote.name} value={emote.name}>
                      {emote.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handlePlayEmote}
                  disabled={!!currentAnimation}
                  className={currentAnimation?.startsWith("emote:") ? "active" : ""}
                >
                  Play Emote
                </button>
              </div>
            </div>

            <div className="control-section">
              <h3>Animation Sequences</h3>
              <div className="button-group">
                {sequences.map((sequence) => (
                  <button
                    key={sequence.name}
                    onClick={() => handlePlaySequence(sequence.name)}
                    disabled={!!currentAnimation}
                    className={currentAnimation === `sequence:${sequence.name}` ? "active" : ""}
                  >
                    {sequence.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Log */}
      <div className="animation-log">
        <h3>Animation Log</h3>
        <div className="log-entries">
          {animationLog.map((entry, index) => (
            <div key={index} className="log-entry">
              {entry}
            </div>
          ))}
        </div>
      </div>

      {/* Animation Status */}
      <div className="animation-status">
        <p>
          Status:{" "}
          {!isUnityLoaded
            ? "Loading Unity..."
            : currentAnimation
              ? `Playing: ${currentAnimation}`
              : "Idle"}
        </p>
      </div>
    </div>
  );
};

export default CharacterAnimationController;
