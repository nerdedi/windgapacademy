import { useEffect, useRef } from "react";

// Portions of this file were generated with the assistance of GitHub Copilot
// Converted from static HTML to React component

export default function RippleEffectPage() {
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

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;

      varying highp vec2 vTextureCoord;

      void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;

    // Fragment shader program
    const fsSource = `
      precision highp float;
      varying highp vec2 vTextureCoord;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      void main() {
        vec2 uv = vTextureCoord;

        // Calculate distance from mouse position
        float dist = distance(uv, uMouse);

        // Create ripple effect
        float ripple = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;
        ripple *= exp(-dist * 8.0); // Fade out with distance

        // Base gradient
        vec3 color = mix(
          vec3(0.2, 0.5, 0.9), // Blue
          vec3(0.8, 0.2, 0.8), // Purple
          uv.x
        );

        // Add ripple effect
        color += vec3(ripple * 0.2);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Initialize shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, "uTime"),
        resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
        mouse: gl.getUniformLocation(shaderProgram, "uMouse"),
      },
    };

    // Create buffers
    const buffers = initBuffers(gl);

    // Track mouse position
    let mousePosition = [0.5, 0.5];
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition = [
        (event.clientX - rect.left) / rect.width,
        1.0 - (event.clientY - rect.top) / rect.height, // Flip Y for WebGL
      ];
    });

    // Handle touch events
    canvas.addEventListener("touchmove", (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      mousePosition = [
        (touch.clientX - rect.left) / rect.width,
        1.0 - (touch.clientY - rect.top) / rect.height,
      ];
    });

    // Animation
    let then = 0;

    function render(now) {
      now *= 0.001; // Convert to seconds
      const deltaTime = now - then;
      then = now;

      drawScene(gl, programInfo, buffers, now, mousePosition);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

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

    function initBuffers(gl) {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Create a square that covers the entire canvas
      const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

      const textureCoordinates = [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
      };
    }

    function drawScene(gl, programInfo, buffers, time, mousePosition) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Set position attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      }

      // Set texture coordinate attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
      }

      // Use the shader program
      gl.useProgram(programInfo.program);

      // Set uniforms
      gl.uniform1f(programInfo.uniformLocations.time, time);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform2f(programInfo.uniformLocations.mouse, mousePosition[0], mousePosition[1]);

      // Draw
      {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    }

    // Cleanup on unmount
    return () => {
      // Delete WebGL resources
      gl.deleteProgram(programInfo.program);
      gl.deleteBuffer(buffers.position);
      gl.deleteBuffer(buffers.textureCoord);
    };
  }, []);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">WebGL Ripple Effect</h1>
      <p className="mb-4">
        Interactive ripple effect using WebGL shaders. Move your cursor over the canvas to create
        ripples.
      </p>

      <div className="demo-section w-full max-w-3xl">
        <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg shadow-lg" />

        <div className="mt-4">
          <h2 className="text-xl font-semibold">How It Works</h2>
          <p>
            This demo uses WebGL fragment shaders to create an interactive ripple effect. The ripple
            is calculated based on the distance from your cursor position, creating an engaging
            visual experience.
          </p>
          <p>Technologies used:</p>
          <ul className="list-disc ml-6">
            <li>WebGL for GPU-accelerated rendering</li>
            <li>GLSL Shader programming</li>
            <li>React useRef and useEffect for lifecycle management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
