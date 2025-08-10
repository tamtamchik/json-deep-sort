# JSON Deep Sort

[![Buy Me A Coffee][ico-coffee]][link-coffee]
[![Latest Version on NPM][ico-version]][link-npm]
[![Scrutinizer build][ico-scrutinizer-build]][link-scrutinizer]
[![Scrutinizer quality][ico-scrutinizer-quality]][link-scrutinizer]
[![Scrutinizer coverage][ico-scrutinizer-coverage]][link-scrutinizer]
[![Software License][ico-license]](LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

JSON Deep Sort is a powerful and versatile TypeScript package designed for efficient sorting of JSON objects by keys. It offers:

- Comprehensive handling of deeply nested objects and arrays
- Flexible sorting options, including ascending and descending order
- Support for both synchronous and asynchronous operations
- Preservation of non-sortable objects (e.g., Date, RegExp, Function)
- Lightweight implementation with zero dependencies

Whether you're working with simple flat objects or complex nested structures, JSON Deep Sort provides a reliable solution for organizing your data.

## Installation

Using npm:

```shell
npm install @tamtamchik/json-deep-sort
```

Using yarn:

```shell
yarn add @tamtamchik/json-deep-sort
```

## Usage

Import JSON Deep Sort in your TypeScript file:

```typescript
import { sort } from '@tamtamchik/json-deep-sort';
```

Here is an example of sorting a JSON object:

```typescript
// Example 1: Sorting a simple object
const simpleData = { b: 'b', a: 'a', c: 'c' };
console.log(sort(simpleData));
// Output: { a: 'a', b: 'b', c: 'c' }

// Example 2: Sorting a nested object
const nestedData = {
  b: 'b',
  a: 'a',
  c: { d: 'd', c: 'c', a: 'a', b: 'b' },
};
console.log(sort(nestedData));
// Output: { a: 'a', b: 'b', c: { a: 'a', b: 'b', c: 'c', d: 'd' } }

// Example 3: Sorting an array of objects
const arrayData = [
  { b: 'b', a: 'a' },
  { d: 'd', c: 'c' },
];
console.log(sort(arrayData));
// Output: [{ a: 'a', b: 'b' }, { c: 'c', d: 'd' }]

// Example 4: Sorting in descending order
const descendingData = { a: 'a', c: 'c', b: 'b' };
console.log(sort(descendingData, false));
// Output: { c: 'c', b: 'b', a: 'a' }

// Example 5: Handling mixed data types
const mixedData = {
  b: [3, 1, 2],
  a: { z: 'z', y: 'y' },
  c: new Date('2023-01-01'),
};
console.log(sort(mixedData));
// Output: { a: { y: 'y', z: 'z' }, b: [3, 1, 2], c: Date('2023-01-01') }

// Example 6: Sorting arrays of primitives
const primitiveArrayData = ['b', 'a', 'c'];
console.log(sort(primitiveArrayData, true, true));
// Output: ['a', 'b', 'c']
```

## API Reference

### `sort(data, ascending?, sortPrimitiveArrays?)`

Sorts a JSON object or array by keys in a specified order.

**Parameters:**

- `data` (required): The data to sort. Can be an object, array, or primitive value.
- `ascending` (optional): Boolean flag to determine sort order. Defaults to `true` (ascending).
- `sortPrimitiveArrays` (optional): Boolean flag to enable sorting of arrays containing primitive values (strings, numbers, booleans). Defaults to `false` to maintain backward compatibility.

**Returns:** The sorted data with the same structure and type as the input.

**Note:** When `sortPrimitiveArrays` is `false` (default), arrays of primitives are not modified, preserving the original behavior. When `true`, primitive arrays are sorted according to the `ascending` parameter.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

JSON Deep Sort is [MIT licensed](./LICENSE).

[ico-coffee]: https://img.shields.io/badge/Buy%20Me%20A-Coffee-%236F4E37.svg?style=flat-square
[ico-version]: https://img.shields.io/npm/v/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-license]: https://img.shields.io/npm/l/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-scrutinizer-build]: https://img.shields.io/scrutinizer/build/g/tamtamchik/json-deep-sort/main.svg?style=flat-square
[ico-scrutinizer-quality]: https://img.shields.io/scrutinizer/quality/g/tamtamchik/json-deep-sort/main.svg?style=flat-square
[ico-scrutinizer-coverage]: https://img.shields.io/scrutinizer/coverage/g/tamtamchik/json-deep-sort/main.svg?style=flat-square
[link-coffee]: https://www.buymeacoffee.com/tamtamchik
[link-npm]: https://www.npmjs.com/package/@tamtamchik/json-deep-sort
[link-downloads]: https://www.npmjs.com/package/@tamtamchik/json-deep-sort
[link-scrutinizer]: https://scrutinizer-ci.com/g/tamtamchik/json-deep-sort/
