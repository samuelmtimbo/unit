import { Callback } from '../../Callback'

export const R_METHOD_GET = ['read']
export const R_METHOD_CALL = []
export const R_METHOD_WATCH = []
export const R_METHOD_REF = []

export interface $R_G {
  $read(data: {}, callback: Callback<any>): void
}

export interface $R_C {}

export interface $R_W {}

export interface $R_R {}

export interface $R extends $R_G, $R_C, $R_W, $R_R {}
