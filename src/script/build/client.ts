import { build } from '../build'

build({
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/client/index.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/_index.js',
})

export default null
