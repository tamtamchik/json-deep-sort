/**
 * Function to sort JSON data.
 * @param {unknown} data - The data to be sorted.
 * @param {boolean} [asc=true] - Whether to sort in ascending order.
 * @returns {unknown} The sorted data.
 */
export function sort(data: unknown, asc: boolean = true): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sort(item, asc));
  }

  if (isNonSortableObject(data)) {
    return data;
  }

  const sortedEntries = Object.entries(data as Record<string, unknown>)
    .sort(([a], [b]) => asc ? a.localeCompare(b) : b.localeCompare(a));
  
  return Object.fromEntries(
    sortedEntries.map(([key, value]) => [key, sort(value, asc)])
  );
}

function isNonSortableObject(obj: object): boolean {
  return (
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Function ||
    obj instanceof Error ||
    obj instanceof Map ||
    obj instanceof Set ||
    obj instanceof WeakMap ||
    obj instanceof WeakSet ||
    obj instanceof Promise ||
    Symbol.iterator in Object(obj)
  );
}
