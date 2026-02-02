/**
 * Renderer Module
 * Creates and manages the WebGL renderer
 */
import * as THREE from 'three';

/**
 * Creates a WebGL renderer with optimal settings
 * @param {HTMLElement} container - DOM element to attach canvas
 * @returns {THREE.WebGLRenderer} The configured renderer
 */
export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  
  // Set pixel ratio for sharp rendering on high-DPI displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Enable shadow maps for realistic shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Set output encoding for correct colors
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // Set tone mapping for better lighting
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  
  // Append canvas to container
  container.appendChild(renderer.domElement);
  
  return renderer;
}

/**
 * Updates renderer size on window resize
 * @param {THREE.WebGLRenderer} renderer - The renderer to update
 */
export function updateRendererSize(renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/**
 * Renders the scene
 * @param {THREE.WebGLRenderer} renderer - The renderer
 * @param {THREE.Scene} scene - The scene to render
 * @param {THREE.Camera} camera - The camera
 */
export function render(renderer, scene, camera) {
  renderer.render(scene, camera);
}

export default { createRenderer, updateRendererSize, render };
