// Constants - make the code self-documenting
export const NULLISH_VALUES = [null, undefined] as const;
export const SORTABLE_PRIMITIVE_TYPES = [
  'string',
  'number',
  'boolean',
] as const;

// Type definitions that make sense
export type NullishValue = (typeof NULLISH_VALUES)[number];
export type SortablePrimitiveType = (typeof SORTABLE_PRIMITIVE_TYPES)[number];
export type ObjectType = Record<string | symbol, unknown>;
export type SortedEntry = [string | symbol, unknown];
export type NonSortableType =
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

export type SortOptions = {
  ascending: boolean;
  sortPrimitiveArrays: boolean;
};
