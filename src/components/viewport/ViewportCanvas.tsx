import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraControlsToolbar } from './CameraControls';
import { PRESET_POSITIONS, type CameraPreset } from './cameraPresetConstants';
import { applyZoomStep, MIN_ZOOM_DISTANCE, MAX_ZOOM_DISTANCE } from './zoomControls';

export interface ViewportCanvasProps {
  children?: React.ReactNode;
  onFitToScreen?: () => void;
}

export const ViewportCanvas: React.FC<ViewportCanvasProps> = ({ children, onFitToScreen }) => {
  const [activePreset, setActivePreset] = React.useState<CameraPreset>('ISO');
  const controlsRef = React.useRef<OrbitControlsImpl>(null);

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const targetPos = PRESET_POSITIONS[preset];
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.set(...targetPos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = React.useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      applyZoomStep(camera, controlsRef.current, 'in', MIN_ZOOM_DISTANCE, MAX_ZOOM_DISTANCE);
    }
  }, []);

  const handleZoomOut = React.useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      applyZoomStep(camera, controlsRef.current, 'out', MIN_ZOOM_DISTANCE, MAX_ZOOM_DISTANCE);
    }
  }, []);

  // FR-4 Keyboard shortcuts for + and -
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut]);

  const handleDoubleClick = () => {
    // Trigger auto-scale framing on background double click
    if (onFitToScreen) {
      onFitToScreen();
    }
  };

  return (
    <div
      data-testid="viewport-container"
      onDoubleClick={handleDoubleClick}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#11111b',
        overflow: 'hidden',
      }}
    >
      <Canvas
        shadows
        gl={{ localClippingEnabled: true }}
        camera={{ position: PRESET_POSITIONS.ISO, fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, 5, -10]} intensity={0.4} />

        {/* Dynamic Fading Ground Grid */}
        <Grid
          infiniteGrid
          fadeDistance={30}
          fadeStrength={1.5}
          cellSize={1}
          sectionSize={5}
          cellColor="#45475a"
          sectionColor="#89b4fa"
        />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={MIN_ZOOM_DISTANCE}
          maxDistance={MAX_ZOOM_DISTANCE}
        />

        {/* 3D ViewCube / Orientation Gizmo */}
        <GizmoHelper alignment="top-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#f38ba8', '#a6e3a1', '#89b4fa']} labelColor="#cdd6f4" />
        </GizmoHelper>

        {children}
      </Canvas>

      {/* Camera Preset & Zoom Toolbar */}
      <CameraControlsToolbar
        onSelectPreset={handleSelectPreset}
        activePreset={activePreset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};
