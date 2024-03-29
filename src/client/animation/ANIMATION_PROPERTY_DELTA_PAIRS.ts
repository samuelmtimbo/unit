import { ANIMATION_DELTA_TRESHOLD } from './ANIMATION_DELTA_TRESHOLD'

export const ANIMATION_PROPERTY_DELTA_PAIRS: [string, number][] = [
  ['x', ANIMATION_DELTA_TRESHOLD],
  ['y', ANIMATION_DELTA_TRESHOLD],
  ['width', ANIMATION_DELTA_TRESHOLD],
  ['height', ANIMATION_DELTA_TRESHOLD],
  ['sx', ANIMATION_DELTA_TRESHOLD / 100],
  ['sy', ANIMATION_DELTA_TRESHOLD / 100],
  ['opacity', ANIMATION_DELTA_TRESHOLD / 100],
  ['fontSize', ANIMATION_DELTA_TRESHOLD / 10],
]
