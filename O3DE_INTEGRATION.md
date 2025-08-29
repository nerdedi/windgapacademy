# O3DE Integration Tracking

This document explains how to track and monitor O3DE (Open 3D Engine) code integration into Windgap Academy.

## Overview

The O3DE integration tracking system provides visibility into when O3DE code has been updated and integrated into the Windgap Academy codebase. This helps developers and project maintainers know:

- When O3DE code was last integrated
- Which O3DE commit/version is currently integrated
- Whether newer O3DE updates are available for integration

## Features

### Status Tracking
- **Last Integration Date**: Timestamp of when O3DE code was last merged
- **Integration Version**: Current version of integrated O3DE components
- **Last O3DE Commit**: The specific O3DE commit hash that was integrated
- **Update Status**: Whether newer O3DE code is available

### Automatic Monitoring
- Automatic checks for updates every hour
- Visual indicators when updates are available
- Event logging for integration activities

## Usage

### Accessing the O3DE Status Panel

1. **Via Direct URL**: Navigate to `/o3de-test.html` for the standalone test interface
2. **Via Application**: Use `window.route('o3de-status')` to navigate to the status panel
3. **Programmatically**: Import and use `showO3DEStatus(container)` from `components/O3DEStatus.js`

### Marking an Integration Complete

When you integrate O3DE code into Windgap Academy:

1. Click "✅ Mark Integration Complete"
2. Enter the O3DE commit hash you integrated
3. Optionally enter the integration version
4. The system will update the status and reset the update timer

### Checking for Updates

The system automatically checks for updates based on time since last integration:
- Updates are considered needed if more than 7 days have passed since last integration
- Manual checks can be triggered via the "🔄 Refresh Status" button

## API Reference

### Core Functions

```javascript
import { 
  getO3DEIntegrationStatus, 
  setO3DEIntegrationStatus, 
  checkO3DEUpdates,
  scheduleO3DEUpdateChecks 
} from './utils/monitoring.js';
```

#### `getO3DEIntegrationStatus()`
Returns the current O3DE integration status object:
```javascript
{
  lastIntegrationDate: string, // ISO timestamp or 'Never'
  lastCheckedCommit: string,   // Commit hash or 'Unknown'
  integrationVersion: string,  // Version string
  hasO3DEUpdates: boolean      // Whether updates are available
}
```

#### `setO3DEIntegrationStatus(commitHash, version?)`
Records a new O3DE integration:
- `commitHash`: The O3DE commit that was integrated
- `version`: Optional version string

#### `checkO3DEUpdates()`
Checks if O3DE updates are needed (returns boolean):
- Returns `true` if more than 7 days since last integration
- Returns `false` if integration is recent

#### `scheduleO3DEUpdateChecks()`
Starts automatic update checking (called on app startup)

### UI Component

```javascript
import { showO3DEStatus } from './components/O3DEStatus.js';

// Display the O3DE status panel in a container
showO3DEStatus(document.getElementById('my-container'));
```

## Integration Workflow

### When Integrating O3DE Code

1. **Before Integration**: Check current status via the status panel
2. **During Integration**: Note the specific O3DE commit you're integrating
3. **After Integration**: 
   - Use "Mark Integration Complete" to record the integration
   - Enter the commit hash and version
   - Verify the status updates correctly

### Monitoring Updates

The system will:
- Check for updates every hour
- Show visual indicators when updates are available
- Log events for monitoring and debugging
- Send analytics events for tracking integration patterns

## Configuration

### Update Check Interval
Default: 1 hour (3600000ms)
To modify, update the interval in `scheduleO3DEUpdateChecks()` in `utils/monitoring.js`

### Update Threshold
Default: 7 days
To modify, update the threshold in `checkO3DEUpdates()` in `utils/monitoring.js`

## Troubleshooting

### Status Not Updating
- Check browser console for errors
- Verify localStorage is enabled
- Try refreshing the status panel

### False Update Notifications
- Verify the last integration date is correct
- Check if the update threshold (7 days) is appropriate for your workflow
- Manually mark integration complete if needed

## Testing

Run the O3DE integration tests:
```bash
npm test __tests__/o3de-integration.test.js
```

For manual testing, use the test interface at `/o3de-test.html`