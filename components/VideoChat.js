// Video/audio chat integration
export function showVideoChat(container) {
  container.innerHTML = `
    <div class="lesson-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/lesson-bg.svg') center/cover no-repeat;"></div>
    <section id="video-chat" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">
      <h2 id="video-heading" class="text-3xl font-bold text-primary mb-6">🎥 Video Chat</h2>
      <button id="start-video" class="btn-primary nav-btn">Start Video</button>
      <div id="video-area"></div>
    </section>
  `;
  // Animate heading and button
  applyHeadingAnimation(document.getElementById('video-heading'));
  applyButtonAnimation(document.getElementById('start-video'));
  // Accessibility
  setAriaAttributes(document.getElementById('video-chat'), { role: 'region', label: 'Video Chat' });
}
