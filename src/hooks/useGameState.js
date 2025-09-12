import { useState, useEffect } from "react";

// Simple game state hook
export const useGameState = () => {
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    lives: 3,
    powerUps: [],
    achievements: [],
    isPlaying: false,
    isPaused: false,
    gameMode: "adventure",
  });

  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    // Load game state from localStorage
    const savedState = localStorage.getItem("windgap-game-state");
    if (savedState) {
      try {
        setGameState(JSON.parse(savedState));
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    }

    const savedStats = localStorage.getItem("windgap-game-stats");
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats));
      } catch (error) {
        console.error("Failed to load game stats:", error);
      }
    }
  }, []);

  const saveGameState = (newState) => {
    setGameState(newState);
    localStorage.setItem("windgap-game-state", JSON.stringify(newState));
  };

  const saveGameStats = (newStats) => {
    setGameStats(newStats);
    localStorage.setItem("windgap-game-stats", JSON.stringify(newStats));
  };

  const startGame = (mode = "adventure") => {
    const newState = {
      ...gameState,
      isPlaying: true,
      isPaused: false,
      gameMode: mode,
      score: 0,
      lives: 3,
      currentLevel: 1,
    };
    saveGameState(newState);
  };

  const pauseGame = () => {
    saveGameState({ ...gameState, isPaused: true });
  };

  const resumeGame = () => {
    saveGameState({ ...gameState, isPaused: false });
  };

  const endGame = () => {
    const newStats = {
      ...gameStats,
      totalGamesPlayed: gameStats.totalGamesPlayed + 1,
      totalScore: gameStats.totalScore + gameState.score,
      bestScore: Math.max(gameStats.bestScore, gameState.score),
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.totalGamesPlayed);

    saveGameStats(newStats);
    saveGameState({ ...gameState, isPlaying: false, isPaused: false });
  };

  const updateScore = (points) => {
    saveGameState({ ...gameState, score: gameState.score + points });
  };

  const levelUp = () => {
    saveGameState({ ...gameState, currentLevel: gameState.currentLevel + 1 });
  };

  const loseLife = () => {
    const newLives = gameState.lives - 1;
    if (newLives <= 0) {
      endGame();
    } else {
      saveGameState({ ...gameState, lives: newLives });
    }
  };

  const addPowerUp = (powerUp) => {
    saveGameState({
      ...gameState,
      powerUps: [...gameState.powerUps, powerUp],
    });
  };

  const usePowerUp = (powerUpId) => {
    saveGameState({
      ...gameState,
      powerUps: gameState.powerUps.filter((p) => p.id !== powerUpId),
    });
  };

  const addAchievement = (achievement) => {
    if (!gameState.achievements.find((a) => a.id === achievement.id)) {
      saveGameState({
        ...gameState,
        achievements: [...gameState.achievements, achievement],
      });
    }
  };

  return {
    gameState,
    gameStats,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    updateScore,
    levelUp,
    loseLife,
    addPowerUp,
    usePowerUp,
    addAchievement,
  };
};

export default useGameState;
