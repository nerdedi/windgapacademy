const CACHE_NAME = 'freespeech-v2';
const STATIC_CACHE = 'static-cache-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v2';
const TILE_CACHE = 'tile-images-cache-v1';
const VOICE_CACHE = 'voice-data-cache-v1';

// Assets that should be available offline
const STATIC_ASSETS = [
  '/',
  '/app/dashboard',
  '/app/dashboard/projects',
  '/favicon.png',
  '/manifest.json',
  '/app.css',
  '/offline', // Offline fallback page
  // Icons and essential UI assets
  '/icons/add.svg',
  '/icons/edit.svg',
  '/icons/speak.svg',
  '/icons/offline.svg'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          // If the cache version has changed, remove old caches
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== TILE_CACHE && key !== VOICE_CACHE) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        // Ensure the service worker takes control of all clients ASAP
        return self.clients.claim();
      })
  );
});

// Helper function to check if a request is for an API endpoint
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Helper function to check if a request is for a tile image
function isTileImageRequest(url) {
  // Adjust according to your actual image URL patterns
  return url.pathname.includes('/images/tiles/') ||
         url.href.includes('media.freespeechaac.com');
}

// Helper function to check if a request is for voice audio data
function isVoiceDataRequest(url) {
  // Adjust according to your actual voice data URL patterns
  return url.pathname.includes('/audio/') ||
         url.pathname.includes('/voice/') ||
         url.href.includes('voicesynthesis');
}

// Fetch event - serve from cache, fall back to network, update cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin &&
      !url.href.includes('media.freespeechaac.com')) {
    return;
  }

  // API requests - Network first, no cache (unless offline)
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Tile image requests - Cache first with network update
  if (isTileImageRequest(url)) {
    event.respondWith(
      caches.open(TILE_CACHE)
        .then(cache => {
          return cache.match(event.request)
            .then(cachedResponse => {
              const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                  // Update the cache with the fresh version
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });

              // Return cached response immediately if available, otherwise wait for network
              return cachedResponse || fetchPromise;
            })
            .catch(() => {
              // If both cache and network fail, return offline fallback
              return caches.match('/icons/offline.svg');
            });
        })
    );
    return;
  }

  // Voice data requests - Cache first with network fallback
  if (isVoiceDataRequest(url)) {
    event.respondWith(
      caches.open(VOICE_CACHE)
        .then(cache => {
          return cache.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }

              // Not in cache, get from network and store
              return fetch(event.request)
                .then(networkResponse => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });
            });
        })
        .catch(() => {
          // If everything fails, return a default response or signal
          // This could trigger a client-side fallback to text display
          return new Response(JSON.stringify({ error: 'Voice data unavailable offline' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Regular requests - Stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version immediately if available
        if (cachedResponse) {
          // Fetch a fresh version in background and update cache
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Don't cache non-successful responses
              if (networkResponse.ok) {
                const clonedResponse = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then(cache => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              // Network request failed, but we already returned the cache
              console.log('[Service Worker] Network request failed, served from cache');
            });

          // Return cached response right away
          return cachedResponse;
        }

        // If not in cache, get from network and store in dynamic cache
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const clonedResponse = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(event.request, clonedResponse);
            });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }

            // For image requests that fail, return a default offline image
            if (event.request.destination === 'image') {
              return caches.match('/icons/offline.svg');
            }

            // For other failed requests, return a simple offline response
            return new Response('You are offline and this content is not available.', {
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for storing user actions when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tiles') {
    event.waitUntil(
      syncTileData()
    );
  } else if (event.tag === 'sync-sentences') {
    event.waitUntil(
      syncSentenceData()
    );
  }
});

// Function to sync tile data when back online
async function syncTileData() {
  try {
    // Get data from IndexedDB
    const offlineTileEdits = await getOfflineTileEditsFromIndexedDB();

    if (offlineTileEdits && offlineTileEdits.length > 0) {
      // Send each edit to the server
      const syncPromises = offlineTileEdits.map(edit =>
        fetch('/api/tiles/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(edit)
        }).then(response => {
          if (response.ok) {
            // Remove from IndexedDB if successful
            return removeOfflineTileEditFromIndexedDB(edit.id);
          }
        })
      );

      await Promise.all(syncPromises);
    }
  } catch (error) {
    console.error('[Service Worker] Error syncing tile data:', error);
  }
}

// Function to sync sentence data when back online
async function syncSentenceData() {
  try {
    // Implementation similar to syncTileData but for sentences
    console.log('[Service Worker] Syncing sentence data');
  } catch (error) {
    console.error('[Service Worker] Error syncing sentence data:', error);
  }
}

// Placeholder for IndexedDB interaction (would need actual IndexedDB code)
function getOfflineTileEditsFromIndexedDB() {
  // This would be implemented with actual IndexedDB code
  return Promise.resolve([]);
}

function removeOfflineTileEditFromIndexedDB(id) {
  // This would be implemented with actual IndexedDB code
  return Promise.resolve();
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
