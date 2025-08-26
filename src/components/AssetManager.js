// Asset management for images, audio, 3D models
export class AssetManager {
  constructor() {
    this.assets = {};
  }
  loadAsset(name, url) {
    this.assets[name] = url;
    // For images/audio, you can preload here if needed
  }
  getAsset(name) {
    return this.assets[name];
  }
}
