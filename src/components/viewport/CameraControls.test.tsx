import { render, screen, fireEvent } from '@testing-library/react';
import { CameraControlsToolbar } from './CameraControls';
import { PRESET_DIRECTIONS, getPresetPosition, type CameraPreset } from './cameraPresetConstants';

describe('CameraControlsToolbar Component', () => {
  it('renders all preset buttons', () => {
    const handleSelect = vi.fn();
    render(<CameraControlsToolbar onSelectPreset={handleSelect} activePreset="ISO" />);

    const presets: CameraPreset[] = ['ISO', 'TOP', 'FRONT', 'BACK', 'LEFT', 'RIGHT'];
    presets.forEach((preset) => {
      expect(screen.getByRole('button', { name: preset })).toBeInTheDocument();
    });
  });

  it('triggers onSelectPreset callback when preset button is clicked', () => {
    const handleSelect = vi.fn();
    render(<CameraControlsToolbar onSelectPreset={handleSelect} activePreset="ISO" />);

    const topButton = screen.getByRole('button', { name: 'TOP' });
    fireEvent.click(topButton);

    expect(handleSelect).toHaveBeenCalledWith('TOP');
  });

  it('defines valid unit direction vectors for all camera presets', () => {
    const presets: CameraPreset[] = ['ISO', 'TOP', 'FRONT', 'BACK', 'LEFT', 'RIGHT'];
    presets.forEach((preset) => {
      const dir = PRESET_DIRECTIONS[preset];
      expect(dir).toHaveLength(3);
      expect(typeof dir[0]).toBe('number');
      expect(typeof dir[1]).toBe('number');
      expect(typeof dir[2]).toBe('number');
    });
  });

  it('scales preset positions correctly by distance', () => {
    const pos = getPresetPosition('FRONT', 100);
    expect(pos[0]).toBeCloseTo(0);
    expect(pos[1]).toBeCloseTo(0);
    expect(pos[2]).toBeCloseTo(100);

    const posCenter = getPresetPosition('FRONT', 50, [10, 20, 30]);
    expect(posCenter[0]).toBeCloseTo(10);
    expect(posCenter[1]).toBeCloseTo(20);
    expect(posCenter[2]).toBeCloseTo(80);
  });
});
