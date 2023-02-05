import { watch } from '../build'

watch({
  minify: false,
  sourcemap: true,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['src/client/platform/web/sw.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "development"}',
  },
  outfile: 'public/sw.js',
})

export default null
