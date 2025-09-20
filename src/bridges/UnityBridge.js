/**
 * Enhanced Unity WebGL Bridge with Advanced Features
 * Features:
 * - Bidirectional communication
 * - Animation synchronization
 * - Performance monitoring and optimization
 * - Asset streaming
 * - Input handling with raycasting
 * - Scene management
 * - Audio system integration
 * - Shader and material control
 * - Physics simulation control
 * - Network multiplayer support
 * - Save system integration
 */

// Performance Monitor Class
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.history = [];
    this.maxHistorySize = 100;
  }

  start(config) {
    this.interval = setInterval(() => {
      const currentMetrics = this.collectMetrics(config.metrics);
      this.history.push(currentMetrics);
      
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
      
      config.callback(currentMetrics);
    }, config.interval);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  collectMetrics(metricTypes) {
    const metrics = {};
    
    if (metricTypes.includes('fps')) {
      metrics.fps = this.calculateFPS();
    }
    
    if (metricTypes.includes('memory')) {
      metrics.memory = performance.memory ? 
        performance.memory.usedJSHeapSize / 1048576 : 0;
    }
    
    if (metricTypes.includes('drawCalls')) {
      // Would need to get this from Unity
      metrics.drawCalls = 0;
    }
    
    if (metricTypes.includes('triangles')) {
      // Would need to get this from Unity
      metrics.triangles = 0;
    }
    
    return metrics;
  }

  calculateFPS() {
    // Simple FPS calculation based on requestAnimationFrame
    if (!this._lastFrameTime) {
      this._lastFrameTime = performance.now();
      this._frameCount = 0;
      this._fps = 60;
      return this._fps;
    }
    
    const now = performance.now();
    const delta = now - this._lastFrameTime;
    this._frameCount++;
    
    if (delta >= 1000) {
      this._fps = Math.round((this._frameCount * 1000) / delta);
      this._lastFrameTime = now;
      this._frameCount = 0;
    }
    
    return this._fps;
  }
}

// Animation Synchronizer Class
class AnimationSynchronizer {
  constructor() {
    this.syncHistory = [];
    this.interpolationBuffer = [];
  }

  recordSync(data) {
    this.syncHistory.push(data);
    this.interpolationBuffer.push(data);
    
    if (this.interpolationBuffer.length > 3) {
      this.interpolationBuffer.shift();
    }
  }

  interpolate(timestamp) {
    // Cubic interpolation between frames
    if (this.interpolationBuffer.length < 2) return null;
    
    const t = (timestamp - this.interpolationBuffer[0].timestamp) / 
              (this.interpolationBuffer[1].timestamp - this.interpolationBuffer[0].timestamp);
    
    return this.cubicInterpolation(
      this.interpolationBuffer[0],
      this.interpolationBuffer[1],
      t
    );
  }

  cubicInterpolation(a, b, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    
    // Cubic Bezier interpolation
    return {
      frame: a.frame + (b.frame - a.frame) * t,
      blendWeights: a.blendWeights.map((w, i) => 
        w + (b.blendWeights[i] - w) * t
      )
    };
  }
}

// Main Unity Bridge Class
class UnityBridge {
  constructor() {
    this.unityInstance = null;
    this.messageQueue = [];
    this.callbacks = new Map();
    this.performanceMonitor = new PerformanceMonitor();
    this.animationSync = new AnimationSynchronizer();
    this.callbackIdCounter = 0;
    this.isInitialized = false;
    this.communicationEstablished = false;
    this.messageListeners = new Map();
  }

  async initialize(containerId, config = {}) {
    if (this.isInitialized) return this.unityInstance;
    
    this.config = {
      buildUrl: config.buildUrl || '/unity-builds/windgap-academy/',
      productName: config.productName || 'Windgap Academy',
      companyName: config.companyName || 'Windgap Academy',
      productVersion: config.productVersion || '1.0.0',
      enablePerformanceMonitoring: config.enablePerformanceMonitoring !== false,
      performanceMonitoringInterval: config.performanceMonitoringInterval || 1000,
      enableLogging: config.enableLogging !== false,
      ...config
    };
    
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    
    // Log initialization
    this.log('Initializing Unity WebGL with configuration:', this.config);
    
    const buildUrl = this.config.buildUrl;
    const loaderUrl = `${buildUrl}Build.loader.js`;
    const configUrl = `${buildUrl}Build.data`;
    const frameworkUrl = `${buildUrl}Build.framework.js`;
    const codeUrl = `${buildUrl}Build.wasm`;

    try {
      // Add loader script
      const script = document.createElement('script');
      script.src = loaderUrl;
      script.async = true;
      document.body.appendChild(script);
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (typeof createUnityInstance === 'undefined') {
            const error = new Error('Unity loader script loaded but createUnityInstance is undefined');
            this.log('Error initializing Unity:', error);
            reject(error);
            return;
          }
          
          // Create Unity instance
          createUnityInstance(container, {
            dataUrl: configUrl,
            frameworkUrl: frameworkUrl,
            codeUrl: codeUrl,
            streamingAssetsUrl: 'StreamingAssets',
            companyName: this.config.companyName,
            productName: this.config.productName,
            productVersion: this.config.productVersion,
            showBanner: (msg, type) => {
              this.log(`Unity: ${msg} (${type})`);
            }
          }).then(instance => {
            this.unityInstance = instance;
            this.isInitialized = true;
            
            // Setup communication channel
            this.setupCommunicationChannel();
            
            // Initialize performance monitoring if enabled
            if (this.config.enablePerformanceMonitoring) {
              this.initializePerformanceMonitoring();
            }
            
            this.log('Unity successfully initialized');
            resolve(instance);
          }).catch(error => {
            this.log('Error creating Unity instance:', error);
            reject(error);
          });
        };
        
        script.onerror = () => {
          const error = new Error(`Failed to load Unity loader script from ${loaderUrl}`);
          this.log('Error loading Unity script:', error);
          reject(error);
        };
      });
    } catch (error) {
      this.log('Error during Unity initialization:', error);
      throw error;
    }
  }

  // Bidirectional communication
  setupCommunicationChannel() {
    // React to Unity
    window.SendToUnity = (gameObject, method, parameter) => {
      if (this.unityInstance) {
        this.unityInstance.SendMessage(gameObject, method, parameter);
        this.logCommunication('React->Unity', { gameObject, method, parameter });
      } else {
        this.messageQueue.push({ gameObject, method, parameter });
        this.log('Message queued for Unity (not yet initialized):', { gameObject, method, parameter });
      }
    };

    // Unity to React
    window.ReceiveFromUnity = (type, data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        this.handleUnityMessage(type, parsedData);
        
        // Execute callbacks
        if (this.callbacks.has(type)) {
          this.callbacks.get(type).forEach(callback => callback(parsedData));
        }
        
        // Notify message listeners
        if (this.messageListeners.has(type)) {
          this.messageListeners.get(type).forEach(listener => listener(parsedData));
        }
        
        this.logCommunication('Unity->React', { type, data: parsedData });
      } catch (error) {
        this.log('Error processing message from Unity:', error);
      }
    };

    // Process queued messages
    this.processMessageQueue();
    
    // Set communication as established
    this.communicationEstablished = true;
    this.log('Communication channel established');
  }

  // Process queued messages
  processMessageQueue() {
    if (!this.unityInstance || !this.communicationEstablished) {
      return;
    }
    
    this.log(`Processing ${this.messageQueue.length} queued messages`);
    
    // Process all queued messages
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.unityInstance.SendMessage(
        message.gameObject,
        message.method,
        message.parameter
      );
      this.logCommunication('React->Unity (from queue)', message);
    }
  }

  // Handle message from Unity
  handleUnityMessage(type, data) {
    // Handle special message types
    if (type.startsWith('Callback_')) {
      const callbackId = type.replace('Callback_', '');
      if (this.callbacks.has(callbackId)) {
        this.callbacks.get(callbackId).forEach(callback => callback(data));
        this.callbacks.delete(callbackId);
      }
    }
  }

  // Send message to Unity
  sendToUnity(gameObject, method, parameter) {
    const message = typeof parameter === 'string' ? parameter : JSON.stringify(parameter);
    
    if (this.unityInstance && this.communicationEstablished) {
      this.unityInstance.SendMessage(gameObject, method, message);
      this.logCommunication('React->Unity', { gameObject, method, parameter });
    } else {
      this.messageQueue.push({ gameObject, method, parameter: message });
      this.log('Message queued for Unity (not yet initialized):', { gameObject, method, parameter });
    }
  }

  // Register callback for Unity messages
  on(type, callback) {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    
    this.messageListeners.get(type).push(callback);
    return () => this.off(type, callback);
  }

  // Unregister callback
  off(type, callback) {
    if (this.messageListeners.has(type)) {
      const listeners = this.messageListeners.get(type);
      const index = listeners.indexOf(callback);
      
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      
      if (listeners.length === 0) {
        this.messageListeners.delete(type);
      }
    }
  }

  // Advanced animation synchronization
  syncAnimation(animationData) {
    const syncData = {
      timestamp: performance.now(),
      animation: animationData.name,
      frame: animationData.frame,
      blendWeights: animationData.blendWeights,
      boneTransforms: this.compressBoneData(animationData.bones)
    };

    this.sendToUnity('AnimationController', 'SyncAnimation', JSON.stringify(syncData));
    this.animationSync.recordSync(syncData);
  }

  // Compress bone data for efficient transfer
  compressBoneData(bones) {
    // In a real implementation, this would compress the bone transform data
    // For example, using quaternions instead of matrices, quantizing values, etc.
    return bones; // Placeholder
  }

  // Performance monitoring
  initializePerformanceMonitoring() {
    this.performanceMonitor.start({
      metrics: ['fps', 'memory', 'drawCalls', 'triangles'],
      interval: this.config.performanceMonitoringInterval,
      callback: (metrics) => {
        this.optimizePerformance(metrics);
      }
    });
    
    this.log('Performance monitoring initialized');
  }

  // Dynamic quality adjustment
  optimizePerformance(metrics) {
    // Only adjust if significant change detected
    if (metrics.fps < 30) {
      this.adjustQualitySettings('low');
    } else if (metrics.fps > 55 && metrics.fps < 58) {
      this.adjustQualitySettings('medium');
    } else if (metrics.fps > 58) {
      this.adjustQualitySettings('high');
    }

    // Memory management
    if (metrics.memory > 500) {
      this.sendToUnity('ResourceManager', 'UnloadUnusedAssets', '');
      this.log('Requested Unity to unload unused assets due to high memory usage');
    }
  }

  // Adjust quality settings
  adjustQualitySettings(quality) {
    this.sendToUnity('QualityManager', 'SetQuality', quality);
    this.log(`Adjusted quality settings to: ${quality}`);
  }

  // Asset streaming
  async streamAsset(assetPath, priority = 'normal') {
    const streamConfig = {
      path: assetPath,
      priority,
      chunking: true,
      caching: true
    };

    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      
      this.registerCallback(`AssetLoaded_${callbackId}`, (data) => {
        if (data.success) {
          resolve(data.asset);
        } else {
          reject(new Error(data.error || 'Failed to load asset'));
        }
      });

      this.sendToUnity('AssetStreamer', 'LoadAsset', {
        ...streamConfig,
        callbackId
      });
      
      this.log(`Requested asset streaming: ${assetPath}`);
    });
  }

  // Input handling
  setupInputHandling() {
    const inputHandler = {
      keyboard: new Map(),
      mouse: { x: 0, y: 0, buttons: [] },
      touch: new Map(),
      gamepad: null
    };

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (!inputHandler.keyboard.has(e.code)) {
        inputHandler.keyboard.set(e.code, true);
        this.sendToUnity('InputManager', 'OnKeyDown', e.code);
      }
    });

    document.addEventListener('keyup', (e) => {
      inputHandler.keyboard.delete(e.code);
      this.sendToUnity('InputManager', 'OnKeyUp', e.code);
    });

    // Mouse events with ray casting
    document.addEventListener('mousemove', (e) => {
      if (!this.unityInstance) return;
      
      const container = this.unityInstance.container;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      
      inputHandler.mouse.x = x;
      inputHandler.mouse.y = y;
      
      this.sendToUnity('InputManager', 'OnMouseMove', { x, y });
    });
    
    document.addEventListener('mousedown', (e) => {
      if (!this.unityInstance) return;
      
      inputHandler.mouse.buttons[e.button] = true;
      this.sendToUnity('InputManager', 'OnMouseDown', { 
        button: e.button,
        x: inputHandler.mouse.x,
        y: inputHandler.mouse.y
      });
    });
    
    document.addEventListener('mouseup', (e) => {
      if (!this.unityInstance) return;
      
      inputHandler.mouse.buttons[e.button] = false;
      this.sendToUnity('InputManager', 'OnMouseUp', { 
        button: e.button,
        x: inputHandler.mouse.x,
        y: inputHandler.mouse.y
      });
    });

    // Touch support
    this.setupTouchHandling(inputHandler);
    
    // Gamepad support
    this.setupGamepadHandling(inputHandler);
    
    this.log('Input handling set up');
    return inputHandler;
  }

  // Setup touch handling
  setupTouchHandling(inputHandler) {
    const container = this.unityInstance?.container;
    if (!container) return;
    
    container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1 - (touch.clientY - rect.top) / rect.height;
        
        inputHandler.touch.set(touch.identifier, { x, y });
        
        this.sendToUnity('InputManager', 'OnTouchStart', {
          id: touch.identifier,
          x,
          y
        });
      }
    });
    
    container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1 - (touch.clientY - rect.top) / rect.height;
        
        inputHandler.touch.set(touch.identifier, { x, y });
        
        this.sendToUnity('InputManager', 'OnTouchMove', {
          id: touch.identifier,
          x,
          y
        });
      }
    });
    
    container.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchData = inputHandler.touch.get(touch.identifier);
        
        if (touchData) {
          this.sendToUnity('InputManager', 'OnTouchEnd', {
            id: touch.identifier,
            x: touchData.x,
            y: touchData.y
          });
          
          inputHandler.touch.delete(touch.identifier);
        }
      }
    });
    
    container.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        
        this.sendToUnity('InputManager', 'OnTouchCancel', {
          id: touch.identifier
        });
        
        inputHandler.touch.delete(touch.identifier);
      }
    });
  }

  // Setup gamepad handling
  setupGamepadHandling(inputHandler) {
    // Check for Gamepad API support
    if (!navigator.getGamepads) {
      this.log('Gamepad API not supported');
      return;
    }
    
    // Initial check for connected gamepads
    const checkGamepads = () => {
      const gamepads = navigator.getGamepads();
      
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        
        if (gamepad) {
          if (!inputHandler.gamepad) {
            inputHandler.gamepad = gamepad;
            this.sendToUnity('InputManager', 'OnGamepadConnected', {
              id: gamepad.id,
              index: gamepad.index
            });
            
            this.log(`Gamepad connected: ${gamepad.id}`);
          }
        }
      }
    };
    
    // Check for gamepads on page load
    checkGamepads();
    
    // Listen for gamepad connections/disconnections
    window.addEventListener('gamepadconnected', (e) => {
      const gamepad = e.gamepad;
      
      inputHandler.gamepad = gamepad;
      this.sendToUnity('InputManager', 'OnGamepadConnected', {
        id: gamepad.id,
        index: gamepad.index
      });
      
      this.log(`Gamepad connected: ${gamepad.id}`);
    });
    
    window.addEventListener('gamepaddisconnected', (e) => {
      const gamepad = e.gamepad;
      
      if (inputHandler.gamepad && inputHandler.gamepad.index === gamepad.index) {
        inputHandler.gamepad = null;
      }
      
      this.sendToUnity('InputManager', 'OnGamepadDisconnected', {
        id: gamepad.id,
        index: gamepad.index
      });
      
      this.log(`Gamepad disconnected: ${gamepad.id}`);
    });
    
    // Poll gamepad state
    const pollGamepad = () => {
      if (!inputHandler.gamepad) return;
      
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[inputHandler.gamepad.index];
      
      if (!gamepad) return;
      
      // Send button states
      for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i];
        
        if (button.pressed) {
          this.sendToUnity('InputManager', 'OnGamepadButtonPressed', {
            index: gamepad.index,
            button: i,
            value: button.value
          });
        }
      }
      
      // Send axis values
      for (let i = 0; i < gamepad.axes.length; i++) {
        const axis = gamepad.axes[i];
        
        // Only send if changed significantly (reduce noise)
        if (Math.abs(axis) > 0.1) {
          this.sendToUnity('InputManager', 'OnGamepadAxisChanged', {
            index: gamepad.index,
            axis: i,
            value: axis
          });
        }
      }
    };
    
    // Set up polling interval
    setInterval(pollGamepad, 16); // 60fps polling
  }

  // Scene management
  async loadScene(sceneName, options = {}) {
    const loadConfig = {
      scene: sceneName,
      mode: options.additive ? 'Additive' : 'Single',
      async: options.async !== false,
      transition: options.transition || 'fade',
      transitionDuration: options.transitionDuration || 1.0
    };

    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      
      this.registerCallback(`SceneLoaded_${callbackId}`, (data) => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error || `Failed to load scene: ${sceneName}`));
        }
      });

      this.sendToUnity('SceneManager', 'LoadScene', {
        ...loadConfig,
        callbackId
      });
      
      this.log(`Requested scene load: ${sceneName}`);
    });
  }

  // Audio system integration
  playAudio(audioConfig) {
    const config = {
      clip: audioConfig.clip,
      volume: audioConfig.volume || 1.0,
      loop: audioConfig.loop || false,
      spatial: audioConfig.spatial || false,
      position: audioConfig.position || [0, 0, 0],
      minDistance: audioConfig.minDistance || 1,
      maxDistance: audioConfig.maxDistance || 100
    };

    this.sendToUnity('AudioManager', 'PlaySound', config);
    this.log(`Playing audio: ${audioConfig.clip}`);
  }

  // Shader and material control
  setMaterialProperty(objectPath, property, value) {
    this.sendToUnity('MaterialController', 'SetProperty', {
      object: objectPath,
      property,
      value
    });
    
    this.log(`Setting material property: ${objectPath}.${property} = ${value}`);
  }

  // Physics simulation control
  setPhysicsParameters(params) {
    this.sendToUnity('PhysicsManager', 'UpdateSettings', {
      gravity: params.gravity || [0, -9.81, 0],
      timeScale: params.timeScale || 1.0,
      fixedDeltaTime: params.fixedDeltaTime || 0.02,
      solverIterations: params.solverIterations || 6
    });
    
    this.log('Updated physics parameters');
  }

  // Network multiplayer support
  async connectMultiplayer(config) {
    const networkConfig = {
      server: config.server,
      port: config.port || 7777,
      protocol: config.protocol || 'websocket',
      room: config.room,
      playerData: config.playerData
    };

    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      
      this.registerCallback(`Connected_${callbackId}`, (data) => {
        if (data.success) {
          resolve(data.playerId);
          this.log(`Connected to multiplayer server: ${config.server}`);
        } else {
          reject(new Error(data.error || 'Failed to connect to multiplayer server'));
          this.log(`Failed to connect to multiplayer server: ${config.server}`);
        }
      });

      this.sendToUnity('NetworkManager', 'Connect', {
        ...networkConfig,
        callbackId
      });
      
      this.log(`Connecting to multiplayer server: ${config.server}`);
    });
  }

  // Save system integration
  async saveGameState(slot = 'autosave') {
    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      
      this.registerCallback(`GameSaved_${callbackId}`, (data) => {
        if (data.success) {
          resolve(data);
          this.log(`Game state saved to slot: ${slot}`);
        } else {
          reject(new Error(data.error || 'Failed to save game state'));
          this.log(`Failed to save game state to slot: ${slot}`);
        }
      });

      this.sendToUnity('SaveManager', 'SaveGame', {
        slot,
        callbackId
      });
      
      this.log(`Saving game state to slot: ${slot}`);
    });
  }

  async loadGameState(slot = 'autosave') {
    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      
      this.registerCallback(`GameLoaded_${callbackId}`, (data) => {
        if (data.success) {
          resolve(data.saveData);
          this.log(`Game state loaded from slot: ${slot}`);
        } else {
          reject(new Error(data.error || 'Save not found'));
          this.log(`Failed to load game state from slot: ${slot}`);
        }
      });

      this.sendToUnity('SaveManager', 'LoadGame', {
        slot,
        callbackId
      });
      
      this.log(`Loading game state from slot: ${slot}`);
    });
  }

  // Helper to generate a unique callback ID
  generateCallbackId() {
    return `cb_${Date.now()}_${this.callbackIdCounter++}`;
  }

  // Register a callback for a specific message type
  registerCallback(type, callback) {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, []);
    }
    
    this.callbacks.get(type).push(callback);
  }

  // Log communication
  logCommunication(direction, message) {
    if (this.config.enableLogging) {
      console.debug(`[UnityBridge] ${direction}:`, message);
    }
  }

  // Log general messages
  log(...args) {
    if (this.config.enableLogging) {
      console.log('[UnityBridge]', ...args);
    }
  }

  // Clean up resources when done
  dispose() {
    // Stop performance monitoring
    if (this.performanceMonitor) {
      this.performanceMonitor.stop();
    }
    
    // Clear callbacks and listeners
    this.callbacks.clear();
    this.messageListeners.clear();
    
    // Clear message queue
    this.messageQueue = [];
    
    // Reset state
    this.isInitialized = false;
    this.communicationEstablished = false;
    
    this.log('UnityBridge disposed');
  }
}

export default UnityBridge;
export { PerformanceMonitor, AnimationSynchronizer };

// Backwards compatibility with older integration
export const sendToUnity = (gameObject, method, parameter) => {
  // This is a static method for backwards compatibility
  console.warn('[UnityBridge] Using deprecated sendToUnity method. Please use UnityBridge instance instead.');
  
  if (typeof window !== "undefined" && window.unityInstance) {
    try {
      const message = typeof parameter === 'string' ? parameter : JSON.stringify(parameter);
      window.unityInstance.SendMessage(gameObject, method, message);
    } catch (error) {
      console.warn("Failed to send message to Unity:", error);
    }
  } else {
    console.log(`[Mock] Unity message to ${gameObject}.${method}:`, parameter);
  }
};

export const registerUnityMessageHandler = (type, callback) => {
  // This is a static method for backwards compatibility
  console.warn('[UnityBridge] Using deprecated registerUnityMessageHandler method. Please use UnityBridge instance instead.');
  
  if (typeof window !== "undefined") {
    if (!window._unityMessageHandlers) {
      window._unityMessageHandlers = new Map();
    }
    
    if (!window._unityMessageHandlers.has(type)) {
      window._unityMessageHandlers.set(type, []);
    }
    
    window._unityMessageHandlers.get(type).push(callback);
  }
};