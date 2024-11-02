import { build } from '../build'

build({
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/client/platform/web/sw.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/_sw.js',
})
