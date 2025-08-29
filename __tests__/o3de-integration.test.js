/**
 * Tests for O3DE Integration Monitoring
 */

// Mock DOM environment for testing
global.document = {
  createElement: () => ({ innerHTML: '', style: {}, setAttribute: () => {}, classList: { add: () => {}, remove: () => {} } }),
  getElementById: () => null,
  body: { appendChild: () => {} }
};

global.window = {
  addEventListener: () => {},
  performance: { now: () => 100 }
};

// Mock localStorage
global.localStorage = {
  storage: {},
  getItem(key) { return this.storage[key] || null; },
  setItem(key, value) { this.storage[key] = value; },
  clear() { this.storage = {}; }
};

// Import the monitoring functions
import { 
  getO3DEIntegrationStatus, 
  setO3DEIntegrationStatus, 
  checkO3DEUpdates,
  setDebug 
} from '../utils/monitoring.js';

describe('O3DE Integration Monitoring', () => {
  beforeEach(() => {
    localStorage.clear();
    setDebug(false); // Disable debug output for tests
  });

  test('should return default status when no integration data exists', () => {
    const status = getO3DEIntegrationStatus();
    
    expect(status.lastIntegrationDate).toBe('Never');
    expect(status.lastCheckedCommit).toBe('Unknown');
    expect(status.integrationVersion).toBe('1.0.0');
    expect(status.hasO3DEUpdates).toBe(false);
  });

  test('should set and retrieve integration status', () => {
    const commitHash = 'abc123def456';
    const version = '2.1.0';
    
    setO3DEIntegrationStatus(commitHash, version);
    const status = getO3DEIntegrationStatus();
    
    expect(status.lastCheckedCommit).toBe(commitHash);
    expect(status.integrationVersion).toBe(version);
    expect(status.lastIntegrationDate).not.toBe('Never');
    expect(status.hasO3DEUpdates).toBe(false);
  });

  test('should detect updates needed for old integrations', () => {
    // Set an old integration date (8+ days ago)
    const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('o3de_last_integration', oldDate);
    
    const hasUpdates = checkO3DEUpdates();
    expect(hasUpdates).toBe(true);
  });

  test('should not detect updates needed for recent integrations', () => {
    // Set a recent integration
    setO3DEIntegrationStatus('recent123', '2.0.0');
    
    const hasUpdates = checkO3DEUpdates();
    expect(hasUpdates).toBe(false);
  });

  test('should handle version updates correctly', () => {
    // First integration
    setO3DEIntegrationStatus('commit1', '1.0.0');
    let status = getO3DEIntegrationStatus();
    expect(status.integrationVersion).toBe('1.0.0');
    
    // Update to new version
    setO3DEIntegrationStatus('commit2', '2.0.0');
    status = getO3DEIntegrationStatus();
    expect(status.integrationVersion).toBe('2.0.0');
    expect(status.lastCheckedCommit).toBe('commit2');
  });
});