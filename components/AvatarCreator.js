
// AvatarCreator.js
// Advanced customizable avatar system for Windgap Academy

export class AvatarCreator {
  constructor(container) {
    this.container = container;
    this.state = {
      skin: '#f4e2d8',
      hair: '#2d3339',
      hairstyle: 'short',
      eyes: 'round',
      mouth: 'smile',
      bodyType: 'average',
      outfit: 'academy',
      outfitPattern: 'plain',
      accessory: 'none',
      mood: 'happy',
      background: '#e0f7fa',
      shoes: 'yellow',
      pronoun: 'they/them',
      animation: 'wave',
    };
    this.gallery = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="avatar-creator flex flex-col items-center p-8" aria-label="Avatar Creator" tabindex="0">
        <h2 class="text-3xl font-bold mb-4">Create Your Academy Avatar</h2>
        <div class="avatar-preview mb-6" aria-live="polite">
          <svg width="180" height="220" viewBox="0 0 180 220">
            <ellipse cx="90" cy="80" rx="60" ry="50" fill="${this.state.skin}" />
            <ellipse cx="90" cy="60" rx="40" ry="20" fill="${this.state.hair}" />
            ${this.state.hairstyle === 'long' ? '<rect x="60" y="40" width="60" height="30" rx="15" fill="'+this.state.hair+'" />' : ''}
            <rect x="60" y="130" width="60" height="60" rx="20" fill="#fff" />
            <!-- Eyes -->
            ${this.state.eyes === 'round' ? '<circle cx="70" cy="100" r="6" fill="#222" /><circle cx="110" cy="100" r="6" fill="#222" />' : '<ellipse cx="70" cy="100" rx="4" ry="8" fill="#222" /><ellipse cx="110" cy="100" rx="4" ry="8" fill="#222" />'}
            <!-- Mouth -->
            ${this.state.mouth === 'smile' ? '<ellipse cx="90" cy="120" rx="18" ry="8" fill="#d16d6d" />' : '<rect x="80" y="115" width="20" height="6" rx="3" fill="#d16d6d" />'}
            <!-- Shoes -->
            <rect x="80" y="190" width="20" height="20" rx="8" fill="${this.state.shoes === 'yellow' ? '#ffe066' : this.state.shoes === 'blue' ? '#1976d2' : '#fff'}" />
            <!-- Accessories -->
            ${this.state.accessory === 'glasses' ? '<rect x="65" y="95" width="50" height="12" rx="6" fill="#1976d2" />' : ''}
            ${this.state.accessory === 'hat' ? '<ellipse cx="90" cy="40" rx="30" ry="10" fill="#888" />' : ''}
            <!-- Outfit Pattern -->
            ${this.state.outfitPattern === 'stripes' ? '<rect x="60" y="130" width="60" height="60" rx="20" fill="url(#stripes)" />' : ''}
            <!-- Animation -->
            ${this.state.animation === 'wave' ? '<path d="M60 180 Q90 200 120 180" stroke="#1976d2" stroke-width="4" fill="none" />' : ''}
            <defs>
              <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="8" fill="#1976d2" />
              </pattern>
            </defs>
          </svg>
        </div>
        <div class="avatar-controls grid grid-cols-2 gap-4 mb-6">
          <label>Skin Tone <input type="color" id="skin-tone" value="${this.state.skin}" aria-label="Skin Tone" /></label>
          <label>Hair Color <input type="color" id="hair-color" value="${this.state.hair}" aria-label="Hair Color" /></label>
          <label>Hairstyle
            <select id="hairstyle-select" aria-label="Hairstyle">
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </label>
          <label>Eyes
            <select id="eyes-select" aria-label="Eyes">
              <option value="round">Round</option>
              <option value="oval">Oval</option>
            </select>
          </label>
          <label>Mouth
            <select id="mouth-select" aria-label="Mouth">
              <option value="smile">Smile</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>
          <label>Body Type
            <select id="bodytype-select" aria-label="Body Type">
              <option value="average">Average</option>
              <option value="slim">Slim</option>
              <option value="athletic">Athletic</option>
            </select>
          </label>
          <label>Outfit
            <select id="outfit-select" aria-label="Outfit">
              <option value="academy">Academy</option>
              <option value="casual">Casual</option>
              <option value="sporty">Sporty</option>
            </select>
          </label>
          <label>Outfit Pattern
            <select id="outfitpattern-select" aria-label="Outfit Pattern">
              <option value="plain">Plain</option>
              <option value="stripes">Stripes</option>
            </select>
          </label>
          <label>Accessory
            <select id="accessory-select" aria-label="Accessory">
              <option value="none">None</option>
              <option value="glasses">Glasses</option>
              <option value="hat">Hat</option>
            </select>
          </label>
          <label>Mood
            <select id="mood-select" aria-label="Mood">
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="excited">Excited</option>
            </select>
          </label>
          <label>Shoes
            <select id="shoes-select" aria-label="Shoes">
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="white">White</option>
            </select>
          </label>
          <label>Pronoun
            <select id="pronoun-select" aria-label="Pronoun">
              <option value="they/them">They/Them</option>
              <option value="she/her">She/Her</option>
              <option value="he/him">He/Him</option>
            </select>
          </label>
          <label>Background
            <input type="color" id="background-select" value="${this.state.background}" aria-label="Background" />
          </label>
          <label>Animation
            <select id="animation-select" aria-label="Animation">
              <option value="wave">Wave</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
        <button class="btn-primary" id="save-avatar" aria-label="Save Avatar">Save Avatar</button>
        <button class="btn-secondary" id="export-avatar" aria-label="Export Avatar">Export as PNG</button>
        <button class="btn-secondary" id="add-to-gallery" aria-label="Add to Gallery">Add to Gallery</button>
        <div id="avatar-status" class="mt-4 text-green-700 font-bold" aria-live="polite"></div>
        <div id="avatar-gallery" class="mt-8"></div>
      </section>
    `;
    this.attachEvents();
    this.renderGallery();
    document.body.style.background = this.state.background;
  }

  attachEvents() {
    this.container.querySelector('#skin-tone').addEventListener('input', e => {
      this.state.skin = e.target.value;
      this.render();
    });
    this.container.querySelector('#hair-color').addEventListener('input', e => {
      this.state.hair = e.target.value;
      this.render();
    });
    this.container.querySelector('#hairstyle-select').addEventListener('change', e => {
      this.state.hairstyle = e.target.value;
      this.render();
    });
    this.container.querySelector('#eyes-select').addEventListener('change', e => {
      this.state.eyes = e.target.value;
      this.render();
    });
    this.container.querySelector('#mouth-select').addEventListener('change', e => {
      this.state.mouth = e.target.value;
      this.render();
    });
    this.container.querySelector('#bodytype-select').addEventListener('change', e => {
      this.state.bodyType = e.target.value;
      this.render();
    });
    this.container.querySelector('#outfit-select').addEventListener('change', e => {
      this.state.outfit = e.target.value;
      this.render();
    });
    this.container.querySelector('#outfitpattern-select').addEventListener('change', e => {
      this.state.outfitPattern = e.target.value;
      this.render();
    });
    this.container.querySelector('#accessory-select').addEventListener('change', e => {
      this.state.accessory = e.target.value;
      this.render();
    });
    this.container.querySelector('#mood-select').addEventListener('change', e => {
      this.state.mood = e.target.value;
      this.render();
    });
    this.container.querySelector('#shoes-select').addEventListener('change', e => {
      this.state.shoes = e.target.value;
      this.render();
    });
    this.container.querySelector('#pronoun-select').addEventListener('change', e => {
      this.state.pronoun = e.target.value;
      this.render();
    });
    this.container.querySelector('#background-select').addEventListener('input', e => {
      this.state.background = e.target.value;
      this.render();
    });
    this.container.querySelector('#animation-select').addEventListener('change', e => {
      this.state.animation = e.target.value;
      this.render();
    });
    this.container.querySelector('#save-avatar').addEventListener('click', () => {
      localStorage.setItem('academyAvatar', JSON.stringify(this.state));
      document.getElementById('avatar-status').textContent = 'Avatar saved!';
    });
    this.container.querySelector('#export-avatar').addEventListener('click', () => {
      this.exportAvatar();
    });
    this.container.querySelector('#add-to-gallery').addEventListener('click', () => {
      this.gallery.push({ ...this.state });
      this.renderGallery();
      document.getElementById('avatar-status').textContent = 'Avatar added to gallery!';
    });
  }

  exportAvatar() {
    const svg = this.container.querySelector('.avatar-preview svg');
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'academy-avatar.png';
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  }

  renderGallery() {
    const galleryDiv = this.container.querySelector('#avatar-gallery');
    if (!galleryDiv) return;
    galleryDiv.innerHTML = '<h3 class="text-xl font-bold mb-2">Avatar Gallery</h3>' +
      this.gallery.map((avatar, idx) => `
        <div class="avatar-gallery-item inline-block m-2 p-2 bg-white rounded shadow">
          <svg width="60" height="80" viewBox="0 0 180 220">
            <ellipse cx="90" cy="80" rx="60" ry="50" fill="${avatar.skin}" />
            <ellipse cx="90" cy="60" rx="40" ry="20" fill="${avatar.hair}" />
            ${avatar.hairstyle === 'long' ? '<rect x="60" y="40" width="60" height="30" rx="15" fill="'+avatar.hair+'" />' : ''}
            <rect x="60" y="130" width="60" height="60" rx="20" fill="#fff" />
            ${avatar.eyes === 'round' ? '<circle cx="70" cy="100" r="6" fill="#222" /><circle cx="110" cy="100" r="6" fill="#222" />' : '<ellipse cx="70" cy="100" rx="4" ry="8" fill="#222" /><ellipse cx="110" cy="100" rx="4" ry="8" fill="#222" />'}
            ${avatar.mouth === 'smile' ? '<ellipse cx="90" cy="120" rx="18" ry="8" fill="#d16d6d" />' : '<rect x="80" y="115" width="20" height="6" rx="3" fill="#d16d6d" />'}
            <rect x="80" y="190" width="20" height="20" rx="8" fill="${avatar.shoes === 'yellow' ? '#ffe066' : avatar.shoes === 'blue' ? '#1976d2' : '#fff'}" />
            ${avatar.accessory === 'glasses' ? '<rect x="65" y="95" width="50" height="12" rx="6" fill="#1976d2" />' : ''}
            ${avatar.accessory === 'hat' ? '<ellipse cx="90" cy="40" rx="30" ry="10" fill="#888" />' : ''}
            ${avatar.outfitPattern === 'stripes' ? '<rect x="60" y="130" width="60" height="60" rx="20" fill="url(#stripes)" />' : ''}
            <defs>
              <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="8" fill="#1976d2" />
              </pattern>
            </defs>
          </svg>
          <div class="text-xs mt-1">${avatar.pronoun}</div>
        </div>
      `).join('');
  }
}
