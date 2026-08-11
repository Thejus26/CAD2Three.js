import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { calculateAutoScale, calculateViewportResize } from './autoScaleMath';

describe('autoScaleMath', () => {
  describe('calculateAutoScale', () => {
    it('calculates correct camera distance and center for standard cube', () => {
      const box = new THREE.Box3(
        new THREE.Vector3(-5, -5, -5),
        new THREE.Vector3(5, 5, 5)
      );
      const result = calculateAutoScale({ boundingBox: box, fov: 50, offsetFactor: 1.4 });

      expect(result.center.x).toBeCloseTo(0);
      expect(result.center.y).toBeCloseTo(0);
      expect(result.center.z).toBeCloseTo(0);
      expect(result.size.x).toBeCloseTo(10);
      expect(result.size.y).toBeCloseTo(10);
      expect(result.size.z).toBeCloseTo(10);
      
      // maxDim = 10, fov = 50deg (0.8726 rad) -> tan(25deg) = 0.4663
      // dist = (5 / 0.4663) * 1.4 = 15.01
      expect(result.distance).toBeGreaterThan(10);
      expect(result.cameraPosition.x).toBeCloseTo(result.center.x + result.distance * 0.7);
    });

    it('handles EC-4 off-center origin models correctly', () => {
      const box = new THREE.Box3(
        new THREE.Vector3(100, 200, 300),
        new THREE.Vector3(110, 210, 310)
      );
      const result = calculateAutoScale({ boundingBox: box });

      expect(result.center.x).toBeCloseTo(105);
      expect(result.center.y).toBeCloseTo(205);
      expect(result.center.z).toBeCloseTo(305);
      expect(result.cameraPosition.x).toBeGreaterThan(105);
    });

    it('handles EC-2 empty / zero-volume bounding boxes gracefully', () => {
      const box = new THREE.Box3(); // empty box
      const result = calculateAutoScale({ boundingBox: box });

      expect(result.distance).toBeGreaterThan(0);
      expect(result.size.x).toBe(1);
      expect(isNaN(result.distance)).toBe(false);
    });

    it('handles EC-1 extreme aspect ratio / dimension models', () => {
      const box = new THREE.Box3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1000, 2, 1) // extremely long pipeline
      );
      const result = calculateAutoScale({ boundingBox: box });

      expect(result.size.x).toBe(1000);
      expect(result.distance).toBeGreaterThan(1000);
    });
  });

  describe('calculateViewportResize', () => {
    it('calculates aspect ratio for normal dimensions', () => {
      const result = calculateViewportResize({ width: 1920, height: 1080 });
      expect(result.valid).toBe(true);
      expect(result.aspect).toBeCloseTo(1.7777, 3);
    });

    it('handles EC-3 zero or negative dimensions (minimized tab)', () => {
      const resultZero = calculateViewportResize({ width: 0, height: 0 });
      expect(resultZero.valid).toBe(false);

      const resultNeg = calculateViewportResize({ width: -100, height: 500 });
      expect(resultNeg.valid).toBe(false);
    });
  });
});
