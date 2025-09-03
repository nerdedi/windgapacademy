// Modular performance and error monitoring for Windgap Academy
let debugEnabled = false;
export function setDebug(enabled) {
  debugEnabled = !!enabled;
}
export function logDebug(...args) {
  if (debugEnabled) console.log("[DEBUG]", ...args);
}
export function warnDebug(...args) {
  if (debugEnabled) console.warn("[WARN]", ...args);
}
export function sendEvent(event, data) {
  logDebug("Event:", event, data);
  // Stub: Integrate with analytics backend if needed
}
export function monitorPerformance() {
  const loadTime = window.performance.now();
  logDebug("App load time:", loadTime);
  if (window.performance && window.performance.memory) {
    logDebug("Memory usage:", window.performance.memory);
  }
  if (loadTime > 5000) {
    warnDebug("App is loading slowly.");
    alert("App is loading slowly. Please check your connection or device performance.");
  }
}
export function trackErrorRates() {
  let errorCount = 0;
  window.addEventListener("error", (e) => {
    errorCount++;
    warnDebug("Error event:", e);
    sendEvent("error", e);
    if (errorCount > 3) {
      alert("Multiple errors detected. Please reload or contact support.");
    }
  });
}
export function trackUserEngagement() {
  setInterval(() => {
    logDebug("User engagement tick");
    sendEvent("engagement", { timestamp: Date.now() });
  }, 10000);
}
export function scheduleRegularUpdates() {
  setInterval(() => {
    const hasUpdate = Math.random() < 0.05;
    logDebug("Update check:", hasUpdate);
    if (hasUpdate) {
      alert("New features are available! Please reload to update Windgap Academy.");
      sendEvent("updateAvailable");
    }
  }, 3600000);
}
