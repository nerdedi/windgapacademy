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
