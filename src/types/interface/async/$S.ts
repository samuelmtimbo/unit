import { BundleSpec } from '../../BundleSpec'
import { $Graph } from './$Graph'

export const S_METHOD_GET = []
export const S_METHOD_CALL = []
export const S_METHOD_WATCH = []
export const S_METHOD_REF = ['start']

export interface $S_G {}

export interface $S_C {}

export interface $S_W {}

export interface $S_R {
  $start(data: { bundle: BundleSpec }): $Graph
}

export interface $S extends $S_G, $S_C, $S_W, $S_R {}
