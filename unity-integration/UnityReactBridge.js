// Enhanced Unity-React Communication Bridge
// Advanced integration for Windgap Academy educational platform
// Portions of this file were generated with the assistance of AI

import React, { useRef, useState, useEffect, useMemo } from 'react';

/**
 * Advanced Unity integration class for React components
 * Provides comprehensive communication, state management, and performance optimization
 */
export class UnityReactBridge {
  constructor(unityInstance, options = {}) {
    this.unityInstance = unityInstance;
    this.options = {
      enableLogging: true,
      enablePerformanceMonitoring: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...options
    };

    this.messageQueue = [];
    this.eventListeners = new Map();
    this.performanceMetrics = {
      messagesSent: 0,
      messagesReceived: 0,
      errors: 0,
      startTime: Date.now()
    };

    this.setupGlobalHandlers();
    this.startPerformanceMonitoring();
  }

  /**
   * Set up global Unity message handlers
   */
  setupGlobalHandlers() {
    // Enhanced global Unity communication interface
    window.unityToReact = {
      // Educational content events
      onLessonStart: (jsonData) => this.handleUnityMessage('LESSON_START', jsonData),
      onLessonComplete: (jsonData) => this.handleUnityMessage('LESSON_COMPLETE', jsonData),
      onQuizAnswer: (jsonData) => this.handleUnityMessage('QUIZ_ANSWER', jsonData),
      onProgressUpdate: (jsonData) => this.handleUnityMessage('PROGRESS_UPDATE', jsonData),

      // Character and animation events
      onAnimationComplete: (jsonData) => this.handleUnityMessage('ANIMATION_COMPLETE', jsonData),
      onCharacterInteraction: (jsonData) => this.handleUnityMessage('CHARACTER_INTERACTION', jsonData),
      onEnvironmentChange: (jsonData) => this.handleUnityMessage('ENVIRONMENT_CHANGE', jsonData),

      // Story and narrative events
      onStoryNode: (jsonData) => this.handleUnityMessage('STORY_NODE', jsonData),
      onStoryComplete: (jsonData) => this.handleUnityMessage('STORY_COMPLETE', jsonData),
      onDialogueStart: (jsonData) => this.handleUnityMessage('DIALOGUE_START', jsonData),
      onDialogueEnd: (jsonData) => this.handleUnityMessage('DIALOGUE_END', jsonData),

      // Performance and system events
      onUnityReady: (jsonData) => this.handleUnityMessage('UNITY_READY', jsonData),
      onUnityError: (jsonData) => this.handleUnityMessage('UNITY_ERROR', jsonData),
      onPerformanceUpdate: (jsonData) => this.handleUnityMessage('PERFORMANCE_UPDATE', jsonData),

      // Custom events for extensibility
      onCustomEvent: (eventType, jsonData) => this.handleUnityMessage(eventType, jsonData)
    };

    this.log('Global Unity handlers initialized');
  }

  /**
   * Handle incoming messages from Unity with error handling and retry logic
   */
  handleUnityMessage(type, jsonData, retryCount = 0) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      this.performanceMetrics.messagesReceived++;
      this.log(`Received Unity message: ${type}`, data);

      // Emit to registered listeners
      if (this.eventListeners.has(type)) {
        const listeners = this.eventListeners.get(type);
        listeners.forEach(listener => {
          try {
            listener(data, type);
          } catch (error) {
            this.handleError(`Error in event listener for ${type}`, error);
          }
        });
      }

      // Emit to global listeners
      if (this.eventListeners.has('*')) {
        const globalListeners = this.eventListeners.get('*');
        globalListeners.forEach(listener => {
          try {
            listener(data, type);
          } catch (error) {
            this.handleError(`Error in global event listener`, error);
          }
        });
      }

    } catch (error) {
      if (retryCount < this.options.maxRetries) {
        this.log(`Retrying message parsing (attempt ${retryCount + 1})`, { type, jsonData });
        setTimeout(() => {
          this.handleUnityMessage(type, jsonData, retryCount + 1);
        }, this.options.retryDelay);
      } else {
        this.handleError(`Failed to parse Unity message after ${this.options.maxRetries} attempts`, error, { type, jsonData });
      }
    }
  }

  /**
   * Send message to Unity with enhanced error handling
   */
  sendToUnity(objectName, methodName, value = null, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.unityInstance) {
          throw new Error('Unity instance not available');
        }

        const messageId = this.generateMessageId();
        const payload = {
          messageId,
          timestamp: Date.now(),
          value,
          ...options
        };

        this.performanceMetrics.messagesSent++;
        this.log(`Sending to Unity: ${objectName}.${methodName}`, payload);

        // Add to queue for potential retry
        this.messageQueue.push({ objectName, methodName, payload, resolve, reject, retries: 0 });

        // Send the message
        this.unityInstance.SendMessage(objectName, methodName, JSON.stringify(payload));

        // Resolve immediately for fire-and-forget messages
        resolve(messageId);

      } catch (error) {
        this.handleError('Failed to send message to Unity', error);
        reject(error);
      }
    });
  }

  /**
   * Educational platform specific methods
   */
  async startLesson(lessonId, studentData = {}) {
    return this.sendToUnity('EducationManager', 'StartLesson', {
      lessonId,
      studentData,
      timestamp: Date.now()
    });
  }

  async submitQuizAnswer(questionId, answer, timeSpent = 0) {
    return this.sendToUnity('QuizManager', 'SubmitAnswer', {
      questionId,
      answer,
      timeSpent,
      timestamp: Date.now()
    });
  }

  async updateStudentProgress(progressData) {
    return this.sendToUnity('ProgressManager', 'UpdateProgress', progressData);
  }

  async loadCharacter(characterId, animationSet = 'default') {
    return this.sendToUnity('CharacterManager', 'LoadCharacter', {
      characterId,
      animationSet
    });
  }

  async playAnimation(animationName, options = {}) {
    return this.sendToUnity('AnimationManager', 'PlayAnimation', {
      animationName,
      loop: false,
      speed: 1.0,
      ...options
    });
  }

  async setEnvironment(environmentId, transitionTime = 1.0) {
    return this.sendToUnity('EnvironmentManager', 'SetEnvironment', {
      environmentId,
      transitionTime
    });
  }

  /**
   * Event listener management
   */
  addEventListener(eventType, listener) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(listener);

    return () => this.removeEventListener(eventType, listener);
  }

  removeEventListener(eventType, listener) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Performance monitoring
   */
  startPerformanceMonitoring() {
    if (!this.options.enablePerformanceMonitoring) return;

    setInterval(() => {
      const metrics = this.getPerformanceMetrics();
      this.log('Performance metrics', metrics);

      // Send metrics to Unity for internal monitoring
      if (this.unityInstance) {
        this.sendToUnity('PerformanceManager', 'UpdateMetrics', metrics).catch(() => {
          // Ignore errors for performance metrics
        });
      }
    }, 30000); // Every 30 seconds
  }

  getPerformanceMetrics() {
    const runtime = Date.now() - this.performanceMetrics.startTime;
    return {
      ...this.performanceMetrics,
      runtime,
      messageRate: this.performanceMetrics.messagesSent / (runtime / 1000),
      errorRate: this.performanceMetrics.errors / this.performanceMetrics.messagesSent || 0
    };
  }

  /**
   * Utility methods
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  log(message, data = null) {
    if (this.options.enableLogging) {
      console.log(`[UnityBridge] ${message}`, data || '');
    }
  }

  handleError(message, error, context = null) {
    this.performanceMetrics.errors++;
    console.error(`[UnityBridge] ${message}:`, error, context);

    // Emit error event
    this.handleUnityMessage('BRIDGE_ERROR', {
      message,
      error: error.message,
      context,
      timestamp: Date.now()
    });
  }

  /**
   * Cleanup method
   */
  dispose() {
    this.eventListeners.clear();
    this.messageQueue = [];
    delete window.unityToReact;
    this.log('Unity bridge disposed');
  }
}

/**
 * React Hook for Unity integration
 */
export function useUnityBridge(unityInstance, options = {}) {
  const bridgeRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  useEffect(() => {
    if (unityInstance && !bridgeRef.current) {
      try {
        bridgeRef.current = new UnityReactBridge(unityInstance, memoizedOptions);

        // Listen for Unity ready event
        const unsubscribe = bridgeRef.current.addEventListener('UNITY_READY', () => {
          setIsReady(true);
          setError(null);
        });

        // Listen for errors
        const errorUnsubscribe = bridgeRef.current.addEventListener('UNITY_ERROR', (errorData) => {
          setError(errorData);
        });

        return () => {
          unsubscribe();
          errorUnsubscribe();
          bridgeRef.current?.dispose();
          bridgeRef.current = null;
        };
      } catch (err) {
        setError(err);
      }
    }
  }, [unityInstance, memoizedOptions]);
    }
  }, [unityInstance]);

  return {
    bridge: bridgeRef.current,
    isReady,
    error,
    sendMessage: bridgeRef.current?.sendToUnity.bind(bridgeRef.current),
    addEventListener: bridgeRef.current?.addEventListener.bind(bridgeRef.current),
    removeEventListener: bridgeRef.current?.removeEventListener.bind(bridgeRef.current)
  };
}

/**
 * Simplified setup function for basic usage
 */
export function setupAdvancedUnityBridge(unityInstance, messageHandler, options = {}) {
  const bridge = new UnityReactBridge(unityInstance, options);

  // Set up global message handler
  bridge.addEventListener('*', messageHandler);

  return bridge;
}

export default UnityReactBridge;
