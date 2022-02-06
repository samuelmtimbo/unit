import { $Child } from '../../component/Child'
import { $Children } from '../../component/Children'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { $C, $C_C, $C_R, $C_W } from './$C'
import { $Component } from './$Component'

export const AsyncCCall = (c: $C_C): $C_C => {
  return {
    $appendChild(data: { specId: string }, callback: Callback<number>): void {
      return c.$appendChild(data, callback)
    },

    $removeChild(
      data: { at: number },
      callback: Callback<{ specId: string }>
    ): void {
      return c.$removeChild(data, callback)
    },

    $hasChild(data: { at: number }, callback: Callback<boolean>): void {
      return c.$hasChild(data, callback)
    },

    $child(data: { at: number }, callback: Callback<$Child>): void {
      return c.$child(data, callback)
    },

    $children(data: {}, callback: Callback<$Children>): void {
      return c.$children(data, callback)
    },
  }
}

export const _AsyncCCall = (obj: Dict<any>, c: $C_C): $C_C => {
  return {
    $appendChild(data: { specId: string }, callback: Callback<number>): void {
      return c.$appendChild(data, callback)
    },

    $removeChild(
      data: { at: number },
      callback: Callback<{ specId: string }>
    ): void {
      return c.$removeChild(data, callback)
    },

    $hasChild(data: { at: number }, callback: Callback<boolean>): void {
      return c.$hasChild(data, callback)
    },

    $child(data: { at: number }, callback: Callback<$Child>): void {
      return c.$child(data, callback)
    },

    $children(data: {}, callback: Callback<$Children>): void {
      return c.$children(data, callback)
    },
  }
}

export const AsyncCWatch = (c: $C_W): $C_W => {
  return {}
}

export const AsyncCRef = (c: $C_R): $C_R => {
  return {
    $refChild(data: { at: number; _: string[] }): $Component {
      return c.$refChild(data)
    },
  }
}

export const AsyncC: (c: $C) => $C = (c: $C) => {
  return {
    ...AsyncCCall(c),
    ...AsyncCWatch(c),
    ...AsyncCRef(c),
  }
}
