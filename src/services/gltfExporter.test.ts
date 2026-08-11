import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { exportToGLTF } from './gltfExporter';

describe('glTF/GLB Exporter Service', () => {
  it('serializes a Three.js scene mesh to binary GLB format', async () => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    scene.add(mesh);

    const buffer = await exportToGLTF(scene, { binary: true });
    expect(buffer).toBeInstanceOf(ArrayBuffer);
    expect(buffer.byteLength).toBeGreaterThan(0);
  });
});
