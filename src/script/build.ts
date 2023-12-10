import * as esbuild from 'esbuild'
import {
  DEFAULT_BUILD_OPTIONS,
  DEFAULT_WATCH_OPTIONS,
} from '../build/constants'

export async function watch(opt: esbuild.BuildOptions): Promise<any> {
  const context = await esbuild.context({ ...DEFAULT_WATCH_OPTIONS, ...opt })

  return context.watch()
}

export function build(opt: esbuild.BuildOptions) {
  return esbuild.build({ ...DEFAULT_BUILD_OPTIONS, ...opt })
}

export function buildSync(opt: esbuild.BuildOptions) {
  return esbuild.buildSync({ ...DEFAULT_BUILD_OPTIONS, ...opt })
}
