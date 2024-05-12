import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'
import { Component } from './component'
import { listenMovement } from './listenMovement'

export const DIM_OPACITY: number = 0.2
export const DIM_TIMEOUT_T = 3000

export function whenInteracted(
  component: Component,
  ms: number = 6000,
  active: boolean = true,
  on_active: Callback<undefined>,
  on_inactive: Callback<undefined>
): Unlisten {
  const {
    api: {
      window: { setTimeout, clearTimeout },
    },
  } = component.$system

  let timeout = null
  const resetTimeout = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      active = false
      on_inactive()
    }, ms)
  }
  resetTimeout()
  const unlisten = listenMovement(component, () => {
    resetTimeout()
    on_active()
  })
  if (active) {
    on_active()
  } else {
    on_inactive()
  }
  return unlisten
}
