import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { calculateMeshProperties } from './meshProperties';

describe('meshProperties calculation utility', () => {
  it('calculates properties for a 1x1x1 cube correctly', () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const props = calculateMeshProperties(geometry);

    expect(props.volume).toBeCloseTo(1.0, 4);
    expect(props.surfaceArea).toBeCloseTo(6.0, 4);
    expect(props.boundingBox.dimensions).toEqual([1, 1, 1]);
    expect(props.triangleCount).toBe(12);
  });

  it('calculates properties for a sphere correctly', () => {
    const radius = 2;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const props = calculateMeshProperties(geometry);

    const expectedVolume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const expectedSurfaceArea = 4 * Math.PI * Math.pow(radius, 2);

    expect(props.volume).toBeCloseTo(expectedVolume, 0);
    expect(props.surfaceArea).toBeCloseTo(expectedSurfaceArea, 0);
  });

  it('handles empty geometry gracefully', () => {
    const geometry = new THREE.BufferGeometry();
    const props = calculateMeshProperties(geometry);

    expect(props.volume).toBe(0);
    expect(props.surfaceArea).toBe(0);
    expect(props.vertexCount).toBe(0);
    expect(props.triangleCount).toBe(0);
  });
});
