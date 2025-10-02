import type { Tile, SentenceItem } from '../common/types';

const DB_NAME = 'freespeech-offline-db';
const DB_VERSION = 1;
const TILE_STORE = 'tiles';
const SENTENCE_STORE = 'sentences';
const PENDING_ACTIONS_STORE = 'pendingActions';

// Database connection
let dbPromise: Promise<IDBDatabase> | null = null;

// Initialize the database
function initDatabase(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Create object stores on database creation/upgrade
    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create store for tiles
      if (!db.objectStoreNames.contains(TILE_STORE)) {
        db.createObjectStore(TILE_STORE, { keyPath: 'id' });
      }

      // Create store for sentence items
      if (!db.objectStoreNames.contains(SENTENCE_STORE)) {
        db.createObjectStore(SENTENCE_STORE, { keyPath: 'id' });
      }

      // Create store for pending actions
      if (!db.objectStoreNames.contains(PENDING_ACTIONS_STORE)) {
        const pendingStore = db.createObjectStore(PENDING_ACTIONS_STORE, {
          keyPath: 'id',
          autoIncrement: true
        });
        pendingStore.createIndex('type', 'type', { unique: false });
        pendingStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// Get database connection
async function getDb(): Promise<IDBDatabase> {
  return initDatabase();
}

// TILE OPERATIONS

// Save a tile to IndexedDB
export async function saveTileOffline(tile: Tile): Promise<void> {
  const db = await getDb();
  const transaction = db.transaction(TILE_STORE, 'readwrite');
  const store = transaction.objectStore(TILE_STORE);

  return new Promise((resolve, reject) => {
    const request = store.put(tile);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get all tiles from IndexedDB
export async function getAllTilesOffline(): Promise<Tile[]> {
  const db = await getDb();
  const transaction = db.transaction(TILE_STORE, 'readonly');
  const store = transaction.objectStore(TILE_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get a tile by ID from IndexedDB
export async function getTileByIdOffline(id: string): Promise<Tile | undefined> {
  const db = await getDb();
  const transaction = db.transaction(TILE_STORE, 'readonly');
  const store = transaction.objectStore(TILE_STORE);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// SENTENCE OPERATIONS

// Save a sentence to IndexedDB
export async function saveSentenceOffline(sentence: SentenceItem[]): Promise<void> {
  const db = await getDb();
  const transaction = db.transaction(SENTENCE_STORE, 'readwrite');
  const store = transaction.objectStore(SENTENCE_STORE);

  // Create a unique ID based on timestamp
  const sentenceEntry = {
    id: `sentence_${Date.now()}`,
    items: sentence,
    timestamp: Date.now()
  };

  return new Promise((resolve, reject) => {
    const request = store.put(sentenceEntry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get all saved sentences
export async function getAllSentencesOffline(): Promise<any[]> {
  const db = await getDb();
  const transaction = db.transaction(SENTENCE_STORE, 'readonly');
  const store = transaction.objectStore(SENTENCE_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// PENDING ACTIONS

// Save a pending action for background sync
export async function savePendingAction(type: string, data: any): Promise<void> {
  // Only save if we're offline
  if (navigator.onLine) {
    return;
  }

  const db = await getDb();
  const transaction = db.transaction(PENDING_ACTIONS_STORE, 'readwrite');
  const store = transaction.objectStore(PENDING_ACTIONS_STORE);

  const action = {
    type,
    data,
    createdAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    const request = store.add(action);
    request.onsuccess = () => {
      // Register for sync if supported
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then(registration => registration.sync.register(`sync-${type}`))
          .then(() => resolve())
          .catch(error => {
            console.error('Error registering sync:', error);
            resolve();
          });
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// Get all pending actions by type
export async function getPendingActionsByType(type: string): Promise<any[]> {
  const db = await getDb();
  const transaction = db.transaction(PENDING_ACTIONS_STORE, 'readonly');
  const store = transaction.objectStore(PENDING_ACTIONS_STORE);
  const index = store.index('type');

  return new Promise((resolve, reject) => {
    const request = index.getAll(type);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete a pending action
export async function deletePendingAction(id: number): Promise<void> {
  const db = await getDb();
  const transaction = db.transaction(PENDING_ACTIONS_STORE, 'readwrite');
  const store = transaction.objectStore(PENDING_ACTIONS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Export functions for use in service worker
export function getOfflineTileEditsFromIndexedDB() {
  return getPendingActionsByType('tiles');
}

export function removeOfflineTileEditFromIndexedDB(id: number) {
  return deletePendingAction(id);
}
