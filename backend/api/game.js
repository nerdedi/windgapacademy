const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

// Map of userId -> state for demo persistence
const USER_GAME_STATES = new Map();

router.get("/state", (req, res) => {
  // Public read of default demo state
  const demo = USER_GAME_STATES.get("__demo__") || {
    currentGame: null,
    characters: [],
    started: false,
  };
  res.json({ state: demo });
});

router.post("/action", express.json(), authenticateToken, (req, res) => {
  const { action } = req.body || {};
  // support tokens issued with { id } or { username } in payload
  const uid = (req.user && (req.user.id || req.user.username)) || null;
  if (!uid) return res.status(401).json({ error: "unauthenticated" });

  const state = USER_GAME_STATES.get(uid) || { currentGame: null, characters: [], started: false };

  if (action === "move") {
    const { id, x, y } = req.body;
    state.characters = state.characters.map((c) => (c.id === id ? { ...c, x, y } : c));
    USER_GAME_STATES.set(uid, state);
    return res.json({ ok: true });
  }
  if (action === "event") {
    // noop for demo, but record lastEvent
    state.lastEvent = req.body.event || null;
    USER_GAME_STATES.set(uid, state);
    return res.json({ ok: true });
  }
  res.status(400).json({ error: "unknown action" });
});

router.post("/save", express.json(), authenticateToken, (req, res) => {
  const { state } = req.body || {};
  const uid = (req.user && (req.user.id || req.user.username)) || null;
  if (!uid) return res.status(401).json({ error: "unauthenticated" });
  if (state) {
    USER_GAME_STATES.set(uid, state);
    return res.json({ ok: true });
  }
  res.status(400).json({ error: "no state provided" });
});

module.exports = router;
