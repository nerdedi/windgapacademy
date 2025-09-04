const { normalizeRole } = require("../normalizeRole");

describe("normalizeRole", () => {
  test("maps student to learner", () => {
    expect(normalizeRole("student")).toBe("learner");
  });

  test("maps trainer and teacher to educator", () => {
    expect(normalizeRole("trainer")).toBe("educator");
    expect(normalizeRole("teacher")).toBe("educator");
  });

  test("preserves educator and learner (case-insensitive)", () => {
    expect(normalizeRole("Educator")).toBe("educator");
    expect(normalizeRole("Learner")).toBe("learner");
  });

  test("returns undefined for falsy or empty inputs", () => {
    expect(normalizeRole(null)).toBeUndefined();
    expect(normalizeRole(undefined)).toBeUndefined();
    expect(normalizeRole("")).toBeUndefined();
    expect(normalizeRole("   ")).toBeUndefined();
  });

  test("unknown role returns lowercased string", () => {
    expect(normalizeRole("Admin")).toBe("admin");
  });
});
