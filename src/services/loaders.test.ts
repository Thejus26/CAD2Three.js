import * as THREE from 'three';
import { validateFileExtension, STLLoaderService, OBJLoaderService, fitCameraToSelection } from './loaders';

describe('Loaders Service', () => {
  describe('validateFileExtension', () => {
    it('validates supported file extensions (.stl, .obj)', () => {
      expect(validateFileExtension('model.stl')).toBe(true);
      expect(validateFileExtension('part.OBJ')).toBe(true);
      expect(validateFileExtension('image.png')).toBe(false);
      expect(validateFileExtension('document.pdf')).toBe(false);
    });
  });

  describe('STLLoaderService', () => {
    it('parses valid STL ArrayBuffer into BufferGeometry', () => {
      const service = new STLLoaderService();
      // Dummy ASCII STL header/content
      const stlContent = `solid cube
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 1 1 0
    endloop
  endfacet
endsolid cube`;
      const encoder = new TextEncoder();
      const buffer = encoder.encode(stlContent).buffer;

      const result = service.parse(buffer, 'test.stl');
      expect(result.name).toBe('test.stl');
      expect(result.geometry).toBeInstanceOf(THREE.BufferGeometry);
    });
  });

  describe('OBJLoaderService', () => {
    it('parses valid OBJ string into BufferGeometry', () => {
      const service = new OBJLoaderService();
      const objContent = `v 0 0 0
v 1 0 0
v 1 1 0
f 1 2 3`;

      const result = service.parse(objContent, 'test.obj');
      expect(result.name).toBe('test.obj');
      expect(result.geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('merges multiple geometries into a single BufferGeometry when parsing multi-object OBJ files', () => {
      const service = new OBJLoaderService();
      const multiObjContent = `o Object1
v 0 0 0
v 1 0 0
v 1 1 0
f 1 2 3

o Object2
v 2 2 2
v 3 2 2
v 3 3 2
f 1 2 3`;

      const result = service.parse(multiObjContent, 'multi.obj');
      expect(result.geometry).toBeInstanceOf(THREE.BufferGeometry);
      expect(result.geometry.attributes.position.count).toBe(6);
    });
  });

  describe('fitCameraToSelection', () => {
    it('adjusts camera position and controls target based on object bounding box', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const controls = { target: new THREE.Vector3(), update: vi.fn() };

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      const result = fitCameraToSelection(camera, controls, mesh);

      expect(controls.target.x).toBeCloseTo(0);
      expect(controls.target.y).toBeCloseTo(0);
      expect(controls.target.z).toBeCloseTo(0);
      expect(controls.update).toHaveBeenCalled();

      // Verify return value contains autoscale metrics
      expect(result.distance).toBeGreaterThan(0);
      expect(result.center).toBeInstanceOf(THREE.Vector3);
    });

    it('sets near clipping plane proportionally to prevent z-fighting', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const controls = { target: new THREE.Vector3(), update: vi.fn() };

      // Large model — near must scale up
      const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      fitCameraToSelection(camera, controls, mesh);

      expect(camera.near).toBeGreaterThan(0.01);
      expect(camera.near).toBeLessThanOrEqual(10);
      expect(camera.far).toBeGreaterThan(10000);
    });

    it('camera position changes from default after fitting (regression)', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.set(5, 5, 5); // default ISO position
      const controls = { target: new THREE.Vector3(), update: vi.fn() };

      const geometry = new THREE.BoxGeometry(200, 200, 200);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      fitCameraToSelection(camera, controls, mesh);

      // Camera should NOT still be at the default [5, 5, 5]
      const distFromDefault = camera.position.distanceTo(new THREE.Vector3(5, 5, 5));
      expect(distFromDefault).toBeGreaterThan(1);
    });
  });
});
