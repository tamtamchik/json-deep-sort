// Comparison functions for different data types
export function compareSortablePrimitives(
  a: unknown,
  b: unknown,
  ascending: boolean
): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return compareNumbers(a, b, ascending);
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return compareBooleans(a, b, ascending);
  }

  return 0; // Maintain order for other primitives
}

export function compareNumbers(
  a: number,
  b: number,
  ascending: boolean
): number {
  if (Number.isNaN(a) && Number.isNaN(b)) return 0;
  if (Number.isNaN(a)) return 1;
  if (Number.isNaN(b)) return -1;

  return ascending ? a - b : b - a;
}

export function compareBooleans(
  a: boolean,
  b: boolean,
  ascending: boolean
): number {
  if (a === b) return 0;
  if (a) return ascending ? 1 : -1;
  return ascending ? -1 : 1;
}

export function compareObjectKeys(
  keyA: string | symbol,
  keyB: string | symbol,
  ascending: boolean
): number {
  if (typeof keyA === 'symbol' && typeof keyB === 'symbol') return 0;
  if (typeof keyA === 'symbol') return 1;
  if (typeof keyB === 'symbol') return -1;

  const stringA = keyA as string;
  const stringB = keyB as string;

  return ascending
    ? stringA.localeCompare(stringB)
    : stringB.localeCompare(stringA);
}
