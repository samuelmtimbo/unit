import { Callback } from '../../Callback'

export const TE_METHOD_GET = []
export const TE_METHOD_CALL = ['encode']
export const TE_METHOD_WATCH = []
export const TE_METHOD_REF = []

export interface $TE_G {}

export interface $TE_C {
  $encode(
    data: { opt: {}; text: string | ArrayBuffer },
    callback: Callback<Uint8Array>
  ): void
}

export interface $TE_W {}

export interface $TE_R {}

export interface $TE extends $TE_G, $TE_C, $TE_W, $TE_R {}
