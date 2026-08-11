import React from 'react';
import * as THREE from 'three';
import { ViewportCanvas } from '@/components/viewport/ViewportCanvas';
import { Dropzone } from '@/components/uploader/Dropzone';
import { LoadingModal } from '@/components/uploader/LoadingModal';
import { AssemblyTree } from '@/components/assembly/AssemblyTree';
import { InspectorPanel, type MaterialState } from '@/components/assembly/InspectorPanel';
import { PrecisionToolbar } from '@/components/viewport/PrecisionToolbar';
import {
  PrecisionToolsOverlay,
  type ToolMode,
  type DistanceMeasurement,
  type AngleMeasurement,
} from '@/components/viewport/PrecisionToolsOverlay';
import { createClippingPlanes, INITIAL_CLIPPING_STATE, type ClippingPlanesState } from '@/utils/clippingPlanes';
import type { AssemblyNode } from '@/components/assembly/assemblyUtils';
import { calculateMeshProperties, type MeshProperties } from '@/utils/meshProperties';
import { STLLoaderService, OBJLoaderService, fitCameraToSelection } from '@/services/loaders';
import { STEPLoaderService } from '@/services/stepLoader';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import './App.css';

interface LoadedMeshState {
  geometry: THREE.BufferGeometry;
  name: string;
}

export function App() {
  const [workerMsg, setWorkerMsg] = React.useState<string>('Initializing worker...');
  const [loadedMesh, setLoadedMesh] = React.useState<LoadedMeshState | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingFilename, setLoadingFilename] = React.useState<string>('');
  const [loadingProgress, setLoadingProgress] = React.useState<number>(0);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Precision 3D Measurement & Clipping Tool states
  const [toolMode, setToolMode] = React.useState<ToolMode>('none');
  const [distances, setDistances] = React.useState<DistanceMeasurement[]>([]);
  const [angles, setAngles] = React.useState<AngleMeasurement[]>([]);
  const [clippingState, setClippingState] = React.useState<ClippingPlanesState>(INITIAL_CLIPPING_STATE);

  // Assembly & Inspector states
  const [assemblyNodes, setAssemblyNodes] = React.useState<AssemblyNode[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = React.useState<Set<string>>(new Set());
  const [isolatedId, setIsolatedId] = React.useState<string | null>(null);
  const [meshProperties, setMeshProperties] = React.useState<MeshProperties | null>(null);
  const [material, setMaterial] = React.useState<MaterialState>({
    color: '#89b4fa',
    roughness: 0.3,
    metalness: 0.2,
    opacity: 1.0,
    wireframe: false,
  });

  const meshRef = React.useRef<THREE.Mesh>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = React.useRef<OrbitControlsImpl>(null);

  const activeClippingPlanes = React.useMemo(() => createClippingPlanes(clippingState), [clippingState]);

  React.useEffect(() => {
    const worker = new Worker(new URL('@/workers/test.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (e) => {
      setWorkerMsg(e.data.result);
    };
    worker.postMessage('CAD2Three.js Worker Ready');

    return () => {
      worker.terminate();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileLoaded = async (file: File) => {
    setIsLoading(true);
    setLoadingFilename(file.name);
    setLoadingProgress(20);

    try {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      let parsed: { geometry: THREE.BufferGeometry; name: string };

      if (ext === '.stl') {
        const buffer = await file.arrayBuffer();
        setLoadingProgress(60);
        const stlService = new STLLoaderService();
        parsed = stlService.parse(buffer, file.name);
      } else if (ext === '.obj') {
        const text = await file.text();
        setLoadingProgress(60);
        const objService = new OBJLoaderService();
        parsed = objService.parse(text, file.name);
      } else if (ext === '.stp' || ext === '.step') {
        const buffer = await file.arrayBuffer();
        setLoadingProgress(60);
        const stepService = new STEPLoaderService();
        parsed = await stepService.parseAsync(buffer, file.name);
      } else {
        throw new Error('Unsupported format');
      }

      setLoadingProgress(90);

      // Clean up previous geometry
      if (loadedMesh) {
        loadedMesh.geometry.dispose();
      }

      const props = calculateMeshProperties(parsed.geometry);
      setMeshProperties(props);

      const rootNode: AssemblyNode = {
        id: 'node-1',
        name: parsed.name,
        type: 'part',
      };
      setAssemblyNodes([rootNode]);
      setSelectedId(rootNode.id);

      setLoadedMesh(parsed);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 300);
    } catch (err: unknown) {
      setIsLoading(false);
      const errMsg = err instanceof Error ? err.message : 'Error reading file';
      showToast(`Failed to load ${file.name}: ${errMsg}`);
    }
  };

  const handleZoomToFit = React.useCallback(() => {
    if (meshRef.current && cameraRef.current && controlsRef.current) {
      fitCameraToSelection(cameraRef.current, controlsRef.current, meshRef.current);
    }
  }, []);

  React.useEffect(() => {
    if (loadedMesh) {
      handleZoomToFit();
    }
  }, [loadedMesh, handleZoomToFit]);

  const handleToggleVisibility = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleIsolate = (id: string) => {
    setIsolatedId((prev) => (prev === id ? null : id));
  };

  const selectedNode = React.useMemo(() => {
    const findNode = (nodes: AssemblyNode[]): AssemblyNode | null => {
      for (const node of nodes) {
        if (node.id === selectedId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(assemblyNodes);
  }, [assemblyNodes, selectedId]);

  const isMeshVisible = loadedMesh && (!selectedId || !hiddenIds.has('node-1')) && (!isolatedId || isolatedId === 'node-1');
  const meshOpacity = isolatedId && isolatedId !== 'node-1' ? 0.15 : material.opacity;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <header
        style={{
          padding: '0.75rem 1.25rem',
          background: '#1e1e2e',
          color: '#cdd6f4',
          fontFamily: 'sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 5,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>CAD2Three.js Assembly Inspector & Precision Tools</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#a6adc8' }}>
          Worker: <strong>{workerMsg}</strong>
        </p>
      </header>

      {/* Main Container with Sidebar, Viewport & Inspector */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <AssemblyTree
          nodes={assemblyNodes}
          selectedId={selectedId}
          hiddenIds={hiddenIds}
          isolatedId={isolatedId}
          onSelectNode={setSelectedId}
          onToggleVisibility={handleToggleVisibility}
          onToggleIsolate={handleToggleIsolate}
        />

        <div style={{ flex: 1, position: 'relative' }}>
          <Dropzone onFileLoaded={handleFileLoaded} onError={showToast} />
          <LoadingModal isOpen={isLoading} filename={loadingFilename} progress={loadingProgress} />

          <PrecisionToolbar
            toolMode={toolMode}
            onSetToolMode={setToolMode}
            distances={distances}
            angles={angles}
            onClearMeasurements={() => {
              setDistances([]);
              setAngles([]);
            }}
            clippingState={clippingState}
            onClippingChange={setClippingState}
            onZoomToFit={handleZoomToFit}
          />

          {/* Toast Banner */}
          {toastMessage && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#f38ba8',
                color: '#11111b',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              ⚠️ {toastMessage}
            </div>
          )}

          <ViewportCanvas onFitToScreen={handleZoomToFit}>
            {loadedMesh && isMeshVisible ? (
              <mesh
                ref={meshRef}
                geometry={loadedMesh.geometry}
                castShadow
                receiveShadow
                onClick={(e) => {
                  if (toolMode === 'none') {
                    e.stopPropagation();
                    setSelectedId('node-1');
                  }
                }}
              >
                <meshStandardMaterial
                  color={material.color}
                  roughness={material.roughness}
                  metalness={material.metalness}
                  opacity={meshOpacity}
                  transparent={meshOpacity < 1.0}
                  wireframe={material.wireframe}
                  clippingPlanes={activeClippingPlanes}
                  clipShadows
                />
              </mesh>
            ) : !loadedMesh ? (
              <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                onClick={() => {
                  if (toolMode === 'none') setSelectedId(null);
                }}
              >
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial
                  color="#45475a"
                  roughness={0.5}
                  clippingPlanes={activeClippingPlanes}
                  clipShadows
                />
              </mesh>
            ) : null}

            <PrecisionToolsOverlay
              toolMode={toolMode}
              targetMesh={meshRef.current}
              distances={distances}
              angles={angles}
              onAddDistance={(d) => setDistances((prev) => [...prev, d])}
              onAddAngle={(a) => setAngles((prev) => [...prev, a])}
            />
          </ViewportCanvas>
        </div>

        <InspectorPanel
          nodeName={selectedNode?.name ?? null}
          properties={meshProperties}
          material={material}
          onMaterialChange={(updated) => setMaterial((prev) => ({ ...prev, ...updated }))}
        />
      </div>
    </div>
  );
}

export default App;
