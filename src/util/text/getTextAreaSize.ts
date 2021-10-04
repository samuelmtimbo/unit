import { Size } from '../../client/util/geometry'

export const getTextAreaSize = (
  str: string,
  fontSize: number,
  maxLength: number
): Size => {
  const segments = str.split(' ')
  let line_count = 1
  let line_char_count = 0
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segment_length = segment.length
    if (line_char_count + segment_length > maxLength) {
      line_count += 1
      line_char_count = segment_length
    } else {
      line_char_count += segment_length
    }
  }
  let width: number = ((line_count > 1 ? maxLength : str.length) * fontSize) / 2
  let height: number = line_count * fontSize
  return { width, height }
}
