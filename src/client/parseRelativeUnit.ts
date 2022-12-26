import { isFrameRelativeValue } from '../isFrameRelative'
import { isParentRelativeValue } from '../isParentRelative'

export function parseRelativeUnit(
  value: number | string,
  getParentUnit: () => number,
  getFrameUnit: () => number
): number {
  if (typeof value === 'number') {
    return value
  } else {
    if (isParentRelativeValue(value)) {
      const valueNum = value.substring(0, value.length - 1)
      const valueUnit = Number.parseFloat(valueNum)
      const parentUnit: number = getParentUnit()
      const percent = valueUnit / 100
      return percent * parentUnit
    } else if (isFrameRelativeValue(value)) {
      const valueNum = value.substring(0, value.length - 2)
      const valueUnit = Number.parseFloat(valueNum)
      const frameUnit: number = getFrameUnit()
      const percent = valueUnit / 100
      return percent * frameUnit
    } else {
      const valueUnit = Number.parseFloat(value)
      return valueUnit
    }
  }
}
