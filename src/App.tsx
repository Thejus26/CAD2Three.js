import React from 'react';
import { ViewportCanvas } from '@/components/viewport/ViewportCanvas';
import './App.css';

function SampleMesh() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#89b4fa" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

export function App() {
  const [workerMsg, setWorkerMsg] = React.useState<string>('Initializing worker...');

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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>CAD2Three.js Viewport</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#a6adc8' }}>
          Worker: <strong>{workerMsg}</strong>
        </p>
      </header>
      <div style={{ flex: 1, position: 'relative' }}>
        <ViewportCanvas>
          <SampleMesh />
        </ViewportCanvas>
      </div>
    </div>
  );
}

export default App;
