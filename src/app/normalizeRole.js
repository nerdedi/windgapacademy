function normalizeRole(r) {
  if (!r) return undefined;
  const s = String(r).trim().toLowerCase();
  if (!s) return undefined;
  if (s === "student") return "learner";
  if (s === "trainer" || s === "teacher") return "educator";
  if (s === "educator" || s === "learner") return s;
  return s;
}

module.exports = { normalizeRole };
