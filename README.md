# JSON Deep Sort

![npm](https://img.shields.io/npm/v/json-deep-sort)
![license](https://img.shields.io/npm/l/json-deep-sort)

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
npm install json-deep-sort
```

Using yarn:

```shell
yarn add json-deep-sort
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
console.log(sortedData); // { a: 'a', b: 'b', c: { a: 'a', b: 'b', c: 'c', d: 'd' } }
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

JSON Deep Sort is [MIT licensed](./LICENSE).
