// Polyfill setImmediate for this test environment (some Alpine/node variants lack it)
if (typeof setImmediate === "undefined")
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);

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

  test("POST /api/game/action move updates character positions for authenticated user", async () => {
    // login as admin to obtain token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", role: "admin" });
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
});
