import { sort } from '../src'

describe('sort', () => {
  it('should sort an object', () => {
    const input = { b: 'b', a: 'a' }
    const expected = { a: 'a', b: 'b' }
    expect(sort(input)).toEqual(expected)
  })

  it('should not sort an simple array', () => {
    const input = ['a', 'b']
    const expected = ['a', 'b']
    expect(sort(input)).toEqual(expected)
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

  it('should sort an object with array values', () => {
    const input = {
      b: ['b', 'a'],
      a: ['d', 'c', 'b', 'a'],
    }
    const expected = {
      a: ['d', 'c', 'b', 'a'],
      b: ['b', 'a'],
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should sort an object with nested objects', () => {
    const input = {
      a: 'a',
      b: {
        b: 'b',
        a: 'a',
      },
    }
    const expected = {
      a: 'a',
      b: {
        a: 'a',
        b: 'b',
      },
    }
    expect(sort(input)).toEqual(expected)
  })

  it('should not sort an array of simple arrays', () => {
    const input = [
      ['b', 'a'],
      ['d', 'c', 'b', 'a'],
    ]
    const expected = [
      ['b', 'a'],
      ['d', 'c', 'b', 'a'],
    ]
    expect(sort(input)).toEqual(expected)
  })

  it('should sort an array containing objects', () => {
    const input = [
      { b: 'b', a: 'a' },
      { d: 'd', c: 'c', b: 'b', a: 'a' },
    ]
    const expected = [
      { a: 'a', b: 'b' },
      { a: 'a', b: 'b', c: 'c', d: 'd' },
    ]
    expect(sort(input)).toEqual(expected)
  })

  it('should sort an object in descending order', () => {
    const input = { b: 'b', a: 'a', c: 'c' }
    const expected = { c: 'c', b: 'b', a: 'a' }
    expect(sort(input, false)).toEqual(expected)
  })

  it('should throw an error for non-object, non-array input', () => {
    const input = 'string'
    expect(() => sort(input)).toThrow('Invalid data type: expected an object or array of objects.')

    const inputNumber = 123
    expect(() => sort(inputNumber)).toThrow('Invalid data type: expected an object or array of objects.')

    const inputNull = null
    expect(() => sort(inputNull)).toThrow('Invalid data type: expected an object or array of objects.')
  })
})
