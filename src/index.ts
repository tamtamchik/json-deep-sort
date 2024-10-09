// Type definitions for object types and non-sortable types
type ObjectType = Record<string | symbol, unknown>;
type SortedEntry = [string | symbol, unknown];
type NonSortableType = Date | RegExp | Function | Error | Map<unknown, unknown> | Set<unknown> | WeakMap<object, unknown> | WeakSet<object> | Promise<unknown>;

// Main sorting function that can handle various data types
export function sort<T>(data: T, ascending = true): T {
  return sortRecursively(data, ascending);
}

// Recursive function to sort nested structures
function sortRecursively<T>(data: T, ascending: boolean): T {
  if (!isObject(data) || Array.isArray(data) || isNonSortableObject(data)) {
    return Array.isArray(data) ? data.map(item => sortRecursively(item, ascending)) as T : data;
  }

  return sortObject(data as ObjectType, ascending) as T;
}

// Helper function to check if a value is an object
function isObject(data: unknown): data is ObjectType {
  return typeof data === 'object' && data !== null;
}

// Function to sort object properties
function sortObject(obj: ObjectType, ascending: boolean): ObjectType {
  const entries = [...Object.entries(obj), ...Object.getOwnPropertySymbols(obj).map(sym => [sym, obj[sym]] as SortedEntry)];
  
  const sortedEntries = entries.sort(([keyA], [keyB]) => {
    if (typeof keyA === 'symbol' && typeof keyB === 'symbol') return 0;
    if (typeof keyA === 'symbol') return 1;
    if (typeof keyB === 'symbol') return -1;
    return ascending ? (keyA as string).localeCompare(keyB as string) : (keyB as string).localeCompare(keyA as string);
  });

  return Object.fromEntries(sortedEntries.map(([key, value]) => [key, sortRecursively(value, ascending)]));
}

// Helper function to check if an object is of a non-sortable type
function isNonSortableObject(obj: unknown): obj is NonSortableType {
  const nonSortableTypes = [Date, RegExp, Function, Error, Map, Set, WeakMap, WeakSet, Promise];
  return nonSortableTypes.some(type => obj instanceof type) || Symbol.iterator in Object(obj);
}
