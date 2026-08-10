import React from 'react';
import * as THREE from 'three';
import { ViewportCanvas } from '@/components/viewport/ViewportCanvas';
import { Dropzone } from '@/components/uploader/Dropzone';
import { LoadingModal } from '@/components/uploader/LoadingModal';
import { STLLoaderService, OBJLoaderService, fitCameraToSelection } from '@/services/loaders';
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

  const meshRef = React.useRef<THREE.Mesh>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = React.useRef<OrbitControlsImpl>(null);

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
      } else {
        throw new Error('Unsupported format');
      }

      setLoadingProgress(90);

      // Clean up previous geometry
      if (loadedMesh) {
        loadedMesh.geometry.dispose();
      }

      setLoadedMesh(parsed);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 300);
    } catch (err: unknown) {
      setIsLoading(false);
      const errMsg = err instanceof Error ? err.message : 'Error reading file';
      showToast(`Failed to load ${file.name}: ${errMsg}`);
    }
  };

  React.useEffect(() => {
    if (loadedMesh && meshRef.current && cameraRef.current && controlsRef.current) {
      fitCameraToSelection(cameraRef.current, controlsRef.current, meshRef.current);
    }
  }, [loadedMesh]);

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
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>CAD2Three.js Core Viewer</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#a6adc8' }}>
          Worker: <strong>{workerMsg}</strong>
        </p>
      </header>

      {/* Main Viewport Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Dropzone onFileLoaded={handleFileLoaded} onError={showToast} />
        <LoadingModal isOpen={isLoading} filename={loadingFilename} progress={loadingProgress} />

        {/* Toast Banner */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              top: '80px',
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

        <ViewportCanvas>
          {loadedMesh ? (
            <mesh ref={meshRef} geometry={loadedMesh.geometry} castShadow receiveShadow>
              <meshStandardMaterial color="#89b4fa" roughness={0.3} metalness={0.2} />
            </mesh>
          ) : (
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial color="#45475a" roughness={0.5} />
            </mesh>
          )}
        </ViewportCanvas>
      </div>
    </div>
  );
}

export default App;
