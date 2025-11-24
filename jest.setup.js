require("@testing-library/jest-dom");

process.env.NODE_ENV = "development";

// Silence noisy console in CI (opt-in)
if (process.env.CI) {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
}

global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {},
    };
  };

global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn(() => "test");

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}

if (typeof window !== "undefined") {
  window.alert = window.alert || ((msg) => console.info("window.alert (test)", msg));
  window.matchMedia =
    window.matchMedia ||
    ((q) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {},
    }));
}

// Canvas stub
if (typeof window !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (id) => {
    if (id === "2d") {
      return {
        fillText() {},
        strokeText() {},
        measureText: () => ({ width: 0 }),
        fillRect() {},
        strokeRect() {},
        clearRect() {},
        beginPath() {},
        closePath() {},
        moveTo() {},
        lineTo() {},
        arc() {},
        fill() {},
        stroke() {},
        save() {},
        restore() {},
        scale() {},
        rotate() {},
        translate() {},
        font: "10px sans-serif",
      };
    }
    if (id === "webgl" || id === "webgl2") {
      return {
        clearColor() {},
        clear() {},
        viewport() {},
        useProgram() {},
        createShader: () => ({}),
        createProgram: () => ({}),
        attachShader() {},
        linkProgram() {},
        getProgramParameter: () => true,
      };
    }
    return null;
  };
}

// JWT secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-for-jest";
