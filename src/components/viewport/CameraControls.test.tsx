import { render, screen, fireEvent } from '@testing-library/react';
import { CameraControlsToolbar } from './CameraControls';
import { PRESET_POSITIONS, type CameraPreset } from './cameraPresetConstants';

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

  it('defines valid 3D coordinates for all camera presets', () => {
    const presets: CameraPreset[] = ['ISO', 'TOP', 'FRONT', 'BACK', 'LEFT', 'RIGHT'];
    presets.forEach((preset) => {
      const pos = PRESET_POSITIONS[preset];
      expect(pos).toHaveLength(3);
      expect(typeof pos[0]).toBe('number');
      expect(typeof pos[1]).toBe('number');
      expect(typeof pos[2]).toBe('number');
    });
  });
});
