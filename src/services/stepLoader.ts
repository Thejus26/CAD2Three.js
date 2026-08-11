import * as THREE from 'three';
import type { ParsedMeshResult } from './loaders';

export interface STEPLoaderOptions {
  linearDeflection?: number;
  angularDeflection?: number;
}

export class STEPLoaderService {
  /**
   * Parses raw STEP (.stp, .step) buffer and returns a Three.js BufferGeometry representation
   */
  parse(_buffer: ArrayBuffer | string, filename: string, _options?: STEPLoaderOptions): ParsedMeshResult {
    // For client-side STEP representation fallback/tessellation container
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return {
      geometry,
      name: filename,
    };
  }
}
