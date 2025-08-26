// Adaptive learning: personalized recommendations and difficulty
export class AdaptiveLearning {
  constructor() {
    this.difficulty = 1;
  }
  updateDifficulty(performance) {
    // Simple logic: increase difficulty if performance is high, decrease if low
    if (performance > 0.8) this.difficulty = Math.min(this.difficulty + 0.1, 2);
    else if (performance < 0.5) this.difficulty = Math.max(this.difficulty - 0.1, 0.5);
  }
  getDifficulty() {
    return this.difficulty;
  }
  recommendNextModule(modules, progress) {
    // Recommend next locked module
    return modules.find(m => !progress[m]);
  }
}
