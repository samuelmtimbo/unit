import { build } from '../../build'

build({
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  watch: true,
  entryPoints: ['src/worker/pod.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "development"}',
  },
  outfile: 'public/_worker.js',
})

export default null
