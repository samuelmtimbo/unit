import {
  $refChildContainer,
  $refParentChildContainer,
  $refParentRootContainer,
} from '../../../component/$component'
import { WP } from '../WP'
import { $Component } from './$Component'
import { $W, $W_C, $W_R, $W_W } from './$W'

export const AsyncWCall = (w: WP): $W_C => {
  return {}
}

export const AsyncWWatch = (w: WP): $W_W => {
  return {}
}

export const AsyncWRef = (w: WP): $W_R => {
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

export const AsyncW: (w: WP) => $W = (w: WP) => {
  return {
    ...AsyncWCall(w),
    ...AsyncWWatch(w),
    ...AsyncWRef(w),
  }
}
