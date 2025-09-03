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
        onClick={() =>
          moveCharacter("c1", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))
        }
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
