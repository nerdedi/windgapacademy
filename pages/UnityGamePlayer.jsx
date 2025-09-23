import React, { useState } from "react";

import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer.jsx";
import "./UnityGamePlayer.css";

/**
 * Unity Game Player Page - Displays the Unity WebGL content
 */
const UnityGamePlayer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  // Handle Unity loaded event
  const handleUnityLoaded = () => {
    console.log("Unity game loaded successfully");
    setIsLoaded(true);
    setGameStatus("Game loaded and ready to play");
  };

  // Handle messages from Unity
  const handleUnityMessage = (actionType, data) => {
    console.log(`Received message from Unity: ${actionType}`, data);

    if (actionType === "SCORE_UPDATE") {
      setGameStatus(`Score updated: ${data.score}`);
    } else if (actionType === "GAME_COMPLETE") {
      setGameStatus(`Game completed with score: ${data.finalScore}`);
    }
  };

  return (
    <div className="unity-game-page">
      <h1>Windgap Academy Game</h1>

      {/* Status display */}
      <div className="game-status">
        <p>{gameStatus || "Loading game..."}</p>
        <progress value={isLoaded ? 100 : 0} max={100} /> {/* Simple progress bar */}
      </div>

      {/* Unity Player Component */}
      <div className="unity-container">
        <EnhancedUnityPlayer
          buildUrl="/unity-builds/windgap-academy-game"
          width={800}
          height={450}
          onUnityLoaded={handleUnityLoaded}
          onUnityMessage={handleUnityMessage}
        />
      </div>

      {/* Game instructions */}
      {isLoaded && (
        <div className="game-instructions">
          <h2>How to Play</h2>
          <p>Use arrow keys to move your character and space to interact with objects.</p>
        </div>
      )}
    </div>
  );
};

export default UnityGamePlayer;
