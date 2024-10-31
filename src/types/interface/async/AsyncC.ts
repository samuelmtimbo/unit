import {
  $appendChild,
  $child,
  $children,
  $getAnimations,
  $getSetup,
  $hasChild,
  $refChild,
  $refRoot,
  $removeChild,
} from '../../../component/$component'
import { Child } from '../../../component/Child'
import { Children } from '../../../component/Children'
import { fromUnitBundle } from '../../../spec/fromUnitBundle'
import { Callback } from '../../Callback'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Component_ } from '../Component'
import { $C, $C_C, $C_G, $C_R, $C_W } from './$C'
import { $Component } from './$Component'

export const AsyncCGet = (c: Component_): $C_G => {
  return {
    $hasChild(data: { at: number }, callback: Callback<boolean>): void {
      return $hasChild(c, data, callback)
    },

    $child(data: { at: number }, callback: Callback<Child>): void {
      return $child(c, data, callback)
    },

    $children(data: {}, callback: Callback<Children>): void {
      return $children(c, data, callback)
    },

    $getAnimations(data, callback) {
      return $getAnimations(c, data, callback)
    },

    $getSetup(data, callback) {
      return $getSetup(c, data, callback)
    },
  }
}

export const AsyncCCall = (c: Component_): $C_C => {
  return {
    $appendChild(
      { bundle }: { bundle: UnitBundleSpec },
      callback: Callback<number>
    ): void {
      const Class = fromUnitBundle<Component_>(
        bundle,
        c.__system.specs,
        c.__system.classes
      )

      $appendChild(c, Class, callback)
    },

    $removeChild(
      data: { at: number },
      callback: Callback<{ specId: string }>
    ): void {
      return $removeChild(c, data, callback)
    },
  }
}

export const AsyncCWatch = (c: Component_): $C_W => {
  return {}
}

export const AsyncCRef = (c: Component_): $C_R => {
  return {
    $refChild(data: { at: number; _: string[] }): $Component {
      return $refChild(c, data)
    },
    $refRoot(data: { at: number; _: string[] }) {
      return $refRoot(c, data)
    },
    $refParentRoot(data: { at: number; _: string[] }): $Component {
      return $refRoot(c, data)
    },
  }
}

export const AsyncC: (c: Component_) => $C = (c: Component_) => {
  return {
    ...AsyncCGet(c),
    ...AsyncCCall(c),
    ...AsyncCWatch(c),
    ...AsyncCRef(c),
  }
}
