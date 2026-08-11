import React from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { findNearestVertex, calculateDistance, calculateAngle } from '@/utils/measurementMath';

export type ToolMode = 'none' | 'distance' | 'angle';

export interface DistanceMeasurement {
  id: string;
  pointA: THREE.Vector3;
  pointB: THREE.Vector3;
  distance: number;
}

export interface AngleMeasurement {
  id: string;
  vertexA: THREE.Vector3;
  vertexB: THREE.Vector3;
  vertexC: THREE.Vector3;
  angleDegrees: number;
}

interface PrecisionToolsOverlayProps {
  toolMode: ToolMode;
  targetMeshRef?: React.RefObject<THREE.Mesh | null>;
  distances: DistanceMeasurement[];
  angles: AngleMeasurement[];
  onAddDistance: (measurement: DistanceMeasurement) => void;
  onAddAngle: (measurement: AngleMeasurement) => void;
}

export const PrecisionToolsOverlay: React.FC<PrecisionToolsOverlayProps> = ({
  toolMode,
  targetMeshRef,
  distances,
  angles,
  onAddDistance,
  onAddAngle,
}) => {
  const [activePoints, setActivePoints] = React.useState<THREE.Vector3[]>([]);
  const [hoverPoint, setHoverPoint] = React.useState<THREE.Vector3 | null>(null);

  const handlePointerMove = (e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
    if (toolMode === 'none') return;
    e.stopPropagation();
    const rawHit = e.point;
    const targetMesh = targetMeshRef?.current;
    if (targetMesh && targetMesh.geometry) {
      const snapped = findNearestVertex(targetMesh.geometry, rawHit, targetMesh.matrixWorld);
      setHoverPoint(snapped);
    } else {
      setHoverPoint(rawHit);
    }
  };

  const handlePointerDown = (e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
    if (toolMode === 'none') return;
    e.stopPropagation();
    const rawHit = e.point;
    const targetMesh = targetMeshRef?.current;
    const pt = targetMesh && targetMesh.geometry
      ? findNearestVertex(targetMesh.geometry, rawHit, targetMesh.matrixWorld)
      : rawHit;

    if (toolMode === 'distance') {
      if (activePoints.length === 0) {
        setActivePoints([pt]);
      } else if (activePoints.length === 1) {
        const pA = activePoints[0];
        const pB = pt;
        const res = calculateDistance(pA, pB);
        onAddDistance({
          id: `dist-${Date.now()}`,
          pointA: res.pointA,
          pointB: res.pointB,
          distance: res.distance,
        });
        setActivePoints([]);
      }
    } else if (toolMode === 'angle') {
      if (activePoints.length < 2) {
        setActivePoints((prev) => [...prev, pt]);
      } else if (activePoints.length === 2) {
        const vA = activePoints[0];
        const vB = activePoints[1];
        const vC = pt;
        const res = calculateAngle(vA, vB, vC);
        onAddAngle({
          id: `ang-${Date.now()}`,
          vertexA: res.vertexA,
          vertexB: res.vertexB,
          vertexC: res.vertexC,
          angleDegrees: res.angleDegrees,
        });
        setActivePoints([]);
      }
    }
  };

  return (
    <group onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}>
      {/* Target hit catcher mesh if active */}
      {toolMode !== 'none' && (
        <mesh visible={false}>
          <boxGeometry args={[100, 100, 100]} />
          <meshBasicMaterial />
        </mesh>
      )}

      {/* Snap Indicator Marker */}
      {hoverPoint && toolMode !== 'none' && (
        <mesh position={hoverPoint}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#f9e2af" wireframe />
        </mesh>
      )}

      {/* Active Draft Points */}
      {activePoints.map((pt, i) => (
        <mesh key={`draft-${i}`} position={pt}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#a6e3a1" />
        </mesh>
      ))}

      {/* Active Line preview while picking distance points */}
      {toolMode === 'distance' && activePoints.length === 1 && hoverPoint && (
        <Line points={[activePoints[0], hoverPoint]} color="#f9e2af" lineWidth={2} dashed />
      )}

      {/* Render Saved Distance Measurements */}
      {distances.map((dist) => {
        const midPoint = new THREE.Vector3()
          .addVectors(dist.pointA, dist.pointB)
          .multiplyScalar(0.5);

        return (
          <React.Fragment key={dist.id}>
            <Line points={[dist.pointA, dist.pointB]} color="#89b4fa" lineWidth={3} />
            <mesh position={dist.pointA}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#89b4fa" />
            </mesh>
            <mesh position={dist.pointB}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#89b4fa" />
            </mesh>
            <Html position={midPoint} center distanceFactor={15}>
              <div
                style={{
                  background: 'rgba(17, 17, 27, 0.85)',
                  color: '#89b4fa',
                  border: '1px solid #89b4fa',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                📏 {dist.distance.toFixed(2)} mm
              </div>
            </Html>
          </React.Fragment>
        );
      })}

      {/* Render Saved Angle Measurements */}
      {angles.map((ang) => (
        <React.Fragment key={ang.id}>
          <Line points={[ang.vertexA, ang.vertexB, ang.vertexC]} color="#a6e3a1" lineWidth={3} />
          <mesh position={ang.vertexB}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#a6e3a1" />
          </mesh>
          <Html position={ang.vertexB} center distanceFactor={15}>
            <div
              style={{
                background: 'rgba(17, 17, 27, 0.85)',
                color: '#a6e3a1',
                border: '1px solid #a6e3a1',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                backdropFilter: 'blur(4px)',
                marginTop: '-24px',
              }}
            >
              📐 {ang.angleDegrees.toFixed(1)}°
            </div>
          </Html>
        </React.Fragment>
      ))}
    </group>
  );
};
