// Small helper to launch games without requiring React or JSX.
export function launchGame(gameId, goal) {
  // eslint-disable-next-line no-console
  console.log("gameHelpers.launchGame", gameId, goal);
  // map well-known goal labels to a description, but keep the original
  // goal as the user-visible gameName when provided.
  let gameDescription = "";
  if (goal === "Practice test") {
    gameDescription = "This is a practice test";
  } else if (goal === "Fluency practice") {
    gameDescription = "Practice reading fluently";
  } else if (goal === "Math practice") {
    gameDescription = "Practice math skills";
  }
  // provide some defaults for common games
  let gameImage = "/assets/fluency.png";
  if (gameId === "mathGame1") {
    gameImage = "/assets/math.png";
  } else if (gameId === "spellingGame1") {
    gameImage = "/assets/spelling.png";
  }
  // provide some defaults for common games
  let gameName = "Practice reading fluently";
  if (gameId === "mathGame1") {
    gameName = "Practice math skills";
  } else if (gameId === "spellingGame1") {
    gameName = "Practice spelling words";
  }
  // set a global so existing GameManager can pick up the request
  // include small launch/close no-ops and flags used by tests
  const payload = {
    gameId,
    gameName: goal || gameName,
    gameDescription: gameDescription || "",
    gameImage,
    launched: false,
    closed: false,
    launch: () => {
      // intentionally a no-op for tests
      return undefined;
    },
    close: () => {
      // intentionally a no-op for tests
      return undefined;
    },
  };

  if (typeof window !== "undefined") {
    window.__LAUNCH_GAME__ = payload;
  }
}

export default { launchGame };
// keep default export for compatibility
