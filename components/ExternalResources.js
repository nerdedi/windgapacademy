// Integration with external learning resources
export function showExternalResources(container) {
  container.innerHTML = `
    <section id='external-resources' aria-label='External Resources'>
      <h2>🌐 External Resources</h2>
      <ul>
        <li><a href='https://www.khanacademy.org/' target='_blank'>Khan Academy</a></li>
        <li><a href='https://www.youtube.com/' target='_blank'>YouTube</a></li>
      </ul>
    </section>
  `;
}
