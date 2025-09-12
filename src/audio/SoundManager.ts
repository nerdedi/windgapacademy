export interface AudioConfig {
  enableSpatialAudio: boolean;
  enableReverb: boolean;
  enableCompression: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  qualityLevel: 'low' | 'medium' | 'high';
}

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  position?: [number, number, number];
  pitch?: number;
  fadeIn?: number;
  fadeOut?: number;
  delay?: number;
  reverb?: number;
}

export interface MusicTrack {
  name: string;
  url: string;
  bpm: number;
  key: string;
  mood: 'calm' | 'energetic' | 'mysterious' | 'heroic' | 'playful';
  intensity: number;
}

export class SoundManager {
  private audioContext: AudioContext;
  private sounds: Map<string, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();
  private masterGain: GainNode;
  private musicGain: GainNode;
  private sfxGain: GainNode;
  private voiceGain: GainNode;
  private reverbNode: ConvolverNode;
  private compressor: DynamicsCompressorNode;
  private spatialAudio: boolean = true;
  private config: AudioConfig;
  private currentMusic: string | null = null;
  private musicCrossfadeTime: number = 2000;
  private ambientSounds: Map<string, AudioBufferSourceNode> = new Map();
  private dynamicMusicSystem: DynamicMusicSystem;

  constructor(config: Partial<AudioConfig> = {}) {
    this.config = {
      enableSpatialAudio: true,
      enableReverb: true,
      enableCompression: true,
      masterVolume: 1.0,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      voiceVolume: 0.9,
      qualityLevel: 'high',
      ...config
    };

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.setupAudioNodes();
    this.setupEffects();
    this.loadSounds();
    this.initializeDynamicMusic();
  }

  private setupAudioNodes() {
    // Create gain nodes
    this.masterGain = this.audioContext.createGain();
    this.musicGain = this.audioContext.createGain();
    this.sfxGain = this.audioContext.createGain();
    this.voiceGain = this.audioContext.createGain();

    // Set initial volumes
    this.masterGain.gain.value = this.config.masterVolume;
    this.musicGain.gain.value = this.config.musicVolume;
    this.sfxGain.gain.value = this.config.sfxVolume;
    this.voiceGain.gain.value = this.config.voiceVolume;

    // Connect audio graph
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);
  }

  private setupEffects() {
    // Compressor for dynamic range control
    if (this.config.enableCompression) {
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      this.masterGain.disconnect();
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.audioContext.destination);
    }

    // Reverb setup
    if (this.config.enableReverb) {
      this.setupReverb();
    }
  }

  private async setupReverb() {
    this.reverbNode = this.audioContext.createConvolver();

    // Create impulse response for reverb
    const impulseResponse = this.createImpulseResponse(2, 2, false);
    this.reverbNode.buffer = impulseResponse;
  }

  private createImpulseResponse(duration: number, decay: number, reverse: boolean): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = reverse ? length - i : i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }
    }

    return impulse;
  }

  async loadSounds() {
    const soundFiles = {
      // UI Sounds
      'portal-enter': '/audio/ui/portal-enter.mp3',
      'world-transition': '/audio/ui/world-transition.mp3',
      'achievement-unlock': '/audio/ui/achievement.mp3',
      'button-hover': '/audio/ui/button-hover.mp3',
      'button-click': '/audio/ui/button-click.mp3',
      'menu-open': '/audio/ui/menu-open.mp3',
      'menu-close': '/audio/ui/menu-close.mp3',

      // Game Sounds
      'correct-answer': '/audio/game/correct-answer.mp3',
      'incorrect-answer': '/audio/game/incorrect-answer.mp3',
      'level-complete': '/audio/game/level-complete.mp3',
      'power-up': '/audio/game/power-up.mp3',
      'coin-collect': '/audio/game/coin-collect.mp3',

      // Character Sounds
      'character-speak': '/audio/character/speak.mp3',
      'character-laugh': '/audio/character/laugh.mp3',
      'character-think': '/audio/character/think.mp3',
      'footsteps': '/audio/character/footsteps.mp3',

      // Ambient Sounds
      'ambient-home': '/audio/ambient/home.mp3',
      'ambient-math': '/audio/ambient/math-realm.mp3',
      'ambient-reading': '/audio/ambient/reading-realm.mp3',
      'ambient-science': '/audio/ambient/science-lab.mp3',
      'ambient-creative': '/audio/ambient/creative-studio.mp3',

      // Music Tracks
      'music-home': '/audio/music/home-theme.mp3',
      'music-math': '/audio/music/math-adventure.mp3',
      'music-reading': '/audio/music/story-time.mp3',
      'music-science': '/audio/music/discovery.mp3',
      'music-creative': '/audio/music/imagination.mp3',

      // Effects
      'magic-sparkle': '/audio/effects/magic-sparkle.mp3',
      'explosion': '/audio/effects/explosion.mp3',
      'whoosh': '/audio/effects/whoosh.mp3',
      'chime': '/audio/effects/chime.mp3'
    };

    const loadPromises = Object.entries(soundFiles).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Sound file not found: ${url}`);
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    });

    await Promise.all(loadPromises);
    console.log(`Loaded ${this.sounds.size} audio files`);
  }

  async play(soundName: string, options: SoundOptions = {}): Promise<AudioBufferSourceNode | null> {
    const buffer = this.sounds.get(soundName);
    if (!buffer) {
      console.warn(`Sound not found: ${soundName}`);
      return null;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    let finalNode: AudioNode = gainNode;

    source.buffer = buffer;
    source.loop = options.loop || false;

    // Pitch adjustment
    if (options.pitch) {
      source.playbackRate.value = options.pitch;
    }

    // Volume with fade in
    const targetVolume = options.volume || 1;
    if (options.fadeIn) {
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(targetVolume, this.audioContext.currentTime + options.fadeIn);
    } else {
      gainNode.gain.value = targetVolume;
    }

    // Spatial audio
    if (this.config.enableSpatialAudio && options.position) {
      const panner = this.audioContext.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 10000;
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 0;
      panner.coneOuterGain = 0;

      panner.positionX.value = options.position[0];
      panner.positionY.value = options.position[1];
      panner.positionZ.value = options.position[2];

      source.connect(panner);
      panner.connect(gainNode);
    } else {
      source.connect(gainNode);
    }

    // Reverb effect
    if (this.config.enableReverb && options.reverb && this.reverbNode) {
      const reverbGain = this.audioContext.createGain();
      const dryGain = this.audioContext.createGain();

      reverbGain.gain.value = options.reverb;
      dryGain.gain.value = 1 - options.reverb;

      gainNode.connect(dryGain);
      gainNode.connect(this.reverbNode);
      this.reverbNode.connect(reverbGain);

      const merger = this.audioContext.createChannelMerger(2);
      dryGain.connect(merger);
      reverbGain.connect(merger);

      finalNode = merger;
    }

    // Connect to appropriate gain node based on sound type
    const gainTarget = this.getGainNodeForSound(soundName);
    finalNode.connect(gainTarget);

    // Schedule playback
    const startTime = this.audioContext.currentTime + (options.delay || 0);
    source.start(startTime);

    // Handle fade out
    if (options.fadeOut) {
      source.addEventListener('ended', () => {
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + options.fadeOut!);
      });
    }

    // Store active source
    const sourceId = `${soundName}_${Date.now()}`;
    this.activeSources.set(sourceId, source);

    source.addEventListener('ended', () => {
      this.activeSources.delete(sourceId);
    });

    return source;
  }

  private getGainNodeForSound(soundName: string): GainNode {
    if (soundName.startsWith('music-')) {
      return this.musicGain;
    } else if (soundName.includes('character') || soundName.includes('voice')) {
      return this.voiceGain;
    } else {
      return this.sfxGain;
    }
  }

  async playMusic(trackName: string, fadeTime: number = 2000): Promise<void> {
    // Stop current music with fade out
    if (this.currentMusic) {
      await this.stopMusic(fadeTime);
    }

    const source = await this.play(trackName, {
      loop: true,
      volume: 0,
      fadeIn: fadeTime / 1000
    });

    if (source) {
      this.currentMusic = trackName;
    }
  }

  async stopMusic(fadeTime: number = 2000): Promise<void> {
    if (!this.currentMusic) return;

    return new Promise((resolve) => {
      this.musicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + fadeTime / 1000);

      setTimeout(() => {
        this.activeSources.forEach((source, id) => {
          if (id.startsWith('music-')) {
            source.stop();
            this.activeSources.delete(id);
          }
        });

        this.musicGain.gain.value = this.config.musicVolume;
        this.currentMusic = null;
        resolve();
      }, fadeTime);
    });
  }

  createAmbientSoundscape(sounds: string[], fadeInTime: number = 2000) {
    // Clear existing ambient sounds
    this.clearAmbientSounds();

    sounds.forEach((soundName, index) => {
      setTimeout(async () => {
        const source = await this.play(soundName, {
          loop: true,
          volume: 0.3,
          fadeIn: fadeInTime / 1000
        });

        if (source) {
          this.ambientSounds.set(soundName, source);
        }
      }, index * 500);
    });
  }

  clearAmbientSounds() {
    this.ambientSounds.forEach((source, name) => {
      source.stop();
    });
    this.ambientSounds.clear();
  }

  setMasterVolume(volume: number) {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.value = this.config.masterVolume;
  }

  setMusicVolume(volume: number) {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    this.musicGain.gain.value = this.config.musicVolume;
  }

  setSfxVolume(volume: number) {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sfxGain.gain.value = this.config.sfxVolume;
  }

  setVoiceVolume(volume: number) {
    this.config.voiceVolume = Math.max(0, Math.min(1, volume));
    this.voiceGain.gain.value = this.config.voiceVolume;
  }

  stopSound(soundName: string) {
    this.activeSources.forEach((source, id) => {
      if (id.startsWith(soundName)) {
        source.stop();
        this.activeSources.delete(id);
      }
    });
  }

  stopAllSounds() {
    this.activeSources.forEach((source) => {
      source.stop();
    });
    this.activeSources.clear();
    this.ambientSounds.clear();
  }

  private initializeDynamicMusic() {
    this.dynamicMusicSystem = new DynamicMusicSystem(this);
  }

  getDynamicMusicSystem(): DynamicMusicSystem {
    return this.dynamicMusicSystem;
  }

  // Voice synthesis for character dialogue
  synthesizeVoice(text: string, voice: {
    pitch: number;
    rate: number;
    volume: number;
    language?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voice.pitch;
      utterance.rate = voice.rate;
      utterance.volume = voice.volume * this.config.voiceVolume;
      utterance.lang = voice.language || 'en-US';

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      speechSynthesis.speak(utterance);
    });
  }

  // Audio analysis for reactive visuals
  createAnalyser(): AnalyserNode {
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;
    this.masterGain.connect(analyser);
    return analyser;
  }

  getAudioContext(): AudioContext {
    return this.audioContext;
  }

  cleanup() {
    this.stopAllSounds();

    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Dynamic Music System for adaptive soundtracks
class DynamicMusicSystem {
  private soundManager: SoundManager;
  private currentMood: string = 'neutral';
  private intensity: number = 0.5;
  private musicTracks: Map<string, MusicTrack> = new Map();

  constructor(soundManager: SoundManager) {
    this.soundManager = soundManager;
    this.initializeTracks();
  }

  private initializeTracks() {
    const tracks: MusicTrack[] = [
      {
        name: 'music-home',
        url: '/audio/music/home-theme.mp3',
        bpm: 120,
        key: 'C',
        mood: 'calm',
        intensity: 0.3
      },
      {
        name: 'music-math',
        url: '/audio/music/math-adventure.mp3',
        bpm: 140,
        key: 'G',
        mood: 'energetic',
        intensity: 0.7
      },
      {
        name: 'music-reading',
        url: '/audio/music/story-time.mp3',
        bpm: 90,
        key: 'F',
        mood: 'mysterious',
        intensity: 0.4
      }
    ];

    tracks.forEach(track => {
      this.musicTracks.set(track.name, track);
    });
  }

  setMood(mood: string, intensity: number = 0.5) {
    this.currentMood = mood;
    this.intensity = intensity;
    this.adaptMusic();
  }

  private adaptMusic() {
    // Find best matching track
    const matchingTracks = Array.from(this.musicTracks.values())
      .filter(track => track.mood === this.currentMood)
      .sort((a, b) => Math.abs(a.intensity - this.intensity) - Math.abs(b.intensity - this.intensity));

    if (matchingTracks.length > 0) {
      this.soundManager.playMusic(matchingTracks[0].name);
    }
  }

  crossfadeToTrack(trackName: string, duration: number = 3000) {
    this.soundManager.playMusic(trackName, duration);
  }
}
