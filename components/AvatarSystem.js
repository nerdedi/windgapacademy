// AvatarSystem.js
// Core logic for live avatars, customisation, emotes, accessories, backgrounds, and sharing

export class AvatarSystem {
  constructor(container) {
    this.container = container;
    this.avatar = {
      base: 'default',
      accessories: [],
      outfit: 'standard',
      background: 'academy',
      emote: null,
      idleAnimation: 'bounce',
      seasonal: null,
      miniGames: [],
      savedDesigns: [],
    };
    this.initUI();
  }

  initUI() {
    this.container.innerHTML = `
      <div class="avatar-customization">
        <div id="avatar-preview"></div>
        <div class="avatar-controls">
          <button onclick="window.avatarSystem.showEmoteMenu()">Emotes</button>
          <button onclick="window.avatarSystem.showAccessoryMenu()">Accessories</button>
          <button onclick="window.avatarSystem.showOutfitMenu()">Outfits</button>
          <button onclick="window.avatarSystem.showBackgroundMenu()">Backgrounds</button>
          <button onclick="window.avatarSystem.showSeasonalMenu()">Seasonal</button>
          <button onclick="window.avatarSystem.saveDesign()">Save Design</button>
          <button onclick="window.avatarSystem.shareDesign()">Share</button>
        </div>
        <div id="avatar-menu"></div>
      </div>
    `;
    window.avatarSystem = this;
    this.renderAvatar();
  }

  renderAvatar() {
    const preview = this.container.querySelector('#avatar-preview');
    preview.innerHTML = `
      <div class="avatar-bg ${this.avatar.background}"></div>
      <div class="avatar-base ${this.avatar.base}"></div>
      <div class="avatar-outfit ${this.avatar.outfit}"></div>
      ${this.avatar.accessories.map(a => `<div class='avatar-accessory ${a}'></div>`).join('')}
      ${this.avatar.seasonal ? `<div class='avatar-seasonal ${this.avatar.seasonal}'></div>` : ''}
      <div class="avatar-idle ${this.avatar.idleAnimation}"></div>
      ${this.avatar.emote ? `<div class='avatar-emote ${this.avatar.emote}'></div>` : ''}
    `;
  }

  showEmoteMenu() {
    this.showMenu(['wave', 'dance', 'laugh', 'cheer', 'idle'], 'emote', 'Choose Emote');
  }
  showAccessoryMenu() {
    this.showMenu(['glasses', 'hat', 'scarf', 'badge', 'earrings'], 'accessory', 'Choose Accessory');
  }
  showOutfitMenu() {
    this.showMenu(['standard', 'sport', 'formal', 'seasonal', 'custom'], 'outfit', 'Choose Outfit');
  }
  showBackgroundMenu() {
    this.showMenu(['academy', 'garden', 'beach', 'night', 'event'], 'background', 'Choose Background');
  }
  showSeasonalMenu() {
    this.showMenu(['spring', 'summer', 'autumn', 'winter', 'holiday'], 'seasonal', 'Choose Seasonal');
  }

  showMenu(options, type, title) {
    const menu = this.container.querySelector('#avatar-menu');
    menu.innerHTML = `<h4>${title}</h4>` + options.map(opt => `<button onclick="window.avatarSystem.selectOption('${type}','${opt}')">${opt}</button>`).join('');
  }

  selectOption(type, value) {
    if (type === 'accessory') {
      if (!this.avatar.accessories.includes(value)) this.avatar.accessories.push(value);
    } else {
      this.avatar[type] = value;
    }
    this.renderAvatar();
    this.container.querySelector('#avatar-menu').innerHTML = '';
  }

  saveDesign() {
    this.avatar.savedDesigns.push({...this.avatar});
    alert('Avatar design saved!');
  }

  shareDesign() {
    // Simulate sharing (could integrate with backend/social)
    alert('Avatar design shared!');
  }
}

// Usage: new AvatarSystem(document.getElementById('avatar-builder-area'));
