import { Callback } from '../../Callback'

export const W_METHOD_GET = []
export const W_METHOD_CALL = ['write']
export const W_METHOD_WATCH = []
export const W_METHOD_REF = []

export interface $W_G {}

export interface $W_C {
  $write(data: { data: any }, callback: Callback<void>): void
}

export interface $W_W {}

export interface $W_R {}

export interface $W extends $W_G, $W_C, $W_W, $W_R {}
