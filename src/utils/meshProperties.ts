import * as THREE from 'three';

export interface MeshProperties {
  volume: number;
  surfaceArea: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number];
  };
  vertexCount: number;
  triangleCount: number;
}

/**
 * Calculates geometric properties for a BufferGeometry.
 * Computes volume using the signed volume of triangles algorithm (divergence theorem).
 */
export function calculateMeshProperties(geometry: THREE.BufferGeometry): MeshProperties {
  // Ensure bounding box is computed
  geometry.computeBoundingBox();
  const box = geometry.boundingBox || new THREE.Box3();
  const size = new THREE.Vector3();
  box.getSize(size);

  const positionAttr = geometry.getAttribute('position');
  if (!positionAttr) {
    return {
      volume: 0,
      surfaceArea: 0,
      boundingBox: {
        min: [0, 0, 0],
        max: [0, 0, 0],
        dimensions: [0, 0, 0],
      },
      vertexCount: 0,
      triangleCount: 0,
    };
  }

  const vertexCount = positionAttr.count;
  const indexAttr = geometry.getIndex();
  const triangleCount = indexAttr ? indexAttr.count / 3 : vertexCount / 3;

  let totalVolume = 0;
  let totalSurfaceArea = 0;

  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  const getVertex = (index: number, target: THREE.Vector3) => {
    target.fromBufferAttribute(positionAttr, index);
  };

  const processTriangle = (iA: number, iB: number, iC: number) => {
    getVertex(iA, vA);
    getVertex(iB, vB);
    getVertex(iC, vC);

    // Signed volume contribution of tetrahedron (Origin, vA, vB, vC)
    // Signed Volume = (vA dot (vB x vC)) / 6
    const signedVolume = vA.dot(cb.crossVectors(vB, vC)) / 6.0;
    totalVolume += signedVolume;

    // Surface Area of triangle = 0.5 * || (vB - vA) x (vC - vA) ||
    cb.subVectors(vC, vA);
    ab.subVectors(vB, vA);
    cb.cross(ab);

    totalSurfaceArea += cb.length() * 0.5;
  };

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      processTriangle(indexAttr.getX(i), indexAttr.getX(i + 1), indexAttr.getX(i + 2));
    }
  } else {
    for (let i = 0; i < positionAttr.count; i += 3) {
      processTriangle(i, i + 1, i + 2);
    }
  }

  return {
    volume: Math.abs(totalVolume),
    surfaceArea: totalSurfaceArea,
    boundingBox: {
      min: [box.min.x, box.min.y, box.min.z],
      max: [box.max.x, box.max.y, box.max.z],
      dimensions: [size.x, size.y, size.z],
    },
    vertexCount,
    triangleCount,
  };
}
