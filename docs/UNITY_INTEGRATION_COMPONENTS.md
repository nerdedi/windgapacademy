# Unity Integration for Windgap Academy

This guide provides an overview of the Unity integration components developed for Windgap Academy's educational platform. These components enable seamless integration of Unity WebGL experiences with the React application, including progress tracking, performance optimization, and user interaction.

## Components Overview

### UnityExperienceDemo

`UnityExperienceDemo` is a comprehensive component that demonstrates how to integrate Unity educational experiences with the React application. It includes:

- Unity WebGL player rendering
- Progress tracking and visualization
- Achievement display
- Activity logging
- User interaction controls

**Usage:**

```jsx
import UnityExperienceDemo from "../components/UnityExperienceDemo";

// Inside your component
<UnityExperienceDemo
  experienceId="physics-playground"
  lessonId="physics-101"
  title="Physics Playground"
  description="Learn physics through interactive experiments"
  buildUrl="/unity-integration/builds/physics-playground"
  width="100%"
  height="600px"
/>;
```

### OptimizedUnityPlayer

`OptimizedUnityPlayer` is a specialized component for rendering Unity WebGL content with optimized performance. It includes:

- Memory management optimizations
- Mobile device detection and adjustments
- Error handling
- Loading progress visualization
- Responsive sizing

**Usage:**

```jsx
import OptimizedUnityPlayer from "../components/OptimizedUnityPlayer";

// Inside your component
<OptimizedUnityPlayer
  ref={unityRef}
  buildUrl="/unity-integration/builds/physics-playground"
  width="100%"
  height="600px"
  onLoaded={handleLoaded}
  onProgress={handleProgress}
  onError={handleError}
  onUnityMessage={handleMessage}
  mobileOptimizations={true}
  responsive={true}
/>;
```

### ProgressTracker

`ProgressTracker` provides a dashboard for tracking user progress across multiple Unity educational experiences. Features include:

- Progress visualization
- Filtering and sorting
- Achievement tracking
- Activity history

**Usage:**

```jsx
import ProgressTracker from "../components/ProgressTracker";

// Inside your component
<ProgressTracker userId={currentUser.uid} showFilters={true} />;
```

## Utilities

### WebGLOptimizer

`WebGLOptimizer` is a utility class that provides methods for optimizing Unity WebGL performance:

- Memory management
- Texture compression
- Mobile optimization
- Cache management

**Usage:**

```jsx
import { WebGLOptimizer } from "../utils/WebGLOptimizer";

// Optimize a Unity instance
WebGLOptimizer.optimizeMemory(unityInstance, {
  initialMemory: 512,
  maxMemory: 1024,
});
```

### ProgressService

`ProgressService` provides methods for managing user progress data with Firebase:

- Storing and retrieving progress data
- Tracking achievements
- Logging activity
- Generating progress reports

**Usage:**

```jsx
import { ProgressService } from "../utils/ProgressService";

// Update progress
await ProgressService.updateProgress(userId, experienceId, {
  progressPercentage: 75,
  completed: false,
  lastUpdated: new Date(),
});

// Add achievement
await ProgressService.addAchievement(userId, experienceId, {
  id: "first-experiment",
  title: "First Experiment",
  description: "Completed your first physics experiment",
});
```

## Unity Communication Protocol

Communication between the React application and Unity WebGL experiences happens through a message protocol:

### From React to Unity

```jsx
// Send message to Unity
unityRef.current.sendMessage(
  "GameManager",
  "SetUserData",
  JSON.stringify({
    userId: "user123",
    displayName: "Student",
    isAuthenticated: true,
  }),
);
```

### From Unity to React

```csharp
// In Unity C# script
void SendProgressToReact(float progress) {
  Dictionary<string, object> data = new Dictionary<string, object> {
    { "progress", progress },
    { "timestamp", DateTime.Now.ToString("o") }
  };
  string json = JsonUtility.ToJson(data);

  // Send to React
  #if UNITY_WEBGL && !UNITY_EDITOR
  ReactBridge.SendMessageToReact("ProgressUpdate", json);
  #endif
}
```

## Implementation Notes

1. **Authentication**: All components check for user authentication and integrate with Firebase Auth.

2. **Mobile Optimization**: Unity WebGL experiences are automatically optimized for mobile devices.

3. **Error Handling**: Comprehensive error handling is implemented to catch and display Unity loading and runtime errors.

4. **Performance**: The WebGLOptimizer utility provides methods to enhance WebGL performance across devices.

5. **Progress Persistence**: User progress is stored in Firebase Firestore for persistence across sessions.

## Example Page

The `UnityLearningDashboard` page demonstrates a complete implementation of the Unity integration components in a learning platform context. It showcases:

- Experience library with thumbnails and progress indicators
- Progress tracking dashboard
- Interactive Unity experience player
- User authentication integration

## Future Enhancements

1. **Offline Mode**: Add support for offline progress tracking with synchronization when online.

2. **Multiplayer**: Implement multiplayer capabilities for collaborative educational experiences.

3. **Analytics**: Integrate detailed analytics for tracking user engagement and progress.

4. **Accessibility**: Enhance accessibility features for users with disabilities.

5. **Performance Profiling**: Add detailed performance metrics and profiling tools.
