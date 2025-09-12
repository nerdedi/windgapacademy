import * as THREE from "three";
import { SoundManager } from "../audio/SoundManager";
import { ParticleSystem } from "../effects/ParticleSystem";

export interface GameState {
  score: number;
  level: number;
  experience: number;
  achievements: Achievement[];
  unlockedFeatures: string[];
  playerStats: PlayerStats;
  gameProgress: GameProgress;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: Date;
  points: number;
}

export interface PlayerStats {
  totalPlayTime: number;
  gamesCompleted: number;
  perfectScores: number;
  streakRecord: number;
  favoriteGame: string;
  skillLevels: {
    math: number;
    reading: number;
    science: number;
    creativity: number;
  };
}

export interface GameProgress {
  mathQuest: {
    levelsCompleted: number;
    highestDifficulty: string;
    conceptsMastered: string[];
  };
  readingRealm: {
    storiesCompleted: number;
    comprehensionScore: number;
    favoriteGenre: string;
  };
  scienceLab: {
    experimentsCompleted: number;
    discoveryCount: number;
    labEquipmentUnlocked: string[];
  };
  creativeStudio: {
    artworksCreated: number;
    storiesWritten: number;
    songsComposed: number;
  };
}

export class GameMechanics {
  private gameState: GameState;
  private soundManager: SoundManager;
  private particleSystem: ParticleSystem;
  private achievements: Map<string, Achievement>;
  private progressCallbacks: Map<string, Function[]>;

  constructor() {
    this.gameState = this.initializeGameState();
    this.soundManager = new SoundManager();
    this.particleSystem = new ParticleSystem();
    this.achievements = new Map();
    this.progressCallbacks = new Map();
    this.initializeAchievements();
  }

  private initializeGameState(): GameState {
    const savedState = localStorage.getItem("windgap-game-state");
    if (savedState) {
      return JSON.parse(savedState);
    }

    return {
      score: 0,
      level: 1,
      experience: 0,
      achievements: [],
      unlockedFeatures: ["mathQuest-basic", "readingRealm-basic"],
      playerStats: {
        totalPlayTime: 0,
        gamesCompleted: 0,
        perfectScores: 0,
        streakRecord: 0,
        favoriteGame: "",
        skillLevels: {
          math: 1,
          reading: 1,
          science: 1,
          creativity: 1,
        },
      },
      gameProgress: {
        mathQuest: {
          levelsCompleted: 0,
          highestDifficulty: "beginner",
          conceptsMastered: [],
        },
        readingRealm: {
          storiesCompleted: 0,
          comprehensionScore: 0,
          favoriteGenre: "",
        },
        scienceLab: {
          experimentsCompleted: 0,
          discoveryCount: 0,
          labEquipmentUnlocked: [],
        },
        creativeStudio: {
          artworksCreated: 0,
          storiesWritten: 0,
          songsComposed: 0,
        },
      },
    };
  }

  private initializeAchievements(): void {
    const achievementDefinitions = [
      {
        id: "first-steps",
        name: "First Steps",
        description: "Complete your first game session",
        icon: "👶",
        rarity: "common" as const,
        points: 10,
      },
      {
        id: "math-wizard",
        name: "Math Wizard",
        description: "Solve 100 math problems correctly",
        icon: "🧙‍♂️",
        rarity: "rare" as const,
        points: 50,
      },
      {
        id: "bookworm",
        name: "Bookworm",
        description: "Read 10 complete stories",
        icon: "📚",
        rarity: "rare" as const,
        points: 50,
      },
      {
        id: "mad-scientist",
        name: "Mad Scientist",
        description: "Complete 25 science experiments",
        icon: "🧪",
        rarity: "epic" as const,
        points: 100,
      },
      {
        id: "creative-genius",
        name: "Creative Genius",
        description: "Create 50 artworks across all creative tools",
        icon: "🎨",
        rarity: "epic" as const,
        points: 100,
      },
      {
        id: "perfectionist",
        name: "Perfectionist",
        description: "Achieve perfect scores in all games",
        icon: "⭐",
        rarity: "legendary" as const,
        points: 500,
      },
    ];

    achievementDefinitions.forEach((def) => {
      this.achievements.set(def.id, {
        ...def,
        unlockedAt: new Date(),
        points: def.points,
      });
    });
  }

  // Core Game Mechanics
  public addScore(points: number, game: string): void {
    this.gameState.score += points;
    this.addExperience(Math.floor(points / 10));
    this.updateGameProgress(game, "score", points);
    this.checkAchievements();
    this.saveGameState();
  }

  public addExperience(exp: number): void {
    this.gameState.experience += exp;
    const newLevel = Math.floor(this.gameState.experience / 100) + 1;

    if (newLevel > this.gameState.level) {
      this.levelUp(newLevel);
    }
  }

  private levelUp(newLevel: number): void {
    const oldLevel = this.gameState.level;
    this.gameState.level = newLevel;

    // Play level up sound and effects
    this.soundManager.play("level-up");
    this.particleSystem.createBurst([0, 5, 0], "levelup");

    // Unlock new features based on level
    this.unlockFeaturesByLevel(newLevel);

    // Trigger callbacks
    this.triggerCallbacks("levelUp", { oldLevel, newLevel });
  }

  private unlockFeaturesByLevel(level: number): void {
    const unlocks: { [key: number]: string[] } = {
      2: ["scienceLab-basic"],
      3: ["creativeStudio-basic"],
      5: ["mathQuest-advanced"],
      7: ["readingRealm-advanced"],
      10: ["scienceLab-advanced", "creativeStudio-advanced"],
      15: ["multiplayer-mode"],
      20: ["custom-content-creation"],
    };

    if (unlocks[level]) {
      unlocks[level].forEach((feature) => {
        if (!this.gameState.unlockedFeatures.includes(feature)) {
          this.gameState.unlockedFeatures.push(feature);
          this.triggerCallbacks("featureUnlocked", { feature, level });
        }
      });
    }
  }

  public updateGameProgress(game: string, metric: string, value: any): void {
    switch (game) {
      case "mathQuest":
        this.updateMathProgress(metric, value);
        break;
      case "readingRealm":
        this.updateReadingProgress(metric, value);
        break;
      case "scienceLab":
        this.updateScienceProgress(metric, value);
        break;
      case "creativeStudio":
        this.updateCreativeProgress(metric, value);
        break;
    }

    this.updateSkillLevels(game);
    this.saveGameState();
  }

  private updateMathProgress(metric: string, value: any): void {
    const progress = this.gameState.gameProgress.mathQuest;

    switch (metric) {
      case "levelCompleted":
        progress.levelsCompleted++;
        break;
      case "conceptMastered":
        if (!progress.conceptsMastered.includes(value)) {
          progress.conceptsMastered.push(value);
        }
        break;
      case "difficultyReached":
        if (this.getDifficultyLevel(value) > this.getDifficultyLevel(progress.highestDifficulty)) {
          progress.highestDifficulty = value;
        }
        break;
    }
  }

  private updateReadingProgress(metric: string, value: any): void {
    const progress = this.gameState.gameProgress.readingRealm;

    switch (metric) {
      case "storyCompleted":
        progress.storiesCompleted++;
        break;
      case "comprehensionScore":
        progress.comprehensionScore = Math.max(progress.comprehensionScore, value);
        break;
      case "genrePreference":
        progress.favoriteGenre = value;
        break;
    }
  }

  private updateScienceProgress(metric: string, value: any): void {
    const progress = this.gameState.gameProgress.scienceLab;

    switch (metric) {
      case "experimentCompleted":
        progress.experimentsCompleted++;
        break;
      case "discovery":
        progress.discoveryCount++;
        break;
      case "equipmentUnlocked":
        if (!progress.labEquipmentUnlocked.includes(value)) {
          progress.labEquipmentUnlocked.push(value);
        }
        break;
    }
  }

  private updateCreativeProgress(metric: string, value: any): void {
    const progress = this.gameState.gameProgress.creativeStudio;

    switch (metric) {
      case "artworkCreated":
        progress.artworksCreated++;
        break;
      case "storyWritten":
        progress.storiesWritten++;
        break;
      case "songComposed":
        progress.songsComposed++;
        break;
    }
  }

  private updateSkillLevels(game: string): void {
    const skillMap: { [key: string]: keyof PlayerStats["skillLevels"] } = {
      mathQuest: "math",
      readingRealm: "reading",
      scienceLab: "science",
      creativeStudio: "creativity",
    };

    const skill = skillMap[game];
    if (skill) {
      const currentLevel = this.gameState.playerStats.skillLevels[skill];
      const newLevel = Math.min(10, currentLevel + 0.1);
      this.gameState.playerStats.skillLevels[skill] = newLevel;
    }
  }

  private getDifficultyLevel(difficulty: string): number {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    return levels[difficulty] || 1;
  }

  // Achievement System
  public checkAchievements(): void {
    // Check for new achievements based on current game state
    this.checkScoreAchievements();
    this.checkProgressAchievements();
    this.checkSkillAchievements();
  }

  private checkScoreAchievements(): void {
    if (this.gameState.score >= 1000 && !this.hasAchievement("score-1000")) {
      this.unlockAchievement("score-1000", "Score Master", "Reach 1000 points", "🏆", "rare", 50);
    }
  }

  private checkProgressAchievements(): void {
    const mathProgress = this.gameState.gameProgress.mathQuest;
    if (mathProgress.levelsCompleted >= 10 && !this.hasAchievement("math-levels-10")) {
      this.unlockAchievement(
        "math-levels-10",
        "Math Explorer",
        "Complete 10 math levels",
        "🔢",
        "common",
        25,
      );
    }
  }

  private checkSkillAchievements(): void {
    const skills = this.gameState.playerStats.skillLevels;
    const averageSkill = (skills.math + skills.reading + skills.science + skills.creativity) / 4;

    if (averageSkill >= 5 && !this.hasAchievement("well-rounded")) {
      this.unlockAchievement(
        "well-rounded",
        "Well Rounded",
        "Reach level 5 in all skills",
        "🌟",
        "epic",
        100,
      );
    }
  }

  private hasAchievement(id: string): boolean {
    return this.gameState.achievements.some((achievement) => achievement.id === id);
  }

  private unlockAchievement(
    id: string,
    name: string,
    description: string,
    icon: string,
    rarity: Achievement["rarity"],
    points: number,
  ): void {
    const achievement: Achievement = {
      id,
      name,
      description,
      icon,
      rarity,
      unlockedAt: new Date(),
      points,
    };

    this.gameState.achievements.push(achievement);
    this.addScore(points, "system");

    // Play achievement sound and effects
    this.soundManager.play("achievement-unlock");
    this.particleSystem.createBurst([0, 6, 0], "achievement");

    // Trigger callbacks
    this.triggerCallbacks("achievementUnlocked", achievement);
  }

  // Utility Methods
  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public isFeatureUnlocked(feature: string): boolean {
    return this.gameState.unlockedFeatures.includes(feature);
  }

  public getSkillLevel(skill: keyof PlayerStats["skillLevels"]): number {
    return this.gameState.playerStats.skillLevels[skill];
  }

  public onProgress(event: string, callback: Function): void {
    if (!this.progressCallbacks.has(event)) {
      this.progressCallbacks.set(event, []);
    }
    this.progressCallbacks.get(event)!.push(callback);
  }

  private triggerCallbacks(event: string, data: any): void {
    const callbacks = this.progressCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  private saveGameState(): void {
    localStorage.setItem("windgap-game-state", JSON.stringify(this.gameState));
  }

  public resetProgress(): void {
    this.gameState = this.initializeGameState();
    localStorage.removeItem("windgap-game-state");
  }
}

export default GameMechanics;
