import { describe, it, expect } from 'vitest';
import {
  sanitizeLinearDeflection,
  sanitizeAngularDeflection,
  getDeflectionPreset,
  DEFAULT_TESSELLATION_OPTIONS
} from './tessellation';

describe('Tessellation Deflection Helper', () => {
  it('sanitizes linear deflection within bounds', () => {
    expect(sanitizeLinearDeflection(0.0001)).toBe(0.001);
    expect(sanitizeLinearDeflection(5.0)).toBe(1.0);
    expect(sanitizeLinearDeflection(0.05)).toBe(0.05);
    expect(sanitizeLinearDeflection(NaN)).toBe(DEFAULT_TESSELLATION_OPTIONS.linearDeflection);
    expect(sanitizeLinearDeflection(-1)).toBe(DEFAULT_TESSELLATION_OPTIONS.linearDeflection);
  });

  it('sanitizes angular deflection within bounds', () => {
    expect(sanitizeAngularDeflection(0.01)).toBe(0.05);
    expect(sanitizeAngularDeflection(2.5)).toBe(1.5);
    expect(sanitizeAngularDeflection(0.3)).toBe(0.3);
    expect(sanitizeAngularDeflection(NaN)).toBe(DEFAULT_TESSELLATION_OPTIONS.angularDeflection);
  });

  it('returns valid deflection presets', () => {
    const fine = getDeflectionPreset('fine');
    expect(fine.linearDeflection).toBe(0.01);
    expect(fine.angularDeflection).toBe(0.2);

    const medium = getDeflectionPreset('medium');
    expect(medium.linearDeflection).toBe(0.1);

    const coarse = getDeflectionPreset('coarse');
    expect(coarse.linearDeflection).toBe(0.5);
  });
});
