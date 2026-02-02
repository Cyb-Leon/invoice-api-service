/**
 * Lights Module
 * Creates and manages scene lighting
 */
import * as THREE from 'three';

/**
 * Creates the lighting setup for the scene
 * @param {THREE.Scene} scene - The scene to add lights to
 * @returns {Object} Object containing all light references
 */
export function createLights(scene) {
  const lights = {};
  
  // Ambient light for base illumination
  lights.ambient = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(lights.ambient);
  
  // Main directional light (like sunlight)
  lights.directional = new THREE.DirectionalLight(0xffffff, 1);
  lights.directional.position.set(10, 20, 10);
  lights.directional.castShadow = true;
  lights.directional.shadow.mapSize.width = 2048;
  lights.directional.shadow.mapSize.height = 2048;
  scene.add(lights.directional);
  
  // Accent point light - Teal (South African inspired)
  lights.pointTeal = new THREE.PointLight(0x00d4aa, 2, 50);
  lights.pointTeal.position.set(-15, 10, 5);
  scene.add(lights.pointTeal);
  
  // Accent point light - Purple
  lights.pointPurple = new THREE.PointLight(0x7c3aed, 2, 50);
  lights.pointPurple.position.set(15, -10, 5);
  scene.add(lights.pointPurple);
  
  // Accent point light - Orange/Gold
  lights.pointGold = new THREE.PointLight(0xf59e0b, 1.5, 40);
  lights.pointGold.position.set(0, 15, -10);
  scene.add(lights.pointGold);
  
  return lights;
}

/**
 * Animates the accent lights
 * @param {Object} lights - The lights object
 * @param {number} time - Current time in seconds
 */
export function animateLights(lights, time) {
  if (lights.pointTeal) {
    lights.pointTeal.position.x = Math.sin(time * 0.3) * 20;
    lights.pointTeal.position.y = Math.cos(time * 0.2) * 15 + 5;
  }
  
  if (lights.pointPurple) {
    lights.pointPurple.position.x = Math.cos(time * 0.25) * 20;
    lights.pointPurple.position.y = Math.sin(time * 0.35) * 15 - 5;
  }
  
  if (lights.pointGold) {
    lights.pointGold.position.z = Math.sin(time * 0.4) * 10;
  }
}

/**
 * Updates lights for theme change
 * @param {Object} lights - The lights object
 * @param {string} theme - 'dark' or 'light'
 */
export function updateLightsTheme(lights, theme) {
  if (theme === 'light') {
    lights.ambient.intensity = 0.8;
    lights.directional.intensity = 1.5;
    lights.pointTeal.intensity = 1;
    lights.pointPurple.intensity = 1;
    lights.pointGold.intensity = 0.8;
  } else {
    lights.ambient.intensity = 0.5;
    lights.directional.intensity = 1;
    lights.pointTeal.intensity = 2;
    lights.pointPurple.intensity = 2;
    lights.pointGold.intensity = 1.5;
  }
}

export default { createLights, animateLights, updateLightsTheme };
