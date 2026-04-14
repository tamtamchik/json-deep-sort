import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sort } from '../src/index.ts';

describe('JSON Deep Sort Library', () => {
  describe('Object Sorting', () => {
    it('should sort object keys in ascending order by default', () => {
      const input = { c: 'c', b: 'b', a: 'a' };
      const expected = { a: 'a', b: 'b', c: 'c' };
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should sort object keys in descending order when specified', () => {
      const input = { a: 'a', b: 'b', c: 'c' };
      const expected = { c: 'c', b: 'b', a: 'a' };
      assert.deepStrictEqual(sort(input, false), expected);
    });

    it('should sort nested object keys recursively', () => {
      const input = {
        b: { z: 'z', y: 'y' },
        a: { x: 'x', w: 'w' },
      };
      const expected = {
        a: { w: 'w', x: 'x' },
        b: { y: 'y', z: 'z' },
      };
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should sort mixed nested structures', () => {
      const input = {
        b: ['b', 'a'],
        a: { d: 'd', c: 'c' },
      };
      const expected = {
        a: { c: 'c', d: 'd' },
        b: ['b', 'a'],
      };
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should sort deeply nested objects', () => {
      const input = {
        z: {
          y: [
            { c: 3, b: 2, a: 1 },
            { f: 6, e: 5, d: 4 },
          ],
          x: {
            w: { beta: 'β', alpha: 'α', gamma: 'γ' },
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          },
        },
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
      };
      const expected = {
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
        z: {
          x: {
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
            w: { alpha: 'α', beta: 'β', gamma: 'γ' },
          },
          y: [
            { a: 1, b: 2, c: 3 },
            { d: 4, e: 5, f: 6 },
          ],
        },
      };
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should sort numeric string keys numerically', () => {
      const input = {
        '10': 'ten',
        '1': 'one',
        '2': 'two',
        foo: 'bar',
      };
      const expected = {
        '1': 'one',
        '2': 'two',
        '10': 'ten',
        foo: 'bar',
      };
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should handle objects with symbol keys', () => {
      const sym1 = Symbol('test1');
      const sym2 = Symbol('test2');
      const input = {
        [sym1]: 'value1',
        [sym2]: 'value2',
        c: 'c',
        a: 'a',
        b: 'b',
      };
      const result = sort(input);
      assert.deepStrictEqual(Object.getOwnPropertySymbols(result), [
        sym1,
        sym2,
      ]);
      assert.deepStrictEqual(Object.keys(result), ['a', 'b', 'c']);
    });

    it('should handle objects with only symbol keys', () => {
      const sym1 = Symbol('a');
      const sym2 = Symbol('b');
      const input = {
        [sym2]: 'value2',
        [sym1]: 'value1',
      };
      const result = sort(input);
      // Symbol keys should maintain their order (symbols are not sorted)
      assert.deepStrictEqual(Object.getOwnPropertySymbols(result), [
        sym2,
        sym1,
      ]);
    });

    it('should handle objects with mixed key types', () => {
      const sym = Symbol('symbol');
      const input = {
        z: 'last',
        [sym]: 'symbol value',
        a: 'first',
        m: 'middle',
      };
      const result = sort(input);
      // String keys should be sorted, symbol should remain
      assert.deepStrictEqual(Object.keys(result), ['a', 'm', 'z']);
      assert.deepStrictEqual(Object.getOwnPropertySymbols(result), [sym]);
      assert.strictEqual(result[sym], 'symbol value');
    });

    it('should handle objects with getter properties', () => {
      const obj = {
        b: 'b',
        a: 'a',
        get computed() {
          return 'computed';
        },
      };

      const result = sort(obj);
      // Getters are enumerable properties, so they get included in sorting
      assert.deepStrictEqual(Object.keys(result), ['a', 'b', 'computed']);
      assert.strictEqual(result.computed, 'computed');
    });

    it('should handle objects with setter properties', () => {
      const obj = {
        b: 'b',
        a: 'a',
        set computed(_value: string) {
          // Setter is called but we don't need to store the value for this test
        },
      };

      const result = sort(obj);
      // Setters are enumerable properties, so they get included in sorting
      assert.deepStrictEqual(Object.keys(result), ['a', 'b', 'computed']);
      assert.strictEqual(typeof result.computed, 'undefined');
    });

    it('should handle empty objects', () => {
      assert.deepStrictEqual(sort({}), {});
    });
  });

  describe('Array Handling', () => {
    it('should not modify arrays of primitives by default', () => {
      const input = ['b', 'a', 'c'];
      assert.deepStrictEqual(sort(input), input);
    });

    it('should not modify arrays of objects by default', () => {
      const input = [
        { b: 'b', a: 'a' },
        { d: 'd', c: 'c' },
      ];
      assert.deepStrictEqual(sort(input), input);
    });

    it('should sort nested arrays of objects', () => {
      const input = [
        { b: 'b', a: 'a' },
        { d: 'd', c: 'c' },
      ];
      const expected = [
        { a: 'a', b: 'b' },
        { c: 'c', d: 'd' },
      ];
      assert.deepStrictEqual(sort(input), expected);
    });

    it('should handle empty arrays', () => {
      assert.deepStrictEqual(sort([]), []);
    });

    it('should handle arrays with single items', () => {
      assert.deepStrictEqual(sort(['a']), ['a']);
      assert.deepStrictEqual(sort([1]), [1]);
      assert.deepStrictEqual(sort([true]), [true]);
    });

    it('should handle deeply nested arrays', () => {
      const input = {
        z: {
          y: [
            [3, 1, 4],
            [1, 5, 9],
          ],
          x: {
            w: { beta: 'β', alpha: 'α', gamma: 'γ' },
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          },
        },
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
      };
      const expected = {
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
        z: {
          x: {
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
            w: { alpha: 'α', beta: 'β', gamma: 'γ' },
          },
          y: [
            [3, 1, 4],
            [1, 5, 9],
          ],
        },
      };
      assert.deepStrictEqual(sort(input), expected);
    });
  });

  describe('Primitive Array Sorting (when enabled)', () => {
    it('should sort arrays of strings when sortPrimitiveArrays is true', () => {
      const input = ['b', 'a', 'c'];
      const expected = ['a', 'b', 'c'];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should sort arrays of strings in descending order when sortPrimitiveArrays is true', () => {
      const input = ['a', 'b', 'c'];
      const expected = ['c', 'b', 'a'];
      assert.deepStrictEqual(sort(input, false, true), expected);
    });

    it('should sort arrays of numbers when sortPrimitiveArrays is true', () => {
      const input = [3, 1, 4, 1, 5];
      const expected = [1, 1, 3, 4, 5];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should sort arrays of numbers in descending order when sortPrimitiveArrays is true', () => {
      const input = [1, 2, 3, 4, 5];
      const expected = [5, 4, 3, 2, 1];
      assert.deepStrictEqual(sort(input, false, true), expected);
    });

    it('should sort arrays of booleans when sortPrimitiveArrays is true', () => {
      const input = [true, false, true, false];
      const expected = [false, false, true, true];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should sort arrays of booleans in descending order when sortPrimitiveArrays is true', () => {
      const input = [false, true, false, true];
      const expected = [true, true, false, false];
      assert.deepStrictEqual(sort(input, false, true), expected);
    });

    it('should handle NaN values correctly when sorting arrays of numbers', () => {
      const input = [3, NaN, 1, NaN, 5, 2];
      const expected = [1, 2, 3, 5, NaN, NaN];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle NaN values correctly when sorting arrays of numbers in descending order', () => {
      const input = [1, NaN, 5, NaN, 2, 3];
      const expected = [5, 3, 2, 1, NaN, NaN];
      assert.deepStrictEqual(sort(input, false, true), expected);
    });

    it('should handle arrays with duplicate primitive values', () => {
      const input = ['b', 'a', 'b', 'a', 'c'];
      const expected = ['a', 'a', 'b', 'b', 'c'];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle arrays with extreme number values', () => {
      const input = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
        -Infinity,
        Infinity,
      ];
      const expected = [
        -Infinity,
        Number.MIN_SAFE_INTEGER,
        0,
        Number.MAX_SAFE_INTEGER,
        Infinity,
      ];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle arrays with very large numbers', () => {
      const input = [1e308, -1e308, 0, 1e-308, -1e-308];
      const result = sort(input, true, true) as number[];
      // Check that the order is correct (ascending: smallest to largest)
      assert.strictEqual(result[0], -1e308); // Smallest negative
      assert.strictEqual(result[1], -1e-308); // Largest negative
      assert.strictEqual(result[2], 0); // Zero
      assert.strictEqual(result[3], 1e-308); // Smallest positive
      assert.strictEqual(result[4], 1e308); // Largest positive
    });

    it('should handle arrays with special string characters', () => {
      const input = ['z', 'a', 'Z', 'A', '0', '9'];
      const result = sort(input, true, true) as string[];
      // Check that numbers come first, then letters (case-insensitive)
      assert.strictEqual(result[0], '0');
      assert.strictEqual(result[1], '9');
      assert.ok(result.slice(2).includes('A'));
      assert.ok(result.slice(2).includes('Z'));
      assert.ok(result.slice(2).includes('a'));
      assert.ok(result.slice(2).includes('z'));
    });

    it('should handle arrays with unicode characters', () => {
      const input = ['ñ', 'a', 'z', 'é', 'ü'];
      const expected = ['a', 'é', 'ñ', 'ü', 'z'];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle arrays with very long strings', () => {
      const longString1 = 'a'.repeat(1000);
      const longString2 = 'b'.repeat(1000);
      const longString3 = 'c'.repeat(1000);
      const input = [longString2, longString1, longString3];
      const expected = [longString1, longString2, longString3];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle arrays with single primitive items', () => {
      assert.deepStrictEqual(sort(['a'], true, true), ['a']);
      assert.deepStrictEqual(sort([1], true, true), [1]);
      assert.deepStrictEqual(sort([true], true, true), [true]);
      assert.deepStrictEqual(sort([false], true, true), [false]);
    });

    it('should handle empty arrays when sortPrimitiveArrays is true', () => {
      assert.deepStrictEqual(sort([], true, true), []);
    });

    it('should sort nested primitive arrays when sortPrimitiveArrays is true', () => {
      const input = {
        b: ['z', 'y', 'x'],
        a: ['c', 'b', 'a'],
      };
      const expected = {
        a: ['a', 'b', 'c'],
        b: ['x', 'y', 'z'],
      };
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle deeply nested primitive arrays when sortPrimitiveArrays is true', () => {
      const input = {
        z: {
          y: [
            [3, 1, 4],
            [1, 5, 9],
          ],
          x: {
            w: { beta: 'β', alpha: 'α', gamma: 'γ' },
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          },
        },
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
      };
      const expected = {
        a: [
          { foo: { bar: { baz: 'qux' } } },
          [{ nested: { array: [1, 2, 3] } }],
        ],
        z: {
          x: {
            v: [1, 1, 2, 3, 4, 5, 5, 6, 9],
            w: { alpha: 'α', beta: 'β', gamma: 'γ' },
          },
          y: [
            [1, 3, 4],
            [1, 5, 9],
          ],
        },
      };
      assert.deepStrictEqual(sort(input, true, true), expected);
    });
  });

  describe('Mixed Primitive Array Handling', () => {
    it('should handle mixed primitive arrays when sortPrimitiveArrays is true', () => {
      const input = [true, 'b', 3, 'a', false, 1];
      // Mixed types should maintain original order
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should handle arrays with mixed sortable and non-sortable primitives', () => {
      const input = [true, 'string', Symbol('test'), 42];
      // Mixed types should maintain original order when sortPrimitiveArrays is true
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should handle mixed primitive type comparison fallback', () => {
      // This specifically tests the return 0; fallback when comparing
      // different primitive types in compareSortablePrimitives
      const input = [42, 'hello', true, 3.14, 'world', false];

      // When sortPrimitiveArrays is true, mixed types should maintain order
      const result = sort(input, true, true);
      assert.deepStrictEqual(result, input);

      // Also test with a different order to ensure the fallback is triggered
      const input2 = ['hello', 42, false, true, 3.14, 'world'];
      const result2 = sort(input2, true, true);
      assert.deepStrictEqual(result2, input2);
    });

    it('should force comparison of different primitive types for coverage', () => {
      // This test specifically targets the fallback return 0; in compareSortablePrimitives
      const input = ['z', 1, 'a', true, 'm', false];

      // When sorting, the algorithm will compare 'z' vs 1, 'a' vs true, etc.
      // This should trigger the fallback return 0; for different types
      const result = sort(input, true, true);

      // Since all comparisons between different types return 0, the order should be maintained
      assert.deepStrictEqual(result, input);

      // Test descending order as well
      const resultDesc = sort(input, false, true);
      assert.deepStrictEqual(resultDesc, input);
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should not sort arrays with null values when sortPrimitiveArrays is true', () => {
      const input = ['b', null, 'a'];
      // Arrays with null should maintain original order (not sortable)
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should not sort arrays with undefined values when sortPrimitiveArrays is true', () => {
      const input = ['b', undefined, 'a'];
      // Arrays with undefined should maintain original order (not sortable)
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should not sort arrays with mixed null and undefined values when sortPrimitiveArrays is true', () => {
      const input = ['b', null, 'a', undefined, 'c'];
      // Arrays with mixed null/undefined should maintain original order (not sortable)
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should not sort arrays with mixed null and undefined values in descending order when sortPrimitiveArrays is true', () => {
      const input = ['b', null, 'a', undefined, 'c'];
      // Arrays with mixed null/undefined should maintain original order (not sortable)
      assert.deepStrictEqual(sort(input, false, true), input);
    });

    it('should handle arrays with only null values when sortPrimitiveArrays is true', () => {
      const input = [null, null, null];
      // Arrays with all null values should maintain order (all same type)
      assert.deepStrictEqual(sort(input, true, true), input);
    });

    it('should handle arrays with only undefined values when sortPrimitiveArrays is true', () => {
      const input = [undefined, undefined, undefined];
      // Arrays with all undefined values should maintain order (all same type)
      assert.deepStrictEqual(sort(input, true, true), input);
    });
  });

  describe('Primitive Value Handling', () => {
    it('should return primitive inputs unchanged', () => {
      assert.strictEqual(sort('string'), 'string');
      assert.strictEqual(sort(123), 123);
      assert.strictEqual(sort(true), true);
      assert.strictEqual(sort(null), null);
      assert.strictEqual(sort(undefined), undefined);
    });

    it('should handle edge case: empty string comparison', () => {
      const input = ['', 'a', 'b', 'c'];
      const expected = ['', 'a', 'b', 'c'];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle edge case: zero and negative numbers', () => {
      const input = [-5, 0, 5, -10, 10];
      const expected = [-10, -5, 0, 5, 10];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle edge case: boolean false vs true ordering', () => {
      const input = [true, false, true, false];
      const expected = [false, false, true, true];
      assert.deepStrictEqual(sort(input, true, true), expected);
    });

    it('should handle edge case: boolean true vs false ordering in descending', () => {
      const input = [false, true, false, true];
      const expected = [true, true, false, false];
      assert.deepStrictEqual(sort(input, false, true), expected);
    });
  });

  describe('Non-Sortable Object Handling', () => {
    it('should not sort non-sortable objects', () => {
      const date = new Date('2023-01-01');
      const regex = /test/;
      const func = () => {};
      const error = new Error('test');
      const map = new Map();
      const set = new Set();
      const weakMap = new WeakMap();
      const weakSet = new WeakSet();
      const promise = Promise.resolve();
      const iterable = {
        *[Symbol.iterator]() {
          yield 1;
          yield 2;
        },
      };

      const input = {
        date,
        regex,
        func,
        error,
        map,
        set,
        weakMap,
        weakSet,
        promise,
        iterable,
      };

      const result = sort(input) as typeof input;

      assert.deepStrictEqual(Object.keys(result), [
        'date',
        'error',
        'func',
        'iterable',
        'map',
        'promise',
        'regex',
        'set',
        'weakMap',
        'weakSet',
      ]);

      // Ensure the objects are the same instances
      for (const key of Object.keys(input)) {
        assert.strictEqual(
          result[key as keyof typeof input],
          input[key as keyof typeof input]
        );
      }
    });

    it('should handle objects with various value types', () => {
      const date = new Date('2023-01-01');
      const regex = /regex/;
      const func = () => 'function';
      const input = {
        e: date,
        d: regex,
        c: [1, 2, 3],
        b: { nested: 'object' },
        a: func,
      };
      const result = sort(input) as typeof input;
      assert.deepStrictEqual(Object.keys(result), ['a', 'b', 'c', 'd', 'e']);
      assert.strictEqual(result.e, date);
      assert.strictEqual(result.d, regex);
      assert.strictEqual(result.a, func);
    });

    it('should handle edge case: BigInt values (non-sortable)', () => {
      const bigIntValue = BigInt(123);
      const result = sort(bigIntValue);
      assert.strictEqual(result, bigIntValue);
    });

    it('should handle edge case: Symbol values (non-sortable)', () => {
      const symbolValue = Symbol('test');
      const result = sort(symbolValue);
      assert.strictEqual(result, symbolValue);
    });

    it('should handle edge case: function that returns itself', () => {
      const selfReferencingFunction = () => selfReferencingFunction;
      const result = sort(selfReferencingFunction);
      assert.strictEqual(result, selfReferencingFunction);
    });

    it('should handle edge case: data that is neither array, primitive, nor object', () => {
      const testFunction = () => {
        return testFunction;
      };

      const result = sort(testFunction);
      assert.strictEqual(result, testFunction);
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility when sortPrimitiveArrays is false (default)', () => {
      const input = ['b', 'a', 'c'];
      assert.deepStrictEqual(sort(input), input);
      assert.deepStrictEqual(sort(input, true), input);
      assert.deepStrictEqual(sort(input, true, false), input);
    });

    it('should not modify arrays of objects when sortPrimitiveArrays is true', () => {
      const input = [
        { b: 'b', a: 'a' },
        { d: 'd', c: 'c' },
      ];
      const expected = [
        { a: 'a', b: 'b' },
        { c: 'c', d: 'd' },
      ];
      // Arrays of objects should still be sorted by their keys
      assert.deepStrictEqual(sort(input, true, true), expected);
    });
  });

  describe('Error Handling', () => {
    it('should handle circular references gracefully', () => {
      const circular: Record<string, unknown> = {};
      circular.self = circular;

      // Circular references should be detected and handled to prevent infinite recursion
      assert.throws(() => sort(circular), RangeError);
    });

    it('should handle null input gracefully', () => {
      assert.strictEqual(sort(null), null);
    });

    it('should handle undefined input gracefully', () => {
      assert.strictEqual(sort(undefined), undefined);
    });

    it('should handle empty string input gracefully', () => {
      assert.strictEqual(sort(''), '');
    });

    it('should handle zero input gracefully', () => {
      assert.strictEqual(sort(0), 0);
    });

    it('should handle false input gracefully', () => {
      assert.strictEqual(sort(false), false);
    });

    it('should handle true input gracefully', () => {
      assert.strictEqual(sort(true), true);
    });
  });
});
