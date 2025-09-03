const request = require("supertest");
const app = require("../app");

describe("Assignments API", () => {
  it("should return all assignments", async () => {
    const res = await request(app).get("/api/assignments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("title");
  });

  it("should allow educators to create assignments", async () => {
    // Login as educator to obtain token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "educator", role: "educator" });
    expect(loginRes.body.token).toBeDefined();
    const token = loginRes.body.token;

    // Create assignment as educator
    const createRes = await request(app)
      .post("/api/assignments")
      .send({ title: "New Math Assignment" })
      .set("Authorization", `Bearer ${token}`);
    
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.message).toBe("Assignment created");
    expect(createRes.body.assignment.title).toBe("New Math Assignment");
  });

  it("should deny learners from creating assignments", async () => {
    // Login as learner to obtain token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "learner", role: "learner" });
    expect(loginRes.body.token).toBeDefined();
    const token = loginRes.body.token;

    // Try to create assignment as learner
    const createRes = await request(app)
      .post("/api/assignments")
      .send({ title: "Unauthorized Assignment" })
      .set("Authorization", `Bearer ${token}`);
    
    expect(createRes.statusCode).toBe(403);
    expect(createRes.body.error).toBe("Access denied");
  });
});
