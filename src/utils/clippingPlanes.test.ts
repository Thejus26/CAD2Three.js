import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createClippingPlanes, getClippingRanges, INITIAL_CLIPPING_STATE, type ClippingPlanesState } from './clippingPlanes';

describe('clippingPlanes', () => {
  describe('createClippingPlanes', () => {
    it('returns empty array when global sectioning is disabled', () => {
      const state: ClippingPlanesState = {
        ...INITIAL_CLIPPING_STATE,
        enabled: false,
        x: { enabled: true, constant: 5, negate: false },
      };
      const planes = createClippingPlanes(state);
      expect(planes).toHaveLength(0);
    });

    it('creates active X axis clipping plane with correct normal and constant', () => {
      const state: ClippingPlanesState = {
        enabled: true,
        x: { enabled: true, constant: 4.5, negate: false },
        y: { enabled: false, constant: 0, negate: false },
        z: { enabled: false, constant: 0, negate: false },
      };
      const planes = createClippingPlanes(state);
      expect(planes).toHaveLength(1);
      expect(planes[0].normal).toEqual(new THREE.Vector3(-1, 0, 0));
      expect(planes[0].constant).toBe(4.5);
    });

    it('reverses plane normal direction when negate is true', () => {
      const state: ClippingPlanesState = {
        enabled: true,
        x: { enabled: false, constant: 0, negate: false },
        y: { enabled: true, constant: -2.0, negate: true },
        z: { enabled: false, constant: 0, negate: false },
      };
      const planes = createClippingPlanes(state);
      expect(planes).toHaveLength(1);
      expect(planes[0].normal).toEqual(new THREE.Vector3(0, 1, 0));
      expect(planes[0].constant).toBe(-2.0);
    });

    it('creates multiple clipping planes when multiple axes are enabled', () => {
      const state: ClippingPlanesState = {
        enabled: true,
        x: { enabled: true, constant: 1, negate: false },
        y: { enabled: true, constant: 2, negate: false },
        z: { enabled: true, constant: 3, negate: false },
      };
      const planes = createClippingPlanes(state);
      expect(planes).toHaveLength(3);
    });
  });

  describe('getClippingRanges', () => {
    it('returns default fallback bounds when geometry is null', () => {
      const ranges = getClippingRanges(null);
      expect(ranges).toEqual({
        xMin: -10, xMax: 10,
        yMin: -10, yMax: 10,
        zMin: -10, zMax: 10,
      });
    });

    it('calculates min/max bounds based on geometry bounding box', () => {
      const geometry = new THREE.BoxGeometry(10, 20, 30);
      const ranges = getClippingRanges(geometry);

      expect(ranges.xMin).toBeLessThanOrEqual(-5);
      expect(ranges.xMax).toBeGreaterThanOrEqual(5);
      expect(ranges.yMin).toBeLessThanOrEqual(-10);
      expect(ranges.yMax).toBeGreaterThanOrEqual(10);
      expect(ranges.zMin).toBeLessThanOrEqual(-15);
      expect(ranges.zMax).toBeGreaterThanOrEqual(15);
    });
  });
});
