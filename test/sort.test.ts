import { sort } from "../src";

describe("sort", () => {
  it("should sort an object in ascending order by default", () => {
    const input = { c: "c", b: "b", a: "a" };
    const expected = { a: "a", b: "b", c: "c" };
    expect(sort(input)).toEqual(expected);
  });

  it("should sort an object in descending order when specified", () => {
    const input = { a: "a", b: "b", c: "c" };
    const expected = { c: "c", b: "b", a: "a" };
    expect(sort(input, false)).toEqual(expected);
  });

  it("should not modify an array of primitives", () => {
    const input = ["b", "a", "c"];
    expect(sort(input)).toEqual(input);
  });

  it("should sort an array of objects", () => {
    const input = [
      { b: "b", a: "a" },
      { d: "d", c: "c" },
    ];
    const expected = [
      { a: "a", b: "b" },
      { c: "c", d: "d" },
    ];
    expect(sort(input)).toEqual(expected);
  });

  it("should sort nested objects", () => {
    const input = {
      b: { z: "z", y: "y" },
      a: { x: "x", w: "w" },
    };
    const expected = {
      a: { w: "w", x: "x" },
      b: { y: "y", z: "z" },
    };
    expect(sort(input)).toEqual(expected);
  });

  it("should handle mixed nested structures", () => {
    const input = {
      b: ["b", "a"],
      a: { d: "d", c: "c" },
    };
    const expected = {
      a: { c: "c", d: "d" },
      b: ["b", "a"],
    };
    expect(sort(input)).toEqual(expected);
  });

  it("should return primitive inputs unchanged", () => {
    expect(sort("string")).toBe("string");
    expect(sort(123)).toBe(123);
    expect(sort(true)).toBe(true);
    expect(sort(null)).toBe(null);
    expect(sort(undefined)).toBe(undefined);
  });

  it("should handle deeply nested objects and arrays", () => {
    const input = {
      z: {
        y: [
          { c: 3, b: 2, a: 1 },
          { f: 6, e: 5, d: 4 },
        ],
        x: {
          w: { beta: "β", alpha: "α", gamma: "γ" },
          v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
        },
      },
      a: [{ foo: { bar: { baz: "qux" } } }, [{ nested: { array: [3, 2, 1] } }]],
    };
    const expected = {
      a: [{ foo: { bar: { baz: "qux" } } }, [{ nested: { array: [3, 2, 1] } }]],
      z: {
        x: {
          v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          w: { alpha: "α", beta: "β", gamma: "γ" },
        },
        y: [
          { a: 1, b: 2, c: 3 },
          { d: 4, e: 5, f: 6 },
        ],
      },
    };
    expect(sort(input)).toEqual(expected);
  });

  it("should handle objects with various value types", () => {
    const date = new Date("2023-01-01");
    const regex = /regex/;
    const func = () => "function";
    const input = {
      e: date,
      d: regex,
      c: [1, 2, 3],
      b: { nested: "object" },
      a: func,
    };
    const expected = {
      a: func,
      b: { nested: "object" },
      c: [1, 2, 3],
      d: regex,
      e: date,
    };
    expect(sort(input)).toEqual(expected);
    expect(sort(input).e).toBe(date);
    expect(sort(input).d).toBe(regex);
    expect(sort(input).a).toBe(func);
  });

  it("should sort keys that are numbers or can be coerced to numbers", () => {
    const input = {
      "10": "ten",
      "1": "one",
      "2": "two",
      foo: "bar",
    };
    const expected = {
      "1": "one",
      "2": "two",
      "10": "ten",
      foo: "bar",
    };
    expect(sort(input)).toEqual(expected);
  });

  it("should not sort non-sortable objects", () => {
    const date = new Date("2023-01-01");
    const regex = /test/;
    const func = () => {};
    const error = new Error("test");
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

    expect(result).toEqual({
      date,
      error,
      func,
      iterable,
      map,
      promise,
      regex,
      set,
      weakMap,
      weakSet,
    });

    // Ensure the objects are the same instances
    Object.keys(input).forEach((key) => {
      expect(result[key as keyof typeof input]).toBe(
        input[key as keyof typeof input]
      );
    });
  });

  it("should handle empty objects and arrays", () => {
    expect(sort({})).toEqual({});
    expect(sort([])).toEqual([]);
  });

  it("should handle objects with symbol keys", () => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");
    const input = {
      [sym1]: "value1",
      [sym2]: "value2",
      c: "c",
      a: "a",
      b: "b",
    };
    const result = sort(input);
    expect(Object.getOwnPropertySymbols(result)).toEqual([sym1, sym2]);
    expect(Object.keys(result)).toEqual(["a", "b", "c"]);
  });

  describe("sortPrimitiveArrays option", () => {
    it("should sort arrays of strings when sortPrimitiveArrays is true", () => {
      const input = ["b", "a", "c"];
      const expected = ["a", "b", "c"];
      expect(sort(input, true, true)).toEqual(expected);
    });

    it("should sort arrays of strings in descending order when sortPrimitiveArrays is true", () => {
      const input = ["a", "b", "c"];
      const expected = ["c", "b", "a"];
      expect(sort(input, false, true)).toEqual(expected);
    });

    it("should sort arrays of numbers when sortPrimitiveArrays is true", () => {
      const input = [3, 1, 4, 1, 5];
      const expected = [1, 1, 3, 4, 5];
      expect(sort(input, true, true)).toEqual(expected);
    });

    it("should sort arrays of numbers in descending order when sortPrimitiveArrays is true", () => {
      const input = [1, 2, 3, 4, 5];
      const expected = [5, 4, 3, 2, 1];
      expect(sort(input, false, true)).toEqual(expected);
    });

    it("should sort arrays of booleans when sortPrimitiveArrays is true", () => {
      const input = [true, false, true, false];
      const expected = [false, false, true, true];
      expect(sort(input, true, true)).toEqual(expected);
    });

    it("should sort arrays of booleans in descending order when sortPrimitiveArrays is true", () => {
      const input = [false, true, false, true];
      const expected = [true, true, false, false];
      expect(sort(input, false, true)).toEqual(expected);
    });

    it("should handle mixed primitive arrays when sortPrimitiveArrays is true", () => {
      const input = [true, "b", 3, "a", false, 1];
      // Mixed types should maintain original order
      expect(sort(input, true, true)).toEqual(input);
    });

    it("should maintain backward compatibility when sortPrimitiveArrays is false (default)", () => {
      const input = ["b", "a", "c"];
      expect(sort(input)).toEqual(input);
      expect(sort(input, true)).toEqual(input);
      expect(sort(input, true, false)).toEqual(input);
    });

    it("should sort nested primitive arrays when sortPrimitiveArrays is true", () => {
      const input = {
        b: ["z", "y", "x"],
        a: ["c", "b", "a"],
      };
      const expected = {
        a: ["a", "b", "c"],
        b: ["x", "y", "z"],
      };
      expect(sort(input, true, true)).toEqual(expected);
    });

    it("should handle empty arrays when sortPrimitiveArrays is true", () => {
      expect(sort([], true, true)).toEqual([]);
    });

    it("should handle arrays with single items when sortPrimitiveArrays is true", () => {
      expect(sort(["a"], true, true)).toEqual(["a"]);
      expect(sort([1], true, true)).toEqual([1]);
      expect(sort([true], true, true)).toEqual([true]);
    });

    it("should not modify arrays of objects when sortPrimitiveArrays is true", () => {
      const input = [
        { b: "b", a: "a" },
        { d: "d", c: "c" },
      ];
      const expected = [
        { a: "a", b: "b" },
        { c: "c", d: "d" },
      ];
      // Arrays of objects should still be sorted by their keys
      expect(sort(input, true, true)).toEqual(expected);
    });

    it("should handle deeply nested primitive arrays when sortPrimitiveArrays is true", () => {
      const input = {
        z: {
          y: [
            [3, 1, 4],
            [1, 5, 9],
          ],
          x: {
            w: { beta: "β", alpha: "α", gamma: "γ" },
            v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          },
        },
        a: [
          { foo: { bar: { baz: "qux" } } },
          [{ nested: { array: [3, 2, 1] } }],
        ],
      };
      const expected = {
        a: [
          { foo: { bar: { baz: "qux" } } },
          [{ nested: { array: [1, 2, 3] } }],
        ],
        z: {
          x: {
            v: [1, 1, 2, 3, 4, 5, 5, 6, 9],
            w: { alpha: "α", beta: "β", gamma: "γ" },
          },
          y: [
            [1, 3, 4],
            [1, 5, 9],
          ],
        },
      };
      expect(sort(input, true, true)).toEqual(expected);
    });
  });
});
