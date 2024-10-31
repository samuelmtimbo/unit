import { Child } from '../../../component/Child'
import { Children } from '../../../component/Children'
import { Callback } from '../../Callback'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { AnimationSpec, ComponentSetup } from '../C'
import { $Component } from './$Component'

export const C_METHOD_GET = [
  'hasChild',
  'child',
  'children',
  'getAnimations',
  'getSetup',
]
export const C_METHOD_CALL = ['appendChild', 'removeChild']
export const C_METHOD_WATCH = []
export const C_METHOD_REF = ['refChild']

export interface $C_G {
  $hasChild(data: { at: number }, callback: Callback<boolean>): void
  $child(data: { at: number }, callback: Callback<Child>): void
  $children(data: {}, callback: Callback<Children>): void
  $getAnimations(data: {}, callback: Callback<AnimationSpec[]>): void
  $getSetup(data: {}, callback: Callback<ComponentSetup>): void
}

export interface $C_C {
  $appendChild(
    data: { bundle: UnitBundleSpec },
    callback: Callback<number>
  ): void
  $removeChild(
    data: { at: number },
    callback: Callback<{ specId: string }>
  ): void
}

export interface $C_W {}

export interface $C_R {
  $refChild(data: { at: number; _: string[] }): $Component
  $refRoot(data: { at: number; _: string[] }): $Component
  $refParentRoot(data: { at: number; _: string[] }): $Component
}

export interface $C extends $C_G, $C_C, $C_W, $C_R {}
