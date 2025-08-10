import { SortOptions, ObjectType, SortedEntry } from './types';
import { compareObjectKeys } from './comparators';

export function sortObject(obj: ObjectType, options: SortOptions): ObjectType {
  const entries = collectObjectEntries(obj);
  const sortedEntries = sortObjectEntries(entries, options.ascending);
  return createSortedObject(sortedEntries, options);
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

import { sortRecursively } from './core';
