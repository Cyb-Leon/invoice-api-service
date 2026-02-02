/**
 * Three.js Module Index
 * Main entry point for the Three.js visualization
 */
import { createScene, updateSceneTheme } from './scene.js';
import { createCamera, updateCameraAspect } from './camera.js';
import { createRenderer, updateRendererSize } from './renderer.js';
import { createLights, updateLightsTheme } from './lights.js';
import { createParticleSystem, createConnectionLines } from './objects/particles.js';
import { createFloatingShapes, createWireframeShapes } from './objects/shapes.js';
import { startAnimationLoop, stopAnimationLoop, onFrame, applyMouseParallax } from './animations.js';

/**
 * Three.js visualization context
 */
let context = null;

/**
 * Mouse position for parallax effect
 */
const mousePosition = { x: 0, y: 0 };

/**
 * Initializes the Three.js visualization
 * @param {HTMLElement} container - DOM element to attach the canvas
 * @returns {Object} The visualization context
 */
export function initThreeJS(container) {
  // Create core components
  const scene = createScene();
  const camera = createCamera(window.innerWidth / window.innerHeight);
  const renderer = createRenderer(container);
  const lights = createLights(scene);
  
  // Create visual elements
  const particles = createParticleSystem(2000);
  scene.add(particles);
  
  const connectionLines = createConnectionLines(particles);
  scene.add(connectionLines);
  
  const shapes = createFloatingShapes();
  scene.add(shapes);
  
  const wireframes = createWireframeShapes();
  scene.add(wireframes);
  
  // Store context
  context = {
    scene,
    camera,
    renderer,
    lights,
    particles,
    connectionLines,
    shapes,
    wireframes,
  };
  
  // Set up event listeners
  setupEventListeners();
  
  // Register mouse parallax effect
  onFrame(() => {
    applyMouseParallax(camera, mousePosition, 0.3);
  });
  
  // Start animation loop
  startAnimationLoop(context);
  
  return context;
}

/**
 * Sets up event listeners for resize and mouse movement
 */
function setupEventListeners() {
  // Handle window resize
  window.addEventListener('resize', handleResize);
  
  // Handle mouse movement for parallax
  window.addEventListener('mousemove', handleMouseMove);
  
  // Handle touch for mobile parallax
  window.addEventListener('touchmove', handleTouchMove);
}

/**
 * Handles window resize
 */
function handleResize() {
  if (!context) return;
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  updateCameraAspect(context.camera, width / height);
  updateRendererSize(context.renderer);
}

/**
 * Handles mouse movement
 * @param {MouseEvent} event - Mouse event
 */
function handleMouseMove(event) {
  // Normalize mouse position to -1 to 1
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

/**
 * Handles touch movement
 * @param {TouchEvent} event - Touch event
 */
function handleTouchMove(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  }
}

/**
 * Updates the theme for the visualization
 * @param {string} theme - 'dark' or 'light'
 */
export function updateTheme(theme) {
  if (!context) return;
  
  updateSceneTheme(context.scene, theme);
  updateLightsTheme(context.lights, theme);
}

/**
 * Cleans up Three.js resources
 */
export function dispose() {
  if (!context) return;
  
  stopAnimationLoop();
  
  // Remove event listeners
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);
  
  // Dispose of geometries and materials
  context.scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
  
  // Dispose renderer
  context.renderer.dispose();
  
  context = null;
}

/**
 * Gets the current context
 * @returns {Object|null} The visualization context
 */
export function getContext() {
  return context;
}

export default {
  initThreeJS,
  updateTheme,
  dispose,
  getContext,
};
