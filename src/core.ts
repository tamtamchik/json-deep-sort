import { SortOptions } from './types';
import { isPrimitive, isNonSortableObject, isObject } from './type-guards';
import { sortArray } from './array-sorter';
import { sortObject } from './object-sorter';

export function sortRecursively<T>(data: T, options: SortOptions): T {
  if (Array.isArray(data)) {
    return sortArray(data, options) as T;
  }

  if (isPrimitive(data) || isNonSortableObject(data)) {
    return data;
  }

  if (isObject(data)) {
    return sortObject(data, options) as T;
  }

  return data;
}
