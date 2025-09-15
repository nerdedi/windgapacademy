import React, { useState } from "react";
import UnityPlayer from "./UnityPlayer";

const UnityGamePage = () => {
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle score updates from Unity
  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    // You could also send this to your backend for tracking
    console.log("Score updated:", newScore);
  };

  // Handle level completion from Unity
  const handleLevelComplete = (levelId, completed) => {
    if (completed && !completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
      // You could also send this to your backend for tracking
      console.log("Level completed:", levelId);
    }
  };

  // Handle Unity loaded event
  const handleUnityLoaded = () => {
    setIsLoaded(true);
    console.log("Unity content loaded successfully");
  };

  return (
    <div className="unity-game-page">
      <h1>Windgap Academy Educational Game</h1>

      <div className="game-container">
        <UnityPlayer
          buildUrl="/unity-builds/windgap-academy-game"
          width={960}
          height={600}
          onScoreUpdate={handleScoreUpdate}
          onLevelComplete={handleLevelComplete}
          onUnityLoaded={handleUnityLoaded}
          initialState={{
            playerName: "Student",
            difficulty: "medium",
            accessibility: true,
            startingLevel: 1,
          }}
        />
      </div>

      <div className="game-status">
        <h2>Game Progress</h2>
        <p>Current Score: {score}</p>
        <p>
          Completed Levels: {completedLevels.length > 0 ? completedLevels.join(", ") : "None yet"}
        </p>
        <p>Game Status: {isLoaded ? "Loaded" : "Loading..."}</p>
      </div>

      <div className="game-controls">
        <h2>Game Controls</h2>
        <p>Use the following controls to play the game:</p>
        <ul>
          <li>
            <strong>W, A, S, D</strong> - Move character
          </li>
          <li>
            <strong>Space</strong> - Jump
          </li>
          <li>
            <strong>E</strong> - Interact with objects
          </li>
          <li>
            <strong>ESC</strong> - Pause game
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UnityGamePage;
