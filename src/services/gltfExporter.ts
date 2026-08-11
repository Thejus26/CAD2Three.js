import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';

export interface ExportOptions {
  binary?: boolean;
  dracoOptions?: {
    compressionLevel?: number;
  };
}

/**
 * Serializes a Three.js Object3D / Scene into a binary (.glb) or JSON (.gltf) ArrayBuffer
 */
export async function exportToGLTF(
  object: THREE.Object3D,
  options: ExportOptions = { binary: true }
): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter();

  return new Promise<ArrayBuffer>((resolve, reject) => {
    exporter.parse(
      object,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(result);
        } else {
          const jsonString = JSON.stringify(result, null, 2);
          const encoder = new TextEncoder();
          resolve(encoder.encode(jsonString).buffer);
        }
      },
      (error) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      },
      {
        binary: options.binary ?? true,
        embedImages: true,
      }
    );
  });
}
