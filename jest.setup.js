require("@testing-library/jest-dom");

// Mock window.matchMedia
global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {}, // deprecated
      removeListener: function () {}, // deprecated
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    };
  };

// Mock window.alert and other browser APIs
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn(() => "test");

// Polyfill TextEncoder for Node.js tests (some deps rely on it)
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}

// Provide a harmless window.alert implementation for jsdom tests
if (typeof window !== "undefined" && typeof window.alert !== "function") {
  window.alert = (msg) => {
    // no-op to keep tests from throwing when components call alert

    console.info("window.alert called during test:", msg);
  };
}

// Mock window.matchMedia for tests
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  });
}

// Mock Canvas API for tests
if (typeof window !== "undefined") {
  // Mock HTMLCanvasElement.getContext
  HTMLCanvasElement.prototype.getContext = (contextId) => {
    if (contextId === "2d") {
      return {
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1,
        font: "10px sans-serif",
        textAlign: "start",
        textBaseline: "alphabetic",
        direction: "ltr",
        fillText: () => {},
        strokeText: () => {},
        measureText: () => ({ width: 0 }),
        fillRect: () => {},
        strokeRect: () => {},
        clearRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        arc: () => {},
        quadraticCurveTo: () => {},
        bezierCurveTo: () => {},
        fill: () => {},
        stroke: () => {},
        clip: () => {},
        save: () => {},
        restore: () => {},
        scale: () => {},
        rotate: () => {},
        translate: () => {},
        transform: () => {},
        setTransform: () => {},
        resetTransform: () => {},
        globalAlpha: 1,
        globalCompositeOperation: "source-over",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "low",
        createLinearGradient: () => ({
          addColorStop: () => {},
        }),
        createRadialGradient: () => ({
          addColorStop: () => {},
        }),
        createPattern: () => null,
        drawImage: () => {},
        getImageData: () => ({ data: [], width: 0, height: 0 }),
        putImageData: () => {},
        createImageData: () => ({ data: [], width: 0, height: 0 }),
      };
    }
    if (contextId === "webgl" || contextId === "webgl2") {
      return {
        // WebGL context mock
        canvas: null,
        clearColor: () => {},
        clear: () => {},
        viewport: () => {},
        useProgram: () => {},
        createShader: () => ({}),
        createProgram: () => ({}),
        attachShader: () => {},
        linkProgram: () => {},
        getProgramParameter: () => true,
        getShaderParameter: () => true,
        shaderSource: () => {},
        compileShader: () => {},
        createBuffer: () => ({}),
        bindBuffer: () => {},
        bufferData: () => {},
        enableVertexAttribArray: () => {},
        vertexAttribPointer: () => {},
        drawArrays: () => {},
        drawElements: () => {},
        enable: () => {},
        disable: () => {},
        blendFunc: () => {},
        depthFunc: () => {},
        cullFace: () => {},
      };
    }
    return null;
  };
}

// Ensure JWT_SECRET is available during tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-secret-for-jest";
}

// Provide harmless global helper stubs used by legacy UI code.
const noop = () => {};
const noopSafeRun = (fn) => {
  try {
    return typeof fn === "function" ? fn() : undefined;
  } catch (e) {
    
    console.error(e);
  }
};

if (typeof global !== "undefined") {
  global.backupProgress = global.backupProgress || noop;
  global.syncProgress = global.syncProgress || noop;
  global.updateLeaderboard = global.updateLeaderboard || noop;
  global.sendFeedback = global.sendFeedback || noop;
  global.logEvent = global.logEvent || noop;
  global.safeRun = global.safeRun || noopSafeRun;
  global.showOnboarding = global.showOnboarding || noop;
  global.showSettings = global.showSettings || noop;
}
if (typeof window !== "undefined") {
  window.backupProgress = window.backupProgress || noop;
  window.syncProgress = window.syncProgress || noop;
  window.updateLeaderboard = window.updateLeaderboard || noop;
  window.sendFeedback = window.sendFeedback || noop;
  window.logEvent = window.logEvent || noop;
  window.safeRun = window.safeRun || noopSafeRun;
  window.showOnboarding = window.showOnboarding || noop;
  window.showSettings = window.showSettings || noop;
}

// Firebase will be mocked via __mocks__ directory
