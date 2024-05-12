import { Callback } from '../../Callback'

export const B_METHOD_CALL = ['blob']
export const B_METHOD_WATCH = []
export const B_METHOD_REF = []

export interface $B_C {
  $blob({}: {}, callback: Callback<Blob>): void
}

export interface $B_W {}

export interface $B_R {}

export interface $B extends $B_C, $B_W, $B_R {}
