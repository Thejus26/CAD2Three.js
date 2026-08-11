import type { MeshProperties } from '@/utils/meshProperties';

export interface MaterialState {
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  wireframe: boolean;
}

export interface InspectorPanelProps {
  nodeName: string | null;
  properties: MeshProperties | null;
  material: MaterialState;
  onMaterialChange: (updated: Partial<MaterialState>) => void;
}

export function InspectorPanel({
  nodeName,
  properties,
  material,
  onMaterialChange,
}: InspectorPanelProps) {
  if (!nodeName || !properties) {
    return (
      <div
        style={{
          width: '280px',
          background: '#181825',
          color: '#a6adc8',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          fontSize: '0.85rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        Select a component in the assembly tree or 3D viewport to inspect properties & materials.
      </div>
    );
  }

  const formatNum = (val: number) => (val > 1000 ? val.toLocaleString(undefined, { maximumFractionDigits: 1 }) : val.toFixed(2));

  return (
    <div
      style={{
        width: '280px',
        background: '#181825',
        color: '#cdd6f4',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
        fontSize: '0.85rem',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#cdd6f4' }}>{nodeName}</h3>
        <span style={{ fontSize: '0.75rem', color: '#a6adc8' }}>Component Properties</span>
      </div>

      {/* Geometric Properties */}
      <div
        style={{
          background: '#1e1e2e',
          borderRadius: '6px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#89b4fa' }}>Geometry & Physics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
          <div>
            <div style={{ color: '#a6adc8', fontSize: '0.75rem' }}>Volume</div>
            <div style={{ fontWeight: 600 }}>{formatNum(properties.volume)} mm³</div>
          </div>
          <div>
            <div style={{ color: '#a6adc8', fontSize: '0.75rem' }}>Surface Area</div>
            <div style={{ fontWeight: 600 }}>{formatNum(properties.surfaceArea)} mm²</div>
          </div>
          <div>
            <div style={{ color: '#a6adc8', fontSize: '0.75rem' }}>Triangles</div>
            <div style={{ fontWeight: 600 }}>{properties.triangleCount.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#a6adc8', fontSize: '0.75rem' }}>Vertices</div>
            <div style={{ fontWeight: 600 }}>{properties.vertexCount.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ color: '#a6adc8', fontSize: '0.75rem', marginBottom: '2px' }}>Bounding Box (X × Y × Z)</div>
          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {formatNum(properties.boundingBox.dimensions[0])} × {formatNum(properties.boundingBox.dimensions[1])} × {formatNum(properties.boundingBox.dimensions[2])} mm
          </div>
        </div>
      </div>

      {/* Material Controls */}
      <div
        style={{
          background: '#1e1e2e',
          borderRadius: '6px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#a6e3a1' }}>Material & Shading</h4>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label htmlFor="mat-color" style={{ fontSize: '0.8rem' }}>Color Override</label>
          <input
            id="mat-color"
            type="color"
            value={material.color}
            onChange={(e) => onMaterialChange({ color: e.target.value })}
            style={{ border: 'none', background: 'none', width: '28px', height: '28px', cursor: 'pointer' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span>Roughness</span>
            <span>{material.roughness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={material.roughness}
            onChange={(e) => onMaterialChange({ roughness: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span>Metalness</span>
            <span>{material.metalness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={material.metalness}
            onChange={(e) => onMaterialChange({ metalness: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span>Opacity (X-Ray)</span>
            <span>{material.opacity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={material.opacity}
            onChange={(e) => onMaterialChange({ opacity: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
          <input
            id="mat-wireframe"
            type="checkbox"
            checked={material.wireframe}
            onChange={(e) => onMaterialChange({ wireframe: e.target.checked })}
          />
          <label htmlFor="mat-wireframe" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Wireframe Toggle</label>
        </div>
      </div>
    </div>
  );
}
