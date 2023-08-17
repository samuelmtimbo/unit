import { Size } from '../../client/util/geometry/types'

export const getTextAreaSize = (
  str: string,
  fontSize: number,
  maxLineLength: number
): Size => {
  const segments = str.split(' ')

  let line_count = 1
  let line_char_count = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segment_length = segment.length

    if (line_char_count + segment_length > maxLineLength) {
      line_count += Math.floor((segment_length - 1) / maxLineLength)
      line_char_count = segment_length
    } else {
      line_char_count += segment_length
    }
  }

  let width: number =
    ((line_count > 1 ? maxLineLength : str.length) * fontSize) / 2
  let height: number = line_count * fontSize

  return { width, height }
}
