// Modular performance and error monitoring for Windgap Academy
let debugEnabled = false;
export function setDebug(enabled) {
  debugEnabled = !!enabled;
}
export function logDebug(...args) {
  if (debugEnabled) console.log('[DEBUG]', ...args);
}
export function warnDebug(...args) {
  if (debugEnabled) console.warn('[WARN]', ...args);
}
export function sendEvent(event, data) {
  logDebug('Event:', event, data);
  // Stub: Integrate with analytics backend if needed
}
export function monitorPerformance() {
  const loadTime = window.performance.now();
  logDebug('App load time:', loadTime);
  if (window.performance && window.performance.memory) {
    logDebug('Memory usage:', window.performance.memory);
  }
  if (loadTime > 5000) {
    warnDebug('App is loading slowly.');
    alert('App is loading slowly. Please check your connection or device performance.');
  }
}
export function trackErrorRates() {
  let errorCount = 0;
  window.addEventListener('error', (e) => {
    errorCount++;
    warnDebug('Error event:', e);
    sendEvent('error', e);
    if (errorCount > 3) {
      alert('Multiple errors detected. Please reload or contact support.');
    }
  });
}
export function trackUserEngagement() {
  setInterval(() => {
    logDebug('User engagement tick');
    sendEvent('engagement', { timestamp: Date.now() });
  }, 10000);
}
export function scheduleRegularUpdates() {
  setInterval(() => {
    const hasUpdate = Math.random() < 0.05;
    logDebug('Update check:', hasUpdate);
    if (hasUpdate) {
      alert('New features are available! Please reload to update Windgap Academy.');
      sendEvent('updateAvailable');
    }
  }, 3600000);
}

// O3DE Integration Tracking
export function getO3DEIntegrationStatus() {
  const status = {
    lastIntegrationDate: localStorage.getItem('o3de_last_integration') || 'Never',
    lastCheckedCommit: localStorage.getItem('o3de_last_commit') || 'Unknown',
    integrationVersion: localStorage.getItem('o3de_integration_version') || '1.0.0',
    hasO3DEUpdates: localStorage.getItem('o3de_has_updates') === 'true'
  };
  logDebug('O3DE Integration Status:', status);
  return status;
}

export function setO3DEIntegrationStatus(commitHash, version = null) {
  const timestamp = new Date().toISOString();
  localStorage.setItem('o3de_last_integration', timestamp);
  localStorage.setItem('o3de_last_commit', commitHash);
  if (version) {
    localStorage.setItem('o3de_integration_version', version);
  }
  localStorage.setItem('o3de_has_updates', 'false');
  
  logDebug('O3DE Integration updated:', { commitHash, version, timestamp });
  sendEvent('o3deIntegrated', { commitHash, version, timestamp });
}

export function checkO3DEUpdates() {
  // Simulate checking for O3DE updates (in a real implementation, this would check the submodule)
  const status = getO3DEIntegrationStatus();
  const daysSinceLastIntegration = status.lastIntegrationDate !== 'Never' 
    ? Math.floor((Date.now() - new Date(status.lastIntegrationDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  // Check if updates are needed (simulate based on time since last integration)
  const hasUpdates = daysSinceLastIntegration > 7; // Check if more than 7 days since last integration
  
  if (hasUpdates !== status.hasO3DEUpdates) {
    localStorage.setItem('o3de_has_updates', hasUpdates.toString());
    sendEvent('o3deUpdateStatusChanged', { hasUpdates, daysSinceLastIntegration });
  }
  
  logDebug('O3DE Update check:', { hasUpdates, daysSinceLastIntegration });
  return hasUpdates;
}

export function scheduleO3DEUpdateChecks() {
  // Check for O3DE updates every hour
  setInterval(() => {
    const hasUpdates = checkO3DEUpdates();
    if (hasUpdates) {
      const status = getO3DEIntegrationStatus();
      logDebug('O3DE updates available:', status);
      sendEvent('o3deUpdatesAvailable', status);
    }
  }, 3600000); // 1 hour
}
