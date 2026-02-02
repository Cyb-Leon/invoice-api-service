/**
 * Camera Module
 * Creates and manages the perspective camera
 */
import * as THREE from 'three';

/**
 * Creates a perspective camera
 * @param {number} aspect - Aspect ratio (width/height)
 * @returns {THREE.PerspectiveCamera} The configured camera
 */
export function createCamera(aspect) {
  const camera = new THREE.PerspectiveCamera(
    60,           // Field of view
    aspect,       // Aspect ratio
    0.1,          // Near clipping plane
    1000          // Far clipping plane
  );
  
  camera.position.set(0, 0, 30);
  
  return camera;
}

/**
 * Updates camera aspect ratio and projection matrix
 * @param {THREE.PerspectiveCamera} camera - The camera to update
 * @param {number} aspect - New aspect ratio
 */
export function updateCameraAspect(camera, aspect) {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

/**
 * Smoothly moves camera to target position
 * @param {THREE.PerspectiveCamera} camera - The camera
 * @param {THREE.Vector3} targetPosition - Target position
 * @param {number} duration - Animation duration in seconds
 */
export function animateCameraTo(camera, targetPosition, duration = 1) {
  const startPosition = camera.position.clone();
  const startTime = performance.now();
  
  function update() {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    
    camera.position.lerpVectors(startPosition, targetPosition, eased);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

export default { createCamera, updateCameraAspect, animateCameraTo };
