<p align="center">
  <img src="https://raw.githubusercontent.com/tamtamchik/json-deep-sort/main/docs/assets/json-deep-sort-readme-banner.png" alt="JSON Deep Sort" width="100%">
</p>

<p align="center">
  <strong>Recursive JSON key sorting for JavaScript and TypeScript.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@tamtamchik/json-deep-sort"><img alt="Latest version on npm" src="https://img.shields.io/npm/v/@tamtamchik/json-deep-sort?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@tamtamchik/json-deep-sort"><img alt="Monthly downloads" src="https://img.shields.io/npm/dm/@tamtamchik/json-deep-sort?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@tamtamchik/json-deep-sort"><img alt="Total downloads" src="https://img.shields.io/npm/dt/@tamtamchik/json-deep-sort?style=flat-square"></a>
  <a href="https://github.com/tamtamchik/json-deep-sort/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/tamtamchik/json-deep-sort/ci.yml?branch=main&style=flat-square&label=CI"></a>
  <a href="https://scrutinizer-ci.com/g/tamtamchik/json-deep-sort/"><img alt="Scrutinizer build" src="https://img.shields.io/scrutinizer/build/g/tamtamchik/json-deep-sort/main?style=flat-square"></a>
  <a href="https://scrutinizer-ci.com/g/tamtamchik/json-deep-sort/"><img alt="Scrutinizer quality" src="https://img.shields.io/scrutinizer/quality/g/tamtamchik/json-deep-sort/main?style=flat-square"></a>
  <a href="https://scrutinizer-ci.com/g/tamtamchik/json-deep-sort/"><img alt="Code coverage" src="https://img.shields.io/scrutinizer/coverage/g/tamtamchik/json-deep-sort/main?style=flat-square"></a>
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#development-setup">Development Setup</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="#security-notes">Security Notes</a> ·
  <a href="#support">Support</a>
</p>

JSON Deep Sort sorts object keys throughout nested objects and arrays without
mutating the input. It supports ascending and descending order, optional sorting
of primitive arrays, ES modules and CommonJS, and includes TypeScript types.
The library has no runtime dependencies.

## Quick Start

Install with npm:

```shell
npm install @tamtamchik/json-deep-sort
```

Or with yarn:

```shell
yarn add @tamtamchik/json-deep-sort
```

Sort an object:

```typescript
import { sort } from '@tamtamchik/json-deep-sort';

const data = { b: 2, a: { d: 4, c: 3 } };
console.log(sort(data));
// { a: { c: 3, d: 4 }, b: 2 }
```

## Usage

Pass an object, array, or primitive value to `sort`. It returns the result
synchronously. Object keys are sorted in ascending order by default; array
items keep their order unless primitive array sorting is enabled.

The Quick Start example uses an ES module import. For CommonJS, use `require`:

### CommonJS

```javascript
const { sort } = require('@tamtamchik/json-deep-sort');

console.log(sort({ b: 'b', a: 'a', c: 'c' }));
// { a: 'a', b: 'b', c: 'c' }
```

### Nested Objects and Arrays

Objects inside arrays are sorted recursively, while the array items keep their
positions:

```typescript
const data = {
  b: [3, 1, 2],
  a: [
    { b: 'b', a: 'a' },
    { d: 'd', c: 'c' },
  ],
};

console.log(sort(data));
// { a: [{ a: 'a', b: 'b' }, { c: 'c', d: 'd' }], b: [3, 1, 2] }
```

### Descending Order

Set the second argument to `false` to sort keys in descending order at each level:

```typescript
console.log(sort({ a: 'a', c: 'c', b: 'b' }, false));
// { c: 'c', b: 'b', a: 'a' }
```

### Primitive Arrays

Set the third argument to `true` to sort arrays of strings, numbers, or booleans,
including arrays nested inside objects:

```typescript
console.log(sort(['b', 'a', 'c'], true, true));
// ['a', 'b', 'c']

console.log(sort([3, 1, 2], false, true));
// [3, 2, 1]

console.log(sort({ values: [3, 1, 2] }, true, true));
// { values: [1, 2, 3] }
```

Numbers use numeric order, strings use `localeCompare`, and booleans sort as
`false` before `true` in ascending order. Arrays containing `null`, `undefined`,
or objects retain their item order. Arrays mixing strings, numbers, and booleans
also keep their original order.

### Preserved Values

Primitive values pass through unchanged. Values such as `Date`, `RegExp`,
functions, `Map`, and `Set` retain their original references:

```typescript
const date = new Date('2023-01-01');
const result = sort({ b: date, a: { z: 'z', y: 'y' } });

console.log(result.a);
// { y: 'y', z: 'z' }
console.log(result.b === date);
// true
```

### API Reference

#### `sort<T>(data: T, ascending = true, sortPrimitiveArrays = false): T`

| Parameter             | Default  | Description                                                 |
| --------------------- | -------- | ----------------------------------------------------------- |
| `data`                | Required | Object, array, or primitive value to sort.                  |
| `ascending`           | `true`   | Sort keys and eligible primitive arrays in ascending order. |
| `sortPrimitiveArrays` | `false`  | Enable sorting of arrays containing primitive values.       |

The return type is inferred from the input. Traversed objects and arrays are
rebuilt; preserved values keep their references. JavaScript enumeration rules
keep integer-index keys in numeric order, even when descending order is requested.
String key ordering uses `localeCompare` and can depend on the runtime locale.

## Development Setup

Use Node.js 22 (22.18 or later), Node.js 24 (24.11 or later), or Node.js 26.
The `.nvmrc` file selects Node.js 24; npm enforces these development versions
through `devEngines`. CI tests Node.js 22, 24, and 26. These requirements apply
to development tooling; the published library adds no Node.js engine restriction.

Install dependencies:

```shell
npm ci
```

Run the checks used in CI:

```shell
npm run check
npm run typecheck
npm run build
npm test
npm run test:package
```

Useful focused commands:

```shell
npm run fix      # Format files and apply safe lint fixes with Biome.
npm run dev      # Rebuild when source files change.
npm run coverage # Run unit tests and generate coverage reports.
```

Biome checks TypeScript, JavaScript, and JSON. Markdown and YAML are reviewed
manually. Coverage runs deterministic unit tests; `test:package` installs a packed
archive in an isolated consumer and checks CommonJS, ES modules, TypeScript types,
and package contents.

## Documentation

- [npm package](https://www.npmjs.com/package/@tamtamchik/json-deep-sort): published versions and installation details.
- [API reference](#api-reference): arguments, defaults, and return values.
- [Source](src/index.ts): public function and exported TypeScript types.
- [Unit tests](test/sort.test.ts): nested objects, arrays, sort order, and preserved values.
- [Package tests](test/package.test.mjs): packed files, imports, and consumer types.
- [Security policy](SECURITY.md): vulnerability reporting.
- [CI](https://github.com/tamtamchik/json-deep-sort/actions/workflows/ci.yml): formatting, lint, build, and test results.

## Security Notes

Use acyclic JSON data. Circular references are unsupported, and very deep inputs
can exceed the JavaScript call stack. Sorting keys does not validate or sanitize
input, and locale-dependent ordering is unsuitable for cryptographic JSON
canonicalization.

Report vulnerabilities by emailing [yuri.tam.tkachenko@gmail.com](mailto:yuri.tam.tkachenko@gmail.com).
See [SECURITY.md](SECURITY.md) for the reporting policy.

## Contributing

Pull requests are welcome. For major changes, [open an issue](https://github.com/tamtamchik/json-deep-sort/issues)
first to discuss the proposal.

## Support

<p>
  <a href="https://www.buymeacoffee.com/tamtamchik"><img alt="Buy me a coffee" src="https://img.shields.io/badge/Buy%20Me%20A-Coffee-6F4E37?style=flat-square&logo=buymeacoffee&logoColor=white"></a>
</p>

## License

[MIT](LICENSE).
