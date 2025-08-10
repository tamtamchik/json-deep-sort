import {
  NULLISH_VALUES,
  SORTABLE_PRIMITIVE_TYPES,
  NullishValue,
  NonSortableType,
  ObjectType,
} from './types';

// Type guards - single responsibility, clear naming
export function isNullish(value: unknown): value is NullishValue {
  return NULLISH_VALUES.includes(value as NullishValue);
}

export function hasNullishValues(array: unknown[]): boolean {
  return array.some(isNullish);
}

export function isSortablePrimitive(
  value: unknown
): value is string | number | boolean {
  return SORTABLE_PRIMITIVE_TYPES.includes(
    typeof value as 'string' | 'number' | 'boolean'
  );
}

export function isPrimitive(data: unknown): boolean {
  return isSortablePrimitive(data) || isNullish(data);
}

export function isObject(data: unknown): data is ObjectType {
  return typeof data === 'object' && data !== null;
}

export function isNonSortableObject(obj: unknown): obj is NonSortableType {
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
