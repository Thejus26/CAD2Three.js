import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { calculateDistance, calculateAngle, findNearestVertex } from './measurementMath';

describe('measurementMath', () => {
  describe('calculateDistance', () => {
    it('calculates accurate distance between two 3D points', () => {
      const p1 = new THREE.Vector3(0, 0, 0);
      const p2 = new THREE.Vector3(3, 4, 0);
      const result = calculateDistance(p1, p2);

      expect(result.distance).toBeCloseTo(5, 5);
      expect(result.pointA).toEqual(p1);
      expect(result.pointB).toEqual(p2);
    });

    it('returns zero for identical points', () => {
      const p1 = new THREE.Vector3(10, -5, 2.5);
      const result = calculateDistance(p1, p1);
      expect(result.distance).toBe(0);
    });
  });

  describe('calculateAngle', () => {
    it('calculates 90 degree angle correctly', () => {
      const vA = new THREE.Vector3(1, 0, 0);
      const vB = new THREE.Vector3(0, 0, 0);
      const vC = new THREE.Vector3(0, 1, 0);

      const result = calculateAngle(vA, vB, vC);
      expect(result.angleDegrees).toBeCloseTo(90, 5);
      expect(result.angleRadians).toBeCloseTo(Math.PI / 2, 5);
    });

    it('calculates 180 degree straight angle', () => {
      const vA = new THREE.Vector3(-1, 0, 0);
      const vB = new THREE.Vector3(0, 0, 0);
      const vC = new THREE.Vector3(1, 0, 0);

      const result = calculateAngle(vA, vB, vC);
      expect(result.angleDegrees).toBeCloseTo(180, 5);
    });

    it('calculates 45 degree angle', () => {
      const vA = new THREE.Vector3(1, 0, 0);
      const vB = new THREE.Vector3(0, 0, 0);
      const vC = new THREE.Vector3(1, 1, 0);

      const result = calculateAngle(vA, vB, vC);
      expect(result.angleDegrees).toBeCloseTo(45, 5);
    });
  });

  describe('findNearestVertex', () => {
    it('snaps hit point to the closest mesh vertex within tolerance', () => {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      // Box corners are at (+/-1, +/-1, +/-1)
      const hitPoint = new THREE.Vector3(0.95, 0.98, 1.02);
      const snapped = findNearestVertex(geometry, hitPoint);

      expect(snapped.x).toBeCloseTo(1, 5);
      expect(snapped.y).toBeCloseTo(1, 5);
      expect(snapped.z).toBeCloseTo(1, 5);
    });

    it('applies world matrix transformation when provided', () => {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const matrixWorld = new THREE.Matrix4().makeTranslation(10, 0, 0);
      const hitPoint = new THREE.Vector3(10.95, 0.98, 1.02);

      const snapped = findNearestVertex(geometry, hitPoint, matrixWorld);
      expect(snapped.x).toBeCloseTo(11, 5);
      expect(snapped.y).toBeCloseTo(1, 5);
      expect(snapped.z).toBeCloseTo(1, 5);
    });
  });
});
