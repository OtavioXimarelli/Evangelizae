import {cpSync, existsSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';

const projectRoot = process.cwd();
const standaloneRoot = join(projectRoot, '.next', 'standalone');

function findServerJs(root, depth = 0) {
  if (depth > 4) return null;
  const candidate = join(root, 'server.js');
  if (existsSync(candidate) && statSync(candidate).isFile()) return root;
  let entries;
  try {
    entries = readdirSync(root, {withFileTypes: true});
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules') continue;
    // Copy targets created by this script (public, .next mirrors) never hold server.js.
    if (entry.name === 'public' || entry.name === 'server.js') continue;
    const found = findServerJs(join(root, entry.name), depth + 1);
    if (found) return found;
  }
  return null;
}

const serverRoot = findServerJs(standaloneRoot);
if (!serverRoot) {
  throw new Error('The standalone Next.js server was not generated.');
}

cpSync(join(projectRoot, 'public'), join(serverRoot, 'public'), {recursive: true});
cpSync(join(projectRoot, '.next', 'static'), join(serverRoot, '.next', 'static'), {recursive: true});

// Next.js 16 may emit the standalone output nested (e.g. .next/standalone/Work/<repo>/)
// when outputFileTracingRoot resolves above the project directory, while the Dockerfile
// and package.json expect .next/standalone/server.js. Record the entry-point path that
// scripts/start-standalone.mjs (and Docker builds unaffected by nesting) should launch.
const entryRelative = relative(projectRoot, join(serverRoot, 'server.js'));
writeFileSync(join(projectRoot, '.next', 'standalone-entry.txt'), `${entryRelative}\n`);
console.log(`Standalone entry: ${entryRelative}`);
