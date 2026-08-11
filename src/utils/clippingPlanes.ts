import * as THREE from 'three';

export interface AxisClippingState {
  enabled: boolean;
  constant: number; // plane displacement from origin along normal
  negate: boolean;   // reverse normal direction
}

export interface ClippingPlanesState {
  enabled: boolean;
  x: AxisClippingState;
  y: AxisClippingState;
  z: AxisClippingState;
}

export const INITIAL_CLIPPING_STATE: ClippingPlanesState = {
  enabled: false,
  x: { enabled: false, constant: 0, negate: false },
  y: { enabled: false, constant: 0, negate: false },
  z: { enabled: false, constant: 0, negate: false },
};

/**
 * Creates THREE.Plane objects based on axis clipping settings.
 */
export function createClippingPlanes(state: ClippingPlanesState): THREE.Plane[] {
  if (!state.enabled) return [];

  const planes: THREE.Plane[] = [];

  if (state.x.enabled) {
    const normal = new THREE.Vector3(state.x.negate ? 1 : -1, 0, 0);
    planes.push(new THREE.Plane(normal, state.x.constant));
  }

  if (state.y.enabled) {
    const normal = new THREE.Vector3(0, state.y.negate ? 1 : -1, 0);
    planes.push(new THREE.Plane(normal, state.y.constant));
  }

  if (state.z.enabled) {
    const normal = new THREE.Vector3(0, 0, state.z.negate ? 1 : -1);
    planes.push(new THREE.Plane(normal, state.z.constant));
  }

  return planes;
}

/**
 * Computes bounding box limits along each axis for slider ranges.
 */
export function getClippingRanges(geometry: THREE.BufferGeometry | null): {
  xMin: number; xMax: number;
  yMin: number; yMax: number;
  zMin: number; zMax: number;
} {
  if (!geometry) {
    return { xMin: -10, xMax: 10, yMin: -10, yMax: 10, zMin: -10, zMax: 10 };
  }

  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }

  const box = geometry.boundingBox!;
  return {
    xMin: Math.floor(box.min.x - 2),
    xMax: Math.ceil(box.max.x + 2),
    yMin: Math.floor(box.min.y - 2),
    yMax: Math.ceil(box.max.y + 2),
    zMin: Math.floor(box.min.z - 2),
    zMax: Math.ceil(box.max.z + 2),
  };
}
