import * as THREE from 'three';

export const MIN_ZOOM_DISTANCE = 0.1;
export const MAX_ZOOM_DISTANCE = 50000.0;
export const ZOOM_STEP_FACTOR = 0.1; // 10% zoom step

/**
 * Calculates new camera distance clamped strictly between min and max bounds.
 */
export function calculateClampedZoomDistance(
  currentDistance: number,
  deltaFactor: number,
  minDistance: number = MIN_ZOOM_DISTANCE,
  maxDistance: number = MAX_ZOOM_DISTANCE
): number {
  if (isNaN(currentDistance) || currentDistance <= 0) {
    currentDistance = 10;
  }
  
  const targetDistance = currentDistance * deltaFactor;
  return Math.min(Math.max(targetDistance, minDistance), maxDistance);
}

/**
 * Calculates zoom step factor for keyboard shortcuts (+ / -) or button clicks.
 */
export function getZoomStepFactor(direction: 'in' | 'out', stepRatio: number = ZOOM_STEP_FACTOR): number {
  return direction === 'in' ? (1.0 - stepRatio) : (1.0 + stepRatio);
}

/**
 * Applies zoom in/out step to an active camera and OrbitControls instance.
 */
export function applyZoomStep(
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  controls: { target: THREE.Vector3; update: () => void },
  direction: 'in' | 'out',
  minDistance: number = MIN_ZOOM_DISTANCE,
  maxDistance: number = MAX_ZOOM_DISTANCE
): number {
  const currentDistance = camera.position.distanceTo(controls.target);
  const factor = getZoomStepFactor(direction);
  const newDistance = calculateClampedZoomDistance(currentDistance, factor, minDistance, maxDistance);

  if (currentDistance > 0) {
    const ratio = newDistance / currentDistance;
    const directionVector = new THREE.Vector3().subVectors(camera.position, controls.target);
    directionVector.multiplyScalar(ratio);
    camera.position.copy(controls.target).add(directionVector);
    controls.update();
  }

  return newDistance;
}
