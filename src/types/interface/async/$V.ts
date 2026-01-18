import { Callback } from '../../Callback'

export const V_METHOD_GET = ['read']
export const V_METHOD_CALL = ['write']
export const V_METHOD_WATCH = []
export const V_METHOD_REF = ['refer']

export interface $V_G {
  $read(data: {}, callback: Callback<any>): void
}

export interface $V_C {
  $write(data: { data: any }, callback: Callback<void>): void
}

export interface $V_W {}

export interface $V_R {
  $refer(data: { __: string[] }): any
}

export interface $V extends $V_G, $V_C, $V_W, $V_R {}
