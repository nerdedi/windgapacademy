import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const GameContext = createContext(null);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState({
    currentGame: null,
    characters: [],
    started: false,
    lastEvent: null,
  });

  // Fetch initial state from backend
  useEffect(() => {
    let mounted = true;
    fetch("/api/game/state")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.state) setGameState((s) => ({ ...s, ...data.state }));
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const startGame = useCallback((gameId) => {
    setGameState((s) => ({ ...s, currentGame: gameId, started: true }));
  }, []);

  const endGame = useCallback(() => {
    setGameState((s) => ({ ...s, started: false }));
  }, []);

  const moveCharacter = useCallback((id, x, y) => {
    setGameState((s) => {
      const characters = s.characters.map((c) => (c.id === id ? { ...c, x, y } : c));
      return { ...s, characters, lastEvent: { type: "move", id, x, y } };
    });
    // notify backend
    fetch("/api/game/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "move", id, x, y }),
    }).catch(() => {});
  }, []);

  const triggerEvent = useCallback((event) => {
    setGameState((s) => ({ ...s, lastEvent: event }));
    fetch("/api/game/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "event", event }),
    }).catch(() => {});
  }, []);

  const saveState = useCallback(() => {
    fetch("/api/game/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: gameState }),
    }).catch(() => {});
  }, [gameState]);

  const value = {
    gameState,
    startGame,
    endGame,
    moveCharacter,
    triggerEvent,
    saveState,
    setGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;
