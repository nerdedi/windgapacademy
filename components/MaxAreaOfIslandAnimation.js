// MaxAreaOfIslandAnimation.js
// Interactive animation for LeetCode 695: Max Area of Island (DFS)

export class MaxAreaOfIslandAnimation {
  constructor(container) {
    this.container = container;
    this.grid = [
      [0,0,1,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,1,0,0,0],
      [0,1,1,0,1,0,0,0,0,0,0,0,0],
      [0,1,0,0,1,1,0,0,1,0,1,0,0],
      [0,1,0,0,1,1,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0]
    ];
    this.visited = Array.from({length: this.grid.length}, () => Array(this.grid[0].length).fill(false));
    this.maxArea = 0;
    this.currentArea = 0;
    this.currentIsland = [];
    this.stepQueue = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="island-animation flex flex-col items-center p-8">
        <h2 class="text-2xl font-bold mb-4">Max Area of Island Animation</h2>
        <svg width="520" height="320" viewBox="0 0 520 320" class="mb-4">
          ${this.renderGrid()}
        </svg>
        <div class="flex gap-2 mb-4">
          <button id="step-dfs" class="btn-primary">Step DFS</button>
          <button id="reset-dfs" class="btn-secondary">Reset</button>
        </div>
        <div class="mt-4 text-lg">Current Island Area: <span id="current-area">${this.currentArea}</span></div>
        <div class="mt-2 text-lg">Max Area Found: <span id="max-area">${this.maxArea}</span></div>
      </section>
    `;
    this.attachEvents();
  }

  renderGrid() {
    let svg = '';
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[0].length; c++) {
        let fill = this.grid[r][c] === 1 ? '#ffe066' : '#e0f7fa';
        if (this.visited[r][c]) fill = '#1976d2';
        if (this.currentIsland.some(([rr,cc]) => rr === r && cc === c)) fill = '#d16d6d';
        svg += `<rect x="${c*40}" y="${r*40}" width="38" height="38" fill="${fill}" stroke="#222" stroke-width="2" />`;
      }
    }
    return svg;
  }

  attachEvents() {
    this.container.querySelector('#step-dfs').addEventListener('click', () => {
      this.stepDFS();
    });
    this.container.querySelector('#reset-dfs').addEventListener('click', () => {
      this.visited = Array.from({length: this.grid.length}, () => Array(this.grid[0].length).fill(false));
      this.maxArea = 0;
      this.currentArea = 0;
      this.currentIsland = [];
      this.stepQueue = [];
      this.render();
    });
  }

  stepDFS() {
    if (this.stepQueue.length === 0) {
      // Find next unvisited land
      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[0].length; c++) {
          if (this.grid[r][c] === 1 && !this.visited[r][c]) {
            this.currentArea = 0;
            this.currentIsland = [];
            this.stepQueue = [[r, c]];
            this.render();
            return;
          }
        }
      }
      // No more islands
      return;
    }
    const [r, c] = this.stepQueue.pop();
    if (r < 0 || r >= this.grid.length || c < 0 || c >= this.grid[0].length) return;
    if (this.visited[r][c] || this.grid[r][c] !== 1) return;
    this.visited[r][c] = true;
    this.currentArea++;
    this.currentIsland.push([r, c]);
    this.stepQueue.push([r-1, c], [r+1, c], [r, c-1], [r, c+1]);
    if (this.stepQueue.length === 0) {
      if (this.currentArea > this.maxArea) this.maxArea = this.currentArea;
      this.currentIsland = [];
    }
    this.render();
  }
}
