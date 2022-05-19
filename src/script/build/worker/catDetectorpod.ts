import { build } from '../../build'

build({
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
  entryPoints: ['public/worker-typescript/workercatDetector.ts'],
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  outfile: 'public/worker-javascript/_catDetectorWorker.js',
})

export default null
