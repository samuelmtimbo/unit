import { Size } from '../../client/util/geometry'
import isEqual from '../../system/f/comparisson/Equals/f'

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

const example0 = getDivTextSize('identity', 12, 12)

console.assert(
  isEqual(example0, {
    width: 48,
    height: 12,
  }),
  example0,
  '{ width: 48, height: 12 }'
)

const example1 = getDivTextSize('find last index from or default', 12, 12)

console.assert(
  isEqual(example1, {
    width: 60,
    height: 36,
  }),
  example1,
  '{ width: 60, height: 36 }'
)

const example2 = getDivTextSize('012345678900012345678900', 12, 12)

console.assert(
  isEqual(example2, {
    width: 72,
    height: 24,
  }),
  example2,
  '{ width: 72, height: 24 }'
)

const example3 = getDivTextSize('012345678901234567890123456789', 12, 12)

console.assert(
  isEqual(example3, {
    width: 72,
    height: 36,
  }),
  example3,
  '{ width: 72, height: 36 }'
)

const example4 = getDivTextSize('not logged in', 12, 18)

console.assert(
  isEqual(example4, {
    width: 78,
    height: 12,
  }),
  example0,
  '{ width: 78, height: 12 }'
)
