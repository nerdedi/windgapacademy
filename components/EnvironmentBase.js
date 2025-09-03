// EnvironmentBase.js
// Base class for modular learning environments in Windgap Academy

export class EnvironmentBase {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.agents = [];
    this.state = {};
    this.rewards = [];
    this.observations = [];
    this.actions = [];
    this.achievements = [];
    this.init();
  }

  init() {
    // To be implemented by child classes
    this.render();
  }

  render() {
    // Basic layout, can be extended
    this.container.innerHTML = `
      <section class="env-base flex flex-col items-center p-8">
        <h2 class="text-2xl font-bold mb-4">${this.options.title || "Learning Environment"}</h2>
        <div class="env-canvas mb-4" style="width:400px;height:300px;background:#f8f8f8;border:1px solid #ccc;"></div>
        <div class="env-controls mb-4"></div>
        <div class="env-feedback mb-2"></div>
        <div class="env-achievements mb-2">Achievements: ${this.achievements.join(", ") || "None yet"}</div>
      </section>
    `;
  }

  step(action) {
    // To be implemented by child classes
  }

  giveReward(agent, value) {
    this.rewards.push({ agent, value });
  }

  observe(agent) {
    // To be implemented by child classes
    return {};
  }

  addAchievement(name) {
    if (!this.achievements.includes(name)) {
      this.achievements.push(name);
      this.render();
    }
  }
}
