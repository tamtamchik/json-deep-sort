import { sort } from '../src'

describe('sort', () => {
  it('should sort an object in ascending order by default', () => {
    const input = { c: 'c', b: 'b', a: 'a' }
    const expected = { a: 'a', b: 'b', c: 'c' }
    expect(sort(input)).toEqual(expected)
  })

  it('should sort an object in descending order when specified', () => {
    const input = { a: 'a', b: 'b', c: 'c' }
    const expected = { c: 'c', b: 'b', a: 'a' }
    expect(sort(input, false)).toEqual(expected)
  })

  it('should not modify an array of primitives', () => {
    const input = ['b', 'a', 'c']
    expect(sort(input)).toEqual(input)
  })

  it('should sort an array of objects', () => {
    const input = [
      { b: 'b', a: 'a' },
      { d: 'd', c: 'c' },
    ]
    const expected = [
      { a: 'a', b: 'b' },
      { c: 'c', d: 'd' },
    ]
    expect(sort(input)).toEqual(expected)
  })

  it('should sort nested objects', () => {
    const input = {
      b: { z: 'z', y: 'y' },
      a: { x: 'x', w: 'w' },
    }
    const expected = {
      a: { w: 'w', x: 'x' },
      b: { y: 'y', z: 'z' },
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should handle mixed nested structures', () => {
    const input = {
      b: ['b', 'a'],
      a: { d: 'd', c: 'c' },
    }
    const expected = {
      a: { c: 'c', d: 'd' },
      b: ['b', 'a'],
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should not throw an error for primitive inputs', () => {
    expect(() => sort('string')).not.toThrow()
    expect(() => sort(123)).not.toThrow()
    expect(() => sort(null)).not.toThrow()
    expect(() => sort(undefined)).not.toThrow()
  })

  it('should return primitive inputs unchanged', () => {
    expect(sort('string')).toBe('string')
    expect(sort(123)).toBe(123)
    expect(sort(null)).toBe(null)
    expect(sort(undefined)).toBe(undefined)
  })

  it('should handle deeply nested objects and arrays', () => {
    const input = {
      z: {
        y: [
          { c: 3, b: 2, a: 1 },
          { f: 6, e: 5, d: 4 }
        ],
        x: {
          w: { beta: 'β', alpha: 'α', gamma: 'γ' },
          v: [3, 1, 4, 1, 5, 9, 2, 6, 5]
        }
      },
      a: [
        { foo: { bar: { baz: 'qux' } } },
        [{ nested: { array: [3, 2, 1] } }]
      ]
    }
    const expected = {
      a: [
        { foo: { bar: { baz: 'qux' } } },
        [{ nested: { array: [3, 2, 1] } }]
      ],
      z: {
        x: {
          v: [3, 1, 4, 1, 5, 9, 2, 6, 5],
          w: { alpha: 'α', beta: 'β', gamma: 'γ' }
        },
        y: [
          { a: 1, b: 2, c: 3 },
          { d: 4, e: 5, f: 6 }
        ]
      }
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should handle objects with various value types', () => {
    const input = {
      e: new Date('2023-01-01'),
      d: /regex/,
      c: [1, 2, 3],
      b: { nested: 'object' },
      a: () => 'function'
    }
    const expected = {
      a: input.a,
      b: { nested: 'object' },
      c: [1, 2, 3],
      d: /regex/,
      e: input.e
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should sort keys that are numbers or can be coerced to numbers', () => {
    const input = {
      '10': 'ten',
      '1': 'one',
      '2': 'two',
      foo: 'bar'
    }
    const expected = {
      '1': 'one',
      '2': 'two',
      '10': 'ten',
      foo: 'bar'
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should not sort non-sortable objects', () => {
    const date = new Date('2023-01-01')
    const regex = /test/
    const func = () => {}
    const error = new Error('test')
    const map = new Map()
    const set = new Set()
    const weakMap = new WeakMap()
    const weakSet = new WeakSet()
    const promise = Promise.resolve()
    const iterable = {
      *[Symbol.iterator]() {
        yield 1
        yield 2
      }
    }

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
      iterable
    }

    const result = sort(input) as typeof input

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
      weakSet
    })

    // Ensure the objects are the same instances
    expect(result.date).toBe(date)
    expect(result.regex).toBe(regex)
    expect(result.func).toBe(func)
    expect(result.error).toBe(error)
    expect(result.map).toBe(map)
    expect(result.set).toBe(set)
    expect(result.weakMap).toBe(weakMap)
    expect(result.weakSet).toBe(weakSet)
    expect(result.promise).toBe(promise)
    expect(result.iterable).toBe(iterable)
  })
})
