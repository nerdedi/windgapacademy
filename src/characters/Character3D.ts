import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type CharacterState = 'idle' | 'walking' | 'running' | 'talking' | 'thinking' | 'celebrating' | 'disappointed' | 'excited' | 'sleeping';
export type EmotionType = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'confused' | 'excited' | 'thoughtful';

export interface PersonalityTraits {
  friendliness: number; // 0-1
  intelligence: number; // 0-1
  energy: number; // 0-1
  patience: number; // 0-1
  humor: number; // 0-1
  helpfulness: number; // 0-1
}

export interface DialogueSystem {
  speak(text: string, emotion: EmotionType): void;
  update(deltaTime: number): void;
  isCurrentlySpeaking(): boolean;
  getCurrentText(): string;
}

export interface EmotionSystem {
  setEmotion(emotion: EmotionType): void;
  getCurrentEmotion(): EmotionType;
  update(deltaTime: number): void;
  blendToEmotion(emotion: EmotionType, duration: number): void;
}

export class Character3D {
  public model: THREE.Group;
  public mixer: THREE.AnimationMixer;
  public animations: Map<string, THREE.AnimationAction> = new Map();
  public currentState: CharacterState = 'idle';
  public personality: PersonalityTraits;
  public dialogue: DialogueSystem;
  private emotionSystem: EmotionSystem;
  private facialExpressions: Map<EmotionType, THREE.AnimationAction> = new Map();
  private bodyLanguage: Map<CharacterState, THREE.AnimationAction> = new Map();
  private voiceSettings: { pitch: number; speed: number; volume: number };
  private interactionRadius: number = 5;
  private isInteractable: boolean = true;
  private currentTarget: THREE.Vector3 | null = null;
  private movementSpeed: number = 2;
  private rotationSpeed: number = 3;

  constructor(gltf: GLTF, scene: THREE.Scene, personalityConfig?: Partial<PersonalityTraits>) {
    this.model = gltf.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.setupAnimations(gltf.animations);
    this.setupPersonality(personalityConfig);
    this.setupEmotionSystem();
    this.setupDialogueSystem();
    this.setupVoiceSettings();
    this.setupInteractionSphere();
    scene.add(this.model);
  }

  private setupAnimations(animations: THREE.AnimationClip[]) {
    animations.forEach(clip => {
      const action = this.mixer.clipAction(clip);
      this.animations.set(clip.name, action);

      // Categorize animations
      if (clip.name.includes('facial') || clip.name.includes('expression')) {
        const emotion = this.extractEmotionFromClipName(clip.name);
        if (emotion) {
          this.facialExpressions.set(emotion, action);
        }
      } else if (clip.name.includes('body') || clip.name.includes('pose')) {
        const state = this.extractStateFromClipName(clip.name);
        if (state) {
          this.bodyLanguage.set(state, action);
        }
      }
    });
  }

  private extractEmotionFromClipName(name: string): EmotionType | null {
    const emotionMap: { [key: string]: EmotionType } = {
      'happy': 'happy',
      'sad': 'sad',
      'angry': 'angry',
      'surprised': 'surprised',
      'confused': 'confused',
      'excited': 'excited',
      'thoughtful': 'thoughtful',
      'neutral': 'neutral'
    };

    for (const [key, emotion] of Object.entries(emotionMap)) {
      if (name.toLowerCase().includes(key)) {
        return emotion;
      }
    }
    return null;
  }

  private extractStateFromClipName(name: string): CharacterState | null {
    const stateMap: { [key: string]: CharacterState } = {
      'idle': 'idle',
      'walk': 'walking',
      'run': 'running',
      'talk': 'talking',
      'think': 'thinking',
      'celebrate': 'celebrating',
      'disappoint': 'disappointed',
      'excite': 'excited',
      'sleep': 'sleeping'
    };

    for (const [key, state] of Object.entries(stateMap)) {
      if (name.toLowerCase().includes(key)) {
        return state;
      }
    }
    return null;
  }

  private setupPersonality(config?: Partial<PersonalityTraits>) {
    this.personality = {
      friendliness: 0.8,
      intelligence: 0.7,
      energy: 0.6,
      patience: 0.8,
      humor: 0.5,
      helpfulness: 0.9,
      ...config
    };
  }

  private setupEmotionSystem() {
    this.emotionSystem = {
      currentEmotion: 'neutral' as EmotionType,
      targetEmotion: 'neutral' as EmotionType,
      transitionProgress: 1,
      transitionDuration: 0,

      setEmotion: (emotion: EmotionType) => {
        this.emotionSystem.currentEmotion = emotion;
        this.emotionSystem.targetEmotion = emotion;
        this.emotionSystem.transitionProgress = 1;
        this.updateFacialExpression(emotion);
      },

      getCurrentEmotion: () => this.emotionSystem.currentEmotion,

      blendToEmotion: (emotion: EmotionType, duration: number) => {
        this.emotionSystem.targetEmotion = emotion;
        this.emotionSystem.transitionDuration = duration;
        this.emotionSystem.transitionProgress = 0;
      },

      update: (deltaTime: number) => {
        if (this.emotionSystem.transitionProgress < 1) {
          this.emotionSystem.transitionProgress += deltaTime / this.emotionSystem.transitionDuration;
          this.emotionSystem.transitionProgress = Math.min(1, this.emotionSystem.transitionProgress);

          if (this.emotionSystem.transitionProgress >= 1) {
            this.emotionSystem.currentEmotion = this.emotionSystem.targetEmotion;
            this.updateFacialExpression(this.emotionSystem.currentEmotion);
          }
        }
      }
    };
  }

  private setupDialogueSystem() {
    this.dialogue = {
      currentText: '',
      isCurrentlySpeaking: false,
      speechDuration: 0,
      speechProgress: 0,

      speak: (text: string, emotion: EmotionType) => {
        this.dialogue.currentText = text;
        this.dialogue.isCurrentlySpeaking = true;
        this.dialogue.speechDuration = text.length * 0.05; // Rough estimate
        this.dialogue.speechProgress = 0;

        this.emotionSystem.blendToEmotion(emotion, 0.5);
        this.setState('talking');

        // Simulate speech synthesis
        this.synthesizeSpeech(text, emotion);
      },

      update: (deltaTime: number) => {
        if (this.dialogue.isCurrentlySpeaking) {
          this.dialogue.speechProgress += deltaTime;
          if (this.dialogue.speechProgress >= this.dialogue.speechDuration) {
            this.dialogue.isCurrentlySpeaking = false;
            this.setState('idle');
          }
        }
      },

      isCurrentlySpeaking: () => this.dialogue.isCurrentlySpeaking,
      getCurrentText: () => this.dialogue.currentText
    };
  }

  private setupVoiceSettings() {
    // Voice characteristics based on personality
    this.voiceSettings = {
      pitch: 0.8 + (this.personality.energy * 0.4),
      speed: 0.9 + (this.personality.energy * 0.2),
      volume: 0.7 + (this.personality.friendliness * 0.3)
    };
  }

  private setupInteractionSphere() {
    // Create invisible interaction sphere
    const geometry = new THREE.SphereGeometry(this.interactionRadius, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      visible: false
    });
    const interactionSphere = new THREE.Mesh(geometry, material);
    interactionSphere.userData = { type: 'interaction', character: this };
    this.model.add(interactionSphere);
  }

  playAnimation(name: string, loop: boolean = true, fadeTime: number = 0.3) {
    const action = this.animations.get(name);
    if (action) {
      // Fade out current animations
      this.animations.forEach((otherAction, otherName) => {
        if (otherName !== name && otherAction.isRunning()) {
          otherAction.fadeOut(fadeTime);
        }
      });

      action.reset();
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      action.fadeIn(fadeTime);
      action.play();
    }
  }

  private updateFacialExpression(emotion: EmotionType) {
    const expression = this.facialExpressions.get(emotion);
    if (expression) {
      // Fade out current facial expressions
      this.facialExpressions.forEach((action, currentEmotion) => {
        if (currentEmotion !== emotion && action.isRunning()) {
          action.fadeOut(0.5);
        }
      });

      expression.reset();
      expression.fadeIn(0.5);
      expression.play();
    }
  }

  setState(state: CharacterState) {
    if (this.currentState === state) return;

    this.currentState = state;

    // Play body language animation
    const bodyAction = this.bodyLanguage.get(state);
    if (bodyAction) {
      this.playAnimation(state);
    } else {
      // Fallback to basic animations
      switch (state) {
        case 'walking':
          this.playAnimation('walk');
          break;
        case 'running':
          this.playAnimation('run');
          break;
        case 'talking':
          this.playAnimation('talk');
          break;
        default:
          this.playAnimation('idle');
      }
    }
  }

  speak(text: string, emotion: EmotionType = 'neutral') {
    this.dialogue.speak(text, emotion);
  }

  private synthesizeSpeech(text: string, emotion: EmotionType) {
    // Web Speech API synthesis (if available)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = this.voiceSettings.pitch;
      utterance.rate = this.voiceSettings.speed;
      utterance.volume = this.voiceSettings.volume;

      // Adjust voice characteristics based on emotion
      switch (emotion) {
        case 'happy':
        case 'excited':
          utterance.pitch *= 1.2;
          utterance.rate *= 1.1;
          break;
        case 'sad':
        case 'disappointed':
          utterance.pitch *= 0.8;
          utterance.rate *= 0.9;
          break;
        case 'angry':
          utterance.pitch *= 0.9;
          utterance.rate *= 1.2;
          utterance.volume *= 1.1;
          break;
        case 'thoughtful':
          utterance.rate *= 0.8;
          break;
      }

      speechSynthesis.speak(utterance);
    }
  }

  moveTo(position: THREE.Vector3, onComplete?: () => void) {
    this.currentTarget = position.clone();
    this.setState('walking');

    const startPosition = this.model.position.clone();
    const distance = startPosition.distanceTo(position);
    const duration = (distance / this.movementSpeed) * 1000;

    // Look at target
    this.lookAt(position);

    // Animate movement
    const animate = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing
      const eased = this.easeInOutQuad(progress);

      this.model.position.lerpVectors(startPosition, position, eased);

      if (progress < 1) {
        requestAnimationFrame(() => animate(startTime));
      } else {
        this.currentTarget = null;
        this.setState('idle');
        onComplete?.();
      }
    };

    animate(Date.now());
  }

  lookAt(target: THREE.Vector3) {
    const direction = new THREE.Vector3().subVectors(target, this.model.position);
    direction.y = 0; // Keep character upright
    direction.normalize();

    const targetRotation = Math.atan2(direction.x, direction.z);

    // Smooth rotation
    const currentRotation = this.model.rotation.y;
    const rotationDiff = targetRotation - currentRotation;

    // Handle rotation wrapping
    let adjustedDiff = rotationDiff;
    if (adjustedDiff > Math.PI) adjustedDiff -= Math.PI * 2;
    if (adjustedDiff < -Math.PI) adjustedDiff += Math.PI * 2;

    const rotationDuration = Math.abs(adjustedDiff) / this.rotationSpeed * 1000;

    const startRotation = currentRotation;
    const endRotation = currentRotation + adjustedDiff;

    const animateRotation = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / rotationDuration, 1);
      const eased = this.easeInOutQuad(progress);

      this.model.rotation.y = THREE.MathUtils.lerp(startRotation, endRotation, eased);

      if (progress < 1) {
        requestAnimationFrame(() => animateRotation(startTime));
      }
    };

    animateRotation(Date.now());
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  interact(player: THREE.Object3D): boolean {
    const distance = this.model.position.distanceTo(player.position);
    if (distance <= this.interactionRadius && this.isInteractable) {
      this.lookAt(player.position);
      this.emotionSystem.setEmotion('happy');
      return true;
    }
    return false;
  }

  setInteractable(interactable: boolean) {
    this.isInteractable = interactable;
  }

  getPersonalityResponse(topic: string): string {
    // Generate responses based on personality traits
    const responses = this.generatePersonalityResponses(topic);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generatePersonalityResponses(topic: string): string[] {
    const baseResponses = [
      "That's interesting!",
      "Tell me more about that.",
      "I see what you mean.",
      "That's a great point!"
    ];

    // Modify responses based on personality
    if (this.personality.humor > 0.7) {
      baseResponses.push("Haha, that's funny!", "You're quite the comedian!");
    }

    if (this.personality.intelligence > 0.8) {
      baseResponses.push("That's a fascinating perspective.", "I've been thinking about that too.");
    }

    if (this.personality.friendliness > 0.8) {
      baseResponses.push("I'm so glad you shared that!", "You're wonderful to talk to!");
    }

    return baseResponses;
  }

  update(deltaTime: number) {
    this.mixer.update(deltaTime);
    this.emotionSystem.update(deltaTime);
    this.dialogue.update(deltaTime);

    // Update movement if moving to target
    if (this.currentTarget) {
      const distance = this.model.position.distanceTo(this.currentTarget);
      if (distance < 0.1) {
        this.currentTarget = null;
        this.setState('idle');
      }
    }
  }

  dispose() {
    // Clean up animations
    this.animations.forEach(action => {
      action.stop();
    });

    // Clean up mixer
    this.mixer.stopAllAction();

    // Remove from scene
    if (this.model.parent) {
      this.model.parent.remove(this.model);
    }
  }
}
