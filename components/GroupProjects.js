// Group projects or collaborative activities
export function showGroupProjects(container) {
  container.innerHTML = `
    <section id="group-projects" aria-label="Group Projects">
      <h2>🤝 Group Projects</h2>
      <ul>
        <li>Science Fair Team</li>
        <li>Community Art Project</li>
      </ul>
      <div id="group-feedback" aria-live="polite"></div>
    </section>
  `;
}
