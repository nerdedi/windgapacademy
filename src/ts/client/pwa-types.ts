// Type declarations for the Background Sync API
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistration {
  sync: SyncManager;
}

// Type declaration for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

// Type declaration for offline indicator
interface HTMLElement {
  offlineIndicator?: HTMLDivElement;
}
