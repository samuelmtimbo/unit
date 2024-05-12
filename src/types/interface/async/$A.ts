import { Callback } from '../../Callback'

export const A_METHOD_CALL = ['append', 'put', 'at', 'length', 'indexOf']
export const A_METHOD_WATCH = []
export const A_METHOD_REF = []

export interface $A_C {
  append(data: { a: any }, callback: Callback<void>): void
  put(data: { i: number; data: any }, callback: Callback<any>): void
  at(data: { i: number }, callback: Callback<any>): void
  length(data: {}, callback: Callback<number>): void
  indexOf(data: { a: any }, callback: Callback<number>): void
}

export interface $A_W {}

export interface $A_R {}

export interface $A extends $A_C, $A_W, $A_R {}
