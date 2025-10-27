# Windgap Academy - Best Practices Guide

This document outlines the best practices to follow when developing the Windgap Academy application. Following these guidelines will ensure a consistent, maintainable, and high-performance application.

## Table of Contents

- [Architecture & Organization](#architecture--organization)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [3D & WebGL Development](#3d--webgl-development)
- [Firebase Integration](#firebase-integration)
- [Accessibility](#accessibility)
- [Security](#security)
- [Code Quality & Documentation](#code-quality--documentation)

## Architecture & Organization

### Project Structure

- Follow the established project structure:
  - `src/components/` for reusable UI components
  - `src/pages/` for page/route components
  - `src/utils/` for utility functions
  - `src/hooks/` for custom React hooks
  - `src/context/` for React Context providers
  - `src/assets/` for static assets

### SPA Architecture

- **Route-Based Features**: All features should be accessible via routes in the React SPA
- **No Static HTML**: Avoid standalone HTML files; convert all features to React components

### Component Patterns

- **Container/Presentation Pattern**: Separate data fetching and state management from presentational components
- **Compound Components**: Use compound components for complex UI elements
- **Custom Hooks**: Extract complex logic into reusable hooks

### Path Aliases

- Use the defined path aliases in `vite.config.js`:

  ```javascript
  // Instead of this
  import Component from "../../../components/SomeComponent";

  // Use path aliases
  import Component from "@components/SomeComponent";
  ```

## Component Development

### Component Design

- Keep components small and focused on a single responsibility
- Use TypeScript for type safety where possible
- Implement proper prop validation with PropTypes or TypeScript

### Animation System

- Use the `MicroInteractions.jsx` utility for consistent animations
- Follow these patterns when adding animations:

  ```javascript
  import { useAnimation } from "../utils/MicroInteractions";

  const MyComponent = () => {
    const { animate, styles } = useAnimation();

    return (
      <div className={styles.container} onClick={animate.pulse}>
        Animated Content
      </div>
    );
  };
  ```

### Responsive Design

- Use Tailwind's responsive classes for different screen sizes
- Test all components on mobile, tablet, and desktop viewports

## State Management

### React Context

- Use React Context for global state that needs to be shared across multiple components
- Create specialized contexts for different domains (auth, preferences, etc.)
- Example pattern:

  ```javascript
  // In AuthContext.js
  export const AuthContext = createContext();

  export function AuthProvider({ children }) {
    // State and functions
    const value = {
      /* state and functions */
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  // Custom hook for consuming the context
  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }
  ```

### Data Fetching

- Use React Query or SWR for data fetching to handle loading/error states and caching
- Implement proper loading states for all data-dependent components

## Performance Optimization

### Code Splitting

- Use lazy loading for routes to reduce initial load time:
  ```javascript
  const SomeLargeComponent = lazy(() => import("./components/SomeLargeComponent"));
  ```

### Memoization

- Use `useMemo` for expensive computations
- Use `React.memo` for components that render often but with the same props
- Use `useCallback` for functions passed as props to memoized components

### Bundle Size Management

- Monitor bundle size with `npm run analyze:bundle`
- Split vendor code from application code
- Use dynamic imports for large dependencies

## Testing Strategy

### Unit Tests

- Write tests for all utility functions
- Test complex business logic in isolation
- Use Jest snapshots for UI components

### Integration Tests

- Test important user flows with integration tests
- Ensure components work together correctly

### End-to-End Tests

- Use Playwright for critical user journeys
- Test on multiple browsers (Chrome, Firefox, Safari)

## 3D & WebGL Development

### Resource Management

- Implement proper cleanup of Three.js resources:

  ```javascript
  useEffect(() => {
    // Create resources

    return () => {
      // Dispose of geometries, materials, textures
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);
  ```

### Performance Considerations

- Use Level of Detail (LOD) for complex models
- Implement frustum culling
- Use instanced meshes for repeated objects
- Optimize shader complexity

## Firebase Integration

### Authentication

- Use the Firebase auth methods from `firebase.js`
- Implement proper authentication flow with protected routes

### Firestore

- Use typed data models for Firestore documents
- Implement proper error handling for database operations
- Use batched writes for atomic operations

### Security

- Define proper Firestore security rules
- Never expose Firebase API keys in client-side code
- Use environment variables for sensitive configuration

## Accessibility

### WCAG Compliance

- Ensure proper contrast ratios
- Implement keyboard navigation
- Add proper ARIA attributes to custom components
- Use semantic HTML elements

### User Preferences

- Honor user preferences for animations and motion
- Provide text scaling options
- Support high contrast mode

## Security

### Input Validation

- Validate all user inputs
- Sanitize content before rendering
- Implement proper CSRF protection

### Content Security Policy

- Define a restrictive CSP
- Avoid inline scripts and styles
- Use nonce for allowed inline content

## Code Quality & Documentation

### Code Style

- Follow ESLint and Prettier configuration
- Run `npm run lint` and `npm run format` before committing

### Documentation

- Add JSDoc comments to functions and components
- Maintain README files for each major feature
- Document complex algorithms and business logic

### Attribution

- Add attribution comments for AI-generated code:
  ```javascript
  // Portions of this file were generated with the assistance of GitHub Copilot
  ```

## Implementation Example

### Converting Static HTML to React Components

#### Before: HTML with inline script

```html
<div id="container">
  <canvas id="canvas"></canvas>
</div>
<script>
  const canvas = document.getElementById("canvas");
  // Canvas manipulation
</script>
```

#### After: React Component

```jsx
import { useEffect, useRef } from "react";

export function CanvasComponent() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas manipulation

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="container">
      <canvas ref={canvasRef} />
    </div>
  );
}
```

## Next Steps

- Continue converting all static HTML demos to React components
- Refactor any direct DOM manipulation to use React refs
- Implement proper routing for all features
- Add unit tests for all new components
- Optimize bundle sizes through code splitting
