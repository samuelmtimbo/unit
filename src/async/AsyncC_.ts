import { Callback } from '../Callback'
import { Component } from '../client/component'
import {
  $appendChild,
  $child,
  $children,
  $component,
  $hasChild,
  $refChild,
  $removeChild,
} from '../component/$component'
import { $Child } from '../component/Child'
import { $Children } from '../component/Children'
import { C } from '../interface/C'
import { fromId } from '../spec/fromId'
import { Unlisten } from '../Unlisten'
import { $C, $C_C, $C_R, $C_W } from './$C'
import { $Component } from './$Component'

export const AsyncCCall = (c: C): $C_C => {
  return {
    $appendChild(
      { specId }: { specId: string },
      callback: Callback<number>
    ): void {
      const Class = fromId(specId, globalThis.__specs)
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
    $component(data: {}, callback: Callback<Component>): Unlisten {
      return $component(c, data, callback)
    },
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
