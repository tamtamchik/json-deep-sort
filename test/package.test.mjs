import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const consumer = mkdtempSync(join(tmpdir(), 'json-deep-sort-consumer-'));
const run = (command, args, cwd = consumer) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' });

try {
  const [pack] = JSON.parse(
    run('npm', ['pack', '--json', '--pack-destination', consumer], root)
  );
  assert.deepEqual(
    pack.files.map(({ path }) => path).sort(),
    [
      'LICENSE',
      'README.md',
      'package.json',
      'dist/index.js',
      'dist/index.mjs',
      'dist/index.d.ts',
      'dist/index.d.mts',
    ].sort()
  );
  writeFileSync(join(consumer, 'package.json'), '{"private":true}');
  run('npm', [
    'install',
    join(consumer, pack.filename),
    '--ignore-scripts',
    '--offline',
    '--no-audit',
    '--no-fund',
  ]);
  const scenarios = `
const input = { z: [{ b: 2, a: 1 }], a: [3, 1, 2] };
const snapshot = JSON.stringify(input);
const sorted = sort(input);
assert.deepEqual(Object.keys(sorted), ['a', 'z']);
assert.deepEqual(Object.keys(sorted.z[0]), ['a', 'b']);
assert.deepEqual(sorted.a, [3, 1, 2]);
assert.equal(JSON.stringify(input), snapshot);
assert.deepEqual(Object.keys(sort(input, false)), ['z', 'a']);
assert.deepEqual(sort([3, 1, 2], true, true), [1, 2, 3]);
assert.deepEqual(sort([3, 1, 2], false, true), [3, 2, 1]);
assert.deepEqual(sort([true, 'b', 3, 'a', false, 1], true, true), [true, 'b', 3, 'a', false, 1]);
const date = new Date();
assert.equal(sort({ date }).date, date);
`;
  writeFileSync(
    join(consumer, 'consumer.cjs'),
    `const assert = require('node:assert/strict');\nconst { sort } = require('@tamtamchik/json-deep-sort');\n${scenarios}`
  );
  writeFileSync(
    join(consumer, 'consumer.mjs'),
    `import assert from 'node:assert/strict';\nimport { sort } from '@tamtamchik/json-deep-sort';\n${scenarios}`
  );
  run(process.execPath, ['consumer.cjs']);
  run(process.execPath, ['consumer.mjs']);
  const typeScenario = `
const result: { a: number; b: number } = sort({ b: 2, a: 1 });
const options: SortOptions = { ascending: false, sortPrimitiveArrays: true };
sort(result, options.ascending, options.sortPrimitiveArrays);
// @ts-expect-error sort order must be a boolean.
sort(result, 'descending');
`;
  writeFileSync(
    join(consumer, 'consumer.mts'),
    `import { sort, type SortOptions } from '@tamtamchik/json-deep-sort';\n${typeScenario}`
  );
  writeFileSync(
    join(consumer, 'consumer.cts'),
    `import library = require('@tamtamchik/json-deep-sort');\nconst { sort } = library;\ntype SortOptions = library.SortOptions;\n${typeScenario}`
  );
  run(join(root, 'node_modules/.bin/tsc'), [
    '--noEmit',
    '--strict',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    '--target',
    'ES2020',
    '--verbatimModuleSyntax',
    'consumer.mts',
    'consumer.cts',
  ]);
  const manifest = JSON.parse(
    readFileSync(
      join(consumer, 'node_modules/@tamtamchik/json-deep-sort/package.json'),
      'utf8'
    )
  );
  assert.equal(manifest.main, './dist/index.js');
  assert.equal(manifest.module, './dist/index.mjs');
  assert.equal(manifest.types, './dist/index.d.ts');
  console.log(
    `Packed consumer checks passed on ${process.version}: CommonJS, ESM, types, and file contents.`
  );
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
