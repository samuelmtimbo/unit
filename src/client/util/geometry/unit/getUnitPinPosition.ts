import { polarToCartesian } from '..'
import { LINK_DISTANCE } from '../../../../constant/LINK_DISTANCE'
import { OPENING } from '../../../../constant/OPENING'
import { getUnitPinAngle } from './getUnitPinAngle'

export const getUnitPinPosition = (
  i: number,
  n: number,
  t: 'input' | 'output',
  r: number,
  x: number,
  y: number,
  R: number,
  o: number = OPENING,
  l: number = LINK_DISTANCE / 3
) => {
  return polarToCartesian(x, y, r + l + R + 4, getUnitPinAngle(i, n, t, o))
}
