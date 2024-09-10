// Types that represent the structure of our data
type ObjectType = Record<string | symbol, unknown>;
type SortedEntry = [string | symbol, unknown];
type NonSortableType = Date | RegExp | Function | Error | Map<unknown, unknown> | Set<unknown> | WeakMap<object, unknown> | WeakSet<object> | Promise<unknown>;

/**
 * The Grand Sorting Function
 * 
 * This function is the entry point for our sorting adventure.
 * It takes any data and returns it sorted, like a well-organized closet.
 * 
 * @template T - The type of data we're dealing with. Could be anything!
 * @param {T} data - The messy data that needs sorting
 * @param {boolean} [ascending=true] - Do we sort A-Z (true) or Z-A (false)?
 * @returns {T} - The same data, but neatly organized
 */
export function sort<T>(data: T, ascending: boolean = true): T {
  return sortWithCache(data, ascending, new WeakMap());
}

/**
 * The Recursive Sorting Wizard
 * 
 * This function does the heavy lifting. It sorts the data
 * and uses a cache to avoid getting stuck in circular references.
 * 
 * @template T - The type of our data (could be anything!)
 * @param {T} data - The data we're currently sorting
 * @param {boolean} ascending - The direction of our sort
 * @param {WeakMap<object, T>} cache - Our circular reference safety net
 * @returns {T} - The sorted version of our input
 */
function sortWithCache<T>(data: T, ascending: boolean, cache: WeakMap<object, T>): T {
  if (!isObject(data)) return data;
  if (Array.isArray(data)) return data.map(item => sortWithCache(item, ascending, cache)) as T;
  if (isNonSortableObject(data)) return data;

  if (cache.has(data as object)) {
    return cache.get(data as object) as T;
  }

  const result = {} as T;
  cache.set(data as object, result);

  return sortObject(data as ObjectType, ascending, cache) as T;
}

/**
 * The Object Detector
 * 
 * This function checks if something is an object.
 * It's like a metal detector, but for objects!
 * 
 * @param {unknown} data - The mysterious data we're investigating
 * @returns {boolean} - True if it's an object, false otherwise
 */
function isObject(data: unknown): data is ObjectType {
  return typeof data === 'object' && data !== null;
}

/**
 * The Object Sorter
 * 
 * This function takes an object and sorts its keys.
 * It's like alphabetizing a bookshelf, but for object properties.
 * 
 * @param {ObjectType} obj - The object we're sorting
 * @param {boolean} ascending - The direction of our sort
 * @param {WeakMap<object, unknown>} cache - Our circular reference safety net
 * @returns {ObjectType} - A new object with sorted keys
 */
function sortObject(obj: ObjectType, ascending: boolean, cache: WeakMap<object, unknown>): ObjectType {
  const entries = [...Object.entries(obj), ...Object.getOwnPropertySymbols(obj).map(sym => [sym, obj[sym]] as SortedEntry)];
  
  const sortedEntries = entries.sort(([keyA], [keyB]) => {
    if (typeof keyA === 'symbol' && typeof keyB === 'symbol') return 0;
    if (typeof keyA === 'symbol') return 1;
    if (typeof keyB === 'symbol') return -1;
    return ascending ? (keyA as string).localeCompare(keyB as string) : (keyB as string).localeCompare(keyA as string);
  });

  return Object.fromEntries(sortedEntries.map(([key, value]) => [key, sortWithCache(value, ascending, cache)]));
}

/**
 * The Unsortable Object Identifier
 * 
 * This function checks if an object is one of those special snowflakes
 * that we can't (or shouldn't) sort. It's like a bouncer for a "No Sorting Allowed" club.
 * 
 * @param {unknown} obj - The object we're checking
 * @returns {boolean} - True if it's a special unsortable object, false otherwise
 */
function isNonSortableObject(obj: unknown): obj is NonSortableType {
  const nonSortableTypes: Array<new (...args: any[]) => NonSortableType> = [
    Date, RegExp, Function, Error, Map, Set, WeakMap, WeakSet, Promise
  ];
  return nonSortableTypes.some(type => obj instanceof type) || Symbol.iterator in Object(obj);
}
