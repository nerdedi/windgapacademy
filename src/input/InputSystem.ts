import * as THREE from "three";

export interface InputConfig {
  enableKeyboard: boolean;
  enableMouse: boolean;
  enableTouch: boolean;
  enableGamepad: boolean;
  mouseSensitivity: number;
  touchSensitivity: number;
}

export interface KeyBinding {
  key: string;
  action: string;
  modifiers?: string[];
}

export interface InputState {
  keyboard: Map<string, boolean>;
  mouse: {
    position: THREE.Vector2;
    delta: THREE.Vector2;
    buttons: Map<number, boolean>;
    wheel: number;
  };
  touch: {
    touches: Map<number, THREE.Vector2>;
    gestures: {
      pinch: { scale: number; active: boolean };
      pan: { delta: THREE.Vector2; active: boolean };
      rotate: { angle: number; active: boolean };
    };
  };
  gamepad: {
    connected: boolean;
    buttons: Map<number, { pressed: boolean; value: number }>;
    axes: number[];
  };
}

export class InputSystem {
  private config: InputConfig;
  private state: InputState;
  private keyBindings: Map<string, string>;
  private actionCallbacks: Map<string, Function[]>;
  private element: HTMLElement;
  private isActive: boolean;

  constructor(element: HTMLElement, config: Partial<InputConfig> = {}) {
    this.element = element;
    this.config = {
      enableKeyboard: true,
      enableMouse: true,
      enableTouch: true,
      enableGamepad: true,
      mouseSensitivity: 1.0,
      touchSensitivity: 1.0,
      ...config,
    };

    this.state = this.initializeState();
    this.keyBindings = new Map();
    this.actionCallbacks = new Map();
    this.isActive = false;

    this.setupDefaultBindings();
    this.attachEventListeners();
  }

  private initializeState(): InputState {
    return {
      keyboard: new Map(),
      mouse: {
        position: new THREE.Vector2(),
        delta: new THREE.Vector2(),
        buttons: new Map(),
        wheel: 0,
      },
      touch: {
        touches: new Map(),
        gestures: {
          pinch: { scale: 1, active: false },
          pan: { delta: new THREE.Vector2(), active: false },
          rotate: { angle: 0, active: false },
        },
      },
      gamepad: {
        connected: false,
        buttons: new Map(),
        axes: [],
      },
    };
  }

  private setupDefaultBindings(): void {
    // Movement
    this.bindKey("w", "move-forward");
    this.bindKey("s", "move-backward");
    this.bindKey("a", "move-left");
    this.bindKey("d", "move-right");
    this.bindKey(" ", "jump");
    this.bindKey("shift", "run");

    // Camera
    this.bindKey("q", "camera-left");
    this.bindKey("e", "camera-right");
    this.bindKey("r", "camera-reset");

    // Actions
    this.bindKey("enter", "confirm");
    this.bindKey("escape", "cancel");
    this.bindKey("tab", "menu");

    // Game specific
    this.bindKey("1", "tool-1");
    this.bindKey("2", "tool-2");
    this.bindKey("3", "tool-3");
    this.bindKey("4", "tool-4");
  }

  private attachEventListeners(): void {
    if (this.config.enableKeyboard) {
      this.setupKeyboardEvents();
    }

    if (this.config.enableMouse) {
      this.setupMouseEvents();
    }

    if (this.config.enableTouch) {
      this.setupTouchEvents();
    }

    if (this.config.enableGamepad) {
      this.setupGamepadEvents();
    }
  }

  private setupKeyboardEvents(): void {
    document.addEventListener("keydown", (event) => {
      if (!this.isActive) return;

      const key = event.key.toLowerCase();
      this.state.keyboard.set(key, true);

      const action = this.keyBindings.get(key);
      if (action) {
        this.triggerAction(action, { type: "keydown", key, event });
        event.preventDefault();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (!this.isActive) return;

      const key = event.key.toLowerCase();
      this.state.keyboard.set(key, false);

      const action = this.keyBindings.get(key);
      if (action) {
        this.triggerAction(`${action}-up`, { type: "keyup", key, event });
      }
    });
  }

  private setupMouseEvents(): void {
    this.element.addEventListener("mousedown", (event) => {
      if (!this.isActive) return;

      this.state.mouse.buttons.set(event.button, true);
      this.triggerAction("mouse-down", {
        type: "mousedown",
        button: event.button,
        position: this.getMousePosition(event),
        event,
      });
    });

    this.element.addEventListener("mouseup", (event) => {
      if (!this.isActive) return;

      this.state.mouse.buttons.set(event.button, false);
      this.triggerAction("mouse-up", {
        type: "mouseup",
        button: event.button,
        position: this.getMousePosition(event),
        event,
      });
    });

    this.element.addEventListener("mousemove", (event) => {
      if (!this.isActive) return;

      const newPosition = this.getMousePosition(event);
      this.state.mouse.delta.copy(newPosition).sub(this.state.mouse.position);
      this.state.mouse.delta.multiplyScalar(this.config.mouseSensitivity);
      this.state.mouse.position.copy(newPosition);

      this.triggerAction("mouse-move", {
        type: "mousemove",
        position: newPosition,
        delta: this.state.mouse.delta.clone(),
        event,
      });
    });

    this.element.addEventListener("wheel", (event) => {
      if (!this.isActive) return;

      this.state.mouse.wheel = event.deltaY;
      this.triggerAction("mouse-wheel", {
        type: "wheel",
        delta: event.deltaY,
        event,
      });
    });

    this.element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  private setupTouchEvents(): void {
    this.element.addEventListener("touchstart", (event) => {
      if (!this.isActive) return;

      event.preventDefault();
      this.updateTouches(event);
      this.triggerAction("touch-start", {
        type: "touchstart",
        touches: this.getTouchPositions(event),
        event,
      });
    });

    this.element.addEventListener("touchmove", (event) => {
      if (!this.isActive) return;

      event.preventDefault();
      this.updateTouches(event);
      this.detectGestures(event);
      this.triggerAction("touch-move", {
        type: "touchmove",
        touches: this.getTouchPositions(event),
        gestures: this.state.touch.gestures,
        event,
      });
    });

    this.element.addEventListener("touchend", (event) => {
      if (!this.isActive) return;

      event.preventDefault();
      this.updateTouches(event);
      this.resetGestures();
      this.triggerAction("touch-end", {
        type: "touchend",
        touches: this.getTouchPositions(event),
        event,
      });
    });
  }

  private setupGamepadEvents(): void {
    window.addEventListener("gamepadconnected", (event) => {
      this.state.gamepad.connected = true;
      this.triggerAction("gamepad-connected", {
        type: "gamepadconnected",
        gamepad: event.gamepad,
      });
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      this.state.gamepad.connected = false;
      this.triggerAction("gamepad-disconnected", {
        type: "gamepaddisconnected",
        gamepad: event.gamepad,
      });
    });
  }

  private getMousePosition(event: MouseEvent): THREE.Vector2 {
    const rect = this.element.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  private getTouchPositions(event: TouchEvent): THREE.Vector2[] {
    const rect = this.element.getBoundingClientRect();
    const positions: THREE.Vector2[] = [];

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      positions.push(
        new THREE.Vector2(
          ((touch.clientX - rect.left) / rect.width) * 2 - 1,
          -((touch.clientY - rect.top) / rect.height) * 2 + 1,
        ),
      );
    }

    return positions;
  }

  private updateTouches(event: TouchEvent): void {
    this.state.touch.touches.clear();

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const position = this.getTouchPositions(event)[i];
      this.state.touch.touches.set(touch.identifier, position);
    }
  }

  private detectGestures(event: TouchEvent): void {
    const touches = Array.from(this.state.touch.touches.values());

    if (touches.length === 2) {
      // Pinch gesture
      const distance = touches[0].distanceTo(touches[1]);
      const previousDistance = this.state.touch.gestures.pinch.scale;

      if (previousDistance > 0) {
        this.state.touch.gestures.pinch.scale = distance / previousDistance;
        this.state.touch.gestures.pinch.active = true;
      } else {
        this.state.touch.gestures.pinch.scale = distance;
      }

      // Rotation gesture
      const angle = Math.atan2(touches[1].y - touches[0].y, touches[1].x - touches[0].x);
      this.state.touch.gestures.rotate.angle = angle;
      this.state.touch.gestures.rotate.active = true;
    } else if (touches.length === 1) {
      // Pan gesture
      this.state.touch.gestures.pan.active = true;
    }
  }

  private resetGestures(): void {
    this.state.touch.gestures.pinch.active = false;
    this.state.touch.gestures.pan.active = false;
    this.state.touch.gestures.rotate.active = false;
  }

  private updateGamepad(): void {
    if (!this.config.enableGamepad || !this.state.gamepad.connected) return;

    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (gamepad) {
      // Update buttons
      for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i];
        this.state.gamepad.buttons.set(i, {
          pressed: button.pressed,
          value: button.value,
        });
      }

      // Update axes
      this.state.gamepad.axes = Array.from(gamepad.axes);
    }
  }

  // Public API
  public bindKey(key: string, action: string): void {
    this.keyBindings.set(key.toLowerCase(), action);
  }

  public unbindKey(key: string): void {
    this.keyBindings.delete(key.toLowerCase());
  }

  public onAction(action: string, callback: Function): void {
    if (!this.actionCallbacks.has(action)) {
      this.actionCallbacks.set(action, []);
    }
    this.actionCallbacks.get(action)!.push(callback);
  }

  public offAction(action: string, callback?: Function): void {
    if (callback) {
      const callbacks = this.actionCallbacks.get(action);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      this.actionCallbacks.delete(action);
    }
  }

  private triggerAction(action: string, data: any): void {
    const callbacks = this.actionCallbacks.get(action);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  public isKeyPressed(key: string): boolean {
    return this.state.keyboard.get(key.toLowerCase()) || false;
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.state.mouse.buttons.get(button) || false;
  }

  public getMousePosition(): THREE.Vector2 {
    return this.state.mouse.position.clone();
  }

  public getMouseDelta(): THREE.Vector2 {
    return this.state.mouse.delta.clone();
  }

  public getTouchCount(): number {
    return this.state.touch.touches.size;
  }

  public isGamepadConnected(): boolean {
    return this.state.gamepad.connected;
  }

  public getGamepadButton(button: number): { pressed: boolean; value: number } | undefined {
    return this.state.gamepad.buttons.get(button);
  }

  public getGamepadAxis(axis: number): number {
    return this.state.gamepad.axes[axis] || 0;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
    this.clearState();
  }

  private clearState(): void {
    this.state.keyboard.clear();
    this.state.mouse.buttons.clear();
    this.state.mouse.delta.set(0, 0);
    this.state.touch.touches.clear();
    this.resetGestures();
  }

  public update(): void {
    this.updateGamepad();

    // Reset frame-based values
    this.state.mouse.delta.set(0, 0);
    this.state.mouse.wheel = 0;
  }

  public dispose(): void {
    this.deactivate();
    this.actionCallbacks.clear();
    this.keyBindings.clear();
  }
}

export default InputSystem;
