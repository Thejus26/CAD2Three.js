import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { calculateAutoScale } from '@/utils/autoScaleMath';

export interface ParsedMeshResult {
  geometry: THREE.BufferGeometry;
  materials?: THREE.Material[];
  name: string;
}

export const SUPPORTED_EXTENSIONS = ['.stl', '.obj', '.stp', '.step', '.igs', '.iges', '.ifc'];

export const validateFileExtension = (filename: string): boolean => {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
};

export class STLLoaderService {
  private loader: STLLoader;

  constructor() {
    this.loader = new STLLoader();
  }

  parse(buffer: ArrayBuffer, filename: string): ParsedMeshResult {
    const geometry = this.loader.parse(buffer);
    geometry.computeVertexNormals();
    return {
      geometry,
      name: filename,
    };
  }
}

export class OBJLoaderService {
  private loader: OBJLoader;

  constructor() {
    this.loader = new OBJLoader();
  }

  parse(text: string, filename: string): ParsedMeshResult {
    const objGroup = this.loader.parse(text);
    const geometries: THREE.BufferGeometry[] = [];

    objGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        geometries.push(mesh.geometry.clone());
      }
    });

    let finalGeometry: THREE.BufferGeometry;
    if (geometries.length === 1) {
      finalGeometry = geometries[0];
    } else if (geometries.length > 1) {
      // Merge multiple geometries into one for display
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
        g.dispose();
      }

      finalGeometry = new THREE.BufferGeometry();
      finalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(totalPositions, 3));
      finalGeometry.setIndex(totalIndices);
    } else {
      finalGeometry = new THREE.BufferGeometry();
    }

    finalGeometry.computeVertexNormals();
    return {
      geometry: finalGeometry,
      name: filename,
    };
  }
}

export interface FitCameraResult {
  distance: number;
  center: THREE.Vector3;
}

export const fitCameraToSelection = (
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  controls: { target: THREE.Vector3; update: () => void },
  object: THREE.Object3D,
  offset = 1.6
): FitCameraResult => {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const fov = (camera as THREE.PerspectiveCamera).fov || 50;
  const aspect = (camera as THREE.PerspectiveCamera).aspect || 1.0;

  const { center, cameraPosition, distance } = calculateAutoScale({
    boundingBox,
    fov,
    aspectRatio: aspect,
    offsetFactor: offset,
  });

  // Adjust near and far clipping planes dynamically so large CAD models
  // are never clipped and small models don't suffer z-fighting.
  if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.near = Math.max(0.01, Math.min(10, distance * 0.001));
    perspCam.far = Math.max(10000, distance * 10);
    perspCam.updateProjectionMatrix();
  }

  camera.position.copy(cameraPosition);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();

  return { distance, center };
};
