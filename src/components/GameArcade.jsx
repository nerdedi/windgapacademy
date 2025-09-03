import React from "react";

import { windgapCharacters } from "./Characters";
import GameModes from "./GameModes";

export default function GameArcade() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Game Arcade</h2>
      <p className="mb-6">Play mini-games and challenge Windgap Academy characters!</p>
      <GameModes />
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Meet Your Opponents & Guides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(windgapCharacters).map((char) => (
            <div key={char.name} className="flex flex-col items-center">
              <span className="text-3xl mb-1">{char.avatar}</span>
              <span className="font-semibold text-sm">{char.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
