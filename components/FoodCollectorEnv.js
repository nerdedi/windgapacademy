// FoodCollectorEnv.js
// Nutrition learning game based on ML-Agents Food Collector environment
import { EnvironmentBase } from "./EnvironmentBase.js";

export class FoodCollectorEnv extends EnvironmentBase {
  constructor(container, options = {}) {
    super(container, { ...options, title: "Food Collector: Nutrition Challenge" });
    this.foods = [
      { name: "Broccoli", type: "healthy", img: "foods/broccoli.png" },
      { name: "Apple", type: "healthy", img: "foods/apple.png" },
      { name: "Carrot", type: "healthy", img: "foods/carrot.png" },
      { name: "Chips", type: "unhealthy", img: "foods/chips.png" },
      { name: "Soda", type: "unhealthy", img: "foods/soda.png" },
      { name: "Chocolate", type: "unhealthy", img: "foods/chocolate.png" },
    ];
    this.agent = { x: 2, y: 2, score: 0 };
    this.gridSize = 5;
    this.foodPositions = [];
    this.initGame();
    this.render();
    this.container.querySelector(".env-feedback").textContent =
      "Collect healthy foods to earn points! Avoid unhealthy foods.";
  }

  initGame() {
    this.foodPositions = [];
    // Place foods randomly on grid
    this.foodPositions = this.foods.map((food) => ({
      ...food,
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize),
    }));
    // Reset agent position and score
    this.agent.x = 2;
    this.agent.y = 2;
    this.agent.score = 0;
    this.container.querySelector(".env-feedback").textContent =
      "Game reset! Collect healthy foods.";

    this.container.querySelector("#fc-score").textContent = this.agent.score;
    this.achievements = [];
    this.updateAchievements();
    this.render();
  }

  render() {
    super.render();
    const canvas = this.container.querySelector(".env-canvas");
    canvas.innerHTML = this.renderGrid(); // Render grid as HTML table
    this.renderControls();
  }

  renderControls() {
    // Simple buttons for movement and reset
    const controls = this.container.querySelector(".env-controls");
    controls.innerHTML = `
      <button onclick="window.fcMove('up')">Up</button>
      <button onclick="window.fcMove('right')">Right</button>
      <button onclick="window.fcMove('down')">Down</button>
      <button onclick="window.fcMove('left')">Left</button>
      <button onclick="window.fcMove('right')">Right</button>
      <button onclick="window.fcReset()">Reset</button>
      <div class="env-achievements">
        <h4>Achievements:</h4>
        <ul id="fc-achievements">
          ${this.achievements.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </div>
      <div>Score: <span id="fc-score">${this.agent.score}</span></div>
      <div class="env-feedback" aria-live="polite"></div>
    </div>
    `;
    // Expose movement and reset functions globally for button onclick handlers
    window.fcMove = (dir) => this.moveAgent(dir);
    window.fcReset = () => {
      this.container.querySelector(".env-feedback").textContent = "Game reset!";
      this.initGame();
      this.render();
    };
  }
  updateAchievements() {
    const achEl = this.container.querySelector("#fc-achievements");
    achEl.innerHTML = this.achievements.length
      ? this.achievements.map((a) => `<li>${a}</li>`).join("")
      : "<li>None yet</li>";
  }

  addAchievement(name) {
    if (!this.achievements.includes(name)) {
      this.achievements.push(name);
      this.updateAchievements();
    }
  }

  renderGrid() {
    let html = '<table style="border-collapse:collapse;width:100%;height:100%">';
    for (let x = 0; x < this.gridSize; x++) {
      html += "<tr>";
      for (let y = 0; y < this.gridSize; y++) {
        let cellFood = this.foodPositions.find((f) => f.x === x && f.y === y);
        let agentHere = this.agent.x === x && this.agent.y === y;
        html += `<td style="border:1px solid #ccc;width:20%;height:20%;text-align:center;vertical-align:middle;position:relative;">
          ${cellFood ? `<img src="${cellFood.img}" alt="${cellFood.name}" width="32"/><br>${cellFood.name}` : ""}
          <br />
          <span>${cellFood ? cellFood.calories : 0} cal</span>
          <br />
          <span>${agentHere ? "You are here" : ""}</span>
          <br />
          <span>${cellFood ? cellFood.type : ""}</span>
          <br />
          ${agentHere ? '<div style="width:32px;height:32px;background:#1976d2;border-radius:50%;margin:auto;"></div>' : ""}
        </td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  }

  moveAgent(dir) {
    this.container.querySelector(".env-feedback").textContent = ""; // Clear previous feedback
    let { x, y } = this.agent;
    if (dir === "up" && y > 0) y--;
    if (dir === "down" && y < this.gridSize - 1) y++;
    if (dir === "left" && x > 0) x--;
    if (dir === "right" && x < this.gridSize - 1) x++;
    this.agent.x = x;
    this.agent.y = y;
    this.checkFood();
    this.render();
    if (this.foodPositions.length === 0) {
      this.container.querySelector(".env-feedback").textContent =
        "All foods collected! Reset to play again.";
    } else {
      this.container.querySelector(".env-feedback").textContent =
        "Move to collect healthy foods and avoid unhealthy ones.";
    }
  }

  checkFood() {
    const idx = this.foodPositions.findIndex((f) => f.x === this.agent.x && f.y === this.agent.y);
    if (idx !== -1) {
      const food = this.foodPositions[idx];
      if (food.type === "healthy") {
        this.agent.score += 1;
        this.addAchievement("Healthy Choice");
        this.container.querySelector(".env-feedback").textContent =
          `Great! You collected a healthy food: ${food.name}`;
      } else {
        this.agent.score -= 1;
        this.container.querySelector(".env-feedback").textContent =
          `Oops! ${food.name} is not a healthy choice.`;
      }
      this.foodPositions.splice(idx, 1);
      this.container.querySelector("#fc-score").textContent = this.agent.score;
    }
  }
}
