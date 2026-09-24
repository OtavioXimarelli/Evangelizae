import {existsSync, readFileSync} from 'node:fs';
import {chdir, cwd} from 'node:process';
import {dirname, join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const projectRoot = cwd();
const entryFile = join(projectRoot, '.next', 'standalone-entry.txt');

if (!existsSync(entryFile)) {
  throw new Error('Standalone entry missing — run `pnpm build` first.');
}

const entry = readFileSync(entryFile, 'utf8').trim();
if (!entry) {
  throw new Error('Standalone entry is empty — run `pnpm build` first.');
}

const serverPath = resolve(projectRoot, entry);
// The generated server.js resolves everything relative to its own directory.
chdir(dirname(serverPath));

import(pathToFileURL(serverPath).href);
