import { SortOptions } from './types';
import { sortRecursively } from './core';

export function sort<T>(
  data: T,
  ascending = true,
  sortPrimitiveArrays = false
): T {
  const options: SortOptions = { ascending, sortPrimitiveArrays };
  return sortRecursively(data, options);
}

// Re-export types for convenience
export type {
  SortOptions,
  ObjectType,
  SortedEntry,
  NonSortableType,
} from './types';
