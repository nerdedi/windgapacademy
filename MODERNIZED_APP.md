# Windgap Academy - Modernized Web Application

## Overview

This project has been modernized to provide a fully functional single-page application (SPA) for the Windgap Academy educational platform. The application now features a cohesive navigation system, responsive design, and an integrated feature system that brings together all the previously standalone demo pages.

## Key Features

- **Modern UI**: A sleek, responsive interface with fluid animations and transitions.
- **Centralized Navigation**: Consistent navigation across all pages.
- **Feature Discovery**: Automatic discovery of available tools and learning modules.
- **WebGL Integration**: All WebGL demos are now properly integrated into React components.
- **Component-Based Architecture**: Modular components for better maintainability.

## Directory Structure

- `/src/components/` - Reusable UI components
- `/src/pages/` - Top-level page components
- `/src/pages/Tools/` - Tool-specific page components
- `/src/utils/` - Utility functions and hooks
- `/src/contexts/` - React context providers

## Key Components

- **HomeModern**: The new homepage showcasing all available tools and learning modules
- **NavigationModern**: A responsive navigation component
- **ToolsPage**: A page listing all available interactive tools
- **LearningPage**: A page displaying all learning modules
- **useFeatureLoader**: A React hook for discovering and loading features

## How to Use

1. **Development**:

   ```bash
   npm run dev
   ```

   This will start the Vite dev server on port 3000.

2. **Production Build**:
   ```bash
   npm run build
   ```
   This will output to the `dist/` directory.

## Navigation Structure

- **Home** (`/`): The main landing page
- **Tools** (`/tools`): Interactive educational tools
  - Fluid Simulation (`/tools/fluid-simulation`)
  - Whiteboard (`/tools/whiteboard`)
  - Ripple Effect (`/tools/ripple-effect`)
  - WebGL Effects (`/tools/webgl-effects`)
  - Character Animation (`/tools/character-animation`)
- **Learning** (`/learning`): Learning modules and exercises
  - Adaptive Learning (`/adaptive-demo`)
  - Executive Function (`/executive-function-demo`)
  - Neurodivergent Learning (`/neurodivergent-learning`)
  - Math Exercises (`/exercises/math`)
  - Adaptive Math Quest (`/math/adaptive-quest`)
  - Fraction Mastery (`/math/fraction-mastery`)
- **About** (`/about`): Information about the platform
- **Login** (`/login`): User authentication
- **Dashboard** (`/dashboard`): User dashboard (protected route)

## Feature Loader

The application uses a modernized feature loader system implemented as a React hook. This provides a more maintainable and React-friendly way to discover and load features.

Example usage:

```jsx
import useFeatureLoader from "../utils/useFeatureLoader";

function MyComponent() {
  const { loadFeature, availableFeatures } = useFeatureLoader();

  const handleFeatureClick = (featureId) => {
    loadFeature(featureId);
  };

  return (
    <div>
      {availableFeatures.map((feature) => (
        <button key={feature.id} onClick={() => handleFeatureClick(feature.id)}>
          {feature.name}
        </button>
      ))}
    </div>
  );
}
```

## Responsive Design

The application is fully responsive and works on mobile, tablet, and desktop devices. The navigation system adapts to different screen sizes, providing an optimal user experience across all devices.

## Technologies Used

- React 18
- React Router DOM
- Framer Motion
- Three.js / React Three Fiber
- Tailwind CSS
- WebGL
- Vite

## Future Improvements

- User authentication integration
- More interactive learning tools
- Enhanced 3D character animations
- Expanded adaptive learning modules
- Analytics and progress tracking
