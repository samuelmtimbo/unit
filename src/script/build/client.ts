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
  outfile: 'public/_bundle.js',
})

export default null
