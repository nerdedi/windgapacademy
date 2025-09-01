// SimulationManager: coordinates all simulation modules and manages global state
import SupermarketSimulation from '../../components/SupermarketSimulation';
import ClubhouseSimulation from '../../components/ClubhouseSimulation';
import KitchenSimulation from '../../components/KitchenSimulation';
import CalmSpaceSimulation from '../../components/CalmSpaceSimulation';
import ZooSimulation from '../../components/ZooSimulation';

export type SimulationArea = 'supermarket' | 'clubhouse' | 'kitchen' | 'calmspace' | 'zoo';

interface SimulationState {
  currentArea: SimulationArea;
  progress: Record<SimulationArea, any>;
}

class SimulationManager {
  async fetchProgressFromBackend(userId: string) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/simulation/${userId}`);
      if (res.ok) {
        const data = await res.json();
        this.state.progress = data.progress || this.state.progress;
        this.state.currentArea = data.currentArea || this.state.currentArea;
        this._saveState();
      }
    } catch (e) {}
  }

  async saveProgressToBackend(userId: string) {
    if (!userId) return;
    try {
      await fetch(`/api/simulation/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state),
      });
    } catch (e) {}
  }
  state: SimulationState;
  modules: Record<SimulationArea, any>;

  constructor() {
    this.state = {
      currentArea: 'supermarket',
      progress: {
        supermarket: {},
        clubhouse: {},
        kitchen: {},
        calmspace: {},
        zoo: {},
      },
    };
    this.modules = {
      supermarket: SupermarketSimulation,
      clubhouse: ClubhouseSimulation,
      kitchen: KitchenSimulation,
      calmspace: CalmSpaceSimulation,
      zoo: ZooSimulation,
    };
  }

  switchArea(area: SimulationArea) {
    this.state.currentArea = area;
    this._saveState();
  }

  getCurrentModule() {
    return this.modules[this.state.currentArea];
  }

  getProgress(area: SimulationArea) {
    return this.state.progress[area];
  }

  setProgress(area: SimulationArea, data: any) {
    this.state.progress[area] = data;
    this._saveState();
  }

  _saveState() {
    try {
      localStorage.setItem('simulationState', JSON.stringify(this.state));
    } catch (e) {}
  }

  loadState() {
    try {
      const saved = localStorage.getItem('simulationState');
      if (saved) {
        this.state = JSON.parse(saved);
      }
    } catch (e) {}
  }

  addModule(area: SimulationArea, module: any) {
    this.modules[area] = module;
    if (!this.state.progress[area]) {
      this.state.progress[area] = {};
    }
    this._saveState();
  }
}

export default new SimulationManager();
