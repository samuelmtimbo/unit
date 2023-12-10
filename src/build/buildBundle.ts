import { build, BuildOptions } from 'esbuild'
import { pathExists, readJSON } from 'fs-extra'
import { buildIdSetFromBundle } from './buildIdSetFromBundle'
import { DEFAULT_BUILD_OPTIONS } from './constants'
import { watch } from '../script/build'
import { sync } from '../script/sync'
import * as path from 'path'

export async function buildBundle(
  unitPath: string,
  projectPath: string,
  outputFolder: string,
  watchMode: boolean = false,
  includeSystem: boolean = false
): Promise<void> {
  const bundlePath = path.join(projectPath, 'bundle.json')
  const bootPath = path.join(projectPath, 'system.json')

  const bootPathExists = await pathExists(bootPath)

  const bundle = await readJSON(bundlePath, 'utf8')

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

          if (args.path === './system.json') {
            if (bootPathExists) {
              return { path: bootPath }
            } else {
              const fallbackSystemPath = path.join(
                unitPath,
                'src/client/platform/web/system.json'
              )

              return { path: fallbackSystemPath }
            }
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
