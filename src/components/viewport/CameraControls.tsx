import React from 'react';
import type { CameraPreset } from './cameraPresetConstants';

export interface CameraControlsProps {
  onSelectPreset: (preset: CameraPreset) => void;
  activePreset?: CameraPreset;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const CameraControlsToolbar: React.FC<CameraControlsProps> = ({
  onSelectPreset,
  activePreset = 'ISO',
  onZoomIn,
  onZoomOut,
}) => {
  const presets: CameraPreset[] = ['ISO', 'TOP', 'FRONT', 'BACK', 'LEFT', 'RIGHT'];

  return (
    <div
      aria-label="Camera Controls Toolbar"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(30, 30, 46, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '8px 12px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
      }}
    >
      {onZoomIn && (
        <button
          onClick={onZoomIn}
          title="Zoom In (+)"
          style={{
            background: 'transparent',
            color: '#cdd6f4',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '6px 10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ➕
        </button>
      )}

      {onZoomOut && (
        <button
          onClick={onZoomOut}
          title="Zoom Out (-)"
          style={{
            background: 'transparent',
            color: '#cdd6f4',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '6px 10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ➖
        </button>
      )}

      {onZoomIn || onZoomOut ? (
        <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 2px' }} />
      ) : null}

      {presets.map((preset) => {
        const isActive = activePreset === preset;
        return (
          <button
            key={preset}
            onClick={() => onSelectPreset(preset)}
            style={{
              background: isActive ? '#89b4fa' : 'transparent',
              color: isActive ? '#11111b' : '#cdd6f4',
              border: 'none',
              borderRadius: '16px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {preset}
          </button>
        );
      })}
    </div>
  );
};
