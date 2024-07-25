import { Callback } from '../../Callback'

export const TD_METHOD_CALL = ['decode']
export const TD_METHOD_WATCH = []
export const TD_METHOD_REF = []

export interface $TD_C {
  $decode(data: TextDecodeOptions, callback: Callback<ArrayBuffer>): void
}

export interface $TD_W {}

export interface $TD_R {}

export interface $TD extends $TD_C, $TD_W, $TD_R {}
