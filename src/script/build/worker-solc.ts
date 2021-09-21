import { build } from '../build'

build({
  // minify: true,
  // sourcemap: false,
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/client/worker-solc.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/_worker-solc.js',
})

export default null
