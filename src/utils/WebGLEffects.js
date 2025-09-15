import * as THREE from "three";

/**
 * Utility class for WebGL effects in Windgap Academy
 */
class WebGLEffects {
  constructor() {
    this.effects = {};
  }

  /**
   * Initialize a particle system for confetti or sparkle effects
   * @param {string} containerId - DOM element ID to attach the WebGL canvas
   * @param {Object} options - Configuration options
   * @returns {Object} - The initialized particle effect
   */
  initParticleSystem(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }

    const defaultOptions = {
      particleCount: 200,
      particleSize: 0.1,
      particleColors: [0xff9933, 0x66cc66, 0x6699ff, 0xffcc00, 0xff6666],
      speed: 0.01,
      turbulence: 0.05,
      spread: 100,
      animationDuration: 3,
    };

    const config = { ...defaultOptions, ...options };

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create particles
    const particles = new THREE.Group();
    scene.add(particles);

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    const colors = [];

    for (let i = 0; i < config.particleCount; i++) {
      // Random initial positions
      positions.push(
        (Math.random() - 0.5) * config.spread,
        (Math.random() - 0.5) * config.spread,
        (Math.random() - 0.5) * config.spread,
      );

      // Random velocities
      velocities.push(
        (Math.random() - 0.5) * config.speed,
        -(Math.random() * config.speed * 2), // Falling downward
        (Math.random() - 0.5) * config.speed,
      );

      // Random color
      const color = new THREE.Color(
        config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
      );
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: config.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    particles.add(points);

    // Animation
    let animationFrame;
    const positions_array = geometry.attributes.position.array;
    const velocities_array = velocities;

    const startTime = performance.now();
    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      if (elapsedTime < config.animationDuration) {
        animationFrame = requestAnimationFrame(animate);

        for (let i = 0; i < config.particleCount; i++) {
          const i3 = i * 3;

          // Update position based on velocity
          positions_array[i3] += velocities_array[i3];
          positions_array[i3 + 1] += velocities_array[i3 + 1];
          positions_array[i3 + 2] += velocities_array[i3 + 2];

          // Apply turbulence
          positions_array[i3] += (Math.random() - 0.5) * config.turbulence;
          positions_array[i3 + 2] += (Math.random() - 0.5) * config.turbulence;
        }

        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      } else {
        // Animation duration complete, clean up
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        cancelAnimationFrame(animationFrame);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();

    // Responsive handling
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Store reference and return control methods
    const effectId = `particles_${Date.now()}`;
    this.effects[effectId] = {
      container,
      scene,
      camera,
      renderer,
      geometry,
      material,
      animationFrame,
      cleanup: () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", handleResize);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        delete this.effects[effectId];
      },
    };

    return {
      id: effectId,
      cleanup: this.effects[effectId].cleanup,
    };
  }

  /**
   * Create water ripple effect
   * @param {string} containerId - DOM element ID
   * @param {Object} options - Configuration options
   * @returns {Object} - Control methods
   */
  createWaterRipple(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }

    const defaultOptions = {
      color: 0x6699ff,
      rippleSpeed: 0.02,
      rippleWidth: 0.8,
      rippleCount: 3,
      duration: 4,
    };

    const config = { ...defaultOptions, ...options };

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create ripple shader
    const rippleShader = {
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(config.color) },
        rippleWidth: { value: config.rippleWidth },
        rippleCount: { value: config.rippleCount },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float rippleWidth;
        uniform float rippleCount;
        varying vec2 vUv;
        
        float ripple(vec2 uv, float t) {
          float dist = distance(uv, vec2(0.5));
          return sin(dist * rippleCount * 30.0 - time * 10.0) * 0.5 + 0.5;
        }
        
        void main() {
          vec2 centeredUv = vUv - 0.5;
          float dist = length(centeredUv);
          
          // Create circular mask
          float circle = smoothstep(0.5, 0.48, dist);
          
          // Generate ripple
          float rippleValue = ripple(vUv, time);
          
          // Apply ripple within circle with fadeout toward edges
          float edgeFade = smoothstep(0.5, 0.3, dist);
          float alpha = rippleValue * edgeFade * circle * rippleWidth;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: rippleShader.uniforms,
      vertexShader: rippleShader.vertexShader,
      fragmentShader: rippleShader.fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    let animationFrame;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      if (elapsedTime < config.duration) {
        animationFrame = requestAnimationFrame(animate);
        material.uniforms.time.value = elapsedTime * config.rippleSpeed;
        renderer.render(scene, camera);
      } else {
        // Clean up when animation is complete
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        cancelAnimationFrame(animationFrame);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();

    // Responsive handling
    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Store reference and return control methods
    const effectId = `ripple_${Date.now()}`;
    this.effects[effectId] = {
      container,
      scene,
      camera,
      renderer,
      geometry,
      material,
      animationFrame,
      cleanup: () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", handleResize);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        delete this.effects[effectId];
      },
    };

    return {
      id: effectId,
      cleanup: this.effects[effectId].cleanup,
    };
  }

  /**
   * Create a glowing highlight effect around an element
   * @param {string} elementId - DOM element ID to highlight
   * @param {Object} options - Configuration options
   * @returns {Object} - Control methods
   */
  createGlowEffect(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      return null;
    }

    const defaultOptions = {
      color: "#6366f1",
      intensity: 0.5,
      pulseSpeed: 2,
      duration: 3,
    };

    const config = { ...defaultOptions, ...options };

    // Create a wrapper for the glow effect if not already wrapped
    let wrapper = element.parentElement;
    let shouldCreateWrapper = true;

    if (wrapper && wrapper.classList.contains("glow-wrapper")) {
      shouldCreateWrapper = false;
    }

    if (shouldCreateWrapper) {
      wrapper = document.createElement("div");
      wrapper.classList.add("glow-wrapper");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      // Replace the original element with the wrapper containing the element
      element.parentNode.replaceChild(wrapper, element);
      wrapper.appendChild(element);
    }

    // Create the glow overlay
    const glowOverlay = document.createElement("div");
    glowOverlay.classList.add("glow-overlay");
    glowOverlay.style.position = "absolute";
    glowOverlay.style.top = "0";
    glowOverlay.style.right = "0";
    glowOverlay.style.bottom = "0";
    glowOverlay.style.left = "0";
    glowOverlay.style.pointerEvents = "none";
    glowOverlay.style.boxShadow = `0 0 10px ${config.intensity * 10}px ${config.color}`;
    glowOverlay.style.borderRadius = getComputedStyle(element).borderRadius;
    glowOverlay.style.opacity = "0";

    wrapper.appendChild(glowOverlay);

    // Animate the glow effect
    let startTime = performance.now();
    let animationFrame;

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      if (elapsedTime < config.duration) {
        animationFrame = requestAnimationFrame(animate);
        const pulseValue = (Math.sin(elapsedTime * Math.PI * config.pulseSpeed) + 1) / 2;
        glowOverlay.style.opacity = pulseValue.toString();
      } else {
        cancelAnimationFrame(animationFrame);
        // Clean up
        if (wrapper.contains(glowOverlay)) {
          wrapper.removeChild(glowOverlay);
        }

        // Unwrap if we created the wrapper
        if (shouldCreateWrapper) {
          wrapper.parentNode.replaceChild(element, wrapper);
        }
      }
    };

    animate();

    const effectId = `glow_${Date.now()}`;
    this.effects[effectId] = {
      element,
      wrapper,
      glowOverlay,
      animationFrame,
      cleanup: () => {
        cancelAnimationFrame(animationFrame);
        if (wrapper.contains(glowOverlay)) {
          wrapper.removeChild(glowOverlay);
        }

        if (shouldCreateWrapper) {
          wrapper.parentNode.replaceChild(element, wrapper);
        }

        delete this.effects[effectId];
      },
    };

    return {
      id: effectId,
      cleanup: this.effects[effectId].cleanup,
    };
  }

  /**
   * Clean up all active effects
   */
  cleanupAll() {
    Object.values(this.effects).forEach((effect) => {
      if (effect && typeof effect.cleanup === "function") {
        effect.cleanup();
      }
    });

    this.effects = {};
  }
}

export default new WebGLEffects();
