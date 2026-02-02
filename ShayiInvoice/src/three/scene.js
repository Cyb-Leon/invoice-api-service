/**
 * Scene Module
 * Creates and manages the Three.js scene
 */
import * as THREE from 'three';

/**
 * Creates a new Three.js scene with fog effect
 * @returns {THREE.Scene} The configured scene
 */
export function createScene() {
  const scene = new THREE.Scene();
  
  // Add fog for depth effect
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);
  
  return scene;
}

/**
 * Updates scene background based on theme
 * @param {THREE.Scene} scene - The scene to update
 * @param {string} theme - 'dark' or 'light'
 */
export function updateSceneTheme(scene, theme) {
  if (theme === 'light') {
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.02);
  } else {
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);
  }
}

export default { createScene, updateSceneTheme };
