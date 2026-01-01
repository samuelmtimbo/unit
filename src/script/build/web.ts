import { copy } from 'fs-extra';
import { build } from '../build';

void (async () => {
  await Promise.all([
  build({
    minify: true,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/web.ts'],
    outfile: 'dist/index.min.js',
    metafile: true,
  }),
  build({
    minify: false,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/web.ts'],
    outfile: 'dist/index.js',
    metafile: true,
  }),
  build({
    minify: true,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/global.ts'],
    outfile: 'dist/global.min.js',
    metafile: true,
  }),
  build({
    minify: false,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/global.ts'],
    outfile: 'dist/global.js',
    metafile: true,
  })])
})()

