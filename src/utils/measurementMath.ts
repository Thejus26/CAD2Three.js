import * as THREE from 'three';

export interface DistanceResult {
  distance: number; // in units (e.g. mm)
  pointA: THREE.Vector3;
  pointB: THREE.Vector3;
}

export interface AngleResult {
  angleDegrees: number; // in degrees [0, 180]
  angleRadians: number;
  vertexA: THREE.Vector3;
  vertexB: THREE.Vector3; // vertex center/pivot
  vertexC: THREE.Vector3;
}

export interface ClippingPlaneConfig {
  axis: 'x' | 'y' | 'z';
  constant: number;
  negate: boolean;
}

/**
 * Calculates Euclidean distance between two 3D points.
 */
export function calculateDistance(pointA: THREE.Vector3, pointB: THREE.Vector3): DistanceResult {
  const distance = pointA.distanceTo(pointB);
  return {
    distance,
    pointA: pointA.clone(),
    pointB: pointB.clone(),
  };
}

/**
 * Calculates the angle in degrees between three points, with vertexB as the vertex/pivot.
 */
export function calculateAngle(vertexA: THREE.Vector3, vertexB: THREE.Vector3, vertexC: THREE.Vector3): AngleResult {
  const vecBA = new THREE.Vector3().subVectors(vertexA, vertexB).normalize();
  const vecBC = new THREE.Vector3().subVectors(vertexC, vertexB).normalize();

  const dot = THREE.MathUtils.clamp(vecBA.dot(vecBC), -1, 1);
  const angleRadians = Math.acos(dot);
  const angleDegrees = THREE.MathUtils.radToDeg(angleRadians);

  return {
    angleDegrees,
    angleRadians,
    vertexA: vertexA.clone(),
    vertexB: vertexB.clone(),
    vertexC: vertexC.clone(),
  };
}

/**
 * Finds the nearest vertex position on a geometry given a target raycast hit point.
 */
export function findNearestVertex(geometry: THREE.BufferGeometry, hitPoint: THREE.Vector3, matrixWorld?: THREE.Matrix4): THREE.Vector3 {
  const positionAttr = geometry.getAttribute('position');
  if (!positionAttr) {
    return hitPoint.clone();
  }

  let minSqDist = Infinity;
  const closestVertex = hitPoint.clone();
  const tempVec = new THREE.Vector3();

  for (let i = 0; i < positionAttr.count; i++) {
    tempVec.fromBufferAttribute(positionAttr, i);
    if (matrixWorld) {
      tempVec.applyMatrix4(matrixWorld);
    }
    const sqDist = tempVec.distanceToSquared(hitPoint);
    if (sqDist < minSqDist) {
      minSqDist = sqDist;
      closestVertex.copy(tempVec);
    }
  }

  return closestVertex;
}
