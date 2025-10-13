/**
 * RippleEffectUtils.js
 * WebGL utilities for creating advanced ripple effects
 *
 * This utility uses Three.js to create high-performance WebGL ripple effects
 * that can be applied to DOM elements or integrated with React components.
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Custom ripple shader
const RippleShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
    time: { value: 0 },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    strength: { value: 0.3 },
    radius: { value: 0.05 },
    width: { value: 0.25 },
    speed: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time;
    uniform vec2 center;
    uniform float strength;
    uniform float radius;
    uniform float width;
    uniform float speed;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Calculate distance from ripple center
      vec2 dir = uv - center;
      float dist = length(dir);

      // Calculate ripple effect
      float currentRadius = radius * (1.0 + time * speed);
      float atten = max(1.0 - (abs(dist - currentRadius) / width), 0.0);

      // Calculate displacement
      vec2 offset = normalize(dir) * atten * strength * sin(time * 10.0);

      // Apply displacement to UV coordinates
      vec2 newUV = uv - offset;
      newUV = clamp(newUV, 0.0, 1.0);

      // Sample texture with displaced UVs
      vec4 texel = texture2D(tDiffuse, newUV);

      gl_FragColor = texel;
    }
  `,
};

/**
 * Creates a WebGL ripple effect on the provided DOM element
 *
 * @param {HTMLElement} element - DOM element to apply the ripple effect to
 * @param {Object} options - Configuration options
 * @returns {Object} - Controller object with methods to manipulate the ripple effect
 */
export function createRippleEffect(element, options = {}) {
  if (!element) {
    console.error("No element provided for ripple effect");
    return null;
  }

  const defaultOptions = {
    strength: 0.3,
    radius: 0.05,
    width: 0.25,
    speed: 1.0,
    duration: 2.0,
    autoFade: true,
  };

  const config = { ...defaultOptions, ...options };

  // Create offscreen canvas for rendering the effect
  const canvas = document.createElement("canvas");
  canvas.width = element.clientWidth;
  canvas.height = element.clientHeight;

  // Setup Three.js
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
  camera.position.z = 1;

  // Create a plane to render the element's content as a texture
  const elementTexture = new THREE.Texture(element);
  elementTexture.needsUpdate = true;

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: elementTexture,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Setup post-processing for ripple effect
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const ripplePass = new ShaderPass(RippleShader);
  ripplePass.uniforms.resolution.value.set(canvas.width, canvas.height);
  composer.addPass(ripplePass);

  // Animation variables
  let animationFrameId = null;
  let startTime = null;
  let isAnimating = false;

  // Function to trigger a ripple at specified coordinates
  function triggerRipple(x, y) {
    // Convert coordinates to normalized UV space (0-1)
    const centerX = x / canvas.width;
    const centerY = 1.0 - y / canvas.height; // Flip Y for UV coordinates

    ripplePass.uniforms.center.value.set(centerX, centerY);
    ripplePass.uniforms.time.value = 0;
    ripplePass.uniforms.strength.value = config.strength;
    ripplePass.uniforms.radius.value = config.radius;
    ripplePass.uniforms.width.value = config.width;
    ripplePass.uniforms.speed.value = config.speed;

    startTime = performance.now();
    isAnimating = true;

    if (!animationFrameId) {
      animate();
    }
  }

  // Animation loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (isAnimating) {
      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) / 1000; // Convert to seconds

      ripplePass.uniforms.time.value = elapsed;

      // Update element texture
      if (elementTexture) {
        elementTexture.needsUpdate = true;
      }

      // Render the effect
      composer.render();

      // Apply canvas content to element background
      element.style.backgroundImage = `url(${canvas.toDataURL()})`;

      // Stop animation after duration
      if (config.autoFade && elapsed >= config.duration) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;

        // Reset element background
        element.style.backgroundImage = "";
      }
    }
  }

  // Handle resize
  function handleResize() {
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;

    renderer.setSize(canvas.width, canvas.height);
    ripplePass.uniforms.resolution.value.set(canvas.width, canvas.height);
  }

  window.addEventListener("resize", handleResize);

  // Return controller object
  return {
    triggerRipple,

    // Method to manually stop the animation
    stop() {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      element.style.backgroundImage = "";
    },

    // Method to update options
    updateOptions(newOptions) {
      Object.assign(config, newOptions);

      ripplePass.uniforms.strength.value = config.strength;
      ripplePass.uniforms.radius.value = config.radius;
      ripplePass.uniforms.width.value = config.width;
      ripplePass.uniforms.speed.value = config.speed;
    },

    // Method to destroy and clean up resources
    destroy() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      element.style.backgroundImage = "";
    },
  };
}

/**
 * Creates a ripple effect on a canvas element that can be used as an overlay
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to render the effect on
 * @param {Object} options - Configuration options
 * @returns {Object} - Controller object with methods to manipulate the ripple effect
 */
export function createCanvasRippleEffect(canvas, options = {}) {
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    console.error("A valid canvas element is required");
    return null;
  }

  const defaultOptions = {
    color: "#ffffff",
    rippleOpacity: 0.6,
    rippleSpeed: 3,
    maxRadius: 100,
    lineWidth: 2,
    fadeSpeed: 0.96,
  };

  const config = { ...defaultOptions, ...options };
  const ctx = canvas.getContext("2d");
  const ripples = [];
  let animationFrameId = null;

  // Function to add a new ripple
  function addRipple(x, y, color = config.color) {
    ripples.push({
      x,
      y,
      radius: 0,
      opacity: config.rippleOpacity,
      color,
      lineWidth: config.lineWidth,
    });

    if (!animationFrameId) {
      animate();
    }
  }

  // Animation loop for canvas ripples
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];

      // Draw ripple
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = ripple.color;
      ctx.lineWidth = ripple.lineWidth;
      ctx.globalAlpha = ripple.opacity;
      ctx.stroke();

      // Update ripple
      ripple.radius += config.rippleSpeed;
      ripple.opacity *= config.fadeSpeed;

      // Remove faded ripples
      if (ripple.opacity < 0.01 || ripple.radius > config.maxRadius) {
        ripples.splice(i, 1);
        i--;
      }
    }

    // Stop animation if no more ripples
    if (ripples.length === 0) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Handle resize
  function handleResize() {
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  // Return controller object
  return {
    addRipple,

    // Update configuration options
    updateOptions(newOptions) {
      Object.assign(config, newOptions);
    },

    // Clear all ripples
    clear() {
      ripples.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    // Destroy and clean up resources
    destroy() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      ripples.length = 0;
    },
  };
}

/**
 * Creates a full-screen interactive ripple effect
 *
 * @param {string|HTMLElement} containerSelector - Container element or selector for the effect
 * @param {Object} options - Configuration options
 * @returns {Object} - Controller object with methods to manipulate the ripple effect
 */
export function createInteractiveRippleBackground(containerSelector, options = {}) {
  const container =
    typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector;

  if (!container) {
    console.error("Container not found for interactive ripple background");
    return null;
  }

  const defaultOptions = {
    rippleColors: ["rgba(79, 70, 229, 0.3)", "rgba(79, 70, 229, 0.2)"],
    maxRipples: 10,
    autoRippleInterval: 3000, // Set to 0 to disable auto ripples
    interactive: true,
    backgroundBlur: 10,
  };

  const config = { ...defaultOptions, ...options };

  // Create canvas for ripple effect
  const canvas = document.createElement("canvas");
  canvas.className = "interactive-ripple-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";

  // Add canvas to container
  if (container.style.position === "" || container.style.position === "static") {
    container.style.position = "relative";
  }
  container.appendChild(canvas);

  // If background blur is enabled, add styling
  if (config.backgroundBlur > 0) {
    const existingStyles = container.style.cssText;
    container.style.cssText = `${existingStyles}; backdrop-filter: blur(${config.backgroundBlur}px);`;
  }

  // Initialize canvas ripple effect
  const rippleEffect = createCanvasRippleEffect(canvas, {
    color: config.rippleColors[0],
    maxRadius: Math.max(container.clientWidth, container.clientHeight) / 2,
    rippleSpeed: 2,
  });

  let autoRippleTimer = null;

  // Start auto ripples if enabled
  function startAutoRipples() {
    if (config.autoRippleInterval <= 0) return;

    autoRippleTimer = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const colorIndex = Math.floor(Math.random() * config.rippleColors.length);

      rippleEffect.addRipple(x, y, config.rippleColors[colorIndex]);
    }, config.autoRippleInterval);
  }

  // Handle interaction events if enabled
  if (config.interactive) {
    const handleInteraction = (event) => {
      const rect = canvas.getBoundingClientRect();

      let x, y;
      if (event.type === "touchstart" || event.type === "touchmove") {
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      // Use a random color from the rippleColors array
      const colorIndex = Math.floor(Math.random() * config.rippleColors.length);
      rippleEffect.addRipple(x, y, config.rippleColors[colorIndex]);
    };

    container.addEventListener("mousedown", handleInteraction);
    container.addEventListener("touchstart", handleInteraction);
  }

  startAutoRipples();

  // Return controller object
  return {
    // Add a ripple at specific coordinates
    addRipple(x, y, color) {
      rippleEffect.addRipple(x, y, color || config.rippleColors[0]);
    },

    // Update configuration options
    updateOptions(newOptions) {
      Object.assign(config, newOptions);
      rippleEffect.updateOptions({
        color: config.rippleColors[0],
        maxRadius: Math.max(container.clientWidth, container.clientHeight) / 2,
      });

      // Update auto ripple timer if interval changed
      if (autoRippleTimer) {
        clearInterval(autoRippleTimer);
        startAutoRipples();
      }
    },

    // Stop and clean up resources
    destroy() {
      if (autoRippleTimer) {
        clearInterval(autoRippleTimer);
      }
      rippleEffect.destroy();
      container.removeChild(canvas);
    },
  };
}
