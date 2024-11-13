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

  const next = () => (frame = requestAnimationFrame(tick))

  const tick = async () => {
    const _n = n1()

    const ended = animateSimulateTick(n, _n, ff, tf)

    if (ended) {
      const result = await callback()

      if (result === false) {
        next()
      }
    } else {
      next()
    }
  }

  next()

  return () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)

      frame = undefined
    }
  }
}
