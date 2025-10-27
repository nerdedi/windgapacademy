# Feature Loader Modernization

This document explains the modernized approach to loading features in the Windgap Academy application.

## Overview

The feature loader system has been modernized from a vanilla JavaScript module with direct DOM manipulation to a React-based approach using hooks and the React Router. This allows for better integration with the Single Page Application (SPA) architecture while maintaining backward compatibility.

## Files

- **Legacy File**: `/js/featureLoader.js` - Contains the original implementation that manipulates the DOM directly
- **Modern File**: `/src/utils/featureLoader.js` - Contains the new React-based implementation

## Core Concepts

### 1. useFeatureLoader Hook

The core of the new system is the `useFeatureLoader` hook which provides a modern API for loading features:

```javascript
import { useFeatureLoader } from "@utils/featureLoader";

function MyComponent() {
  const { showFeature } = useFeatureLoader();

  const handleButtonClick = () => {
    showFeature("fluid");
  };

  return <button onClick={handleButtonClick}>Show Fluid Simulation</button>;
}
```

### 2. Feature Routes

Features are now mapped to SPA routes instead of being loaded into a DOM container:

```javascript
const featureRoutes = {
  fluid: "/tools/fluid-simulation",
  whiteboard: "/tools/whiteboard",
  // Add more routes here as features are migrated
};
```

### 3. Backward Compatibility

The system maintains backward compatibility by:

1. Exposing a global `window.showFeature` function for legacy code
2. Supporting the legacy feature identifiers like 'fluid', 'whiteboard', etc.
3. Fallback to dynamic imports for features that haven't been migrated to the SPA

## Migration Process

### Step 1: Add SPA Routes

Add a route in `src/App.jsx` for each feature:

```javascript
<Route path="/tools/fluid-simulation" element={<FluidSimulationPage />} />
```

### Step 2: Create React Components

Create a React component for each feature:

```javascript
// src/pages/Tools/FluidSimulation.jsx
export default function FluidSimulationPage() {
  // React implementation of the feature
}
```

### Step 3: Update Feature Routes Map

Add the feature to the routes map in `src/utils/featureLoader.js`:

```javascript
const featureRoutes = {
  fluid: "/tools/fluid-simulation",
  // Add new feature routes here
};
```

## Usage Guide

### Modern React Components

```javascript
import { useFeatureLoader } from "@utils/featureLoader";

function FeatureButton({ feature, label }) {
  const { showFeature } = useFeatureLoader();

  return <button onClick={() => showFeature(feature)}>{label}</button>;
}
```

### Integration with Legacy Code

```javascript
// Legacy code can continue to use the global function
window.showFeature("fluid");
```

### Full Integration Example

```javascript
import { FeatureLoader } from "@utils/featureLoader";

function App() {
  return (
    <div className="app">
      <header>Windgap Academy</header>
      <main>
        {/* The FeatureLoader component will initialize the system */}
        <FeatureLoader defaultFeature="avatar" />
      </main>
    </div>
  );
}
```

## Best Practices

1. **Add New Features as SPA Routes**: All new features should be implemented as React components with dedicated routes
2. **Use the Hook API**: Use `useFeatureLoader` instead of the global `window.showFeature` function
3. **Clean Up Resources**: Implement proper cleanup in `useEffect` for WebGL and Canvas features
4. **Avoid DOM Manipulation**: Refactor any direct DOM manipulation to use React refs and state

## Migration Roadmap

1. **Phase 1**: Add SPA routes for all features (in progress)
2. **Phase 2**: Create React components for all features (in progress)
3. **Phase 3**: Remove the legacy featureLoader.js once all features are migrated
4. **Phase 4**: Remove legacy static HTML files
