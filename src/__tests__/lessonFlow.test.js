import { launchGame } from "../../components/gameHelpers";

test("gameHelpers.launchGame sets window.__LAUNCH_GAME__", () => {
  delete window.__LAUNCH_GAME__;
  launchGame("testGame1", "Practice test");
  expect(window.__LAUNCH_GAME__).toBeDefined();
  expect(window.__LAUNCH_GAME__.gameName).toBe("Practice test");
  expect(window.__LAUNCH_GAME__.gameDescription).toBe("This is a practice test");
  expect(window.__LAUNCH_GAME__.gameImage).toBe("/assets/fluency.png");
  expect(window.__LAUNCH_GAME__.gameId).toBe("testGame1");
  expect(typeof window.__LAUNCH_GAME__.launch).toBe("function");
  expect(typeof window.__LAUNCH_GAME__.close).toBe("function");
  // launch and close are no-ops
  window.__LAUNCH_GAME__.launch();
  window.__LAUNCH_GAME__.close();
  expect(window.__LAUNCH_GAME__.launched).toBe(false);
  expect(window.__LAUNCH_GAME__.closed).toBe(false);
  delete window.__LAUNCH_GAME__;
});
