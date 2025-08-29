// Generic proxy handler for API requests
export default function genericProxyHandler(req, res, next) {
  // Example: Add authentication, logging, or modify request/response
  // For now, just pass through
  next();
}
