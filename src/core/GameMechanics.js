/**
 * Windgap Academy Game Mechanics
 * Handles gamification elements like points, badges, and achievements
 */

export class GameMechanics {
  constructor() {
    this.points = 0;
    this.badges = [];
    this.achievements = [];
    this.level = 1;
    this.experience = 0;
  }

  awardPoints(amount, reason = "") {
    this.points += amount;
    this.experience += amount;

    // Check for level up
    const newLevel = Math.floor(this.experience / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      return {
        points: this.points,
        levelUp: true,
        newLevel: this.level,
        reason,
      };
    }

    return {
      points: this.points,
      levelUp: false,
      reason,
    };
  }

  awardBadge(badgeId, title, description) {
    const badge = {
      id: badgeId,
      title,
      description,
      earnedAt: new Date().toISOString(),
    };

    this.badges.push(badge);
    return badge;
  }

  unlockAchievement(achievementId, title, description) {
    const achievement = {
      id: achievementId,
      title,
      description,
      unlockedAt: new Date().toISOString(),
    };

    this.achievements.push(achievement);
    return achievement;
  }

  getProgress() {
    return {
      level: this.level,
      points: this.points,
      experience: this.experience,
      badges: this.badges.length,
      achievements: this.achievements.length,
    };
  }

  resetProgress() {
    this.points = 0;
    this.badges = [];
    this.achievements = [];
    this.level = 1;
    this.experience = 0;
  }
}
