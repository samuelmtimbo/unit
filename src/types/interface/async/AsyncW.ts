import { $ } from '../../../Class/$'
import {
  $refChildContainer,
  $refParentChildContainer,
  $refParentRootContainer,
} from '../../../component/$wrapper'
import { WP } from '../WP'
import { $Component } from './$Component'
import { $W, $W_C, $W_G, $W_R, $W_W } from './$W'

export const AsyncWGet = (wrapper: WP): $W_G => {
  return {}
}

export const AsyncWCall = (wrapper: WP): $W_C => {
  return {}
}

export const AsyncWWatch = (wrapper: WP): $W_W => {
  return {}
}

export const AsyncWRef = (wrapper: WP & $): $W_R => {
  return {
    $refChildContainer({ at, _ }: { at: number; _: string[] }): $Component {
      const $container = $refChildContainer(wrapper, { at, _ })
      return $container
    },
    $refParentRootContainer({
      at,
      _,
    }: {
      at: number
      _: string[]
    }): $Component {
      const $container = $refParentRootContainer(wrapper, { at, _ })
      return $container
    },
    $refParentChildContainer({
      at,
      _,
    }: {
      at: number
      _: string[]
    }): $Component {
      const $container = $refParentChildContainer(wrapper, { at, _ })
      return $container
    },
  }
}

export const AsyncW: (wrapper: WP & $) => $W = (wrapper: WP & $) => {
  return {
    ...AsyncWGet(wrapper),
    ...AsyncWCall(wrapper),
    ...AsyncWWatch(wrapper),
    ...AsyncWRef(wrapper),
  }
}
