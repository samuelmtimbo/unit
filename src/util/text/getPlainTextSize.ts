import { Size } from '../../client/util/geometry'
import { getTextHeight } from './getPlainTextHeight'
import { getTextWidth } from './getPlainTextWidth'

export const getTextSize = (
  str: string,
  fontSize: number,
  maxLength: number
): Size => {
  const width = getTextWidth(str, fontSize, maxLength)
  const height = getTextHeight(str, fontSize, maxLength)
  return { width, height }
}
