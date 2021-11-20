import { Callback } from '../../Callback'
import { Component } from '../../client/component'
import {
  $appendChild,
  $child,
  $children,
  $hasChild,
  $refChild,
  $removeChild,
} from '../../component/$component'
import { $Child } from '../../component/Child'
import { $Children } from '../../component/Children'
import { fromId } from '../../spec/fromId'
import { Classes, Specs } from '../../types'
import { Unlisten } from '../../Unlisten'
import { C } from '../C'
import { $C, $C_C, $C_R, $C_W } from './$C'
import { $Component } from './$Component'

export const AsyncCCall = (c: C): $C_C => {
  return {
    $appendChild(
      {
        specs,
        classes,
        specId,
      }: { specs: Specs; specId: string; classes: Classes },
      callback: Callback<number>
    ): void {
      const Class = fromId(specId, specs, classes)
      $appendChild(c, Class, callback)
    },

    $removeChild(
      data: { at: number },
      callback: Callback<{ specId: string }>
    ): void {
      return $removeChild(c, data, callback)
    },

    $hasChild(data: { at: number }, callback: Callback<boolean>): void {
      return $hasChild(c, data, callback)
    },

    $child(data: { at: number }, callback: Callback<$Child>): void {
      return $child(c, data, callback)
    },

    $children(data: {}, callback: Callback<$Children>): void {
      return $children(c, data, callback)
    },
  }
}

export const AsyncCWatch = (c: C): $C_W => {
  return {
  }
}

export const AsyncCRef = (c: C): $C_R => {
  return {
    $refChild(data: { at: number; _: string[] }): $Component {
      return $refChild(c, data)
    },
  }
}

export const AsyncC: (c: C) => $C = (c: C) => {
  return {
    ...AsyncCCall(c),
    ...AsyncCWatch(c),
    ...AsyncCRef(c),
  }
}
