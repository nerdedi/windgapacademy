import { launchGame as _launchGame } from "./gameHelpers.js";

export default function GameLauncher({ gameId, goal }: { gameId: string; goal?: string }) {
  const onLaunch = () => {
    // dispatch to existing GameManager or open a new window/modal
    // eslint-disable-next-line no-console
    console.log("Launching game", gameId, "goal", goal);
    // naive approach: set a global for GameManager to pick up
    _launchGame(gameId, goal);
  };

  return (
    <div className="mt-3 p-3 border rounded">
      <div className="font-semibold">{goal || "Play a learning game"}</div>
      <button onClick={onLaunch} className="mt-2 btn-primary">
        Launch Game
      </button>
    </div>
  );
}

// exported for testing without rendering the component
// Window interface augmentation moved to global.d.ts for type safety

export function launchGame(gameId: string, goal?: string) {
  // eslint-disable-next-line no-console
  console.log("launchGame helper", gameId, goal);
  // set a global so existing GameManager can pick up the request
  window.__LAUNCH_GAME__ = { gameId, goal };
}
