// Centralized UI manager for timer, lives, progress bar
export class UnifiedUIManager {
  constructor() {
    this.timer = null;
    this.lives = null;
    this.progressBar = null;
  }
  setTimer(seconds) {
    this.timer = seconds;
    // Update timer UI
    const el = document.getElementById('game-timer');
    if (el) el.textContent = `Time: ${seconds}s`;
  }
  setLives(lives) {
    this.lives = lives;
    const el = document.getElementById('game-lives');
    if (el) el.textContent = `Lives: ${lives}`;
  }
  setProgress(percent) {
    this.progressBar = percent;
    const el = document.getElementById('game-progress');
    if (el) el.style.width = `${percent}%`;
  }
}
