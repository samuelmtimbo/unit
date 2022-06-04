import { GraphSpec } from '../..'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { $Graph } from './$Graph'

export const $P_METHOD_CALL = []
export const $P_METHOD_WATCH = []
export const $P_METHOD_REF = ['refGlobalUnit', 'refGraph']

export const $V_METHOD = [
  ...$P_METHOD_CALL,
  ...$P_METHOD_WATCH,
  ...$P_METHOD_REF,
]

export interface $P_C {
  $getSpecs(data: {}, callback: Callback<GraphSpec>): void
}

export interface $P_W {}

export interface $P_R {
  $refGlobalUnit(data: { id: string; _: string[] }): any

  $refGraph(data: { bundle: BundleSpec }): $Graph
}

export interface $P extends $P_C, $P_W, $P_R {}
