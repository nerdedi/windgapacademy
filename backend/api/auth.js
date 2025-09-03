const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set in environment variables");

// Dummy login endpoint
router.post("/login", (req, res) => {
  const { username, role } = req.body;
  // In production, validate credentials from DB
  if (!username || !role) {
    return res.status(400).json({ error: "Missing credentials" });
  }
  const user = { username, role };
  const token = jwt.sign(user, SECRET, { expiresIn: "2h" });
  console.log(`[LOGIN] ${username} logged in as ${role}`);
  res.json({ token });
});

module.exports = router;
