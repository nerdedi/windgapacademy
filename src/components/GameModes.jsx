import React from "react";

import GameArcade from "./GameArcade";

// GameModes is now a simple wrapper for GameArcade
// This maintains backward compatibility while avoiding circular imports
export default function GameModes() {
  return <GameArcade />;
}
