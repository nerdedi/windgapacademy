// Windgap Academy Results Dashboard (Placeholder)
export default class ResultsDashboard {
  constructor(container) {
    this.container = container;
    this.render();
  }
  render() {
    this.container.innerHTML = `
      <div style="text-align:center;padding:2em;font-size:1.5em;">
        <h2>Results Dashboard</h2>
        <p>Track your progress and achievements here. Coming soon!</p>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Dashboard" style="border-radius:12px;max-width:100%;margin-top:1em;">
      </div>
    `;
  }
}
