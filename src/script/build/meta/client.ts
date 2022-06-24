import { buildSync } from 'esbuild'
import { outputFileSync, readFileSync } from 'fs-extra'
import * as path from 'path'
import { PATH_PUBLIC, PATH_SRC_CLIENT } from '../../../path'

buildSync({
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['./src/client/html/meta.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/_meta.js',
})

const buffer = readFileSync(path.join(PATH_PUBLIC, '_meta.js'))

const INDEX_JS = buffer.toString()

const INDEX_TS = `export const INDEX_JS = \"${INDEX_JS.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"')}\"`

outputFileSync(path.join(PATH_SRC_CLIENT, 'static/js/index.js.ts'), INDEX_TS)