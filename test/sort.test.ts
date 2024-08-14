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
})
