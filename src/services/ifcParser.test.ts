import { describe, it, expect } from 'vitest';
import { classifyIFCElement, parseIFCMetadata } from './ifcParser';

describe('IFC Metadata Parser & Classification', () => {
  it('classifies IFC entity types into human readable categories', () => {
    expect(classifyIFCElement('IFCWALL')).toBe('Wall');
    expect(classifyIFCElement('IFCWALLSTANDARDCASE')).toBe('Wall');
    expect(classifyIFCElement('IFCDOOR')).toBe('Door');
    expect(classifyIFCElement('IFCSLAB')).toBe('Slab');
    expect(classifyIFCElement('IFCBEAM')).toBe('Beam');
    expect(classifyIFCElement('IFCUNKNOWNENTITY')).toBe('Generic Building Element');
  });

  it('parses raw IFC properties into structured metadata', () => {
    const meta = parseIFCMetadata(101, 'IFCWALL', {
      Name: { value: 'Exterior Partition Wall' },
      Material: 'Concrete',
    });

    expect(meta.expressID).toBe(101);
    expect(meta.type).toBe('Wall');
    expect(meta.name).toBe('Exterior Partition Wall');
    expect(meta.material).toBe('Concrete');
  });

  it('handles missing or raw property values gracefully', () => {
    const meta = parseIFCMetadata(205, 'IFCDOOR', {});

    expect(meta.expressID).toBe(205);
    expect(meta.type).toBe('Door');
    expect(meta.name).toBe('Door #205');
    expect(meta.material).toBeUndefined();
  });
});
