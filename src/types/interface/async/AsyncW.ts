import {
  $refChildContainer,
  $refParentChildContainer,
  $refParentRootContainer,
} from '../../../component/$component'
import { W } from '../W'
import { $Component } from './$Component'
import { $W, $W_C, $W_R, $W_W } from './$W'

export const AsyncWCall = (w: W): $W_C => {
  return {}
}

export const AsyncWWatch = (w: W): $W_W => {
  return {}
}

export const AsyncWRef = (w: W): $W_R => {
  return {
    $refChildContainer({ at, _ }: { at: number; _: string[] }): $Component {
      const $container = $refChildContainer(w, { at, _ })
      return $container
    },
    $refParentRootContainer({
      at,
      _,
    }: {
      at: number
      _: string[]
    }): $Component {
      const $container = $refParentRootContainer(w, { at, _ })
      return $container
    },
    $refParentChildContainer({
      at,
      _,
    }: {
      at: number
      _: string[]
    }): $Component {
      const $container = $refParentChildContainer(w, { at, _ })
      return $container
    },
  }
}

export const AsyncW: (w: W) => $W = (w: W) => {
  return {
    ...AsyncWCall(w),
    ...AsyncWWatch(w),
    ...AsyncWRef(w),
  }
}
