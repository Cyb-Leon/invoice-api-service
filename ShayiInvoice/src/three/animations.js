/**
 * Animations Module
 * Main animation loop and coordination
 */
import { animateLights } from './lights.js';
import { animateParticles } from './objects/particles.js';
import { animateShapes, animateWireframes } from './objects/shapes.js';
import { render } from './renderer.js';

/**
 * Animation state
 */
const animationState = {
  isRunning: false,
  frameId: null,
  clock: null,
  callbacks: [],
};

/**
 * Starts the animation loop
 * @param {Object} context - Three.js context containing scene, camera, renderer, etc.
 */
export function startAnimationLoop(context) {
  if (animationState.isRunning) return;
  
  animationState.isRunning = true;
  animationState.clock = { startTime: performance.now() };
  
  function animate() {
    if (!animationState.isRunning) return;
    
    animationState.frameId = requestAnimationFrame(animate);
    
    const time = (performance.now() - animationState.clock.startTime) / 1000;
    
    // Animate all components
    if (context.lights) {
      animateLights(context.lights, time);
    }
    
    if (context.particles) {
      animateParticles(context.particles, time);
    }
    
    if (context.shapes) {
      animateShapes(context.shapes, time);
    }
    
    if (context.wireframes) {
      animateWireframes(context.wireframes, time);
    }
    
    // Execute registered callbacks
    animationState.callbacks.forEach(callback => callback(time));
    
    // Render the scene
    render(context.renderer, context.scene, context.camera);
  }
  
  animate();
}

/**
 * Stops the animation loop
 */
export function stopAnimationLoop() {
  animationState.isRunning = false;
  
  if (animationState.frameId) {
    cancelAnimationFrame(animationState.frameId);
    animationState.frameId = null;
  }
}

/**
 * Registers a callback to be executed each frame
 * @param {Function} callback - Function to call each frame (receives time parameter)
 * @returns {Function} Unsubscribe function
 */
export function onFrame(callback) {
  animationState.callbacks.push(callback);
  
  return () => {
    const index = animationState.callbacks.indexOf(callback);
    if (index > -1) {
      animationState.callbacks.splice(index, 1);
    }
  };
}

/**
 * Mouse parallax effect for camera
 * @param {THREE.Camera} camera - The camera to move
 * @param {Object} mousePosition - { x, y } normalized mouse position
 * @param {number} intensity - Effect intensity (default 0.5)
 */
export function applyMouseParallax(camera, mousePosition, intensity = 0.5) {
  const targetX = mousePosition.x * intensity * 5;
  const targetY = mousePosition.y * intensity * 3;
  
  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (targetY - camera.position.y) * 0.05;
  
  camera.lookAt(0, 0, 0);
}

/**
 * Creates a scroll-based animation effect
 * @param {THREE.Camera} camera - The camera to animate
 * @param {number} scrollProgress - Scroll progress (0-1)
 */
export function applyScrollEffect(camera, scrollProgress) {
  const startZ = 30;
  const endZ = 50;
  
  camera.position.z = startZ + (endZ - startZ) * scrollProgress;
}

/**
 * Transition effect when switching views
 * @param {THREE.Scene} scene - The scene
 * @param {string} viewName - Name of the view being transitioned to
 */
export function viewTransitionEffect(scene, viewName) {
  // Subtle camera shake effect
  const intensity = 0.5;
  const duration = 300;
  const startTime = performance.now();
  
  function shake() {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / duration;
    
    if (progress < 1) {
      const decay = 1 - progress;
      const shakeX = (Math.random() - 0.5) * intensity * decay;
      const shakeY = (Math.random() - 0.5) * intensity * decay;
      
      // Apply to fog or other scene elements if needed
      requestAnimationFrame(shake);
    }
  }
  
  shake();
}

export default {
  startAnimationLoop,
  stopAnimationLoop,
  onFrame,
  applyMouseParallax,
  applyScrollEffect,
  viewTransitionEffect,
};
