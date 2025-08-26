// Windgap Academy Zoo Environment (Placeholder)
export default class AcademyZoo {
  constructor(container) {
    this.container = container;
    this.render();
  }
  render() {
    this.container.innerHTML = `
      <div style="text-align:center;padding:2em;font-size:1.5em;">
        <h2>Academy Zoo Environment</h2>
        <p>Interactive educational zoo coming soon!</p>
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Zoo" style="border-radius:12px;max-width:100%;margin-top:1em;">
      </div>
    `;
  }
}
