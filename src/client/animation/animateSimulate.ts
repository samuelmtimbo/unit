import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { animateSimulateTick } from './animateSimulateTick'

export const animateSimulate = (
  system: System,
  n0: Dict<number>,
  n1: () => Dict<number>,
  ff: [string, number][],
  tf: (n: Dict<number>) => void,
  callback: () => void | boolean
): Unlisten => {
  const {
    api: {
      animation: { requestAnimationFrame, cancelAnimationFrame },
    },
  } = system

  let n = n0

  let frame: number

  const next = () => (frame = requestAnimationFrame(tick))

  const tick = () => {
    const _n = n1()

    const ended = animateSimulateTick(n, _n, ff, tf)

    if (ended) {
      const result = callback()

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
