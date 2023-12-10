import { BuildOptions } from 'esbuild'

export const DEFAULT_BUILD_OPTIONS: BuildOptions = {
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
  // metafile: true,
  define: {
    'globalThis.env': '{"NODE_ENV": "production"}',
  },
  loader: {
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
  },
}

export const DEFAULT_WATCH_OPTIONS: BuildOptions = {
  ...DEFAULT_BUILD_OPTIONS,
  minify: false,
  sourcemap: true,
}
