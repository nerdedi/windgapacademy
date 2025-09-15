import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Advanced Sprite Animation Manager
class SpriteAnimationManager {
  constructor() {
    this.spriteSheets = {};
    this.animations = {};
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.isPlaying = true;
    this.animationQueue = [];
    this.transitionSpeed = 0.1;
  }

  // Create sprite sheet data (simulated)
  createSpriteSheet(name, config) {
    this.spriteSheets[name] = {
      frameWidth: config.frameWidth || 64,
      frameHeight: config.frameHeight || 64,
      framesPerRow: config.framesPerRow || 8,
      totalFrames: config.totalFrames || 32,
      imageData: config.imageData || null,
    };
  }

  // Define animation clips
  createAnimationClip(name, spriteSheet, config) {
    this.animations[name] = {
      spriteSheet: spriteSheet,
      startFrame: config.startFrame || 0,
      endFrame: config.endFrame || 3,
      frameRate: config.frameRate || 12,
      loop: config.loop !== false,
      priority: config.priority || 0,
      transitions: config.transitions || {},
      onComplete: config.onComplete || null,
    };
  }

  // Animation state machine
  playAnimation(name, forceRestart = false) {
    if (!this.animations[name]) return false;

    const newAnim = this.animations[name];

    if (this.currentAnimation?.name === name && !forceRestart) {
      return true;
    }

    // Check if we can transition
    if (this.currentAnimation && this.currentAnimation.transitions[name]) {
      const transition = this.currentAnimation.transitions[name];
      if (transition.condition && !transition.condition()) {
        this.animationQueue.push(name);
        return false;
      }
    }

    this.currentAnimation = { ...newAnim, name };
    this.currentFrame = newAnim.startFrame;
    this.frameTimer = 0;
    return true;
  }

  // Update animation system
  update(deltaTime) {
    if (!this.currentAnimation || !this.isPlaying) return;

    this.frameTimer += deltaTime;
    const frameDuration = 1000 / this.currentAnimation.frameRate;

    if (this.frameTimer >= frameDuration) {
      this.currentFrame++;
      this.frameTimer = 0;

      if (this.currentFrame > this.currentAnimation.endFrame) {
        if (this.currentAnimation.loop) {
          this.currentFrame = this.currentAnimation.startFrame;
        } else {
          this.currentFrame = this.currentAnimation.endFrame;
          if (this.currentAnimation.onComplete) {
            this.currentAnimation.onComplete();
          }
          this.processQueue();
        }
      }
    }
  }

  processQueue() {
    if (this.animationQueue.length > 0) {
      const nextAnim = this.animationQueue.shift();
      this.playAnimation(nextAnim, true);
    }
  }

  // Get current sprite frame data
  getCurrentSpriteFrame() {
    if (!this.currentAnimation) return null;

    const sheet = this.spriteSheets[this.currentAnimation.spriteSheet];
    if (!sheet) return null;

    const row = Math.floor(this.currentFrame / sheet.framesPerRow);
    const col = this.currentFrame % sheet.framesPerRow;

    return {
      x: col * sheet.frameWidth,
      y: row * sheet.frameHeight,
      width: sheet.frameWidth,
      height: sheet.frameHeight,
      animationName: this.currentAnimation.name,
      frame: this.currentFrame,
    };
  }
}

// Enhanced Character with Sprite Rendering
class SpriteCharacter {
  constructor() {
    this.position = { x: 200, y: 250 };
    this.velocity = { x: 0, y: 0 };
    this.scale = { x: 2, y: 2 };
    this.facingRight = true;
    this.isGrounded = true;
    this.health = 100;
    this.energy = 100;

    // Movement parameters
    this.speed = 4;
    this.runMultiplier = 1.8;
    this.jumpPower = 16;
    this.gravity = 0.9;
    this.friction = 0.85;

    // Animation system
    this.animationManager = new SpriteAnimationManager();
    this.setupAnimations();

    // Input state
    this.inputState = {
      left: false,
      right: false,
      jump: false,
      attack: false,
      run: false,
    };
  }

  setupAnimations() {
    // Create sprite sheets (simulated with colored rectangles)
    this.animationManager.createSpriteSheet("character", {
      frameWidth: 32,
      frameHeight: 48,
      framesPerRow: 8,
      totalFrames: 40,
    });

    // Define animation clips with transitions
    this.animationManager.createAnimationClip("idle", "character", {
      startFrame: 0,
      endFrame: 3,
      frameRate: 6,
      loop: true,
      priority: 0,
      transitions: {
        walk: { condition: () => this.isMoving() },
        jump: { condition: () => !this.isGrounded },
        attack: { condition: () => this.inputState.attack },
      },
    });

    this.animationManager.createAnimationClip("walk", "character", {
      startFrame: 8,
      endFrame: 15,
      frameRate: 12,
      loop: true,
      priority: 1,
      transitions: {
        idle: { condition: () => !this.isMoving() },
        run: { condition: () => this.inputState.run },
        jump: { condition: () => !this.isGrounded },
      },
    });

    this.animationManager.createAnimationClip("run", "character", {
      startFrame: 16,
      endFrame: 23,
      frameRate: 16,
      loop: true,
      priority: 2,
      transitions: {
        walk: { condition: () => !this.inputState.run },
        jump: { condition: () => !this.isGrounded },
      },
    });

    this.animationManager.createAnimationClip("jump", "character", {
      startFrame: 24,
      endFrame: 27,
      frameRate: 10,
      loop: false,
      priority: 3,
      onComplete: () => {
        if (this.isGrounded) {
          this.animationManager.playAnimation("idle");
        }
      },
    });

    this.animationManager.createAnimationClip("attack", "character", {
      startFrame: 32,
      endFrame: 36,
      frameRate: 20,
      loop: false,
      priority: 4,
      onComplete: () => {
        this.animationManager.playAnimation("idle");
      },
    });

    // Start with idle animation
    this.animationManager.playAnimation("idle");
  }

  isMoving() {
    return Math.abs(this.velocity.x) > 0.5;
  }

  handleInput(keys) {
    // Update input state
    this.inputState.left = keys.ArrowLeft || keys.KeyA;
    this.inputState.right = keys.ArrowRight || keys.KeyD;
    this.inputState.jump = keys.Space || keys.ArrowUp || keys.KeyW;
    this.inputState.attack = keys.KeyX || keys.Enter;
    this.inputState.run = keys.ShiftLeft || keys.ShiftRight;

    // Horizontal movement
    let targetVelocityX = 0;
    if (this.inputState.left) {
      targetVelocityX = -this.speed;
      this.facingRight = false;
    } else if (this.inputState.right) {
      targetVelocityX = this.speed;
      this.facingRight = true;
    }

    // Apply run multiplier
    if (this.inputState.run && targetVelocityX !== 0) {
      targetVelocityX *= this.runMultiplier;
    }

    // Smooth velocity changes
    this.velocity.x += (targetVelocityX - this.velocity.x) * 0.3;

    // Jumping
    if (this.inputState.jump && this.isGrounded) {
      this.velocity.y = -this.jumpPower;
      this.isGrounded = false;
      this.animationManager.playAnimation("jump");
    }

    // Attack
    if (this.inputState.attack) {
      this.animationManager.playAnimation("attack");
    }

    // Animation state management
    if (this.isGrounded) {
      if (Math.abs(this.velocity.x) > 0.5) {
        if (this.inputState.run) {
          this.animationManager.playAnimation("run");
        } else {
          this.animationManager.playAnimation("walk");
        }
      } else {
        this.animationManager.playAnimation("idle");
      }
    }
  }

  update(deltaTime) {
    // Apply physics
    if (!this.isGrounded) {
      this.velocity.y += this.gravity;
    }

    // Apply friction
    this.velocity.x *= this.friction;

    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Ground collision
    if (this.position.y >= 250) {
      this.position.y = 250;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Screen boundaries
    this.position.x = Math.max(0, Math.min(750, this.position.x));

    // Update animations
    this.animationManager.update(deltaTime);

    // Regenerate energy
    if (this.energy < 100) {
      this.energy = Math.min(100, this.energy + deltaTime * 0.02);
    }
  }

  render(ctx) {
    const spriteFrame = this.animationManager.getCurrentSpriteFrame();
    if (!spriteFrame) return;

    ctx.save();

    // Character transformation
    const renderX = this.position.x;
    const renderY = this.position.y;

    // Flip sprite if facing left
    if (!this.facingRight) {
      ctx.scale(-1, 1);
      ctx.translate(-renderX * 2 - spriteFrame.width * this.scale.x, 0);
    }

    // Render sprite (using colored rectangles as placeholder for actual sprites)
    const colors = {
      idle: "#4ade80",
      walk: "#3b82f6",
      run: "#f59e0b",
      jump: "#8b5cf6",
      attack: "#ef4444",
    };

    ctx.fillStyle = colors[spriteFrame.animationName] || "#4ade80";
    ctx.fillRect(
      renderX,
      renderY,
      spriteFrame.width * this.scale.x,
      spriteFrame.height * this.scale.y,
    );

    // Animation frame indicator
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 8; i++) {
      const alpha = i === spriteFrame.frame % 8 ? 1.0 : 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillRect(renderX + i * 8, renderY - 15, 6, 8);
    }
    ctx.globalAlpha = 1.0;

    ctx.restore();

    // Character status
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(
      `${spriteFrame.animationName} (${spriteFrame.frame})`,
      this.position.x,
      this.position.y - 25,
    );

    // Health and energy bars
    this.renderStatusBars(ctx);
  }

  renderStatusBars(ctx) {
    const barWidth = 60;
    const barHeight = 6;
    const x = this.position.x;
    const y = this.position.y - 45;

    // Health bar
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x, y, (this.health / 100) * barWidth, barHeight);

    // Energy bar
    ctx.fillStyle = "#1e40af";
    ctx.fillRect(x, y + 10, barWidth, barHeight);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(x, y + 10, (this.energy / 100) * barWidth, barHeight);
  }
}

// Main Sprite-Based Game Component
function SpriteBasedGame() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const [keys, setKeys] = useState({});
  const [character] = useState(() => new SpriteCharacter());
  const [gameInfo, setGameInfo] = useState({
    fps: 0,
    deltaTime: 0,
    frameCount: 0,
  });

  // Input handling
  const handleKeyDown = useCallback((e) => {
    setKeys((prev) => ({ ...prev, [e.code]: true }));
    e.preventDefault();
  }, []);

  const handleKeyUp = useCallback((e) => {
    setKeys((prev) => ({ ...prev, [e.code]: false }));
    e.preventDefault();
  }, []);

  // Game loop with delta time
  const gameLoop = useCallback(
    (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Clear canvas with animated background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#0f172a");
      bgGradient.addColorStop(0.7, "#1e293b");
      bgGradient.addColorStop(1, "#334155");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated background elements
      const time = timestamp * 0.001;
      ctx.fillStyle = "#1e40af";
      for (let i = 0; i < 10; i++) {
        const x = (Math.sin(time + i) * 100 + canvas.width / 2) % canvas.width;
        const y = (Math.cos(time * 0.7 + i) * 50 + 100) % canvas.height;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x, y, 20, 20);
      }
      ctx.globalAlpha = 1.0;

      // Ground
      ctx.fillStyle = "#059669";
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      // Update and render character
      character.handleInput(keys);
      character.update(deltaTime);
      character.render(ctx);

      // Update game info
      setGameInfo((prev) => ({
        fps: Math.round(1000 / deltaTime),
        deltaTime: deltaTime,
        frameCount: prev.frameCount + 1,
      }));

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [keys, character],
  );

  // Setup and cleanup
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, gameLoop]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/games")}
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            🎓 Windgap Academy
          </button>
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">Sprite Animation System</span>
            <button
              onClick={() => navigate("/games")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-screen pt-16">
        {/* Game Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="border-2 border-gray-700 rounded-lg shadow-2xl"
              tabIndex={0}
            />

            {/* Game Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 text-sm space-y-1">
              <div>FPS: {gameInfo.fps}</div>
              <div>Delta: {gameInfo.deltaTime.toFixed(1)}ms</div>
              <div>Animation: {character.animationManager.currentAnimation?.name || "none"}</div>
              <div>Frame: {character.animationManager.currentFrame}</div>
            </div>

            {/* Character Stats */}
            <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3 text-sm space-y-1">
              <div>Health: {Math.round(character.health)}%</div>
              <div>Energy: {Math.round(character.energy)}%</div>
              <div>
                Position: ({Math.round(character.position.x)}, {Math.round(character.position.y)})
              </div>
              <div>
                Velocity: ({character.velocity.x.toFixed(1)}, {character.velocity.y.toFixed(1)})
              </div>
            </div>
          </div>
        </div>

        {/* Animation Control Panel */}
        <div className="w-80 bg-gray-900 p-6 border-l border-gray-700">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🎭 Sprite Animation System
          </h2>

          <div className="space-y-6">
            {/* Manual Animation Controls */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Animation Clips</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(character.animationManager.animations).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => character.animationManager.playAnimation(anim, true)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      character.animationManager.currentAnimation?.name === anim
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {anim.charAt(0).toUpperCase() + anim.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Controls</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• A/D or ←/→: Move</div>
                <div>• Shift + Move: Run</div>
                <div>• W/Space/↑: Jump</div>
                <div>• X/Enter: Attack</div>
              </div>
            </div>

            {/* Animation Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3">System Features</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>✅ Sprite Sheet Management</div>
                <div>✅ Animation State Machine</div>
                <div>✅ Frame-by-Frame Animation</div>
                <div>✅ Smooth Transitions</div>
                <div>✅ Input-Triggered Animations</div>
                <div>✅ Animation Queuing</div>
                <div>✅ Delta Time Updates</div>
                <div>✅ Character Physics</div>
                <div>✅ Status Bars & UI</div>
                <div>✅ Responsive Controls</div>
              </div>
            </div>

            {/* Animation Parameters */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Animation</h3>
              <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                <div>Name: {character.animationManager.currentAnimation?.name || "None"}</div>
                <div>Frame: {character.animationManager.currentFrame}</div>
                <div>Loop: {character.animationManager.currentAnimation?.loop ? "Yes" : "No"}</div>
                <div>Priority: {character.animationManager.currentAnimation?.priority || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpriteBasedGame;
