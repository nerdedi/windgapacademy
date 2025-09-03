// Audiobookshelf proxy handler for API requests
export default function audiobookshelfProxyHandler(req, res, next) {
  // Forward Authorization header if present
  if (req.headers && req.headers.authorization) {
    // ensure downstream services receive the auth header
    req.headers["x-forwarded-authorization"] = req.headers.authorization;
  }

  // Allow widgets to include additional headers via req.widgetHeaders
  if (req.widgetHeaders && typeof req.widgetHeaders === "object") {
    Object.keys(req.widgetHeaders).forEach((k) => {
      req.headers[k.toLowerCase()] = req.widgetHeaders[k];
    });
  }

  // Minimal logging for debug
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[audiobookshelfProxyHandler]", req.method, req.originalUrl || req.url);
  }

  next();
}
