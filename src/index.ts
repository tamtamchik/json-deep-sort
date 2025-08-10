// Type definitions
type ObjectType = Record<string | symbol, unknown>;
type SortedEntry = [string | symbol, unknown];
type NonSortableType =
  | Date
  | RegExp
  | (() => unknown)
  | ((...args: unknown[]) => unknown)
  | Error
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>;

type SortOptions = {
  ascending: boolean;
  sortPrimitiveArrays: boolean;
};

// Main public API
export function sort<T>(
  data: T,
  ascending = true,
  sortPrimitiveArrays = false
): T {
  const options: SortOptions = { ascending, sortPrimitiveArrays };
  return sortRecursively(data, options);
}

// Core recursive sorting logic
function sortRecursively<T>(data: T, options: SortOptions): T {
  if (isPrimitive(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return sortArray(data, options) as T;
  }

  if (isObject(data) && !isNonSortableObject(data)) {
    return sortObject(data, options) as T;
  }

  return data;
}

// Array sorting logic
function sortArray<T>(array: T[], options: SortOptions): T[] {
  if (shouldSortPrimitiveArray(array, options.sortPrimitiveArrays)) {
    return sortPrimitiveArray(array, options.ascending) as T[];
  }

  return array.map((item) => sortRecursively(item, options));
}

// Object sorting logic
function sortObject(obj: ObjectType, options: SortOptions): ObjectType {
  const entries = collectObjectEntries(obj);
  const sortedEntries = sortObjectEntries(entries, options.ascending);

  return createSortedObject(sortedEntries, options);
}

// Primitive array sorting
function shouldSortPrimitiveArray(
  array: unknown[],
  sortPrimitiveArrays: boolean
): boolean {
  return (
    sortPrimitiveArrays && array.length > 0 && allItemsArePrimitives(array)
  );
}

function allItemsArePrimitives(array: unknown[]): boolean {
  return array.every((item) => isPrimitive(item));
}

function sortPrimitiveArray(array: unknown[], ascending: boolean): unknown[] {
  if (!allItemsHaveSameType(array)) {
    return array; // Mixed types maintain original order
  }

  return [...array].sort((a, b) => comparePrimitives(a, b, ascending));
}

function allItemsHaveSameType(array: unknown[]): boolean {
  if (array.length === 0) return true;

  const firstType = typeof array[0];
  return array.every((item) => typeof item === firstType);
}

function comparePrimitives(a: unknown, b: unknown, ascending: boolean): number {
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

function compareNumbers(a: number, b: number, ascending: boolean): number {
  if (Number.isNaN(a) && Number.isNaN(b)) return 0;
  if (Number.isNaN(a)) return 1;
  if (Number.isNaN(b)) return -1;

  return ascending ? a - b : b - a;
}

function compareBooleans(a: boolean, b: boolean, ascending: boolean): number {
  if (a === b) return 0;
  if (a) return ascending ? 1 : -1;
  return ascending ? -1 : 1;
}

// Object entry handling
function collectObjectEntries(obj: ObjectType): SortedEntry[] {
  const stringEntries = Object.entries(obj);
  const symbolEntries = Object.getOwnPropertySymbols(obj).map(
    (symbol) => [symbol, obj[symbol]] as SortedEntry
  );

  return [...stringEntries, ...symbolEntries];
}

function sortObjectEntries(
  entries: SortedEntry[],
  ascending: boolean
): SortedEntry[] {
  return entries.sort(([keyA], [keyB]) =>
    compareObjectKeys(keyA, keyB, ascending)
  );
}

function compareObjectKeys(
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

function createSortedObject(
  entries: SortedEntry[],
  options: SortOptions
): ObjectType {
  const sortedEntries = entries.map(([key, value]) => [
    key,
    sortRecursively(value, options),
  ]);

  return Object.fromEntries(sortedEntries);
}

// Type guards
function isPrimitive(data: unknown): boolean {
  return (
    data === null ||
    data === undefined ||
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  );
}

function isObject(data: unknown): data is ObjectType {
  return typeof data === 'object' && data !== null;
}

function isNonSortableObject(obj: unknown): obj is NonSortableType {
  const nonSortableTypes = [
    Date,
    RegExp,
    Function,
    Error,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Promise,
  ];

  return (
    nonSortableTypes.some((type) => obj instanceof type) ||
    Symbol.iterator in Object(obj)
  );
}
