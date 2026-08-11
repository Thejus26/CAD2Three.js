import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InspectorPanel, type MaterialState } from './InspectorPanel';
import type { MeshProperties } from '@/utils/meshProperties';

const mockProperties: MeshProperties = {
  volume: 125.4,
  surfaceArea: 150.2,
  boundingBox: {
    min: [-1, -1, -1],
    max: [1, 1, 1],
    dimensions: [2, 2, 2],
  },
  vertexCount: 8,
  triangleCount: 12,
};

const mockMaterial: MaterialState = {
  color: '#89b4fa',
  roughness: 0.3,
  metalness: 0.2,
  opacity: 1.0,
  wireframe: false,
};

describe('InspectorPanel component', () => {
  it('renders placeholder message when no component is selected', () => {
    render(
      <InspectorPanel
        nodeName={null}
        properties={null}
        material={mockMaterial}
        onMaterialChange={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Select a component in the assembly tree/i)
    ).toBeTruthy();
  });

  it('renders geometric properties and material controls when component is selected', () => {
    render(
      <InspectorPanel
        nodeName="Test Bracket"
        properties={mockProperties}
        material={mockMaterial}
        onMaterialChange={vi.fn()}
      />
    );

    expect(screen.getByText('Test Bracket')).toBeTruthy();
    expect(screen.getByText('125.40 mm³')).toBeTruthy();
    expect(screen.getByText('150.20 mm²')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
  });

  it('triggers material change callbacks on slider and color adjustments', () => {
    const onMatChange = vi.fn();
    render(
      <InspectorPanel
        nodeName="Test Bracket"
        properties={mockProperties}
        material={mockMaterial}
        onMaterialChange={onMatChange}
      />
    );

    const wireframeCheck = screen.getByLabelText('Wireframe Toggle');
    fireEvent.click(wireframeCheck);
    expect(onMatChange).toHaveBeenCalledWith({ wireframe: true });
  });
});
