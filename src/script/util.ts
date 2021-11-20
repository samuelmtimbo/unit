import { build } from './build'

export function prod(): void {
  build({
    minify: true,
    sourcemap: false,
    bundle: true,
    logLevel: 'warning',
    entryPoints: ['src/client/platform/web/index.ts'],
    define: {
      'globalThis.env': '{"NODE_ENV": "production"}',
    },
    outfile: 'public/index.js',
  })
}

export function dev(): void {
  build({
    minify: false,
    sourcemap: true,
    bundle: true,
    logLevel: 'warning',
    watch: false,
    entryPoints: ['src/client/platform/web/index.ts'],
    define: {
      'globalThis.env': '{"NODE_ENV": "production"}',
    },
    outfile: 'public/index.js',
  })
}
