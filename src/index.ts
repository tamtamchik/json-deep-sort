// Type definitions for object types and non-sortable types
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

// Main sorting function that can handle various data types
export function sort<T>(
  data: T,
  ascending = true,
  sortPrimitiveArrays = false
): T {
  return sortRecursively(data, ascending, sortPrimitiveArrays);
}

// Recursive function to sort nested structures
function sortRecursively<T>(
  data: T,
  ascending: boolean,
  sortPrimitiveArrays: boolean
): T {
  if (!isObject(data) || Array.isArray(data) || isNonSortableObject(data)) {
    if (Array.isArray(data)) {
      // If sortPrimitiveArrays is true and all items are primitives, sort the array
      if (
        sortPrimitiveArrays &&
        data.length > 0 &&
        data.every((item) => isPrimitive(item))
      ) {
        return [...data].sort((a, b) => {
          if (typeof a === 'string' && typeof b === 'string') {
            return ascending ? a.localeCompare(b) : b.localeCompare(a);
          }
          if (typeof a === 'number' && typeof b === 'number') {
            return ascending ? a - b : b - a;
          }
          if (typeof a === 'boolean' && typeof b === 'boolean') {
            return ascending
              ? a === b
                ? 0
                : a
                  ? 1
                  : -1
              : a === b
                ? 0
                : a
                  ? -1
                  : 1;
          }
          // For mixed types or other primitives, maintain original order
          return 0;
        }) as T;
      }
      // Otherwise, recursively sort array items
      return data.map((item) =>
        sortRecursively(item, ascending, sortPrimitiveArrays)
      ) as T;
    }
    return data;
  }

  return sortObject(data as ObjectType, ascending, sortPrimitiveArrays) as T;
}

// Helper function to check if a value is an object
function isObject(data: unknown): data is ObjectType {
  return typeof data === 'object' && data !== null;
}

function isPrimitive(data: unknown): boolean {
  return (
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  );
}

// Function to sort object properties
function sortObject(
  obj: ObjectType,
  ascending: boolean,
  sortPrimitiveArrays: boolean
): ObjectType {
  const entries = [
    ...Object.entries(obj),
    ...Object.getOwnPropertySymbols(obj).map(
      (sym) => [sym, obj[sym]] as SortedEntry
    ),
  ];

  const sortedEntries = entries.sort(([keyA], [keyB]) => {
    if (typeof keyA === 'symbol' && typeof keyB === 'symbol') return 0;
    if (typeof keyA === 'symbol') return 1;
    if (typeof keyB === 'symbol') return -1;
    return ascending
      ? (keyA as string).localeCompare(keyB as string)
      : (keyB as string).localeCompare(keyA as string);
  });

  return Object.fromEntries(
    sortedEntries.map(([key, value]) => [
      key,
      sortRecursively(value, ascending, sortPrimitiveArrays),
    ])
  );
}

// Helper function to check if an object is of a non-sortable type
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
