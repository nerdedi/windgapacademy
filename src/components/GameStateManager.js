// Modular state machine for games (inspired by Antura)
export class GameStateManager {
  constructor(states) {
    this.states = states;
    this.currentState = null;
  }
  setState(stateName, ...args) {
    if (this.states[stateName]) {
      if (this.currentState && this.states[this.currentState].onExit) {
        this.states[this.currentState].onExit();
      }
      this.currentState = stateName;
      if (this.states[stateName].onEnter) {
        this.states[stateName].onEnter(...args);
      }
    }
  }
  update(...args) {
    if (this.currentState && this.states[this.currentState].onUpdate) {
      this.states[this.currentState].onUpdate(...args);
    }
  }
}
