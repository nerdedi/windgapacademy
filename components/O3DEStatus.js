// O3DE Integration Status Display Component
import { getO3DEIntegrationStatus, setO3DEIntegrationStatus, checkO3DEUpdates } from '../utils/monitoring.js';

export function showO3DEStatus(container) {
  const status = getO3DEIntegrationStatus();
  const hasUpdates = checkO3DEUpdates();
  
  container.innerHTML = `
    <section id='o3de-status' aria-label='O3DE Integration Status' class='o3de-status-panel'>
      <h2>🔧 O3DE Integration Status</h2>
      <div class='status-grid'>
        <div class='status-item'>
          <label>Last Integration:</label>
          <span class='status-value'>${formatDate(status.lastIntegrationDate)}</span>
        </div>
        <div class='status-item'>
          <label>Integration Version:</label>
          <span class='status-value'>${status.integrationVersion}</span>
        </div>
        <div class='status-item'>
          <label>Last O3DE Commit:</label>
          <span class='status-value'>${status.lastCheckedCommit.substring(0, 8)}${status.lastCheckedCommit.length > 8 ? '...' : ''}</span>
        </div>
        <div class='status-item'>
          <label>Update Status:</label>
          <span class='status-value ${hasUpdates ? 'updates-available' : 'up-to-date'}'>
            ${hasUpdates ? '🔄 Updates Available' : '✅ Up to Date'}
          </span>
        </div>
      </div>
      
      <div class='action-buttons'>
        <button id='refresh-o3de-status' class='btn btn-secondary'>🔄 Refresh Status</button>
        <button id='mark-integration' class='btn btn-primary'>✅ Mark Integration Complete</button>
        ${hasUpdates ? '<button id="check-updates" class="btn btn-warning">⚠️ Review Updates</button>' : ''}
      </div>
      
      <div class='integration-info'>
        <h3>Integration Information</h3>
        <p>This panel shows the status of O3DE (Open 3D Engine) code integration into Windgap Academy.</p>
        <ul>
          <li><strong>Last Integration:</strong> When O3DE code was last merged/updated</li>
          <li><strong>Integration Version:</strong> Current version of integrated O3DE components</li>
          <li><strong>Last O3DE Commit:</strong> The specific O3DE commit that was integrated</li>
          <li><strong>Update Status:</strong> Whether newer O3DE code is available for integration</li>
        </ul>
      </div>
    </section>
  `;
  
  // Add event listeners
  const refreshBtn = container.querySelector('#refresh-o3de-status');
  const markBtn = container.querySelector('#mark-integration');
  const checkBtn = container.querySelector('#check-updates');
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      showO3DEStatus(container); // Refresh the display
    });
  }
  
  if (markBtn) {
    markBtn.addEventListener('click', () => {
      const commitHash = prompt('Enter the O3DE commit hash that was integrated:', status.lastCheckedCommit);
      const version = prompt('Enter the integration version (optional):', status.integrationVersion);
      
      if (commitHash) {
        setO3DEIntegrationStatus(commitHash, version || undefined);
        showO3DEStatus(container); // Refresh the display
        alert('Integration status updated successfully!');
      }
    });
  }
  
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      alert('O3DE updates are available. Please review the O3DE repository for new changes and integrate as needed.');
    });
  }
}

function formatDate(dateString) {
  if (dateString === 'Never') return 'Never';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (e) {
    return dateString;
  }
}