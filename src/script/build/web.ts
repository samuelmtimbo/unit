import { copy } from 'fs-extra';
import { build } from '../build';

;(async () => {
  await build({
    minify: true,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/web.ts'],
    outfile: 'dist/index.min.js',
    metafile: true,
  })

  await build({
    minify: false,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/web.ts'],
    outfile: 'dist/index.js',
    metafile: true,
  })
})()

