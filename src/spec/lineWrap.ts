export function lineWrap(text: string, MAX: number = 15): string[] {
  const lines: string[] = []

  const segments = text.split(' ')

  const l = segments.length

  let line_segments: string[] = []
  let line_segments_char_count = 0

  for (let i = 0; i < l; i++) {
    const segment = segments[i]
    const segment_l = segment.length

    if (line_segments_char_count + line_segments.length - 1 + segment_l > MAX) {
      lines.push(line_segments.join(' '))
      line_segments = []
      line_segments_char_count = 0
    }

    line_segments.push(segment)
    line_segments_char_count += segment_l
  }

  if (line_segments.length > 0) {
    lines.push(line_segments.join(' '))
  }

  return lines
}
