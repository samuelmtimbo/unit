import { BuildOptions } from 'esbuild'

export const DEFAULT_OPTIONS: BuildOptions = {
  bundle: true,
  treeShaking: true,
  logLevel: 'warning',
  loader: {
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
  },
}

export const DEFAULT_BUILD_OPTIONS: BuildOptions = {
  ...DEFAULT_OPTIONS,
  minify: true,
  sourcemap: false,
}

export const DEFAULT_WATCH_OPTIONS: BuildOptions = {
  ...DEFAULT_OPTIONS,
  minify: false,
  sourcemap: true,
}
