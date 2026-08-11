export type CameraPreset = 'ISO' | 'FRONT' | 'TOP' | 'RIGHT' | 'LEFT' | 'BACK';

/**
 * Unit direction vectors for each camera preset.
 * Multiply by a model-relative distance to get the actual camera position.
 */
export const PRESET_DIRECTIONS: Record<CameraPreset, [number, number, number]> = {
  ISO: [0.5774, 0.5774, 0.5774],   // normalized (1,1,1)
  FRONT: [0, 0, 1],
  TOP: [0, 1, 0.0001],              // tiny Z offset to avoid gimbal lock
  RIGHT: [1, 0, 0],
  LEFT: [-1, 0, 0],
  BACK: [0, 0, -1],
};

/** Default camera distance when no model has been autoscaled yet. */
export const DEFAULT_CAMERA_DISTANCE = 8;

/**
 * Returns an absolute camera position for a preset, scaled to the given distance.
 * The position is relative to a center point (defaults to origin).
 */
export function getPresetPosition(
  preset: CameraPreset,
  distance: number = DEFAULT_CAMERA_DISTANCE,
  center: [number, number, number] = [0, 0, 0],
): [number, number, number] {
  const dir = PRESET_DIRECTIONS[preset];
  return [
    center[0] + dir[0] * distance,
    center[1] + dir[1] * distance,
    center[2] + dir[2] * distance,
  ];
}
