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
  });

  describe('fitCameraToSelection', () => {
    it('adjusts camera position and controls target based on object bounding box', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const controls = { target: new THREE.Vector3(), update: vi.fn() };

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      fitCameraToSelection(camera, controls, mesh);

      expect(controls.target.x).toBeCloseTo(0);
      expect(controls.target.y).toBeCloseTo(0);
      expect(controls.target.z).toBeCloseTo(0);
      expect(controls.update).toHaveBeenCalled();
    });
  });
});
