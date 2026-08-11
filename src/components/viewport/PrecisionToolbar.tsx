import React from 'react';
import type { ToolMode, DistanceMeasurement, AngleMeasurement } from './PrecisionToolsOverlay';
import type { ClippingPlanesState } from '@/utils/clippingPlanes';

interface PrecisionToolbarProps {
  toolMode: ToolMode;
  onSetToolMode: (mode: ToolMode) => void;
  distances: DistanceMeasurement[];
  angles: AngleMeasurement[];
  onClearMeasurements: () => void;
  clippingState: ClippingPlanesState;
  onClippingChange: (state: ClippingPlanesState) => void;
}

export const PrecisionToolbar: React.FC<PrecisionToolbarProps> = ({
  toolMode,
  onSetToolMode,
  distances,
  angles,
  onClearMeasurements,
  clippingState,
  onClippingChange,
}) => {
  const [showSectionPanel, setShowSectionPanel] = React.useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Measurement Mode Controls */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(30, 30, 46, 0.85)',
          padding: '6px',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => onSetToolMode(toolMode === 'distance' ? 'none' : 'distance')}
          style={{
            background: toolMode === 'distance' ? '#89b4fa' : '#313244',
            color: toolMode === 'distance' ? '#11111b' : '#cdd6f4',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          📏 Distance
        </button>

        <button
          onClick={() => onSetToolMode(toolMode === 'angle' ? 'none' : 'angle')}
          style={{
            background: toolMode === 'angle' ? '#a6e3a1' : '#313244',
            color: toolMode === 'angle' ? '#11111b' : '#cdd6f4',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          📐 Angle
        </button>

        <button
          onClick={() => setShowSectionPanel((prev) => !prev)}
          style={{
            background: clippingState.enabled ? '#f38ba8' : '#313244',
            color: clippingState.enabled ? '#11111b' : '#cdd6f4',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          ✂️ Sectioning
        </button>

        {(distances.length > 0 || angles.length > 0) && (
          <button
            onClick={onClearMeasurements}
            style={{
              background: '#45475a',
              color: '#f38ba8',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            🗑️ Clear ({distances.length + angles.length})
          </button>
        )}
      </div>

      {/* Dynamic Clipping / Cross-Section Panel */}
      {showSectionPanel && (
        <div
          style={{
            background: 'rgba(30, 30, 46, 0.95)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            color: '#cdd6f4',
            width: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '13px' }}>Dynamic Sectioning</strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={clippingState.enabled}
                onChange={(e) =>
                  onClippingChange({ ...clippingState, enabled: e.target.checked })
                }
              />
              Enable
            </label>
          </div>

          {/* Axis controls */}
          {(['x', 'y', 'z'] as const).map((axis) => {
            const axisState = clippingState[axis];
            return (
              <div
                key={axis}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  background: '#181825',
                  padding: '8px',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 600, textTransform: 'uppercase', color: axis === 'x' ? '#f38ba8' : axis === 'y' ? '#a6e3a1' : '#89b4fa' }}>
                    <input
                      type="checkbox"
                      checked={axisState.enabled}
                      disabled={!clippingState.enabled}
                      onChange={(e) =>
                        onClippingChange({
                          ...clippingState,
                          [axis]: { ...axisState, enabled: e.target.checked },
                        })
                      }
                      style={{ marginRight: '6px' }}
                    />
                    {axis}-Axis
                  </label>
                  <label style={{ fontSize: '10px', color: '#a6adc8' }}>
                    <input
                      type="checkbox"
                      checked={axisState.negate}
                      disabled={!clippingState.enabled || !axisState.enabled}
                      onChange={(e) =>
                        onClippingChange({
                          ...clippingState,
                          [axis]: { ...axisState, negate: e.target.checked },
                        })
                      }
                      style={{ marginRight: '2px' }}
                    />
                    Flip
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="0.5"
                    value={axisState.constant}
                    disabled={!clippingState.enabled || !axisState.enabled}
                    onChange={(e) =>
                      onClippingChange({
                        ...clippingState,
                        [axis]: { ...axisState, constant: parseFloat(e.target.value) },
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <span style={{ width: '32px', textAlign: 'right', fontSize: '11px' }}>
                    {axisState.constant}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
