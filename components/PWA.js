// PWA features and push notifications
export function registerPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (reg) {
        console.log("Service Worker registered!", reg.scope);
      })
      .catch(function (err) {
        // Service worker registration failed - this is fine in dev mode
        console.info("Service Worker registration skipped:", err.message);
      });
  }
}
export function showPushNotification(message) {
  if (window.Notification && Notification.permission === "granted") {
    new Notification(message);
  }
}
