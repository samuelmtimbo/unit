import { BundleSpec } from '../../BundleSpec'
import { Unlisten } from '../../Unlisten'
import { $Graph } from './$Graph'

export const S_METHOD_CALL = []
export const S_METHOD_WATCH = []
export const S_METHOD_REF = ['newGraph']

export interface $S_C {}

export interface $S_W {}

export interface $S_R {
  $newGraph({ bundle }: { bundle: BundleSpec; _: string[] }): [$Graph, Unlisten]
}

export interface $S extends $S_C, $S_W, $S_R {}
