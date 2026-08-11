import { describe, it, expect } from 'vitest';
import { STEPLoaderService } from './stepLoader';
import { validateFileExtension } from './loaders';

describe('STEPLoaderService', () => {
  it('validates .stp and .step file extensions', () => {
    expect(validateFileExtension('model.stp')).toBe(true);
    expect(validateFileExtension('assembly.step')).toBe(true);
    expect(validateFileExtension('MODEL.STP')).toBe(true);
    expect(validateFileExtension('ASSEMBLY.STEP')).toBe(true);
  });

  it('parses STEP buffer into a valid Three.js BufferGeometry', () => {
    const service = new STEPLoaderService();
    const dummyBuffer = new ArrayBuffer(1024);
    const result = service.parse(dummyBuffer, 'sample.stp');

    expect(result.name).toBe('sample.stp');
    expect(result.geometry).toBeDefined();
    expect(result.geometry.attributes.position).toBeDefined();
  });
});
