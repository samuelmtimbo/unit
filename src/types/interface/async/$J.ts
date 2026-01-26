import { ObjectUpdateType } from '../../../ObjectUpdateType'
import { Callback } from '../../Callback'

export const J_METHOD_GET = ['get', 'deepGet', 'hasKey', 'keys', 'deepHas']
export const J_METHOD_CALL = ['set', 'delete', 'deepSet', 'deepDelete']
export const J_METHOD_WATCH = ['subscribe']
export const J_METHOD_REF = ['ref']

export interface $J_G {
  $get(data: { name: string }, callback: Callback<any>): void
  $deepGet(data: { path: string[] }, callback: Callback<any>): void
  $hasKey(data: { name: string }, callback: Callback<boolean>): void
  $keys(data: {}, callback: Callback<string[]>): void
  $deepHas(data: { path: string[] }, callback: Callback<boolean>): void
}

export interface $J_C {
  $set(data: { name: string; data: any }, callback: Callback<any>): void
  $delete(data: { name: string }, callback: Callback<any>): void
  $deepSet(data: { path: string[]; data: any }, callback: Callback<any>): void
  $deepDelete(
    data: { name: string; path: string[] },
    callback: Callback<any>
  ): void
}

export interface $J_W {
  $subscribe(
    data: { path: string[]; key: string },
    callback: Callback<{
      type: ObjectUpdateType
      path: string[]
      key: string
      data: any
    }>
  ): void
}

export interface $J_R {
  $ref(data: { name: string; __: string[] }): any
}

export interface $J extends $J_G, $J_C, $J_W, $J_R {}
