import React from "react";
import GameProvider, { useGame } from "./GameManager";

function PlaygroundInner() {
  const { gameState, startGame, endGame, moveCharacter, saveState } = useGame();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Game Playground</h1>
      <div className="mb-4">Started: {String(gameState.started)}</div>
      <button onClick={() => startGame("demo")} className="mr-2 bg-blue-500 text-white p-2 rounded">
        Start
      </button>
      <button onClick={endGame} className="mr-2 bg-gray-500 text-white p-2 rounded">
        End
      </button>
      <button
        onClick={() => moveCharacter("c1", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))}
        className="mr-2 bg-green-500 text-white p-2 rounded"
      >
        Move Character
      </button>
      <button onClick={saveState} className="bg-indigo-500 text-white p-2 rounded">
        Save State
      </button>
    </div>
  );
}

export default function GamePlayground() {
  return (
    <GameProvider>
      <PlaygroundInner />
    </GameProvider>
  );
}
import React from "react";

import { useGame } from "./GameManager";

function Character({ c, onMove }) {
  const style = {
    position: "absolute",
    left: `${c.x || 0}px`,
    top: `${c.y || 0}px`,
    width: 48,
    height: 48,
    background: "#6b21a8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    cursor: "pointer",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Character ${c.id}`}
      style={style}
      onClick={() => onMove(c.id, (c.x || 0) + 30, (c.y || 0) + 10)}
      onKeyDown={(e) => e.key === "Enter" && onMove(c.id, (c.x || 0) + 30, (c.y || 0) + 10)}
    >
      {c.name || "C"}
    </div>
  );
}

export default function GamePlayground() {
  const { gameState, moveCharacter, startGame, saveState } = useGame();

  if (!gameState) return null;

  return (
    <div style={{ padding: 16 }}>
      <h2>Playground</h2>
      {!gameState.started ? (
        <button onClick={() => startGame("demo")}>Start Demo Game</button>
      ) : (
        <div>
          <div
            style={{
              position: "relative",
              width: 800,
              height: 400,
              background: "#f3f4f6",
              marginTop: 12,
            }}
          >
            {gameState.characters.length
              ? gameState.characters
              : [{ id: "p1", x: 20, y: 20, name: "A" }]
                .map((c) => (
                  <Character key={c.id} c={c} onMove={moveCharacter} />
                ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={saveState}>Save State</button>
          </div>
        </div>
      )}
    </div>
  );
}
