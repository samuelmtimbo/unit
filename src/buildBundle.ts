import { build, BuildOptions } from 'esbuild'
import { readFile } from 'fs-extra'
import { buildIdSetFromBundle } from './buildIdSetFromBundle'
import { watch } from './script/build'
import { sync } from './script/sync'
import path = require('path')

export const DEFAULT_BUILD_OPTIONS: BuildOptions = {
  minify: true,
  sourcemap: false,
  bundle: true,
  logLevel: 'warning',
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

export async function buildBundle(
  unitPath: string,
  bundlePath: string,
  outputFolder: string,
  watchMode: boolean = false,
  includeSystem: boolean = false
): Promise<void> {
  const bundleText = await readFile(bundlePath, 'utf8')

  const bundle = JSON.parse(bundleText)

  const idSet = includeSystem ? undefined : buildIdSetFromBundle(bundle)

  const systemPath = path.join(unitPath, 'src', 'system')

  await sync(systemPath, outputFolder, idSet)

  const entrypoint = `${unitPath}/src/client/platform/web/index.ts`

  const resolvePlugin = {
    name: 'resolve',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        const { resolveDir, importer } = args

        if (importer === entrypoint) {
          if (args.path === './bundle.json') {
            return { path: bundlePath }
          }
        }

        if (
          args.path.endsWith('/system/_specs') ||
          args.path.endsWith('/system/_components') ||
          args.path.endsWith('/system/_ids') ||
          args.path.endsWith('/system/_classes')
        ) {
          const absolutePath = path
            .join(resolveDir, args.path)
            .replace(`${path.join(unitPath, 'src', 'system')}`, '')

          const otherPath = path.join(outputFolder, `${absolutePath}.ts`)

          return { path: otherPath }
        }

        if (importer.endsWith('_classes.ts')) {
          const otherPath = `${path.join(systemPath, args.path, 'index.ts')}`

          return { path: otherPath }
        }

        if (importer.endsWith('_components.ts')) {
          const otherPath = `${path.join(systemPath, args.path)}.ts`

          return { path: otherPath }
        }

        return {}
      })
    },
  }

  const esbuildOptions: BuildOptions = {
    ...DEFAULT_BUILD_OPTIONS,
    entryPoints: [entrypoint],
    plugins: resolvePlugin ? [resolvePlugin] : [],
    outfile: `${outputFolder}/index.js`,
  }

  if (watchMode) {
    await watch({ ...esbuildOptions, minify: false, sourcemap: true })
  } else {
    await build(esbuildOptions)
  }
}
