import { watch } from '../../build'

watch({
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/worker/system.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "development"}',
  },
  outfile: 'public/_worker.js',
})
