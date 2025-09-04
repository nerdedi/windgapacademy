// Small helper to launch games without requiring React or JSX.
export function launchGame(gameId, goal) {
  // eslint-disable-next-line no-console
  console.log("gameHelpers.launchGame", gameId, goal);
  // set a global so existing GameManager can pick up the request
  // keep it simple for tests and runtime
  if (typeof window !== "undefined") {
    window.__LAUNCH_GAME__ = { gameId, goal };
  }
}

export default { launchGame };
