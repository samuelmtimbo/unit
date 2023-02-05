import * as esbuild from 'esbuild'

export async function watch(opt: esbuild.BuildOptions): Promise<any> {
  const context = await esbuild.context(opt)

  return context.watch()
}

export function build(opt: esbuild.BuildOptions) {
  esbuild.build(opt)
}

export function buildSync(opt: esbuild.BuildOptions) {
  esbuild.buildSync(opt)
}
