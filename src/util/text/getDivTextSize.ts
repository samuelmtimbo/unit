import { Size } from '../../client/util/geometry'

export const getDivTextSize = (
  str: string,
  fontSize: number,
  maxLineLength: number
): Size => {
  const segments = str.split(' ')

  let max_line_char_count = Number.MIN_SAFE_INTEGER

  let line_count = 1
  let line_char_count = 0
  let line_segment_count = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segment_length = segment.length

    const space_between = line_segment_count && 1

    if (line_char_count + segment_length + space_between >= maxLineLength) {
      if (space_between) {
        line_count +=
          1 + Math.floor((segment_length - space_between) / maxLineLength)

        line_char_count = segment_length
      } else {
        line_count += Math.ceil(segment_length / maxLineLength) - 1

        line_char_count = line_count && maxLineLength
      }

      max_line_char_count = Math.max(max_line_char_count, line_char_count)

      line_segment_count = 1
    } else {
      line_char_count += space_between + segment_length

      max_line_char_count = Math.max(max_line_char_count, line_char_count)

      line_segment_count += 1
    }
  }

  let width: number = (max_line_char_count * fontSize) / 2
  let height: number = line_count * fontSize

  return { width, height }
}
