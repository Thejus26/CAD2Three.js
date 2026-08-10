export type CameraPreset = 'ISO' | 'FRONT' | 'TOP' | 'RIGHT' | 'LEFT' | 'BACK';

export const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  ISO: [5, 5, 5],
  FRONT: [0, 0, 8],
  TOP: [0, 8, 0.001],
  RIGHT: [8, 0, 0],
  LEFT: [-8, 0, 0],
  BACK: [0, 0, -8],
};
