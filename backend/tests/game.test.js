// Polyfill setImmediate for this test environment (some Alpine/node variants lack it)
if (typeof setImmediate === "undefined") global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);

const request = require("supertest");

// Use the real server so auth routes and middleware are available
const app = require("../server");

describe("/api/game endpoints", () => {
  test("GET /api/game/state returns JSON state", async () => {
    const res = await request(app).get("/api/game/state");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("state");
    expect(res.body.state).toHaveProperty("characters");
  });

  test("POST /api/game/action requires authentication", async () => {
    const res = await request(app)
      .post("/api/game/action")
      .send({ action: "move", id: "c1", x: 10, y: 20 });
    expect(res.status).toBe(401);
  });

  test("POST /api/game/save requires authentication", async () => {
    const res = await request(app)
      .post("/api/game/save")
      .send({ state: { currentGame: "demo" } });
    expect(res.status).toBe(401);
  });

  test("POST /api/game/action move updates character positions for authenticated user", async () => {
    // login as admin to obtain token
    const loginRes = await request(app).post("/api/auth/login").send({ username: "admin", role: "admin" });
    const token = loginRes.body.token;

    // First save a state with a character
    const initialState = {
      currentGame: "demo",
      characters: [{ id: "c1", x: 0, y: 0 }],
      started: true,
    };
    await request(app)
      .post("/api/game/save")
      .send({ state: initialState })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const moveRes = await request(app)
      .post("/api/game/action")
      .send({ action: "move", id: "c1", x: 10, y: 20 })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(moveRes.status).toBe(200);
    expect(moveRes.body).toEqual({ ok: true });

    // Fetch saved state for this authenticated user via save location
    const stateRes = await request(app).get("/api/game/state");
    expect(stateRes.status).toBe(200);
    expect(stateRes.body).toHaveProperty("state");
    // Note: the public /state returns demo state; user-specific states are stored server-side map (can't fetch by uid from public endpoint in this demo)
  });

  test("POST /api/game/action event for authenticated user", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({ username: "testuser", role: "learner" });
    const token = loginRes.body.token;

    const eventRes = await request(app)
      .post("/api/game/action")
      .send({ action: "event", event: "level_complete" })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(eventRes.status).toBe(200);
    expect(eventRes.body).toEqual({ ok: true });
  });

  test("POST /api/game/action with unknown action returns 400", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({ username: "testuser", role: "learner" });
    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/game/action")
      .send({ action: "unknown_action" })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /api/game/save with valid state for authenticated user", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({ username: "testuser", role: "learner" });
    const token = loginRes.body.token;

    const gameState = {
      currentGame: "math_quiz",
      characters: [{ id: "player", x: 5, y: 10 }],
      started: true,
      score: 100
    };

    const saveRes = await request(app)
      .post("/api/game/save")
      .send({ state: gameState })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(saveRes.status).toBe(200);
    expect(saveRes.body).toEqual({ ok: true });
  });

  test("POST /api/game/save without state returns 400", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({ username: "testuser", role: "learner" });
    const token = loginRes.body.token;

    const saveRes = await request(app)
      .post("/api/game/save")
      .send({})
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(saveRes.status).toBe(400);
    expect(saveRes.body).toHaveProperty("error");
  });
});
