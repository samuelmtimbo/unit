import { Size } from '../../client/util/geometry'
import { getTextLines } from './getTextLines'

export const getDivTextSize = (
  text: string,
  fontSize: number,
  maxLineLength: number
): Size => {
  const lines = getTextLines(text, maxLineLength)

  const line_count = lines.length

  if (!line_count) {
    return { width: 0, height: fontSize }
  }

  let max_line_char_count = Number.MIN_SAFE_INTEGER

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const line_length = line.trim().length

    max_line_char_count = Math.max(max_line_char_count, line_length)
  }

  const width: number = (max_line_char_count * fontSize) / 2
  const height: number = line_count * fontSize

  return { width, height }
}
