import { writable } from 'svelte/store';

export interface SyncData {
  userId: string;
  lastSynced: number;
  version: string;
  data: {
    projects: any[];
    pages: any[];
    tiles: any[];
    settings: any;
    accessibilitySettings: any;
    favorites: any[];
    communicationEvents: any[];
    customRecordings: Record<string, string>; // tileId -> base64 audio
  };
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingChanges: number;
  error: string | null;
}

class CloudSyncManager {
  private apiUrl: string;
  private userId: string = '';
  private syncInterval: number | null = null;
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    error: null
  };

  private pendingUploads: Set<string> = new Set();
  private offlineQueue: Array<{ action: string; data: any; timestamp: number }> = [];

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.setupNetworkListeners();
    this.loadOfflineQueue();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.status.isOnline = true;
      this.status.error = null;
      this.processPendingChanges();
      syncStatusStore.set(this.status);
    });

    window.addEventListener('offline', () => {
      this.status.isOnline = false;
      syncStatusStore.set(this.status);
    });
  }

  async initializeSync(userId: string, autoSyncInterval: number = 300000) { // 5 minutes
    this.userId = userId;

    // Load last sync time
    const lastSync = localStorage.getItem(`last_sync_${userId}`);
    if (lastSync) {
      this.status.lastSyncTime = parseInt(lastSync);
    }

    // Start auto-sync if online
    if (this.status.isOnline) {
      await this.performFullSync();

      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }

      this.syncInterval = setInterval(() => {
        if (this.status.isOnline && !this.status.isSyncing) {
          this.performIncrementalSync();
        }
      }, autoSyncInterval);
    }

    syncStatusStore.set(this.status);
  }

  async performFullSync(): Promise<boolean> {
    if (!this.status.isOnline || this.status.isSyncing) {
      return false;
    }

    this.status.isSyncing = true;
    this.status.error = null;
    syncStatusStore.set(this.status);

    try {
      // Download from cloud first
      const cloudData = await this.downloadFromCloud();
      if (cloudData) {
        await this.mergeCloudData(cloudData);
      }

      // Upload local changes
      const localData = await this.gatherLocalData();
      await this.uploadToCloud(localData);

      this.status.lastSyncTime = Date.now();
      localStorage.setItem(`last_sync_${this.userId}`, this.status.lastSyncTime.toString());

      return true;
    } catch (error) {
      console.error('Full sync failed:', error);
      this.status.error = error instanceof Error ? error.message : 'Sync failed';
      return false;
    } finally {
      this.status.isSyncing = false;
      syncStatusStore.set(this.status);
    }
  }

  async performIncrementalSync(): Promise<boolean> {
    if (!this.status.isOnline || this.status.isSyncing) {
      return false;
    }

    // Only sync if there are pending changes
    if (this.status.pendingChanges === 0 && this.offlineQueue.length === 0) {
      return true;
    }

    this.status.isSyncing = true;
    syncStatusStore.set(this.status);

    try {
      // Process offline queue first
      await this.processPendingChanges();

      // Upload incremental changes
      const changedData = await this.gatherChangedData();
      if (changedData) {
        await this.uploadIncrementalChanges(changedData);
      }

      this.status.lastSyncTime = Date.now();
      this.status.pendingChanges = 0;
      localStorage.setItem(`last_sync_${this.userId}`, this.status.lastSyncTime.toString());

      return true;
    } catch (error) {
      console.error('Incremental sync failed:', error);
      this.status.error = error instanceof Error ? error.message : 'Sync failed';
      return false;
    } finally {
      this.status.isSyncing = false;
      syncStatusStore.set(this.status);
    }
  }

  private async downloadFromCloud(): Promise<SyncData | null> {
    const response = await fetch(`${this.apiUrl}/sync/download/${this.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      // No cloud data exists yet
      return null;
    } else {
      throw new Error(`Download failed: ${response.statusText}`);
    }
  }

  private async uploadToCloud(data: SyncData): Promise<void> {
    const response = await fetch(`${this.apiUrl}/sync/upload/${this.userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  }

  private async uploadIncrementalChanges(changes: any): Promise<void> {
    const response = await fetch(`${this.apiUrl}/sync/incremental/${this.userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changes)
    });

    if (!response.ok) {
      throw new Error(`Incremental upload failed: ${response.statusText}`);
    }
  }

  private async gatherLocalData(): Promise<SyncData> {
    return {
      userId: this.userId,
      lastSynced: Date.now(),
      version: '1.0',
      data: {
        projects: JSON.parse(localStorage.getItem(`projects_${this.userId}`) || '[]'),
        pages: JSON.parse(localStorage.getItem(`pages_${this.userId}`) || '[]'),
        tiles: JSON.parse(localStorage.getItem(`tiles_${this.userId}`) || '[]'),
        settings: JSON.parse(localStorage.getItem(`settings_${this.userId}`) || '{}'),
        accessibilitySettings: JSON.parse(localStorage.getItem(`accessibility_${this.userId}`) || '{}'),
        favorites: JSON.parse(localStorage.getItem(`favorites_${this.userId}`) || '[]'),
        communicationEvents: JSON.parse(localStorage.getItem(`communication_events_${this.userId}`) || '[]'),
        customRecordings: JSON.parse(localStorage.getItem(`custom_recordings_${this.userId}`) || '{}')
      }
    };
  }

  private async gatherChangedData(): Promise<any> {
    // In a real implementation, you'd track what changed since last sync
    // For now, we'll just return everything and let the server handle deduplication
    const changesSince = this.status.lastSyncTime || 0;

    return {
      changedSince: changesSince,
      // You'd implement change tracking here
      // For now, return recent communication events as an example
      recentEvents: JSON.parse(localStorage.getItem(`communication_events_${this.userId}`) || '[]')
        .filter((event: any) => event.timestamp > changesSince)
    };
  }

  private async mergeCloudData(cloudData: SyncData): Promise<void> {
    // Merge cloud data with local data, handling conflicts
    const localLastSynced = this.status.lastSyncTime || 0;

    if (cloudData.lastSynced > localLastSynced) {
      // Cloud data is newer, merge it in
      Object.entries(cloudData.data).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
          const localKey = `${key}_${this.userId}`;
          const existingData = JSON.parse(localStorage.getItem(localKey) || '[]');

          // Simple merge strategy - you'd implement more sophisticated conflict resolution
          const merged = this.mergeArrays(existingData, value);
          localStorage.setItem(localKey, JSON.stringify(merged));
        }
      });
    }
  }

  private mergeArrays(local: any[], cloud: any[]): any[] {
    // Simple merge - in practice you'd need more sophisticated conflict resolution
    const merged = new Map();

    // Add local items
    local.forEach(item => {
      const key = item.id || item.timestamp || JSON.stringify(item);
      merged.set(key, item);
    });

    // Add/update with cloud items
    cloud.forEach(item => {
      const key = item.id || item.timestamp || JSON.stringify(item);
      if (!merged.has(key) || (item.updatedAt > merged.get(key)?.updatedAt)) {
        merged.set(key, item);
      }
    });

    return Array.from(merged.values());
  }

  queueOfflineAction(action: string, data: any) {
    this.offlineQueue.push({
      action,
      data,
      timestamp: Date.now()
    });

    this.status.pendingChanges++;
    this.saveOfflineQueue();
    syncStatusStore.set(this.status);
  }

  private async processPendingChanges() {
    if (this.offlineQueue.length === 0) return;

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const item of queue) {
      try {
        await this.processOfflineAction(item);
      } catch (error) {
        console.error('Failed to process offline action:', error);
        // Re-queue the failed action
        this.offlineQueue.push(item);
      }
    }

    this.saveOfflineQueue();
  }

  private async processOfflineAction(item: { action: string; data: any; timestamp: number }) {
    // Process different types of offline actions
    switch (item.action) {
      case 'save_project':
        await this.uploadProjectData(item.data);
        break;
      case 'save_tile':
        await this.uploadTileData(item.data);
        break;
      case 'record_event':
        await this.uploadEventData(item.data);
        break;
      // Add more action types as needed
    }
  }

  private async uploadProjectData(data: any) {
    // Upload project data to cloud
    const response = await fetch(`${this.apiUrl}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to upload project: ${response.statusText}`);
    }
  }

  private async uploadTileData(data: any) {
    // Upload tile data to cloud
    const response = await fetch(`${this.apiUrl}/tiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to upload tile: ${response.statusText}`);
    }
  }

  private async uploadEventData(data: any) {
    // Upload event data to cloud
    const response = await fetch(`${this.apiUrl}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to upload event: ${response.statusText}`);
    }
  }

  private saveOfflineQueue() {
    localStorage.setItem(`offline_queue_${this.userId}`, JSON.stringify(this.offlineQueue));
  }

  private loadOfflineQueue() {
    const saved = localStorage.getItem(`offline_queue_${this.userId}`);
    if (saved) {
      try {
        this.offlineQueue = JSON.parse(saved);
        this.status.pendingChanges = this.offlineQueue.length;
      } catch (e) {
        console.error('Failed to load offline queue:', e);
      }
    }
  }

  private getAuthToken(): string {
    // Get authentication token from storage or context
    return localStorage.getItem('auth_token') || '';
  }

  async exportBackup(): Promise<string> {
    const data = await this.gatherLocalData();
    return JSON.stringify(data, null, 2);
  }

  async importBackup(backupData: string): Promise<boolean> {
    try {
      const data: SyncData = JSON.parse(backupData);
      await this.mergeCloudData(data);
      return true;
    } catch (error) {
      console.error('Failed to import backup:', error);
      return false;
    }
  }

  forceSync() {
    if (this.status.isOnline) {
      return this.performFullSync();
    }
    return Promise.resolve(false);
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Create store for sync status
export const syncStatusStore = writable<SyncStatus>({
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncTime: null,
  pendingChanges: 0,
  error: null
});

// Create singleton instance
export const cloudSyncManager = new CloudSyncManager(
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8172'
    : 'https://api.freespeechaac.com'
);
