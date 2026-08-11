import * as THREE from 'three';
import { OCCMemoryManager, type DisposableHandle } from './occMemory';

export interface MemoryReport {
  webglGeometries: number;
  webglTextures: number;
  activeOccHandles: number;
  estimatedMemoryBytes: number;
  memoryWarning: boolean;
}

export class SceneMemoryAuditor {
  private occManager: OCCMemoryManager;
  private trackedGeometries: Set<THREE.BufferGeometry> = new Set();
  private trackedMaterials: Set<THREE.Material> = new Set();

  constructor(occManager?: OCCMemoryManager) {
    this.occManager = occManager || new OCCMemoryManager();
  }

  /**
   * Registers a Three.js Mesh or Object3D hierarchy for memory tracking.
   */
  trackObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          this.trackedGeometries.add(mesh.geometry);
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => this.trackedMaterials.add(mat));
          } else {
            this.trackedMaterials.add(mesh.material);
          }
        }
      }
    });
  }

  /**
   * Registers an OCC handle for memory auditing.
   */
  trackOccHandle<T extends DisposableHandle>(handle: T): T {
    return this.occManager.track(handle);
  }

  /**
   * Returns a complete audit report of current memory footprint.
   */
  getReport(renderer?: THREE.WebGLRenderer): MemoryReport {
    let webglGeometries = this.trackedGeometries.size;
    let webglTextures = 0;

    if (renderer) {
      const info = renderer.info.memory;
      webglGeometries = info.geometries;
      webglTextures = info.textures;
    }

    let estimatedBytes = 0;
    this.trackedGeometries.forEach((geom) => {
      for (const attrName in geom.attributes) {
        const attr = geom.attributes[attrName];
        estimatedBytes += attr.array.byteLength;
      }
      if (geom.index) {
        estimatedBytes += geom.index.array.byteLength;
      }
    });

    // 500MB warning threshold
    const memoryWarning = estimatedBytes > 500 * 1024 * 1024;

    return {
      webglGeometries,
      webglTextures,
      activeOccHandles: this.occManager.trackedCount,
      estimatedMemoryBytes: estimatedBytes,
      memoryWarning,
    };
  }

  /**
   * Disposes all tracked Three.js geometries, materials, and WASM OCC C++ handles.
   */
  disposeAll(): void {
    this.trackedGeometries.forEach((geom) => geom.dispose());
    this.trackedMaterials.forEach((mat) => mat.dispose());
    this.trackedGeometries.clear();
    this.trackedMaterials.clear();
    this.occManager.disposeAll();
  }
}
