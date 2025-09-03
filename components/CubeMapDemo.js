// CubeMapDemo.js
// Three.js-based interactive 3D cube map and object demo for Windgap Academy

import * as THREE from "three";

export class CubeMapDemo {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 2, 10);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(this.renderer.domElement);
    this.controls = null;
    this.animate = this.animate.bind(this);
    this.init();
  }

  init() {
    // Add ambient light
    this.scene.add(new THREE.AmbientLight(0x404040, 1.5));
    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    this.scene.add(dirLight);

    // Cube map background (simple color for demo)
    this.scene.background = new THREE.Color(0x87ceeb);

    // Add box
    const boxGeometry = new THREE.BoxGeometry(2, 1, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffe066 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 0.5, 0);
    this.scene.add(box);

    // Add sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xd16d6d });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2, 0);
    this.scene.add(sphere);

    // Add grid
    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);

    // Add orbit controls if available
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new window.THREE.OrbitControls(this.camera, this.renderer.domElement);
    }

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
