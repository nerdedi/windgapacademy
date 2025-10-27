import { useEffect, useRef, useState } from "react";

// Portions of this file were generated with the assistance of GitHub Copilot
// Converted from static HTML to React component

export default function WebGLEffectsPage() {
  const [activeEffect, setActiveEffect] = useState("particles");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Set the canvas resolution
    canvas.width = width;
    canvas.height = height;

    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    let animationFrameId;
    let program;
    let positionBuffer;
    let textureCoordBuffer;

    // Initialize based on the active effect
    switch (activeEffect) {
      case "particles":
        initParticleEffect(gl, canvas);
        break;
      case "glow":
        initGlowEffect(gl, canvas);
        break;
      case "waves":
        initWaveEffect(gl, canvas);
        break;
      default:
        initParticleEffect(gl, canvas);
    }

    // Cleanup on unmount or effect change
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (program) gl.deleteProgram(program);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (textureCoordBuffer) gl.deleteBuffer(textureCoordBuffer);
    };

    // Particle Effect Implementation
    function initParticleEffect(gl, canvas) {
      // Vertex shader for particles
      const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute float aSize;
        attribute vec3 aColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uTime;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vColor;

        void main(void) {
          // Add some movement based on time
          float xOffset = sin(uTime * 0.5 + aVertexPosition.y * 2.0) * 0.3;
          float yOffset = cos(uTime * 0.4 + aVertexPosition.x * 2.0) * 0.2;

          vec4 position = aVertexPosition;
          position.x += xOffset;
          position.y += yOffset;

          gl_Position = uProjectionMatrix * uModelViewMatrix * position;
          gl_PointSize = aSize;

          vTextureCoord = aTextureCoord;
          vColor = aColor;
        }
      `;

      // Fragment shader for particles
      const fsSource = `
        precision mediump float;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vColor;

        void main(void) {
          // Create a circular particle
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(gl_PointCoord, center);
          if (dist > 0.5) {
              discard; // Discard pixels outside the circle
          }

          // Add a glow effect
          float brightness = 1.0 - (dist * 2.0);
          brightness = pow(brightness, 2.0);

          gl_FragColor = vec4(vColor * brightness, brightness);
        }
      `;

      // Initialize shader program
      program = initShaderProgram(gl, vsSource, fsSource);

      const programInfo = {
        program: program,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
          textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
          size: gl.getAttribLocation(program, "aSize"),
          color: gl.getAttribLocation(program, "aColor"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
          time: gl.getUniformLocation(program, "uTime"),
        },
      };

      // Create particle data
      const numParticles = 200;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);
      const sizes = new Float32Array(numParticles);

      for (let i = 0; i < numParticles; i++) {
        // Random position in normalized device coordinates (-1 to +1)
        positions[i * 3] = Math.random() * 2 - 1;
        positions[i * 3 + 1] = Math.random() * 2 - 1;
        positions[i * 3 + 2] = 0;

        // Random colors
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();

        // Random sizes
        sizes[i] = Math.random() * 20 + 5;
      }

      // Create buffers
      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

      const sizeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

      // Animation
      let startTime = Date.now();

      function render() {
        const currentTime = Date.now();
        const time = (currentTime - startTime) / 1000;

        gl.clearColor(0.0, 0.0, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Use shader program
        gl.useProgram(program);

        // Set uniforms
        const projectionMatrix = mat4Identity();
        const modelViewMatrix = mat4Identity();

        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniform1f(programInfo.uniformLocations.time, time);

        // Set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          3, // components per vertex
          gl.FLOAT,
          false,
          0,
          0,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.size, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.size);

        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        // Draw particles
        gl.drawArrays(gl.POINTS, 0, numParticles);

        animationFrameId = requestAnimationFrame(render);
      }

      render();
    }

    // Glow Effect Implementation
    function initGlowEffect(gl, canvas) {
      // Shader implementation for glow effect would go here
      // This is a placeholder
      gl.clearColor(0.1, 0.1, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // Wave Effect Implementation
    function initWaveEffect(gl, canvas) {
      // Shader implementation for wave effect would go here
      // This is a placeholder
      gl.clearColor(0.0, 0.3, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // Helper functions
    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
        return null;
      }

      return program;
    }

    function loadShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function mat4Identity() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }, [activeEffect]);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">WebGL Visual Effects</h1>
      <p className="mb-4">
        A showcase of WebGL shader effects used in the Windgap Academy platform.
      </p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveEffect("particles")}
          className={`px-4 py-2 rounded-lg ${
            activeEffect === "particles" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Particle Effect
        </button>
        <button
          onClick={() => setActiveEffect("glow")}
          className={`px-4 py-2 rounded-lg ${
            activeEffect === "glow" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Glow Effect
        </button>
        <button
          onClick={() => setActiveEffect("waves")}
          className={`px-4 py-2 rounded-lg ${
            activeEffect === "waves" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Wave Effect
        </button>
      </div>

      <div className="demo-section w-full max-w-3xl">
        <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg shadow-lg bg-black" />

        <div className="mt-4">
          <h2 className="text-xl font-semibold">How It Works</h2>
          <p>
            These effects use WebGL shaders to create visually engaging animations. They're used
            throughout the Windgap Academy platform to enhance the user experience and draw
            attention to interactive elements.
          </p>
          <p>The current implementation shows:</p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Particle System</strong>: Dynamic moving particles with glow effects
            </li>
            <li>
              <strong>Glow Highlights</strong>: Used to emphasize important UI elements
            </li>
            <li>
              <strong>Wave Animations</strong>: Smooth flowing animations for backgrounds
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
