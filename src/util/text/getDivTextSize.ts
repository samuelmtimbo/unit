import { Size } from '../../client/util/geometry'
import { getTextLines } from './getTextLines'

export const getDivTextSize = (
  text: string,
  fontSize: number,
  maxLineLength: number
): Size => {
  const lines = getTextLines(text, maxLineLength)

  const lineCount = lines.length

  if (!lineCount) {
    return { width: 0, height: fontSize }
  }

  let maxLineCharCount = Number.MIN_SAFE_INTEGER

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const line_length = line.trim().length

    maxLineCharCount = Math.max(maxLineCharCount, line_length)
  }

  const emptySpaceAround = text.length - text.trim().length

  const width: number = ((maxLineCharCount + emptySpaceAround) * fontSize) / 2
  const height: number = lineCount * fontSize

  return { width, height }
}
