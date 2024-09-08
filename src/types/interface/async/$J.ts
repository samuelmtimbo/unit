import { Callback } from '../../Callback'

export const J_METHOD_GET = ['get']
export const J_METHOD_CALL = ['set']
export const J_METHOD_WATCH = []
export const J_METHOD_REF = []

export interface $J_G {
  $get(data: { name: string }, callback: Callback<any>): void
}

export interface $J_C {
  $set(data: { name: string; data: any }, callback: Callback<any>): void
}

export interface $J_W {}

export interface $J_R {}

export interface $J extends $J_G, $J_C, $J_W, $J_R {}
