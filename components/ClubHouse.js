import { applyButtonAnimation, applyHeadingAnimation, setAriaAttributes } from '../utils/uiUtils.js';

export function showClubHouse(container, userData = {}) {
  container.innerHTML = `
    <div class="clubhouse-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/clubhouse-bg.svg') center/cover no-repeat;"></div>
    <section id="club-house" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-4xl relative bg-white/80 backdrop-blur-lg grid grid-cols-4 gap-6">
      <header class="col-span-4 flex items-center justify-between mb-4">
        <img src="/assets/images/club-logo.png" alt="Club Logo" class="h-12 w-12 rounded-full shadow" />
        <h2 id="club-heading" class="text-3xl font-bold text-primary">Club House</h2>
        <div class="event-banner px-4 py-2 rounded bg-yellow-100 text-yellow-800 font-semibold">Event: Trivia Night!</div>
      </header>
      <aside class="col-span-1 flex flex-col gap-4">
        <button id="club-chat" class="btn-primary nav-btn">Chat</button>
        <button id="club-events" class="btn-secondary nav-btn">Events</button>
        <button id="club-members" class="btn-secondary nav-btn">Members</button>
        <button id="club-achievements" class="btn-secondary nav-btn">Achievements</button>
      </aside>
      <main class="col-span-2 flex flex-col items-center justify-center">
        <div id="club-lounge" class="lounge-area flex flex-wrap gap-4 justify-center items-end">
          <!-- Avatars and chat bubbles will be rendered here -->
        </div>
        <div id="club-board" class="club-board mt-6 p-4 rounded bg-gray-100 shadow">Interactive Club Board</div>
      </main>
      <aside class="col-span-1 flex flex-col gap-4">
        <div id="event-calendar" class="calendar bg-white rounded shadow p-4">Event Calendar</div>
        <div id="achievement-display" class="badge-wall bg-white rounded shadow p-4 mt-4">Achievements</div>
      </aside>
    </section>
  `;
  // Animate heading and buttons
  applyHeadingAnimation(document.getElementById('club-heading'));
  ['club-chat','club-events','club-members','club-achievements'].forEach(id=>applyButtonAnimation(document.getElementById(id)));
  // Accessibility
  setAriaAttributes(document.getElementById('club-house'), { role: 'region', label: 'Club House' });
}
