import { copy } from 'fs-extra';
import { build } from '../build';

;(async () => {
  await build({
    minify: true,
    sourcemap: false,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/web.ts'],
    outfile: 'dist/index.js',
    metafile: true,
  })

  await copy('dist/index.js', 'public/web.js')
})()

