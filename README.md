# JSON Deep Sort

[![Buy Me A Coffee][ico-coffee]][link-coffee]
[![Latest Version on NPM][ico-version]][link-npm]
[![Software License][ico-license]](LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

JSON Deep Sort is a comprehensive package that provides flexible sorting of JSON objects by keys. This
TypeScript-written package can handle deeply nested objects and arrays, and offers both synchronous and asynchronous
operations.

## Features

- Efficiently sorts keys in JSON objects and arrays.
- Handles deeply nested JSON objects and arrays.
- Provides both synchronous and asynchronous sorting operations.
- Written in TypeScript for robust typing and error checking.

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
let data = {
    b: 'b',
    a: 'a',
    c: {
        d: 'd',
        c: 'c',
        a: 'a',
        b: 'b'
    }
};

let sortedData = sort(data, true);
// { a: 'a', b: 'b', c: { a: 'a', b: 'b', c: 'c', d: 'd' } }
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

JSON Deep Sort is [MIT licensed](./LICENSE).

[ico-coffee]: https://img.shields.io/badge/Buy%20Me%20A-Coffee-%236F4E37.svg?style=flat-square
[ico-version]: https://img.shields.io/npm/v/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-license]: https://img.shields.io/npm/l/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/@tamtamchik/json-deep-sort.svg?style=flat-square
[ico-types]: https://img.shields.io/npm/types/@tamtamchik/json-deep-sort.svg?style=flat-square

[link-coffee]: https://www.buymeacoffee.com/tamtamchik
[link-npm]: https://www.npmjs.com/package/@tamtamchik/json-deep-sort
[link-downloads]: https://www.npmjs.com/package/@tamtamchik/json-deep-sort
