import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';

function SampleMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
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
      <header style={{ padding: '1rem', background: '#1e1e2e', color: '#cdd6f4', fontFamily: 'sans-serif' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>CAD2Three.js - Environment Foundation</h1>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#a6adc8' }}>
          Worker status: <strong>{workerMsg}</strong>
        </p>
      </header>
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [3, 3, 3] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <SampleMesh />
          <OrbitControls />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
