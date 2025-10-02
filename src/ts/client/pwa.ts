// Import type declarations
import './pwa-types';

// PWA Service Worker Registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Check for updates to the service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available, show refresh prompt
                    showUpdateNotification();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // Handle updates from active service worker
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

// Show notification that an update is available
function showUpdateNotification() {
  // Create a notification element
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-md rounded-lg bg-blue-600 p-4 text-white shadow-lg';
  notification.style.zIndex = '9999';

  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <p class="font-medium">New update available!</p>
      <div class="flex space-x-2">
        <button id="update-reload" class="rounded bg-white px-3 py-1 text-sm text-blue-600">Reload</button>
        <button id="update-dismiss" class="rounded border border-white px-3 py-1 text-sm">Dismiss</button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Set up event listeners
  document.getElementById('update-reload')?.addEventListener('click', () => {
    // Tell service worker to skip waiting
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    notification.remove();
  });

  document.getElementById('update-dismiss')?.addEventListener('click', () => {
    notification.remove();
  });
}

// PWA Install Prompt
let deferredPrompt: any;

export function setupPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    showInstallButton();
  });

  // Handle successful installation
  window.addEventListener('appinstalled', () => {
    // Log installation to analytics
    console.log('PWA was installed');
    // Hide install button after successful installation
    hideInstallButton();
    // Clear the deferredPrompt
    deferredPrompt = null;
  });
}

function hideInstallButton() {
  const installButton = document.getElementById('install-pwa-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
}

function showInstallButton() {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
      // Hide the install button
      installButton.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  }
}

// Offline Detection
export function setupOfflineDetection() {
  // Create a store for the network status
  let isOnline = navigator.onLine;

  // Function to show offline status
  function showOfflineStatus() {
    // Remove any existing indicator first
    hideOfflineStatus();

    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.className = 'fixed top-[60px] left-0 w-full bg-orange-500 text-white text-center py-1 z-50';
    offlineIndicator.innerHTML = '<p class="text-sm font-medium">You are offline. Some features may be limited.</p>';
    document.body.appendChild(offlineIndicator);

    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-offline', 'true');
  }

  // Function to hide offline status
  function hideOfflineStatus() {
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
      offlineIndicator.remove();
    }

    // Remove data attribute for CSS targeting
    document.documentElement.removeAttribute('data-offline');
  }

  // Initial check
  if (!isOnline) {
    showOfflineStatus();
  }

  // Listen for online status changes
  window.addEventListener('online', () => {
    isOnline = true;
    hideOfflineStatus();

    // Show brief confirmation that we're back online
    const onlineNotification = document.createElement('div');
    onlineNotification.className = 'fixed top-[60px] left-0 w-full bg-green-500 text-white text-center py-1 z-50';
    onlineNotification.innerHTML = '<p class="text-sm font-medium">You\'re back online!</p>';
    document.body.appendChild(onlineNotification);

    // Remove the notification after 3 seconds
    setTimeout(() => {
      onlineNotification.remove();
    }, 3000);

    // Trigger background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-tiles');
        registration.sync.register('sync-sentences');
      });
    }
  });

  window.addEventListener('offline', () => {
    isOnline = false;
    showOfflineStatus();
  });
}
