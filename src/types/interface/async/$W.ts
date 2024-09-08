import { $Component } from './$Component'

export const W_METHOD_GET = []
export const W_METHOD_CALL = []
export const W_METHOD_WATCH = []
export const W_METHOD_REF = [
  'refChildContainer',
  'refParentRootContainer',
  'refParentChildContainer',
]

export interface $W_G {}

export interface $W_C {}

export interface $W_W {}

export interface $W_R {
  $refChildContainer(data: { at: number; _: string[] }): $Component
  $refParentRootContainer(data: { at: number; _: string[] }): $Component
  $refParentChildContainer(data: { at: number; _: string[] }): $Component
}

export interface $W extends $W_G, $W_C, $W_W, $W_R {}
