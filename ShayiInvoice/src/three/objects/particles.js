/**
 * Particles Module
 * Creates and animates particle systems
 */
import * as THREE from 'three';

/**
 * Creates a particle system for background atmosphere
 * @param {number} count - Number of particles
 * @returns {THREE.Points} The particle system
 */
export function createParticleSystem(count = 2000) {
  // Create geometry with random positions
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  // Color palette
  const colorPalette = [
    new THREE.Color(0x00d4aa), // Teal
    new THREE.Color(0x7c3aed), // Purple
    new THREE.Color(0xf59e0b), // Gold
    new THREE.Color(0x3b82f6), // Blue
  ];
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Random position in a sphere
    const radius = 50 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Random color from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Random size
    sizes[i] = Math.random() * 2 + 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create custom shader material for better looking particles
  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  
  const particles = new THREE.Points(geometry, material);
  particles.name = 'particles';
  
  return particles;
}

/**
 * Animates the particle system
 * @param {THREE.Points} particles - The particle system
 * @param {number} time - Current time in seconds
 */
export function animateParticles(particles, time) {
  if (!particles) return;
  
  particles.rotation.y = time * 0.02;
  particles.rotation.x = Math.sin(time * 0.01) * 0.1;
  
  // Subtle pulsing effect
  const positions = particles.geometry.attributes.position.array;
  const count = positions.length / 3;
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = positions[i3];
    const y = positions[i3 + 1];
    const z = positions[i3 + 2];
    
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y + z * z);
    
    // Subtle breathing effect
    const scale = 1 + Math.sin(time + distance * 0.01) * 0.02;
    positions[i3] = x * scale;
    positions[i3 + 1] = y * scale;
    positions[i3 + 2] = z * scale;
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
}

/**
 * Creates floating connection lines between nearby particles
 * @param {THREE.Points} particles - The particle system
 * @returns {THREE.LineSegments} The connection lines
 */
export function createConnectionLines(particles) {
  const positions = particles.geometry.attributes.position.array;
  const linePositions = [];
  const maxDistance = 15;
  const maxConnections = 200;
  let connectionCount = 0;
  
  for (let i = 0; i < positions.length / 3 && connectionCount < maxConnections; i += 10) {
    for (let j = i + 10; j < positions.length / 3 && connectionCount < maxConnections; j += 10) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < maxDistance) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
        connectionCount++;
      }
    }
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  
  const material = new THREE.LineBasicMaterial({
    color: 0x00d4aa,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
  });
  
  return new THREE.LineSegments(geometry, material);
}

export default { createParticleSystem, animateParticles, createConnectionLines };
