// Check a folder of theme images against src/themes/spec.ts: missing files, unknown files, wrong sizes.
// usage: yarn theme:check <folder>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import {SPEC} from './lib.mjs';

const dir = process.argv[2];
if (!dir) {
    console.error('usage: yarn theme:check <folder>');
    process.exit(1);
}

const files = fs.readdirSync(dir).filter(name => !name.startsWith('.'));
const missing = Object.keys(SPEC).filter(name => !files.includes(name));
const unknown = files.filter(name => !SPEC[name]);
const wrongSize = [];
for (const name of files.filter(n => SPEC[n])) {
    const {width, height} = await sharp(path.join(dir, name)).metadata();
    const spec = SPEC[name];
    if (width !== spec.width || height !== spec.height) wrongSize.push(`${name}: ${width}x${height}, expected ${spec.width}x${spec.height}`);
}

const report = (title, list) => list.length && console.log(`\n${title} (${list.length}):\n  ${list.join('\n  ')}`);
report('Missing', missing);
report('Wrong size', wrongSize);
report('Not used by the game', unknown);

const ok = !missing.length && !wrongSize.length;
console.log(ok ? `\n✓ ${dir}: all ${Object.keys(SPEC).length} images present with the right size` : '\n✗ fix the files above');
process.exit(ok ? 0 : 1);
