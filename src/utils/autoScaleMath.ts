import * as THREE from 'three';

export interface AutoScaleResult {
  distance: number;
  center: THREE.Vector3;
  size: THREE.Vector3;
  cameraPosition: THREE.Vector3;
}

/**
 * Calculates auto-scale camera distance and target position for a given object or bounding box.
 * 
 * FOV Formula: distance = (maxDimension / 2) / Math.tan((fov * Math.PI / 180) / 2) * offsetFactor
 */
export function calculateAutoScale({
  boundingBox,
  fov = 50,
  aspectRatio = 1.0,
  offsetFactor = 1.4,
}: {
  boundingBox: THREE.Box3;
  fov?: number;
  aspectRatio?: number;
  offsetFactor?: number;
}): AutoScaleResult {
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  if (boundingBox.isEmpty()) {
    // Fallback EC-2: Empty / Zero-Volume Geometries
    center.set(0, 0, 0);
    size.set(1, 1, 1);
  } else {
    boundingBox.getCenter(center);
    boundingBox.getSize(size);
  }

  // Handle EC-2: zero size length
  let maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim <= 0 || isNaN(maxDim)) {
    maxDim = 1.0;
  }

  // Account for aspect ratio if aspect < 1 (portrait viewport)
  const effectiveFov = aspectRatio < 1 
    ? 2 * Math.atan(Math.tan((fov * Math.PI / 180) / 2) / aspectRatio) * (180 / Math.PI)
    : fov;

  const fovRad = (effectiveFov * Math.PI) / 180;
  let distance = Math.abs((maxDim / 2) / Math.tan(fovRad / 2)) * offsetFactor;

  if (isNaN(distance) || distance <= 0) {
    distance = 10;
  }

  // ISO directional view offset centered on target center
  const offsetVector = new THREE.Vector3(distance * 0.7, distance * 0.7, distance * 0.7);
  const cameraPosition = center.clone().add(offsetVector);

  return {
    distance,
    center,
    size,
    cameraPosition,
  };
}

/**
 * Updates camera and canvas size handling aspect ratio edge cases.
 */
export function calculateViewportResize({
  width,
  height,
}: {
  width: number;
  height: number;
}): { aspect: number; valid: boolean } {
  // EC-3: Canvas dimensions <= 0 (e.g. background tab)
  if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
    return { aspect: 1.0, valid: false };
  }

  return { aspect: width / height, valid: true };
}
