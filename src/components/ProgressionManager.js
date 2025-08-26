// Progression system to unlock modules/games
export class ProgressionManager {
  constructor() {
    this.progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
  }
  unlock(module) {
    this.progress[module] = true;
    localStorage.setItem('userProgress', JSON.stringify(this.progress));
  }
  isUnlocked(module) {
    return !!this.progress[module];
  }
  getProgress() {
    return this.progress;
  }
}
