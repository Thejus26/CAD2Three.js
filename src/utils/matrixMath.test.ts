import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createTransformMatrix, transformGeometry } from './matrixMath';

describe('matrixMath', () => {
  it('creates identity matrix by default when no options provided', () => {
    const matrix = createTransformMatrix({});
    const identity = new THREE.Matrix4().identity();
    expect(matrix.equals(identity)).toBe(true);
  });

  it('correctly composes translation, rotation, and scale into 4x4 matrix', () => {
    const translation = new THREE.Vector3(10, -5, 2);
    const scale = new THREE.Vector3(2, 2, 2);
    const rotation = new THREE.Euler(0, Math.PI / 2, 0);

    const matrix = createTransformMatrix({ translation, rotation, scale });
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const sca = new THREE.Vector3();

    matrix.decompose(pos, quat, sca);

    expect(pos.x).toBeCloseTo(10);
    expect(pos.y).toBeCloseTo(-5);
    expect(pos.z).toBeCloseTo(2);
    expect(sca.x).toBeCloseTo(2);
    expect(sca.y).toBeCloseTo(2);
    expect(sca.z).toBeCloseTo(2);
  });

  it('applies transform matrix to geometry vertices accurately', () => {
    const box = new THREE.BoxGeometry(2, 2, 2);
    const translation = new THREE.Vector3(5, 0, 0);
    const matrix = createTransformMatrix({ translation });

    const transformed = transformGeometry(box, matrix);
    expect(transformed.boundingBox?.min.x).toBeCloseTo(4);
    expect(transformed.boundingBox?.max.x).toBeCloseTo(6);
  });
});
