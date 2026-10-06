import type { SortOptions } from './types';
import { isSortablePrimitive, hasNullishValues } from './type-guards';
import { compareSortablePrimitives } from './comparators';

export function sortArray<T>(array: T[], options: SortOptions): T[] {
  if (shouldSortPrimitiveArray(array, options.sortPrimitiveArrays)) {
    return sortPrimitiveArray(array, options.ascending) as T[];
  }

  return array.map((item) => sortRecursively(item, options));
}

function shouldSortPrimitiveArray(
  array: unknown[],
  sortPrimitiveArrays: boolean
): boolean {
  return sortPrimitiveArrays && canSortPrimitiveArray(array);
}

function canSortPrimitiveArray(array: unknown[]): boolean {
  return (
    allItemsAreSortablePrimitives(array) && allItemsHaveSameSortableType(array)
  );
}

function allItemsAreSortablePrimitives(array: unknown[]): boolean {
  return array.every(isSortablePrimitive);
}

function sortPrimitiveArray(array: unknown[], ascending: boolean): unknown[] {
  // The array has already been validated as sortable in canSortPrimitiveArray
  // No need to check allItemsHaveSameSortableType again
  return [...array].sort((a, b) => compareSortablePrimitives(a, b, ascending));
}

function allItemsHaveSameSortableType(array: unknown[]): boolean {
  if (array.length === 0) return true;

  // Don't sort arrays that contain null or undefined values
  // as they represent absence of value and don't have a natural ordering
  if (hasNullishValues(array)) {
    return false;
  }

  // For arrays with only sortable primitives, check if they have the same type
  const firstItem = array[0];
  if (!isSortablePrimitive(firstItem)) return false;

  const expectedType = typeof firstItem;
  return array.every((item) => typeof item === expectedType);
}

import { sortRecursively } from './core';
