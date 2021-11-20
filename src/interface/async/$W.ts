import { $Component } from './$Component'

export interface $W_C {}

export interface $W_W {}

export interface $W_R {
  $refChildContainer(data: { at: number; _: string[] }): $Component
  $refParentRootContainer(data: { at: number; _: string[] }): $Component
  $refParentChildContainer(data: { at: number; _: string[] }): $Component
}

export interface $W extends $W_C, $W_W, $W_R {}
