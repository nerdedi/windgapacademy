// PWA features and push notifications
export function registerPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(function(reg) {
      console.log("Service Worker registered!", reg);
    });
  }
}
export function showPushNotification(message) {
  if (window.Notification && Notification.permission === "granted") {
    new Notification(message);
  }
}
