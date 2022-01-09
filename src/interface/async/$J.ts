import { Callback } from '../../types/Callback'

export const $J_METHOD_CALL = ['get', 'set']

export const $J_METHOD_WATCH = []

export const $J_METHOD_REF = []

export const $J_METHOD = [
  ...$J_METHOD_CALL,
  ...$J_METHOD_WATCH,
  ...$J_METHOD_REF,
]

export interface $J_C {
  $get(data: { name: string }, callback: Callback<any>): void

  $set(data: { name: string; data: any }, callback: Callback<any>): void
}

export interface $J_W {}

export interface $J_R {}

export interface $J extends $J_C, $J_W, $J_R {}
