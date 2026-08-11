import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';

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
      finalGeometry = geometries[0];
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

export const fitCameraToSelection = (
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  controls: { target: THREE.Vector3; update: () => void },
  object: THREE.Object3D,
  offset = 1.4
) => {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * offset;

  if (isNaN(cameraZ) || cameraZ === 0) {
    cameraZ = 10;
  }

  camera.position.set(center.x + cameraZ * 0.7, center.y + cameraZ * 0.7, center.z + cameraZ * 0.7);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
};
