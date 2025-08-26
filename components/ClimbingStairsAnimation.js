// ClimbingStairsAnimation.js
// Interactive animation for the Climbing Stairs problem (Dynamic Programming)

export class ClimbingStairsAnimation {
  constructor(container) {
    this.container = container;
    this.n = 5; // Default number of stairs
    this.dp = Array(this.n + 1).fill(0);
    this.currentStep = 0;
    this.isPlaying = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="stairs-animation flex flex-col items-center p-8">
        <h2 class="text-2xl font-bold mb-4">Climbing Stairs Animation</h2>
        <label class="mb-4">Number of stairs: <input type="number" id="stairs-n" min="2" max="20" value="${this.n}" /></label>
        <svg width="400" height="120" viewBox="0 0 400 120" class="mb-4">
          ${this.renderStairs()}
        </svg>
        <div class="flex gap-2 mb-4">
          <button id="play-anim" class="btn-primary">Play</button>
          <button id="step-anim" class="btn-secondary">Step</button>
          <button id="reset-anim" class="btn-secondary">Reset</button>
        </div>
        <div id="dp-table" class="mt-4">${this.renderDPTable()}</div>
      </section>
    `;
    this.attachEvents();
  }

  renderStairs() {
    let stairs = '';
    for (let i = 0; i < this.n; i++) {
      stairs += `<rect x="${30 + i * 30}" y="${100 - i * 10}" width="28" height="10" fill="${i <= this.currentStep ? '#1976d2' : '#ccc'}" />`;
      stairs += `<text x="${44 + i * 30}" y="${110 - i * 10}" font-size="10" text-anchor="middle">${i}</text>`;
    }
    stairs += `<circle cx="${44 + this.currentStep * 30}" cy="${95 - this.currentStep * 10}" r="8" fill="#ffe066" stroke="#222" stroke-width="2" />`;
    return stairs;
  }

  renderDPTable() {
    let table = '<table class="border"><tr>';
    for (let i = 0; i <= this.n; i++) {
      table += `<th>${i}</th>`;
    }
    table += '</tr><tr>';
    for (let i = 0; i <= this.n; i++) {
      table += `<td>${this.dp[i]}</td>`;
    }
    table += '</tr></table>';
    return table;
  }

  attachEvents() {
    this.container.querySelector('#stairs-n').addEventListener('input', e => {
      this.n = Math.max(2, Math.min(20, parseInt(e.target.value)));
      this.dp = Array(this.n + 1).fill(0);
      this.currentStep = 0;
      this.isPlaying = false;
      this.render();
    });
    this.container.querySelector('#play-anim').addEventListener('click', () => {
      this.isPlaying = true;
      this.playAnimation();
    });
    this.container.querySelector('#step-anim').addEventListener('click', () => {
      this.stepAnimation();
    });
    this.container.querySelector('#reset-anim').addEventListener('click', () => {
      this.dp = Array(this.n + 1).fill(0);
      this.currentStep = 0;
      this.isPlaying = false;
      this.render();
    });
  }

  stepAnimation() {
    if (this.currentStep === 0) {
      this.dp[0] = 1;
    } else if (this.currentStep === 1) {
      this.dp[1] = 1;
    } else {
      this.dp[this.currentStep] = this.dp[this.currentStep - 1] + this.dp[this.currentStep - 2];
    }
    if (this.currentStep < this.n) {
      this.currentStep++;
      this.render();
    }
  }

  playAnimation() {
    if (!this.isPlaying) return;
    if (this.currentStep <= this.n) {
      this.stepAnimation();
      setTimeout(() => this.playAnimation(), 700);
    } else {
      this.isPlaying = false;
    }
  }
}
