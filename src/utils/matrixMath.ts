import * as THREE from 'three';

export interface MatrixTransformOptions {
  translation?: THREE.Vector3;
  rotation?: THREE.Euler; // in radians
  scale?: THREE.Vector3;
}

/**
 * Computes a 4x4 matrix from translation, euler rotation, and scale parameters.
 */
export function createTransformMatrix(options: MatrixTransformOptions): THREE.Matrix4 {
  const position = options.translation || new THREE.Vector3(0, 0, 0);
  const quaternion = new THREE.Quaternion();
  if (options.rotation) {
    quaternion.setFromEuler(options.rotation);
  }
  const scale = options.scale || new THREE.Vector3(1, 1, 1);

  const matrix = new THREE.Matrix4();
  matrix.compose(position, quaternion, scale);
  return matrix;
}

/**
 * Applies a 4x4 transform matrix directly to geometry vertex attributes.
 */
export function transformGeometry(geometry: THREE.BufferGeometry, matrix: THREE.Matrix4): THREE.BufferGeometry {
  const cloned = geometry.clone();
  cloned.applyMatrix4(matrix);
  cloned.computeVertexNormals();
  cloned.computeBoundingBox();
  cloned.computeBoundingSphere();
  return cloned;
}
