const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const fs = require("fs");
const path = require("path");

// Optional Firestore Admin persistence
let firestore = null;
let firestoreGameCollection = null;
if (process.env.FIRESTORE_ADMIN_JSON && process.env.FIRESTORE_GAME_COLLECTION) {
  try {
    const admin = require("firebase-admin");
    const serviceAccount = JSON.parse(process.env.FIRESTORE_ADMIN_JSON);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    firestore = admin.firestore();
    firestoreGameCollection = process.env.FIRESTORE_GAME_COLLECTION;
    console.log("[game] Firestore Admin persistence enabled for game states.");
  } catch (err) {
    console.error("[game] Firestore Admin init failed:", err);
    firestore = null;
  }
}

// File to persist user game states for demo durability
const DATA_DIR = path.resolve(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "game-states.json");

// Map of userId -> state for demo persistence (in-memory cache)
const USER_GAME_STATES = new Map();

async function loadStates() {
  if (firestore && firestoreGameCollection) {
    try {
      const snapshot = await firestore.collection(firestoreGameCollection).get();
      snapshot.forEach(doc => {
        USER_GAME_STATES.set(doc.id, doc.data());
      });
    } catch (err) {
      console.error("[game] error loading states from Firestore:", err);
    }
    return;
  }
  // fallback to disk
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = await fs.promises.readFile(DATA_FILE, "utf8");
    const obj = JSON.parse(raw || "{}");
    Object.keys(obj).forEach((k) => USER_GAME_STATES.set(k, obj[k]));
  } catch (err) {
    console.error("[game] error loading states:", err);
  }
}

async function saveStates() {
  if (firestore && firestoreGameCollection) {
    try {
      // Save each user state as a document
      const batch = firestore.batch();
      for (const [k, v] of USER_GAME_STATES.entries()) {
        const ref = firestore.collection(firestoreGameCollection).doc(k);
        batch.set(ref, v);
      }
      await batch.commit();
    } catch (err) {
      console.error("[game] error saving states to Firestore:", err);
    }
    return;
  }
  // fallback to disk
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    const obj = {};
    for (const [k, v] of USER_GAME_STATES.entries()) obj[k] = v;
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");
    // console.log("[game] persisted game states to disk");
  } catch (err) {
    console.error("[game] error saving states:", err);
  }
}

// load persisted states at startup (best-effort)
loadStates();

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
    // persist asynchronously, best-effort
    saveStates().catch(() => {});
    return res.json({ ok: true });
  }
  if (action === "event") {
    // noop for demo, but record lastEvent
    state.lastEvent = req.body.event || null;
    USER_GAME_STATES.set(uid, state);
    saveStates().catch(() => {});
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
  // persist to disk
  saveStates().catch(() => {});
  return res.json({ ok: true });
  }
  res.status(400).json({ error: "no state provided" });
});

module.exports = router;
