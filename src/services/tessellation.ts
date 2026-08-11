export interface TessellationOptions {
  linearDeflection: number; // e.g. 0.001 to 1.0 mm
  angularDeflection: number; // e.g. 0.1 to 0.8 rad
}

export const DEFAULT_TESSELLATION_OPTIONS: TessellationOptions = {
  linearDeflection: 0.1,
  angularDeflection: 0.5,
};

/**
 * Sanitizes and constrains linear deflection value to valid range [0.001, 1.0] mm
 */
export function sanitizeLinearDeflection(val: number): number {
  if (isNaN(val) || val <= 0) return DEFAULT_TESSELLATION_OPTIONS.linearDeflection;
  return Math.min(Math.max(val, 0.001), 1.0);
}

/**
 * Sanitizes and constrains angular deflection value to valid range [0.05, 1.5] rad
 */
export function sanitizeAngularDeflection(val: number): number {
  if (isNaN(val) || val <= 0) return DEFAULT_TESSELLATION_OPTIONS.angularDeflection;
  return Math.min(Math.max(val, 0.05), 1.5);
}

/**
 * Computes estimated resolution presets (high quality -> low linear deflection, fast draft -> high linear deflection)
 */
export function getDeflectionPreset(preset: 'fine' | 'medium' | 'coarse'): TessellationOptions {
  switch (preset) {
    case 'fine':
      return { linearDeflection: 0.01, angularDeflection: 0.2 };
    case 'medium':
      return { linearDeflection: 0.1, angularDeflection: 0.5 };
    case 'coarse':
      return { linearDeflection: 0.5, angularDeflection: 0.8 };
  }
}
