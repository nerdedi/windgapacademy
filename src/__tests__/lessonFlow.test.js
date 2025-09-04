import { launchGame } from "../../components/gameHelpers";

test("gameHelpers.launchGame sets window.__LAUNCH_GAME__", () => {
  delete window.__LAUNCH_GAME__;
  launchGame("testGame1", "Practice test");
  expect(window.__LAUNCH_GAME__).toBeDefined();
  expect(window.__LAUNCH_GAME__.gameId).toBe("testGame1");
});
