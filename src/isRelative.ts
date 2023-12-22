import { isFrameRelativeValue } from './isFrameRelative'
import { isParentRelativeValue } from './isParentRelative'

export function isRelativeValue(value: string) {
  return isFrameRelativeValue(value) || isParentRelativeValue(value)
}
