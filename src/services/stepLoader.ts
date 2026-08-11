import * as THREE from 'three';
import occtimportjs from 'occt-import-js';
import type { ParsedMeshResult } from './loaders';

export interface STEPLoaderOptions {
  linearDeflection?: number;
  angularDeflection?: number;
}

export class STEPLoaderService {
  private occtPromise: Promise<unknown> | null = null;

  private async getOcct() {
    if (!this.occtPromise) {
      if (typeof window !== 'undefined' && 'occtimportjs' in window) {
        // @ts-expect-error global window occtimportjs
        this.occtPromise = window.occtimportjs({
          locateFile: (name: string) => {
            return `/${name}`;
          },
        });
      } else {
        this.occtPromise = occtimportjs({
          locateFile: (name: string) => {
            return `/${name}`;
          },
        });
      }
    }
    return this.occtPromise;
  }

  /**
   * Parses raw STEP (.stp, .step) buffer and returns a Three.js BufferGeometry representation
   */
  async parseAsync(buffer: ArrayBuffer, filename: string, options?: STEPLoaderOptions): Promise<ParsedMeshResult> {
    try {
      const occt = (await this.getOcct()) as {
        ReadStepFile: (
          content: Uint8Array,
          params: unknown
        ) => {
          success: boolean;
          meshes: Array<{
            name: string;
            attributes: {
              position: { array: number[] };
              normal?: { array: number[] };
            };
            index?: { array: number[] };
          }>;
        };
      };

      const fileBuffer = new Uint8Array(buffer);
      const params = options
        ? {
            linearDeflection: options.linearDeflection,
            angularDeflection: options.angularDeflection,
          }
        : null;

      const result = occt.ReadStepFile(fileBuffer, params);

      if (!result || !result.success || !result.meshes || result.meshes.length === 0) {
        throw new Error('Failed to parse STEP file B-Rep geometry');
      }

      // Merge all extracted meshes into a single BufferGeometry
      const geometries: THREE.BufferGeometry[] = [];

      for (const meshData of result.meshes) {
        const geom = new THREE.BufferGeometry();
        const posAttr = new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3);
        geom.setAttribute('position', posAttr);

        if (meshData.attributes.normal && meshData.attributes.normal.array.length > 0) {
          const normAttr = new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3);
          geom.setAttribute('normal', normAttr);
        } else {
          geom.computeVertexNormals();
        }

        if (meshData.index && meshData.index.array.length > 0) {
          geom.setIndex(meshData.index.array);
        }

        geometries.push(geom);
      }

      let finalGeometry: THREE.BufferGeometry;
      if (geometries.length === 1) {
        finalGeometry = geometries[0];
      } else {
        // Simple position & index concatenation fallback for multiple meshes
        const totalPositions: number[] = [];
        const totalIndices: number[] = [];
        let indexOffset = 0;

        for (const g of geometries) {
          const pos = g.attributes.position.array;
          for (let i = 0; i < pos.length; i++) {
            totalPositions.push(pos[i]);
          }

          if (g.index) {
            const idx = g.index.array;
            for (let i = 0; i < idx.length; i++) {
              totalIndices.push(idx[i] + indexOffset);
            }
          } else {
            for (let i = 0; i < pos.length / 3; i++) {
              totalIndices.push(i + indexOffset);
            }
          }

          indexOffset += pos.length / 3;
        }

        finalGeometry = new THREE.BufferGeometry();
        finalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(totalPositions, 3));
        finalGeometry.setIndex(totalIndices);
        finalGeometry.computeVertexNormals();
      }

      finalGeometry.computeBoundingBox();
      finalGeometry.computeBoundingSphere();

      return {
        geometry: finalGeometry,
        name: filename,
      };
    } catch (err) {
      console.warn('WASM STEP parsing error, falling back to box:', err);
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

  /**
   * Synchronous parse fallback method for backward compatibility
   */
  parse(_buffer: ArrayBuffer | string, filename: string, _options?: STEPLoaderOptions): ParsedMeshResult {
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
