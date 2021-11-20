import { Callback } from '../../Callback'
import { Component } from '../../client/component'
import { $Child } from '../../component/Child'
import { $Children } from '../../component/Children'
import { Unlisten } from '../../Unlisten'
import { $Component } from './$Component'

export const $C_METHOD_CALL = [
  'appendChild',
  'removeChild',
  'hasChild',
  'child',
  'children',
  'component',
]

export const $C_METHOD_WATCH = []

export const $C_METHOD_REF = ['refChild']

export const $C_METHOD = [
  ...$C_METHOD_CALL,
  ...$C_METHOD_WATCH,
  ...$C_METHOD_REF,
]

export interface $C_C {
  $appendChild(data: { specId: string }, callback: Callback<number>): void

  $removeChild(
    data: { at: number },
    callback: Callback<{ specId: string }>
  ): void

  $hasChild(data: { at: number }, callback: Callback<boolean>): void

  $child(data: { at: number }, callback: Callback<$Child>): void

  $children(data: {}, callback: Callback<$Children>): void
}

export interface $C_W {
  $component(data: {}, callback: Callback<Component>): Unlisten
}

export interface $C_R {
  $refChild(data: { at: number; _: string[] }): $Component
}

export interface $C extends $C_C, $C_W, $C_R {}
