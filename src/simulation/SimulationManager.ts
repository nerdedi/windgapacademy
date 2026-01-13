// SimulationManager: coordinates all simulation modules and manages global state
import CalmSpaceSimulation from "../../components/CalmSpaceSimulation.jsx";
import ClubhouseSimulation from "../../components/ClubhouseSimulation.jsx";
import KitchenSimulation from "../../components/KitchenSimulation.jsx";
import SupermarketSimulation from "../../components/SupermarketSimulation.jsx";
import ZooSimulation from "../../components/ZooSimulation.jsx";

export type SimulationArea = "supermarket" | "clubhouse" | "kitchen" | "calmspace" | "zoo";

interface SimulationState {
  currentArea: SimulationArea;
  progress: Record<SimulationArea, any>;
}

class SimulationManager {
  private backendAvailable = true; // Track if backend is reachable

  async fetchProgressFromBackend(userId: string) {
    if (!userId || !this.backendAvailable) return;
    try {
      const res = await fetch(`/api/simulation/${userId}`);
      if (res.ok) {
        const data = await res.json();
        this.state.progress = data.progress || this.state.progress;
        this.state.currentArea = data.currentArea || this.state.currentArea;
        this._saveState();
      } else if (res.status === 404) {
        // Backend API not available - use local storage only
        this.backendAvailable = false;
        // eslint-disable-next-line no-console
        console.info("Simulation API not available, using local storage");
      }
    } catch (e) {
      // Network error - backend not running, fall back to local storage silently
      this.backendAvailable = false;
    }
  }

  async saveProgressToBackend(userId: string) {
    if (!userId || !this.backendAvailable) return;
    try {
      const res = await fetch(`/api/simulation/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state),
      });
      if (!res.ok && res.status === 404) {
        this.backendAvailable = false;
      }
    } catch (e) {
      // Backend not available - progress saved to local storage only
      this.backendAvailable = false;
    }
  }
  state: SimulationState;
  modules: Record<SimulationArea, any>;

  constructor() {
    this.state = {
      currentArea: "supermarket",
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
      localStorage.setItem("simulationState", JSON.stringify(this.state));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("_saveState error:", e);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem("simulationState");
      if (saved) {
        this.state = JSON.parse(saved);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("loadState error:", e);
    }
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
