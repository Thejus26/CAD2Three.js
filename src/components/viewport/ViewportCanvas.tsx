import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraControlsToolbar } from './CameraControls';
import { getPresetPosition, DEFAULT_CAMERA_DISTANCE, type CameraPreset } from './cameraPresetConstants';
import { applyZoomStep, MIN_ZOOM_DISTANCE, MAX_ZOOM_DISTANCE } from './zoomControls';

export interface ViewportCanvasProps {
  children?: React.ReactNode;
  onFitToScreen?: () => void;
  /** Called once when the OrbitControls instance mounts inside the Canvas. */
  onControlsReady?: (controls: OrbitControlsImpl) => void;
  /** Current autoscale distance — drives preset scaling and grid fade. */
  autoScaleDistance?: number;
  /** Autoscale center point for preset camera targeting. */
  autoScaleCenter?: [number, number, number];
}

export const ViewportCanvas: React.FC<ViewportCanvasProps> = ({
  children,
  onFitToScreen,
  onControlsReady,
  autoScaleDistance,
  autoScaleCenter,
}) => {
  const [activePreset, setActivePreset] = React.useState<CameraPreset>('ISO');
  const controlsRef = React.useRef<OrbitControlsImpl>(null);

  // Callback ref to capture OrbitControls and notify parent
  const handleControlsRef = React.useCallback(
    (instance: OrbitControlsImpl | null) => {
      (controlsRef as React.MutableRefObject<OrbitControlsImpl | null>).current = instance;
      if (instance && onControlsReady) {
        onControlsReady(instance);
      }
    },
    [onControlsReady],
  );

  const effectiveDistance = autoScaleDistance ?? DEFAULT_CAMERA_DISTANCE;
  const effectiveCenter: [number, number, number] = autoScaleCenter ?? [0, 0, 0];

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const targetPos = getPresetPosition(preset, effectiveDistance, effectiveCenter);
      camera.position.set(...targetPos);
      controlsRef.current.target.set(...effectiveCenter);
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

  // Dynamic grid fade: scale to the autoscale distance so grid stays visible
  const gridFadeDistance = Math.max(30, effectiveDistance * 3);
  const gridCellSize = Math.max(1, Math.pow(10, Math.floor(Math.log10(effectiveDistance)) - 1));
  const gridSectionSize = gridCellSize * 5;

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
        camera={{ position: getPresetPosition('ISO'), fov: 50 }}
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
          fadeDistance={gridFadeDistance}
          fadeStrength={1.5}
          cellSize={gridCellSize}
          sectionSize={gridSectionSize}
          cellColor="#45475a"
          sectionColor="#89b4fa"
        />

        {/* Orbit Controls */}
        <OrbitControls
          ref={handleControlsRef}
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
