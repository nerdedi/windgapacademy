import { useEffect, useRef, useState } from "react";

// Portions of this file were generated with the assistance of GitHub Copilot
// Converted from static HTML to React component

export default function CharacterAnimationPage() {
  const canvasRef = useRef(null);
  const [animation, setAnimation] = useState("walk");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Set the canvas resolution
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Character sprite properties
    const spriteWidth = 64;
    const spriteHeight = 64;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 0;
    const staggerFrames = 5; // Speed of animation (lower = faster)

    // Load character sprite sheet
    const characterImage = new Image();
    characterImage.src = "/assets/character-spritesheet.png";

    // If image doesn't exist, draw a placeholder character
    characterImage.onerror = () => {
      console.warn("Character sprite sheet not found, using placeholder");
      drawPlaceholderCharacter();
    };

    // Define animation states
    const animations = {
      idle: {
        frames: 7,
        row: 0,
      },
      walk: {
        frames: 9,
        row: 1,
      },
      run: {
        frames: 9,
        row: 2,
      },
      jump: {
        frames: 7,
        row: 3,
      },
      attack: {
        frames: 8,
        row: 4,
      },
    };

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = "#f5f7fa";
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;

      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Calculate which frame to draw
      const animationSequence = animations[animation];
      const position = Math.floor(gameFrame / staggerFrames) % animationSequence.frames;
      frameX = spriteWidth * position;
      frameY = spriteHeight * animationSequence.row;

      if (characterImage.complete) {
        // Draw character sprite at the center of canvas
        const centerX = width / 2 - spriteWidth;
        const centerY = height / 2 - spriteHeight;

        ctx.drawImage(
          characterImage,
          frameX,
          frameY,
          spriteWidth,
          spriteHeight,
          centerX,
          centerY,
          spriteWidth * 2,
          spriteHeight * 2,
        );
      }

      gameFrame++;
      requestAnimationFrame(animate);
    }

    function drawPlaceholderCharacter() {
      // Draw a simple placeholder character
      ctx.fillStyle = "#4338ca";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(width / 2 - 10, height / 2 - 10, 5, 0, Math.PI * 2);
      ctx.arc(width / 2 + 10, height / 2 - 10, 5, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 + 5, 10, 0, Math.PI);
      ctx.stroke();
    }

    // Start animation
    animate();

    // Clean up
    return () => {
      // No need to cancel animation frame as component will unmount
    };
  }, [animation]);

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Character Animation System</h1>
      <p className="mb-4">
        Interactive character animations used in Windgap Academy educational games.
      </p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setAnimation("idle")}
          className={`px-4 py-2 rounded-lg ${
            animation === "idle" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Idle
        </button>
        <button
          onClick={() => setAnimation("walk")}
          className={`px-4 py-2 rounded-lg ${
            animation === "walk" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Walk
        </button>
        <button
          onClick={() => setAnimation("run")}
          className={`px-4 py-2 rounded-lg ${
            animation === "run" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Run
        </button>
        <button
          onClick={() => setAnimation("jump")}
          className={`px-4 py-2 rounded-lg ${
            animation === "jump" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Jump
        </button>
        <button
          onClick={() => setAnimation("attack")}
          className={`px-4 py-2 rounded-lg ${
            animation === "attack" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Attack
        </button>
      </div>

      <div className="demo-section w-full max-w-3xl">
        <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg shadow-lg" />

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Character Animation System</h2>
          <p>
            This demo showcases our character animation system that&apos;s used across educational
            games and interactive exercises in the Windgap Academy platform. The animations are
            optimized for performance and designed to be accessible and engaging for learners of all
            abilities.
          </p>
          <p>Features of our character animation system:</p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Multiple animation states</strong>: Different animations for various game
              states
            </li>
            <li>
              <strong>Sprite-based animation</strong>: Efficient rendering using sprite sheets
            </li>
            <li>
              <strong>Canvas rendering</strong>: Works across all modern browsers without plugins
            </li>
            <li>
              <strong>Accessibility features</strong>: High contrast and clear movements
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
