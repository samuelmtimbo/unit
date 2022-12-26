import { build } from '../../build'

build({
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/worker/system.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/_worker.js',
})

export default null
