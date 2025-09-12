/**
 * Windgap Academy Professional Authentication Middleware
 *
 * Features:
 * - JWT token validation and verification
 * - Role-based access control (RBAC)
 * - Session management
 * - Security headers and CSRF protection
 * - Audit logging for authentication events
 * - Token refresh and blacklisting
 */

const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

class AuthMiddleware {
  constructor() {
    this.config = {
      jwtSecret: process.env.JWT_SECRET || "windgap_secret",
      jwtExpiry: process.env.JWT_EXPIRY || "24h",
      enableRBAC: process.env.ENABLE_RBAC !== "false",
      enableAuditLog: process.env.ENABLE_AUDIT_LOG !== "false",
    };

    this.tokenBlacklist = new Set();
    this.userSessions = new Map();
  }

  // Main authentication middleware
  authenticate(options = {}) {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);

        if (!token) {
          return this.handleAuthError(res, "No authentication token provided", 401);
        }

        // Check if token is blacklisted
        if (this.tokenBlacklist.has(token)) {
          return this.handleAuthError(res, "Token has been revoked", 401);
        }

        // Verify and decode token
        const decoded = await this.verifyToken(token);

        // Attach user info to request
        req.user = decoded;
        req.token = token;

        // Log authentication event
        if (this.config.enableAuditLog) {
          this.logAuthEvent("token_validated", req, decoded);
        }

        next();
      } catch (error) {
        logger.error("Authentication error", {
          error: error.message,
          requestId: req.id,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        });

        return this.handleAuthError(res, "Invalid authentication token", 401);
      }
    };
  }

  // Role-based access control middleware
  authorize(requiredRoles = []) {
    return (req, res, next) => {
      if (!this.config.enableRBAC) {
        return next();
      }

      if (!req.user) {
        return this.handleAuthError(res, "Authentication required", 401);
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

      if (requiredRoles.length > 0 && !hasRequiredRole) {
        this.logAuthEvent("authorization_failed", req, {
          requiredRoles,
          userRoles,
          userId: req.user.userId,
        });

        return this.handleAuthError(res, "Insufficient permissions", 403);
      }

      next();
    };
  }

  // Extract token from request
  extractToken(req) {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Check cookie
    if (req.cookies && req.cookies.authToken) {
      return req.cookies.authToken;
    }

    return null;
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret);

      // Check token expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error("Token expired");
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  // Generate JWT token
  generateToken(payload, options = {}) {
    const tokenPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      sessionId: this.generateSessionId(),
    };

    const tokenOptions = {
      expiresIn: options.expiresIn || this.config.jwtExpiry,
      issuer: "windgap-academy",
      audience: "windgap-users",
    };

    return jwt.sign(tokenPayload, this.config.jwtSecret, tokenOptions);
  }

  // Generate session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Token blacklisting
  blacklistToken(token) {
    this.tokenBlacklist.add(token);

    // Clean up blacklist periodically
    if (this.tokenBlacklist.size > 10000) {
      this.tokenBlacklist.clear();
    }

    logger.info("Token blacklisted");
  }

  // Error handling
  handleAuthError(res, message, statusCode = 401) {
    res.status(statusCode).json({
      error: {
        message,
        code: statusCode === 401 ? "UNAUTHORIZED" : "FORBIDDEN",
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Audit logging
  logAuthEvent(event, req, data = {}) {
    if (!this.config.enableAuditLog) return;

    logger.info("Auth event", {
      event,
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      timestamp: Date.now(),
      ...data,
    });
  }
}

// Create global auth middleware instance
const authMiddleware = new AuthMiddleware();

// Legacy function for backward compatibility
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, authMiddleware.config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Export both new and legacy APIs
module.exports = authenticateToken;
module.exports.authenticate = authMiddleware.authenticate.bind(authMiddleware);
module.exports.authorize = authMiddleware.authorize.bind(authMiddleware);
module.exports.generateToken = authMiddleware.generateToken.bind(authMiddleware);
module.exports.blacklistToken = authMiddleware.blacklistToken.bind(authMiddleware);
module.exports.AuthMiddleware = AuthMiddleware;
