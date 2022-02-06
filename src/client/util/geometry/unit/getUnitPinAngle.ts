import {
  INPUT_START,
  OPENING,
  OUTPUT_START,
} from '../../../../constant/OPENING'
import { IO } from '../../../../types/IO'

export const getUnitPinAngle = (
  i: number,
  n: number,
  t: IO,
  o: number = OPENING
): number => {
  const s = t === 'input' ? INPUT_START : OUTPUT_START
  return s + (o * (i + 1)) / (n + 1)
}
