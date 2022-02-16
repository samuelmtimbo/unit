import { removeWhiteSpace } from '../util/string'
import { REGEX_CALC, REGEX_PERCENT, REGEX_PX } from './reflectChildrenTrait'

export function parseLayoutValue(value: string): [number, number] {
  value = removeWhiteSpace(value)
  const percentTest = REGEX_PERCENT.exec(value)
  if (percentTest) {
    return [0, parseFloat(percentTest[1])]
  } else {
    const pxTest = REGEX_PX.exec(value)
    if (pxTest) {
      return [parseFloat(pxTest[1]), 0]
    } else {
      const calcTest = REGEX_CALC.exec(value)
      if (calcTest) {
        return [parseFloat(calcTest[2]), parseFloat(calcTest[1])]
      } else {
        throw new Error('layout value not recognized')
      }
    }
  }
}
