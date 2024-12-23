import { $ } from '../../../Class/$'
import {
  $refChildContainer,
  $refParentChildContainer,
  $refParentRootContainer,
} from '../../../component/$wrapper'
import { WP } from '../WP'
import { $Component } from './$Component'
import { $WP, $WP_C, $WP_G, $WP_R, $WP_W } from './$WP'

export const AsyncWPGet = (wrapper: WP): $WP_G => {
  return {}
}

export const AsyncWPCall = (wrapper: WP): $WP_C => {
  return {}
}

export const AsyncWPWatch = (wrapper: WP): $WP_W => {
  return {}
}

export const AsyncWPRef = (wrapper: WP & $): $WP_R => {
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

export const AsyncWP: (wrapper: WP & $) => $WP = (wrapper: WP & $) => {
  return {
    ...AsyncWPGet(wrapper),
    ...AsyncWPCall(wrapper),
    ...AsyncWPWatch(wrapper),
    ...AsyncWPRef(wrapper),
  }
}
