import { BundleSpec } from '../../BundleSpec'
import { $Graph } from './$Graph'

export const S_METHOD_GET = []
export const S_METHOD_CALL = []
export const S_METHOD_WATCH = []
export const S_METHOD_REF = ['newGraph']

export interface $S_G {}

export interface $S_C {}

export interface $S_W {}

export interface $S_R {
  $newGraph(data: { bundle: BundleSpec; _: string[] }): $Graph
}

export interface $S extends $S_G, $S_C, $S_W, $S_R {}
