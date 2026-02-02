/**
 * Shapes Module
 * Creates floating geometric shapes for visual interest
 */
import * as THREE from 'three';

/**
 * Creates a group of floating geometric shapes
 * @returns {THREE.Group} Group containing all shapes
 */
export function createFloatingShapes() {
  const group = new THREE.Group();
  group.name = 'floatingShapes';
  
  // Material definitions with glass-like appearance
  const materials = {
    teal: new THREE.MeshPhysicalMaterial({
      color: 0x00d4aa,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      transmission: 0.5,
      thickness: 1,
    }),
    purple: new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      transmission: 0.5,
      thickness: 1,
    }),
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    }),
    blue: new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      transmission: 0.5,
      thickness: 1,
    }),
  };
  
  // Create various geometric shapes
  const shapes = [
    // Icosahedrons (20-sided)
    {
      geometry: new THREE.IcosahedronGeometry(3, 0),
      material: materials.teal,
      position: new THREE.Vector3(-25, 10, -20),
      rotationSpeed: { x: 0.01, y: 0.015, z: 0 },
      floatSpeed: 0.5,
      floatAmount: 3,
    },
    {
      geometry: new THREE.IcosahedronGeometry(2, 0),
      material: materials.purple,
      position: new THREE.Vector3(20, -5, -15),
      rotationSpeed: { x: 0.015, y: 0.01, z: 0.005 },
      floatSpeed: 0.7,
      floatAmount: 2,
    },
    
    // Octahedrons (8-sided)
    {
      geometry: new THREE.OctahedronGeometry(2.5, 0),
      material: materials.gold,
      position: new THREE.Vector3(15, 15, -25),
      rotationSpeed: { x: 0.008, y: 0.012, z: 0.01 },
      floatSpeed: 0.4,
      floatAmount: 4,
    },
    {
      geometry: new THREE.OctahedronGeometry(1.5, 0),
      material: materials.teal,
      position: new THREE.Vector3(-15, -10, -10),
      rotationSpeed: { x: 0.012, y: 0.008, z: 0.015 },
      floatSpeed: 0.6,
      floatAmount: 2.5,
    },
    
    // Dodecahedrons (12-sided)
    {
      geometry: new THREE.DodecahedronGeometry(2, 0),
      material: materials.blue,
      position: new THREE.Vector3(0, 20, -30),
      rotationSpeed: { x: 0.005, y: 0.01, z: 0.008 },
      floatSpeed: 0.35,
      floatAmount: 5,
    },
    
    // Torus knots
    {
      geometry: new THREE.TorusKnotGeometry(2, 0.5, 100, 16),
      material: materials.purple,
      position: new THREE.Vector3(-20, -15, -25),
      rotationSpeed: { x: 0.01, y: 0.005, z: 0.008 },
      floatSpeed: 0.45,
      floatAmount: 3.5,
    },
    
    // Rings/Torus
    {
      geometry: new THREE.TorusGeometry(3, 0.3, 16, 50),
      material: materials.gold,
      position: new THREE.Vector3(25, 5, -35),
      rotationSpeed: { x: 0.015, y: 0.02, z: 0 },
      floatSpeed: 0.55,
      floatAmount: 4,
    },
    
    // Small accent shapes
    {
      geometry: new THREE.TetrahedronGeometry(1, 0),
      material: materials.teal,
      position: new THREE.Vector3(-8, 8, -5),
      rotationSpeed: { x: 0.02, y: 0.015, z: 0.01 },
      floatSpeed: 0.8,
      floatAmount: 1.5,
    },
    {
      geometry: new THREE.TetrahedronGeometry(0.8, 0),
      material: materials.purple,
      position: new THREE.Vector3(10, -8, -8),
      rotationSpeed: { x: 0.015, y: 0.02, z: 0.012 },
      floatSpeed: 0.9,
      floatAmount: 1.2,
    },
  ];
  
  // Create meshes and store animation data
  shapes.forEach((shapeData, index) => {
    const mesh = new THREE.Mesh(shapeData.geometry, shapeData.material);
    mesh.position.copy(shapeData.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Store animation data in userData
    mesh.userData = {
      rotationSpeed: shapeData.rotationSpeed,
      floatSpeed: shapeData.floatSpeed,
      floatAmount: shapeData.floatAmount,
      initialY: shapeData.position.y,
      phase: index * 0.5, // Offset phase for varied motion
    };
    
    group.add(mesh);
  });
  
  return group;
}

/**
 * Animates the floating shapes
 * @param {THREE.Group} shapesGroup - The group of shapes
 * @param {number} time - Current time in seconds
 */
export function animateShapes(shapesGroup, time) {
  if (!shapesGroup) return;
  
  shapesGroup.children.forEach((mesh) => {
    const { rotationSpeed, floatSpeed, floatAmount, initialY, phase } = mesh.userData;
    
    // Rotation animation
    mesh.rotation.x += rotationSpeed.x;
    mesh.rotation.y += rotationSpeed.y;
    mesh.rotation.z += rotationSpeed.z;
    
    // Floating animation
    mesh.position.y = initialY + Math.sin(time * floatSpeed + phase) * floatAmount;
    
    // Subtle horizontal drift
    mesh.position.x += Math.sin(time * 0.1 + phase) * 0.01;
  });
}

/**
 * Creates wireframe versions of the shapes for a different visual effect
 * @returns {THREE.Group} Group containing wireframe shapes
 */
export function createWireframeShapes() {
  const group = new THREE.Group();
  group.name = 'wireframeShapes';
  
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x00d4aa,
    transparent: true,
    opacity: 0.3,
  });
  
  const geometries = [
    new THREE.IcosahedronGeometry(8, 1),
    new THREE.OctahedronGeometry(6, 1),
    new THREE.DodecahedronGeometry(5, 1),
  ];
  
  geometries.forEach((geometry, index) => {
    const edges = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(edges, wireframeMaterial.clone());
    
    wireframe.position.set(
      (index - 1) * 30,
      0,
      -50
    );
    
    wireframe.userData = {
      rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 },
    };
    
    group.add(wireframe);
  });
  
  return group;
}

/**
 * Animates wireframe shapes
 * @param {THREE.Group} wireframeGroup - The wireframe group
 * @param {number} time - Current time in seconds
 */
export function animateWireframes(wireframeGroup, time) {
  if (!wireframeGroup) return;
  
  wireframeGroup.children.forEach((wireframe) => {
    const { rotationSpeed } = wireframe.userData;
    wireframe.rotation.x += rotationSpeed.x;
    wireframe.rotation.y += rotationSpeed.y;
    wireframe.rotation.z += rotationSpeed.z;
  });
}

export default { createFloatingShapes, animateShapes, createWireframeShapes, animateWireframes };
