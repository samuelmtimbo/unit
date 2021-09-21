import { Size } from '../../client/util/geometry'
import { getTextHeight } from './getTextHeight'
import { getTextWidth } from './getTextWidth'

export const getTextSize = (
  str: string,
  fontSize: number,
  maxLength: number
): Size => {
  const width = getTextWidth(str, fontSize, maxLength)
  const height = getTextHeight(str, fontSize, maxLength)
  return { width, height }
}
