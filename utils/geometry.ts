import * as THREE from 'three';

export const PARTICLE_COUNT = 3000;

// Generate random positions for the "Explosion" / "Nebula" state
export const generateExplosionPositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 15 + Math.random() * 20; // Radius between 15 and 35
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

// Generate positions for the "Christmas Tree" state
export const generateTreePositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const height = 25;
  const maxRadius = 12;

  for (let i = 0; i < count; i++) {
    // Normalized height (0 at bottom, 1 at top)
    // We bias it slightly so there are more particles at the bottom volume-wise
    const hPercent = Math.pow(Math.random(), 0.8); 
    const y = -10 + hPercent * height; // Base at -10

    // Cone radius at this height
    const r = maxRadius * (1 - hPercent);

    // Spiral angle + random noise
    const angle = hPercent * 25 * Math.PI + (Math.random() * Math.PI * 2);
    
    // Add some volume thickness to the branches
    const volumeR = r * Math.sqrt(Math.random());

    const x = volumeR * Math.cos(angle);
    const z = volumeR * Math.sin(angle);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

export const generateColors = (count: number): Float32Array => {
  const colors = new Float32Array(count * 3);
  const colorPalette = [
    new THREE.Color('#FFD700'), // Gold
    new THREE.Color('#FFAA00'), // Bright Orange/Gold
    new THREE.Color('#50C878'), // Emerald Green
    new THREE.Color('#00FF00'), // Bright Lime
    new THREE.Color('#FF0033'), // Bright Red
    new THREE.Color('#00FFFF'), // Cyan Cyan
    new THREE.Color('#FFFFFF'), // Sparkle White
  ];

  for (let i = 0; i < count; i++) {
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    // Multiplier for HDR Glow effect
    const intensity = 2.5;
    colors[i * 3] = color.r * intensity;
    colors[i * 3 + 1] = color.g * intensity;
    colors[i * 3 + 2] = color.b * intensity;
  }
  return colors;
};