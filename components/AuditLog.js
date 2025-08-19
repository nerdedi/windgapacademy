// Audit log for educator actions
export function logAction(action, details) {
  try {
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    logs.push({ action, details, timestamp: Date.now() });
    localStorage.setItem('auditLogs', JSON.stringify(logs));
  } catch (err) {
    console.error('Audit log error:', err);
  }
}
