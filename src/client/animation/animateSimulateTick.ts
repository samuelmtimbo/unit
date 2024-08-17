import { Dict } from '../../types/Dict'
import { ANIMATION_C } from './ANIMATION_C'

export type AnimatableValue = number | number[]

export const animateSimulateTick = <T extends Dict<AnimatableValue>>(
  n0: T,
  n1: T,
  ff: [string, number][],
  tick: (n: T) => void
): boolean => {
  let ended = true

  for (const [prop, threshold] of ff) {
    const tickProp = (n0: Dict<number>, n: Dict<number>, prop: string) => {
      const dp = n[prop] - n0[prop]

      if (Math.abs(dp) > threshold) {
        ended = false

        n0[prop] += dp / ANIMATION_C
      } else {
        n0[prop] = n[prop]
      }
    }

    if (Array.isArray(n0[prop])) {
      for (let i = 0; i < (n0[prop] as number[]).length; i++) {
        tickProp(n0[prop] as any, n1[prop] as any, `${i}`)
      }
    } else {
      tickProp(n0 as Dict<number>, n1 as Dict<number>, prop)
    }
  }

  tick(n0)

  return ended
}
