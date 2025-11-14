import { build, BuildOptions } from 'esbuild'
import { pathExists, readJSON } from 'fs-extra'
import { unlink } from 'fs/promises'
import * as path from 'path'
import { PATH_UNIT } from '../path'
import { sync } from '../script/sync'
import { collectIdSetFromBundle } from './collectIdSet'
import { DEFAULT_BUILD_OPTIONS } from './constants'

export async function bundle(
  unitPath: string,
  projectPath: string,
  outputFolder: string,
  includeSystem: boolean,
  opt: BuildOptions
): Promise<void> {
  const bundlePath = path.join(projectPath, 'bundle.json')
  const bootPath = path.join(projectPath, 'system.json')

  await bundle_(
    unitPath,
    bundlePath,
    bootPath,
    outputFolder,
    includeSystem,
    opt
  )
}

export async function bundle_(
  unitPath: string,
  bundlePath: string,
  bootPath: string,
  outputFolder: string,
  includeSystem: boolean,
  opt: BuildOptions
): Promise<void> {
  const systemPath = path.join(unitPath, 'src', 'system')
  const entrypoint = path.join(unitPath, 'src/client/platform/web/index.ts')
  const fallbackBootPath = path.join(
    unitPath,
    'src/client/platform/web/system.json'
  )
  const outputPath = path.join(outputFolder, 'index.js')

  const bootPathExists = await pathExists(bootPath)
  const bundle = await readJSON(bundlePath)

  const set = includeSystem ? undefined : collectIdSetFromBundle(bundle)

  await sync(systemPath, outputFolder, set)

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
              return { path: fallbackBootPath }
            }
          }
        }

        if (importer.endsWith('_classes.ts')) {
          const otherPath = `${path.join(systemPath, args.path, 'index.ts')}`

          return { path: otherPath }
        }

        if (importer.endsWith('_components.ts')) {
          const otherPath = `${path.join(systemPath, args.path)}.ts`

          return { path: otherPath }
        }

        if (
          args.path.endsWith('/system/_specs') ||
          args.path.endsWith('/system/_components') ||
          args.path.endsWith('/system/_ids') ||
          args.path.endsWith('/system/_classes')
        ) {
          const absolutePath = path
            .join(resolveDir, args.path)
            .replace(systemPath, '')
            .replace('.ts', '')

          const otherPath = path.join(outputFolder, `${absolutePath}.ts`)

          return { path: otherPath }
        }

        return {}
      })
    },
  }

  const esbuildOptions: BuildOptions = {
    ...DEFAULT_BUILD_OPTIONS,
    entryPoints: [entrypoint],
    plugins: [resolvePlugin],
    outfile: outputPath,
    ...opt,
  }

  await build(esbuildOptions)

  await unlink(path.join(outputFolder, '_specs.ts'))
  await unlink(path.join(outputFolder, '_ids.ts'))
  await unlink(path.join(outputFolder, '_classes.ts'))
  await unlink(path.join(outputFolder, '_components.ts'))
}

export async function defaultBundle(
  bundlePath: string,
  bootPath: string,
  outputFolder: string,
  includeSystem: boolean,
  opt: BuildOptions
): Promise<void> {
  const unitPath = PATH_UNIT

  return bundle_(
    unitPath,
    bundlePath,
    bootPath,
    outputFolder,
    includeSystem,
    opt
  )
}
