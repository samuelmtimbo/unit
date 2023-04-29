export const getTextLines = (
  text: string,
  maxLineLength: number,
  current_line: string = ''
): string[] => {
  let lines: string[] = []

  const segments = text.split(' ')

  let line_segment_count = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segment_length = segment.length

    const space_between = line_segment_count && 1

    const space = space_between ? ' ' : ''

    if (current_line.length + space_between + segment_length > maxLineLength) {
      if (segment_length <= maxLineLength) {
        if (current_line.length === maxLineLength) {
          lines.push(current_line)

          const rec_lines = getTextLines(segment, maxLineLength, space)

          lines = lines.concat(rec_lines.slice(0, -1))

          current_line = rec_lines[rec_lines.length - 1]

          line_segment_count = current_line.split(' ').length
        } else {
          if (current_line === ' ') {
            const end = Math.min(
              maxLineLength - current_line.length - space_between,
              segment_length
            )

            lines.push(current_line + space + segment.slice(0, end))

            current_line = segment.slice(end)

            line_segment_count = current_line.length ? 1 : 0
          } else {
            lines.push(current_line + space)

            current_line = segment

            line_segment_count = 1
          }
        }
      } else {
        const end = maxLineLength - current_line.length - space_between

        if (current_line !== '' && segment_length > end) {
          lines.push(current_line + space)

          const rec_lines = getTextLines(segment, maxLineLength)

          lines = lines.concat(rec_lines.slice(0, -1))

          current_line = rec_lines[rec_lines.length - 1]

          line_segment_count = current_line.split(' ').length
        } else {
          lines.push(current_line + space + segment.slice(0, end))

          const rec_lines = getTextLines(segment.slice(end), maxLineLength)

          lines = lines.concat(rec_lines.slice(0, -1))

          current_line = rec_lines[rec_lines.length - 1]

          line_segment_count = current_line.split(' ').length
        }
      }
    } else {
      current_line += space + segment

      line_segment_count++
    }
  }

  if (current_line) {
    lines.push(current_line)
  }

  return lines
}
