// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive calm space gallery logic

function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'onboarding-modal';
  modal.innerHTML = `<h2>Welcome to Calm Space Gallery!</h2><p>Browse relaxing images and sounds. Use the settings to personalize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById('close-onboarding').onclick = () => modal.remove();
}

function setAccessibility() {
  const galleryEl = document.getElementById('calm-space-gallery');
  if (galleryEl) {
    galleryEl.setAttribute('role', 'region');
    galleryEl.setAttribute('aria-label', 'Calm Space Gallery');
  }
}

function backupProgress(progress) {
  localStorage.setItem('calmSpaceGalleryProgress', JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem('calmSpaceGalleryProgress') || '{}');
}

function updateLeaderboard(score) {
  // ...leaderboard logic...
}

function sendFeedback(feedback) {
  // ...send feedback to server...
}

function logEvent(event) {
  // ...analytics logic...
}

function safeRun(fn) {
  try { fn(); } catch (e) { console.error('Error:', e); }
}

function showSettings() {
  // ...settings modal logic...
}

function startCalmSpaceGallery() {
  showOnboarding();
  setAccessibility();
  // ...calm space gallery logic...
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', startCalmSpaceGallery);
}
// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive calm space gallery logic

function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'onboarding-modal';
  modal.innerHTML = `<h2>Welcome to Calm Space Gallery!</h2><p>Explore calming spaces and resources. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById('close-onboarding').onclick = () => modal.remove();
}

function setAccessibility() {
  const calmEl = document.getElementById('calm-space-gallery');
  if (calmEl) {
    calmEl.setAttribute('role', 'region');
    calmEl.setAttribute('aria-label', 'Calm Space Gallery');
  }
}

function backupProgress(progress) {
  localStorage.setItem('calmSpaceGalleryProgress', JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem('calmSpaceGalleryProgress') || '{}');
}

function updateLeaderboard(score) {
  // ...leaderboard logic...
}

function sendFeedback(feedback) {
  // ...send feedback to server...
}

function logEvent(event) {
  // ...analytics logic...
}

function safeRun(fn) {
  try { fn(); } catch (e) { console.error('Error:', e); }
}

function showSettings() {
  // ...settings modal logic...
}

function startCalmSpaceGallery() {
  showOnboarding();
  setAccessibility();
  // ...calm space gallery logic...
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', startCalmSpaceGallery);
}
// CalmSpaceGallery.js
// Interactive gallery for Calm Space module

export const calmingPlaces = [
  {
    label: "Peaceful Lake",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/lake.jpg"
  },
  {
    label: "Serene Forest",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/forest.jpg"
  },
  {
    label: "Sunny Beach",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/beach.jpg"
  },
  {
    label: "Mountain View",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/mountain.jpg"
  },
  {
    label: "Blossom Garden",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/garden.jpg"
  },
  {
    label: "Starry Night",
    url: "https://raw.githubusercontent.com/HubSpotContentOffers/photo_gallery/master/photos/thumbnails/night.jpg"
  }
];

export function showCalmSpaceGallery(container) {
  container.innerHTML = `
    <section class="calm-space-gallery flex flex-col items-center py-8">
      <h2 class="text-3xl font-bold mb-6">Choose Your Calming Place</h2>
      <p class="text-lg mb-4">Select a place to help you relax and find your calm.</p>
      <div class="gallery-list grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        ${calmingPlaces.map((place, idx) => `
          <div class="calm-place-card flex flex-col items-center bg-white/80 rounded-xl shadow-lg p-4 transition hover:scale-105">
            <img src="${place.url}" alt="${place.label}" class="calm-place-img h-40 w-auto rounded mb-2" />
            <span class="text-lg font-semibold mb-2">${place.label}</span>
            <button class="choose-calm-btn btn-primary" data-idx="${idx}">Select</button>
          </div>
        `).join('')}
      </div>
      <div id="selected-calm-place" class="mt-6 text-xl font-bold text-blue-700"></div>
    </section>
  `;
  container.querySelectorAll('.choose-calm-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const place = calmingPlaces[idx]      
      document.getElementById('selected-calm-place').textContent = `You selected: ${place.label}`;
      document.body.style.backgroundImage = `url('${place.url}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    });
  });
}
