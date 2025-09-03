const request = require("supertest");
const express = require("express");

// Mount the real routes from backend/api/game.js
const gameRoutes = require("../api/game");

function makeApp() {
  const app = express();
  app.use("/api/game", gameRoutes);
  return app;
}

describe("/api/game endpoints", () => {
  let app;

  beforeEach(() => {
    app = makeApp();
  });

  test("GET /api/game/state returns JSON state", async () => {
    const res = await request(app).get("/api/game/state");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("state");
    expect(res.body.state).toHaveProperty("characters");
  });

  test("POST /api/game/action move updates character positions", async () => {
    // First save a state with a character
    const initialState = {
      currentGame: "demo",
      characters: [{ id: "c1", x: 0, y: 0 }],
      started: true,
    };
    await request(app).post("/api/game/save").send({ state: initialState }).set("Content-Type", "application/json");

    const moveRes = await request(app)
      .post("/api/game/action")
      .send({ action: "move", id: "c1", x: 10, y: 20 })
      .set("Content-Type", "application/json");

    expect(moveRes.status).toBe(200);
    expect(moveRes.body).toEqual({ ok: true });

    const stateRes = await request(app).get("/api/game/state");
    expect(stateRes.status).toBe(200);
    const ch = stateRes.body.state.characters.find((c) => c.id === "c1");
    expect(ch).toBeDefined();
    expect(ch.x).toBe(10);
    expect(ch.y).toBe(20);
  });
});
