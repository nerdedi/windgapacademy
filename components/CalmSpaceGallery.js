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
      const place = calmingPlaces[idx];
      document.getElementById('selected-calm-place').textContent = `You selected: ${place.label}`;
      document.body.style.backgroundImage = `url('${place.url}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    });
  });
}
