export interface IFCElementMetadata {
  expressID: number;
  type: string; // e.g. IFCWALL, IFCDOOR, IFCSLAB, IFCBEAM, IFCWINDOW
  name: string;
  material?: string;
}

export const IFC_ELEMENT_TYPES: Record<string, string> = {
  IFCWALL: 'Wall',
  IFCWALLSTANDARDCASE: 'Wall',
  IFCDOOR: 'Door',
  IFCSLAB: 'Slab',
  IFCBEAM: 'Beam',
  IFCCOLUMN: 'Column',
  IFCWINDOW: 'Window',
  IFCROOF: 'Roof',
  IFCFURNISHINGELEMENT: 'Furniture',
  IFCSPACE: 'Space',
};

/**
 * Classifies an IFC type code / entity name into human-readable element category
 */
export function classifyIFCElement(ifcType: string): string {
  const upper = (ifcType || '').trim().toUpperCase();
  return IFC_ELEMENT_TYPES[upper] || 'Generic Building Element';
}

/**
 * Parses and formats raw IFC entity properties into structured metadata
 */
export function parseIFCMetadata(
  expressID: number,
  ifcType: string,
  rawProperties: Record<string, unknown>
): IFCElementMetadata {
  const name =
    (typeof rawProperties.Name === 'string' && rawProperties.Name) ||
    (typeof rawProperties.Name === 'object' && rawProperties.Name && 'value' in rawProperties.Name
      ? String((rawProperties.Name as { value: unknown }).value)
      : `${classifyIFCElement(ifcType)} #${expressID}`);

  const material =
    typeof rawProperties.Material === 'string'
      ? rawProperties.Material
      : undefined;

  return {
    expressID,
    type: classifyIFCElement(ifcType),
    name,
    material,
  };
}
