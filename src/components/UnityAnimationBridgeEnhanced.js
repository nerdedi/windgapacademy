import React, { useEffect, useState, useCallback, useRef } from "react";
import { sendToUnity, registerUnityMessageHandler } from "../unity-integration/UnityBridge";
import { useAnimationState } from "../stores/curriculumStore";

/**
 * Enhanced Unity Animation Bridge component for controlling character animations from React
 *
 * Features:
 * - Animation queuing and sequencing
 * - Error handling and fallbacks
 * - Performance monitoring
 * - Accessibility support
 * - Real-time synchronization with Zustand store
 */
const UnityAnimationBridge = ({
  characterId,
  autoConnect = true,
  onAnimationStart,
  onAnimationEnd,
  onAnimationError,
  enablePerformanceMonitoring = false,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastError, setLastError] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  const messageHandlerRef = useRef(null);
  const performanceRef = useRef({});
  const retryTimeoutRef = useRef(null);

  // Get animation state from Zustand store
  const {
    currentAnimation,
    animationQueue,
    isAnimating,
    playAnimation: storePlayAnimation,
    clearAnimationQueue,
    getAnimationStats,
  } = useAnimationState();

  /**
   * Enhanced play animation with error handling and performance tracking
   */
  const playAnimation = useCallback(
    async (animationId, duration = 3.0, options = {}) => {
      const {
        priority = "normal",
        loop = false,
        fadeTime = 0.2,
        enableErrorHandling = true,
        onComplete,
      } = options;

      try {
        // Performance tracking start
        if (enablePerformanceMonitoring) {
          performanceRef.current[animationId] = {
            startTime: performance.now(),
            animationId,
            duration,
          };
        }

        // Add to store queue
        storePlayAnimation(animationId, duration, priority);

        // Send to Unity with enhanced parameters
        const animationData = {
          characterId,
          animationId,
          duration,
          loop,
          fadeTime,
          priority,
          timestamp: Date.now(),
        };

        sendToUnity("ReactAnimationManager", "PlayAnimation", animationData);

        // Callback for animation start
        if (onAnimationStart) {
          onAnimationStart(animationId, duration);
        }

        // Set up completion handler
        if (onComplete) {
          setTimeout(() => {
            onComplete(animationId);
          }, duration * 1000);
        }

        // Clear any previous errors
        setLastError(null);

        console.log(`🎭 Animation started: ${animationId} for ${characterId}`);
      } catch (error) {
        console.error(`Failed to play animation ${animationId}:`, error);
        setLastError(error.message);

        if (enableErrorHandling && onAnimationError) {
          onAnimationError(animationId, error);
        }
      }
    },
    [
      characterId,
      storePlayAnimation,
      onAnimationStart,
      onAnimationError,
      enablePerformanceMonitoring,
    ],
  );

  /**
   * Play emote with enhanced feedback
   */
  const playEmote = useCallback(
    async (emoteType, intensity = 1.0, duration = 2.0) => {
      try {
        const emoteData = {
          characterId,
          emoteType,
          intensity,
          duration,
          timestamp: Date.now(),
        };

        sendToUnity("ReactAnimationManager", "PlayEmote", emoteData);
        console.log(`😊 Emote played: ${emoteType} for ${characterId}`);
      } catch (error) {
        console.error(`Failed to play emote ${emoteType}:`, error);
        setLastError(error.message);
      }
    },
    [characterId],
  );

  /**
   * Enhanced look at function with smooth transitions
   */
  const lookAt = useCallback(
    async (target, speed = 1.0, smoothing = true) => {
      try {
        const lookAtData = {
          characterId,
          target,
          speed,
          smoothing,
          timestamp: Date.now(),
        };

        sendToUnity("ReactAnimationManager", "LookAt", lookAtData);
        console.log(`👁️ Look at target: ${target} for ${characterId}`);
      } catch (error) {
        console.error(`Failed to look at ${target}:`, error);
        setLastError(error.message);
      }
    },
    [characterId],
  );

  /**
   * Queue multiple animations in sequence
   */
  const playAnimationSequence = useCallback(
    async (animations) => {
      try {
        for (const [index, animation] of animations.entries()) {
          const { id, duration = 3.0, delay = 0, waitForCompletion = true } = animation;

          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay * 1000));
          }

          await playAnimation(id, duration, {
            priority: index === 0 ? "high" : "normal",
            onComplete: animation.onComplete,
          });

          if (waitForCompletion) {
            await new Promise((resolve) => setTimeout(resolve, duration * 1000));
          }
        }
      } catch (error) {
        console.error("Failed to play animation sequence:", error);
        setLastError(error.message);
      }
    },
    [playAnimation],
  );

  /**
   * Stop all animations immediately
   */
  const stopAllAnimations = useCallback(() => {
    try {
      clearAnimationQueue();
      sendToUnity("ReactAnimationManager", "StopAllAnimations", { characterId });
      console.log(`⏹️ All animations stopped for ${characterId}`);
    } catch (error) {
      console.error("Failed to stop animations:", error);
      setLastError(error.message);
    }
  }, [characterId, clearAnimationQueue]);

  /**
   * Set up Unity message handler with enhanced error handling
   */
  useEffect(() => {
    if (!autoConnect) return;

    setConnectionStatus("connecting");

    // Register message handler with retry logic
    const setupConnection = () => {
      try {
        const unregister = registerUnityMessageHandler("ReactAnimationManager", (message) => {
          console.log("📨 Unity animation message:", message);

          const { type, data, characterId: msgCharacterId } = message;

          // Only process messages for this character
          if (msgCharacterId !== characterId) return;

          switch (type) {
            case "AnimationStarted":
              if (onAnimationStart) {
                onAnimationStart(data.animationId, data.duration);
              }
              break;

            case "AnimationCompleted":
              // Performance tracking end
              if (enablePerformanceMonitoring && performanceRef.current[data.animationId]) {
                const metrics = performanceRef.current[data.animationId];
                const actualDuration = performance.now() - metrics.startTime;

                setPerformanceMetrics((prev) => ({
                  ...prev,
                  [data.animationId]: {
                    expectedDuration: metrics.duration * 1000,
                    actualDuration,
                    accuracy:
                      Math.abs(actualDuration - metrics.duration * 1000) /
                      (metrics.duration * 1000),
                  },
                }));

                delete performanceRef.current[data.animationId];
              }

              if (onAnimationEnd) {
                onAnimationEnd(data.animationId, data.duration);
              }
              break;

            case "AnimationError":
              console.error("Unity animation error:", data);
              setLastError(data.message);
              if (onAnimationError) {
                onAnimationError(data.animationId, new Error(data.message));
              }
              break;

            case "ConnectionEstablished":
              setIsConnected(true);
              setConnectionStatus("connected");
              console.log(`✅ Animation bridge connected for ${characterId}`);
              break;

            case "ConnectionLost":
              setIsConnected(false);
              setConnectionStatus("disconnected");
              console.warn(`⚠️ Animation bridge disconnected for ${characterId}`);

              // Retry connection after a delay
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
              }
              retryTimeoutRef.current = setTimeout(() => {
                setupConnection();
              }, 5000);
              break;

            default:
              console.log("Unknown animation message type:", type);
          }
        });

        messageHandlerRef.current = unregister;

        // Send initial connection request
        sendToUnity("ReactAnimationManager", "RegisterCharacter", {
          characterId,
          capabilities: {
            animations: true,
            emotes: true,
            lookAt: true,
            sequencing: true,
          },
        });
      } catch (error) {
        console.error("Failed to setup animation bridge:", error);
        setConnectionStatus("error");
        setLastError(error.message);
      }
    };

    setupConnection();

    // Cleanup function
    return () => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      // Unregister character
      try {
        sendToUnity("ReactAnimationManager", "UnregisterCharacter", { characterId });
      } catch (error) {
        console.warn("Failed to unregister character:", error);
      }
    };
  }, [
    characterId,
    autoConnect,
    onAnimationStart,
    onAnimationEnd,
    onAnimationError,
    enablePerformanceMonitoring,
  ]);

  /**
   * Get current animation statistics
   */
  const getAnimationMetrics = useCallback(() => {
    const storeStats = getAnimationStats();
    return {
      ...storeStats,
      performance: performanceMetrics,
      connectionStatus,
      lastError,
      queueLength: animationQueue.length,
      isAnimating,
    };
  }, [
    getAnimationStats,
    performanceMetrics,
    connectionStatus,
    lastError,
    animationQueue.length,
    isAnimating,
  ]);

  // Return enhanced API
  return {
    // Core animation functions
    playAnimation,
    playEmote,
    lookAt,

    // Advanced features
    playAnimationSequence,
    stopAllAnimations,

    // State and metrics
    isConnected,
    connectionStatus,
    currentAnimation,
    animationQueue: animationQueue.slice(), // Return copy to prevent mutations
    isAnimating,
    lastError,

    // Analytics
    getAnimationMetrics,
    performanceMetrics,

    // Queue management
    clearAnimationQueue,

    // Accessibility helpers
    announceAnimation: (animationId) => {
      // For screen readers
      const message = `Character ${characterId} is now performing ${animationId} animation`;
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.volume = 0.1; // Low volume for non-intrusive announcement
        window.speechSynthesis.speak(utterance);
      }
    },
  };
};

export default UnityAnimationBridge;
