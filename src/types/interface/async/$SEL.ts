import { Callback } from '../../Callback'
import { SelectionObject } from '../SEL'

export const SEL_METHOD_GET = ['getSelection']
export const SEL_METHOD_CALL = ['setSelectionRange']
export const SEL_METHOD_WATCH = []
export const SEL_METHOD_REF = []

export interface $SEL_G {
  $getSelection(data: {}, callback: Callback<SelectionObject[]>): void
}

export interface $SEL_C {
  $setSelectionRange(data: SelectionObject): void
}

export interface $SEL_W {}

export interface $SEL_R {}

export interface $SEL extends $SEL_G, $SEL_C, $SEL_W, $SEL_R {}
