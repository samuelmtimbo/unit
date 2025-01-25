import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { AnimatableValue, animateSimulateTick } from './animateSimulateTick'

export const animateSimulate = <T extends Dict<AnimatableValue>>(
  system: System,
  n0: T,
  n1: () => T,
  ff: [string, number][],
  tf: (n: T) => void,
  callback: () => void | boolean | Promise<boolean>
): Unlisten => {
  const {
    api: {
      animation: { requestAnimationFrame, cancelAnimationFrame },
    },
  } = system

  let n = n0

  let frame: number

  let cancelled = false

  const next = () => {
    frame = requestAnimationFrame(tick)
  }

  const tick = () => {
    const n_ = n1()

    const ended = animateSimulateTick(n, n_, ff, tf)

    if (ended) {
      callback()
    }

    if (!cancelled) {
      next()
    }
  }

  next()

  return () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)

      cancelled = true

      frame = undefined
    }
  }
}
