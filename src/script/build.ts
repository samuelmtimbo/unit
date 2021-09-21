import * as esbuild from 'esbuild'

export function build(opt: esbuild.BuildOptions) {
  esbuild.build(opt)
}

export function buildSync(opt: esbuild.BuildOptions) {
  esbuild.buildSync(opt)
}
