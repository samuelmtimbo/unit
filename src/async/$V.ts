import { Callback } from '../Callback'

export const $V_METHOD_CALL = ['read', 'write']

export const $V_METHOD_WATCH = []

export const $V_METHOD_REF = []

export const $V_METHOD = [
  ...$V_METHOD_CALL,
  ...$V_METHOD_WATCH,
  ...$V_METHOD_REF,
]

export interface $V_C {
  $read(data: {}, callback: Callback<any>): void

  $write(data: { data: any }, callback: Callback<void>): void
}

export interface $V_W {}

export interface $V_R {}

export interface $V extends $V_C, $V_W, $V_R {}
