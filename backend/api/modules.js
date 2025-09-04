const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const logger = require('../utils/logger');
const authenticateToken = require('../middleware/authenticateToken');

// POST /api/modules/generate
// body: { subject, topic, acsfLevel, ndisSupport }
// If an Authorization header is present, authenticateToken will run; otherwise the
// endpoint allows anonymous generation (useful for quick client-side saves).
router.post('/generate', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    // authenticateToken expects (req, res, next)
    return authenticateToken(req, res, async () => {
      return await generateModule(req, res);
    });
  }
  logger.info('Generating module via anonymous request');
  return await generateModule(req, res);
});

async function generateModule(req, res) {
  const { subject, topic, acsfLevel, ndisSupport } = req.body || {};
  if (!subject || !topic) {
    return res.status(400).json({ error: 'subject and topic are required' });
  }

  const moduleObj = {
    subject,
    topic,
    acsfLevel: acsfLevel || null,
    ndisSupport: ndisSupport || null,
    createdAt: new Date().toISOString(),
    id: `m_${Date.now()}`,
  };

  // Try Firestore via firebase-admin if configured
  try {
    // eslint-disable-next-line global-require
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      // initialize if service account is provided via env
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (sa) {
        admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
      }
    }
    const db = admin.firestore();
    await db.collection('modules').doc(moduleObj.id).set(moduleObj);
    logger.info('Module stored in Firestore: ' + moduleObj.id);
    return res.json({ ok: true, module: moduleObj, stored: 'firestore' });
  } catch (e) {
    logger.info('Firestore not available, falling back to filesystem: ' + e.message);
  }

  // Fallback: append to backend/data/modules.json
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'modules.json');
    let arr = [];
    if (fs.existsSync(dataPath)) {
      arr = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '[]');
    }
    arr.push(moduleObj);
    fs.writeFileSync(dataPath, JSON.stringify(arr, null, 2));
    logger.info('Module stored to local data/modules.json: ' + moduleObj.id);
    return res.json({ ok: true, module: moduleObj, stored: 'filesystem' });
  } catch (e) {
    logger.error('Failed to store module: ' + e.message);
    return res.status(500).json({ error: 'Failed to store module' });
  }
}

module.exports = router;
