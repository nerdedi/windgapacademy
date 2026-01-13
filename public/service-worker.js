// Windgap Academy Service Worker
// Basic service worker for PWA support

const CACHE_NAME = "windgap-academy-v1";

// Install event - cache essential files
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Service worker activated");
  event.waitUntil(clients.claim());
});

// Fetch event - network-first strategy for dev, cache-first for production
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) return;

  // For now, just pass through to network (dev mode)
  // In production, implement proper caching strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return offline fallback if available
      return caches.match("/offline.html");
    }),
  );
});
