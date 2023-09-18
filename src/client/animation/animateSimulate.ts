import { System } from '../../system'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { animateSimulateTick } from './animateSimulateTick'

export const animateSimulate = (
  system: System,
  n0: Dict<number>,
  n1: () => Dict<number>,
  ff: [string, number][],
  tf: (n: Dict<number>) => void,
  callback: () => void | boolean
): Callback => {
  const {
    api: {
      animation: { requestAnimationFrame, cancelAnimationFrame },
    },
  } = system

  // console.log('Graph', '_animate_simulate')
  let n = n0

  let frame

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
