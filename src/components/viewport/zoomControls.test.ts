import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  calculateClampedZoomDistance,
  getZoomStepFactor,
  applyZoomStep,
  MIN_ZOOM_DISTANCE,
  MAX_ZOOM_DISTANCE,
} from './zoomControls';

describe('zoomControls', () => {
  describe('calculateClampedZoomDistance', () => {
    it('calculates correct distance when scaling within bounds', () => {
      const dist = calculateClampedZoomDistance(10, 0.9); // zoom in 10%
      expect(dist).toBeCloseTo(9.0);
    });

    it('enforces EC-1 minimum zoom limit boundary (0.1 units)', () => {
      const dist = calculateClampedZoomDistance(0.15, 0.5); // would be 0.075
      expect(dist).toBe(MIN_ZOOM_DISTANCE);
    });

    it('enforces EC-2 maximum zoom limit boundary (500.0 units)', () => {
      const dist = calculateClampedZoomDistance(450, 1.5); // would be 675
      expect(dist).toBe(MAX_ZOOM_DISTANCE);
    });

    it('handles EC-3 invalid / NaN initial distance safely', () => {
      const dist = calculateClampedZoomDistance(NaN, 0.9);
      expect(dist).toBeGreaterThan(0);
      expect(isNaN(dist)).toBe(false);
    });
  });

  describe('getZoomStepFactor', () => {
    it('returns factor < 1 for zoom in', () => {
      expect(getZoomStepFactor('in')).toBeCloseTo(0.9);
    });

    it('returns factor > 1 for zoom out', () => {
      expect(getZoomStepFactor('out')).toBeCloseTo(1.1);
    });
  });

  describe('applyZoomStep', () => {
    it('updates camera position towards target when zooming in', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.set(0, 0, 10);
      const controls = {
        target: new THREE.Vector3(0, 0, 0),
        update: () => {},
      };

      const newDist = applyZoomStep(camera, controls, 'in');
      expect(newDist).toBeCloseTo(9.0);
      expect(camera.position.z).toBeCloseTo(9.0);
    });
  });
});
