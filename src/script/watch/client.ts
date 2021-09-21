import { build } from '../build'

build({
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  watch: true,
  entryPoints: ['src/client/index.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "development"}',
  },
  outfile: 'public/_index.js',
})

export default null
