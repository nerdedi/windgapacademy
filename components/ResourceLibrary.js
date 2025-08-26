// Resource library for educators and learners
export function showResourceLibrary(container) {
  container.innerHTML = `
    <div class="lesson-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/lesson-bg.svg') center/cover no-repeat;"></div>
    <section id="resource-library" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">
      <h2 id="resource-heading" class="text-3xl font-bold text-primary mb-6">📚 Resource Library</h2>
      <button id="download-resource" class="btn-primary nav-btn">Download Resource</button>
      <div id="resource-list"></div>
    </section>
  `;
  // Animate heading and button
  applyHeadingAnimation(document.getElementById('resource-heading'));
  applyButtonAnimation(document.getElementById('download-resource'));
  // Accessibility
  setAriaAttributes(document.getElementById('resource-library'), { role: 'region', label: 'Resource Library' });
}
