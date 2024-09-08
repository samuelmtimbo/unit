import { Callback } from '../../Callback'

export const IB_METHOD_GET = ['imageBitmap']
export const IB_METHOD_CALL = ['imageBitmap']
export const IB_METHOD_WATCH = []
export const IB_METHOD_REF = []

export interface $IB_G {
  $imageBitmap({}: {}, callback: Callback<Blob>): void
}

export interface $IB_C {}

export interface $IB_W {}

export interface $IB_R {}

export interface $IB extends $IB_G, $IB_C, $IB_W, $IB_R {}
