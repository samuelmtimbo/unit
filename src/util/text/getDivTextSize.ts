import { Size } from '../../client/util/geometry/types'
import { last } from '../array'
import { getTextLines } from './getTextLines'

export const getDivTextSize = (
  text: string,
  fontSize: number,
  maxLineLength: number
): Size => {
  const lines = getTextLines(text, maxLineLength)

  if (!lines.length) {
    return { width: 0, height: fontSize }
  }

  const lastLine = last(lines)

  if (lastLine.trim() === '') {
    lines.splice(lines.length - 1, 1)
  }

  const newText = lines.join('')

  const lineCount = lines.length

  let maxLineCharCount = Number.MIN_SAFE_INTEGER
  let maxLineCharIndex = Number.MIN_SAFE_INTEGER

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const lineLength = line.trim().length

    if (lineLength > maxLineCharCount) {
      maxLineCharIndex = i
      maxLineCharCount = lineLength
    }
  }

  const emptySpaceAround = newText.length - newText.trim().length

  const isLastLine = maxLineCharIndex === lineCount - 1

  const emptySpaceToAdd = isLastLine ? emptySpaceAround : 0

  const width: number = ((maxLineCharCount + emptySpaceToAdd) * fontSize) / 2
  const height: number = lineCount * fontSize

  return { width, height }
}
