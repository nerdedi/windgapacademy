const request = require("supertest");
const app = require("../app");

describe("Assignments API", () => {
  it("should return all assignments", async () => {
    const res = await request(app).get("/api/assignments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("title");
  });
});
