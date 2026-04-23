export type UnitType = 'volume' | 'weight' | 'count';

export interface Unit {
  id: string;
  label: string;
  type: UnitType;
  toBase: number; // Factor to convert to base (ml for volume, g for weight)
}

export const UNITS: Record<string, Unit> = {
  // Volume (Base: ml)
  'ml': { id: 'ml', label: 'ml', type: 'volume', toBase: 1 },
  'l': { id: 'l', label: 'l', type: 'volume', toBase: 1000 },
  'pinch': { id: 'pinch', label: 'pinch', type: 'volume', toBase: 0.3 },
  'dash': { id: 'dash', label: 'dash', type: 'volume', toBase: 0.6 },
  'tsp': { id: 'tsp', label: 'tsp', type: 'volume', toBase: 4.92892 },
  'tbsp': { id: 'tbsp', label: 'tbsp', type: 'volume', toBase: 14.7868 },
  'fl oz': { id: 'fl oz', label: 'fl oz', type: 'volume', toBase: 29.5735 },
  'cup': { id: 'cup', label: 'cup', type: 'volume', toBase: 236.588 },
  'pt': { id: 'pt', label: 'pt', type: 'volume', toBase: 473.176 },
  'qt': { id: 'qt', label: 'qt', type: 'volume', toBase: 946.353 },
  'gal': { id: 'gal', label: 'gal', type: 'volume', toBase: 3785.41 },
  
  // Weight (Base: g)
  'g': { id: 'g', label: 'g', type: 'weight', toBase: 1 },
  'kg': { id: 'kg', label: 'kg', type: 'weight', toBase: 1000 },
  'mg': { id: 'mg', label: 'mg', type: 'weight', toBase: 0.001 },
  'oz': { id: 'oz', label: 'oz', type: 'weight', toBase: 28.3495 },
  'lb': { id: 'lb', label: 'lb', type: 'weight', toBase: 453.592 },

  // Counts / Other (Base: 1)
  'clove': { id: 'clove', label: 'clove', type: 'count', toBase: 1 },
  'slice': { id: 'slice', label: 'slice', type: 'count', toBase: 1 },
  'piece': { id: 'piece', label: 'piece', type: 'count', toBase: 1 },
  'whole': { id: 'whole', label: 'whole', type: 'count', toBase: 1 },
};

export type UnitSystem = 'original' | 'metric' | 'us' | 'smart';

export function convertUnit(quantity: number, fromUnitId: string, toUnitId: string): number {
  const fromUnit = UNITS[fromUnitId];
  const toUnit = UNITS[toUnitId];

  if (!fromUnit || !toUnit || fromUnit.type !== toUnit.type) {
    return quantity; // Cannot convert
  }

  const baseValue = quantity * fromUnit.toBase;
  return baseValue / toUnit.toBase;
}

export function getCompatibleUnits(unitId: string): Unit[] {
  const unit = UNITS[unitId];
  if (!unit) return [];
  // For 'count' type measurements, we shouldn't allow changing the unit
  // as they aren't actually synonymous (e.g., 1 clove is not 1 piece).
  if (unit.type === 'count') return [unit];
  return Object.values(UNITS).filter(u => u.type === unit.type);
}

export function simplifyUnit(quantity: number, unitId: string): { quantity: number; unit: string } {
  const unit = UNITS[unitId];
  if (!unit || unit.type === 'count') return { quantity, unit: unitId };

  // Sort units from largest to smallest
  const compatibleUnits = getCompatibleUnits(unitId).sort((a, b) => b.toBase - a.toBase);
  const baseValue = quantity * unit.toBase;

  // For US volume, we want to prioritize common units like cup, tbsp, tsp
  const usVolumeOrder = ['gal', 'qt', 'pt', 'cup', 'fl oz', 'tbsp', 'tsp'];
  
  if (unit.type === 'volume') {
      for (const targetId of usVolumeOrder) {
          const targetUnit = UNITS[targetId];
          if (!targetUnit) continue;
          const newQuantity = baseValue / targetUnit.toBase;
          
          // Use the largest unit where the quantity is >= 0.75 (except for tsp where we go lower)
          if (newQuantity >= 0.75 || (targetId === 'tsp' && newQuantity > 0)) {
              return { quantity: newQuantity, unit: targetId };
          }
      }
  }

  // General fallback for other types
  for (const targetUnit of compatibleUnits) {
    const newQuantity = baseValue / targetUnit.toBase;
    if (newQuantity >= 1 && newQuantity < 1000) {
       return { quantity: newQuantity, unit: targetUnit.id };
    }
  }

  return { quantity, unit: unitId };
}

export function convertForSystem(quantity: number, unitId: string, system: UnitSystem): { quantity: number; unit: string } {
    if (system === 'original') return { quantity, unit: unitId };
    
    const unit = UNITS[unitId];
    if (!unit || unit.type === 'count') return { quantity, unit: unitId };

    if (system === 'smart') {
        return simplifyUnit(quantity, unitId);
    }

    if (system === 'metric') {
        if (unit.type === 'volume') {
            const baseMl = quantity * unit.toBase;
            if (baseMl >= 1000) return { quantity: baseMl / 1000, unit: 'l' };
            return { quantity: baseMl, unit: 'ml' };
        }
        if (unit.type === 'weight') {
            const baseG = quantity * unit.toBase;
            if (baseG >= 1000) return { quantity: baseG / 1000, unit: 'kg' };
            return { quantity: baseG, unit: 'g' };
        }
    }

    if (system === 'us') {
        // Just use simplifyUnit but maybe we can be more specific later
        return simplifyUnit(quantity, unitId);
    }

    return { quantity, unit: unitId };
}
