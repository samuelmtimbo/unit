import { Dict } from '../../types/Dict'
import { ANIMATION_C } from './ANIMATION_C'

export const animateSimulateTick = (
  n: Dict<number>,
  _n: Dict<number>,
  ff: [string, number][],
  tick: (n: Dict<number>) => void
): boolean => {
  let ended = true

  for (const [prop, treshold] of ff) {
    const dp = _n[prop] - n[prop]

    if (Math.abs(dp) > treshold) {
      ended = false

      n[prop] += dp / ANIMATION_C
    } else {
      n[prop] = _n[prop]
    }
  }

  tick(n)

  return ended
}
