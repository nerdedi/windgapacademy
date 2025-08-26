// Parent/Educator portal for monitoring and feedback
export function showParentPortal(container) {
  container.innerHTML = `
    <div class="lesson-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/lesson-bg.svg') center/cover no-repeat;"></div>
    <section id="parent-portal" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">
      <h2 id="parent-heading" class="text-3xl font-bold text-primary mb-6">👪 Parent Portal</h2>
      <button id="view-progress" class="btn-primary nav-btn">View Progress</button>
      <div id="parent-info"></div>
    </section>
  `;
  // Animate heading and button
  applyHeadingAnimation(document.getElementById('parent-heading'));
  applyButtonAnimation(document.getElementById('view-progress'));
  // Accessibility
  setAriaAttributes(document.getElementById('parent-portal'), { role: 'region', label: 'Parent Portal' });
  document.getElementById("send-parent-message").onclick = function () {
    document.getElementById("parent-feedback").innerText = "Message sent to parent/educator!";
  };
}
