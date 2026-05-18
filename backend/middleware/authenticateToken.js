const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  // Warn loudly at startup but don't crash — protected routes will return 500
  // until JWT_SECRET is set in the environment.
  console.warn(
    "[authenticateToken] WARNING: JWT_SECRET is not set. All protected routes will be unavailable until it is configured.",
  );
}

function authenticateToken(req, res, next) {
  if (!SECRET) {
    return res.status(500).json({ error: "Server misconfiguration: auth is not available." });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.warn("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
