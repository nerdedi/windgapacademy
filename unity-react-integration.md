# 🔗 UNITY-REACT INTEGRATION ARCHITECTURE

## 🏗️ SYSTEM OVERVIEW

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │◄──►│  Unity WebGL    │◄──►│  Backend API    │
│  (Frontend)     │    │   (3D Engine)   │    │   (Data)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ UI Components   │    │ Animation Sys   │    │ Progress Data   │
│ Lesson Controls │    │ Character AI    │    │ User Profiles   │
│ Progress Bars   │    │ Scene Manager   │    │ Lesson Content  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 COMMUNICATION PROTOCOLS

### JavaScript ↔ Unity Communication

#### React to Unity Messages

```javascript
// Send data from React to Unity
const sendToUnity = (gameObjectName, methodName, data) => {
  if (window.unityInstance) {
    window.unityInstance.SendMessage(gameObjectName, methodName, JSON.stringify(data));
  }
};

// Example usage
sendToUnity("GameManager", "StartLesson", {
  lessonId: "math-counting",
  studentName: "Alex",
  difficulty: "beginner",
});
```

#### Unity to React Messages

```javascript
// Receive data from Unity in React
window.unityToReact = {
  onLessonComplete: (data) => {
    const result = JSON.parse(data);
    // Update React state with lesson results
    setLessonProgress(result);
  },

  onAnimationEvent: (data) => {
    const event = JSON.parse(data);
    // Handle animation events in React UI
    handleAnimationEvent(event);
  },

  onUserInteraction: (data) => {
    const interaction = JSON.parse(data);
    // Track user interactions for analytics
    trackUserInteraction(interaction);
  },
};
```

### Message Types & Schemas

#### Lesson Control Messages

```typescript
interface LessonStartMessage {
  type: "LESSON_START";
  payload: {
    lessonId: string;
    studentProfile: StudentProfile;
    settings: LessonSettings;
  };
}

interface LessonProgressMessage {
  type: "LESSON_PROGRESS";
  payload: {
    currentStep: number;
    totalSteps: number;
    score: number;
    timeElapsed: number;
  };
}

interface LessonCompleteMessage {
  type: "LESSON_COMPLETE";
  payload: {
    finalScore: number;
    achievements: Achievement[];
    nextRecommendation: string;
  };
}
```

#### Character Animation Messages

```typescript
interface CharacterAnimationMessage {
  type: "CHARACTER_ANIMATION";
  payload: {
    characterId: "natalie" | "daisy" | "andy" | "winnie";
    animationName: string;
    parameters?: Record<string, any>;
    duration?: number;
  };
}

interface EmotionalResponseMessage {
  type: "EMOTIONAL_RESPONSE";
  payload: {
    characterId: string;
    emotion: "happy" | "confused" | "excited" | "encouraging";
    intensity: number; // 0-1
  };
}
```

## 🎮 UNITY WEBGL INTEGRATION COMPONENT

### Enhanced Unity Component

```typescript
import React, { useEffect, useRef, useState } from 'react';

interface UnityWebGLProps {
  unityProvider: any;
  width: string;
  height: string;
  onUnityMessage?: (message: any) => void;
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export const UnityWebGL: React.FC<UnityWebGLProps> = ({
  unityProvider,
  width,
  height,
  onUnityMessage,
  onProgress,
  onLoaded
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (canvasRef.current && unityProvider) {
      // Initialize Unity WebGL
      unityProvider.instantiate(canvasRef.current, {
        onProgress: (progress: number) => {
          setLoadingProgress(progress);
          onProgress?.(progress);
        },
        onLoaded: () => {
          setIsLoaded(true);
          onLoaded?.();
          setupUnityMessageHandlers();
        }
      });
    }
  }, [unityProvider]);

  const setupUnityMessageHandlers = () => {
    // Set up global message handlers for Unity
    window.unityMessageHandler = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        onUnityMessage?.(parsedMessage);
      } catch (error) {
        console.error('Failed to parse Unity message:', error);
      }
    };
  };

  const sendMessageToUnity = (
    gameObject: string,
    method: string,
    data: any
  ) => {
    if (isLoaded && window.unityInstance) {
      window.unityInstance.SendMessage(
        gameObject,
        method,
        JSON.stringify(data)
      );
    }
  };

  return (
    <div className="unity-container" style={{ width, height }}>
      {!isLoaded && (
        <div className="unity-loading">
          <div className="loading-bar">
            <div
              className="loading-progress"
              style={{ width: `${loadingProgress * 100}%` }}
            />
          </div>
          <p>Loading 3D Experience... {Math.round(loadingProgress * 100)}%</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: isLoaded ? 'block' : 'none'
        }}
      />
    </div>
  );
};
```

### Unity Integration Hook

```typescript
import { useCallback, useEffect, useState } from "react";

export const useUnityIntegration = () => {
  const [unityInstance, setUnityInstance] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const sendToUnity = useCallback(
    (gameObject: string, method: string, data: any) => {
      if (unityInstance && isConnected) {
        unityInstance.SendMessage(gameObject, method, JSON.stringify(data));
      }
    },
    [unityInstance, isConnected],
  );

  const handleUnityMessage = useCallback((message: any) => {
    setMessages((prev) => [...prev, message]);

    // Handle specific message types
    switch (message.type) {
      case "LESSON_PROGRESS":
        // Update lesson progress in React state
        break;
      case "CHARACTER_ANIMATION":
        // Handle character animation events
        break;
      case "USER_INTERACTION":
        // Track user interactions
        break;
    }
  }, []);

  useEffect(() => {
    // Set up Unity message listener
    window.unityMessageHandler = handleUnityMessage;

    return () => {
      delete window.unityMessageHandler;
    };
  }, [handleUnityMessage]);

  return {
    unityInstance,
    setUnityInstance,
    isConnected,
    setIsConnected,
    messages,
    sendToUnity,
  };
};
```

## 🔄 STATE SYNCHRONIZATION

### Lesson State Management

```typescript
interface LessonState {
  currentLesson: string | null;
  progress: number;
  score: number;
  timeElapsed: number;
  characterStates: Record<string, CharacterState>;
  environmentState: EnvironmentState;
}

const useLessonSync = () => {
  const [lessonState, setLessonState] = useState<LessonState>({
    currentLesson: null,
    progress: 0,
    score: 0,
    timeElapsed: 0,
    characterStates: {},
    environmentState: {},
  });

  const syncWithUnity = useCallback((unityData: any) => {
    setLessonState((prev) => ({
      ...prev,
      ...unityData,
    }));
  }, []);

  const syncWithBackend = useCallback(async (stateData: Partial<LessonState>) => {
    try {
      await fetch("/api/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateData),
      });
    } catch (error) {
      console.error("Failed to sync with backend:", error);
    }
  }, []);

  return { lessonState, syncWithUnity, syncWithBackend };
};
```

## 📱 RESPONSIVE INTEGRATION

### Mobile Optimization

```typescript
const useResponsiveUnity = () => {
  const [dimensions, setDimensions] = useState({
    width: "100%",
    height: "600px",
  });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;

      if (isMobile) {
        setDimensions({
          width: "100%",
          height: "400px",
        });
      } else if (isTablet) {
        setDimensions({
          width: "100%",
          height: "500px",
        });
      } else {
        setDimensions({
          width: "100%",
          height: "600px",
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
};
```

## 🔐 SECURITY & PERFORMANCE

### Security Measures

- **Message Validation**: Validate all Unity-React messages
- **CORS Configuration**: Proper cross-origin setup
- **Content Security Policy**: Restrict Unity WebGL execution
- **Input Sanitization**: Clean all user inputs before sending to Unity

### Performance Optimization

- **Lazy Loading**: Load Unity builds only when needed
- **Message Throttling**: Limit message frequency
- **Memory Management**: Clean up Unity instances
- **Caching Strategy**: Cache Unity builds for faster loading
