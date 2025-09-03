const express = require("express");
const router = express.Router();

// In-memory simple state for demo purposes
let GAME_STATE = {
  currentGame: null,
  characters: [],
  started: false,
};

router.get("/state", (req, res) => {
  res.json({ state: GAME_STATE });
});

router.post("/action", express.json(), (req, res) => {
  const { action } = req.body || {};
  if (action === "move") {
    const { id, x, y } = req.body;
    GAME_STATE.characters = GAME_STATE.characters.map((c) => (c.id === id ? { ...c, x, y } : c));
    return res.json({ ok: true });
  }
  if (action === "event") {
    // noop for demo
    return res.json({ ok: true });
  }
  res.status(400).json({ error: "unknown action" });
});

router.post("/save", express.json(), (req, res) => {
  const { state } = req.body || {};
  if (state) {
    GAME_STATE = state;
    return res.json({ ok: true });
  }
  res.status(400).json({ error: "no state provided" });
});

module.exports = router;
