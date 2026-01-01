import { writeFile } from 'fs-extra';
import { build } from '../build';
(async () => {
  const result = await build({
    minify: true,
    sourcemap: false,
    bundle: true,
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/index.ts'],
    define: {
      'globalThis.env': '{"NODE_ENV": "production"}',
    },
    outfile: 'public/index.js',
    metafile: true,
  })

  await writeFile('public/build.json', JSON.stringify(result.metafile ?? {}))
})()
