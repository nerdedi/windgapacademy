const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

function authenticateToken(req, res, next) {
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
