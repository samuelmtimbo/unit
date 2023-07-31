export const getTextLines = (
  text: string,
  maxLineLength: number,
  currentLine: string = ''
): string[] => {
  let lines: string[] = []

  const segments = text.split(' ')

  let lineSegmentCount = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segmentLength = segment.length

    const spaceBetween = lineSegmentCount && 1

    const space = spaceBetween ? ' ' : ''

    if (currentLine.length + spaceBetween + segmentLength > maxLineLength) {
      if (segmentLength <= maxLineLength) {
        if (currentLine.length === maxLineLength) {
          lines.push(currentLine)

          const rec_lines = getTextLines(segment, maxLineLength, space)

          lines = lines.concat(rec_lines.slice(0, -1))

          currentLine = rec_lines[rec_lines.length - 1]

          lineSegmentCount = currentLine.split(' ').length
        } else {
          if (currentLine === ' ') {
            const end = Math.min(
              maxLineLength - currentLine.length - spaceBetween,
              segmentLength
            )

            lines.push(currentLine + space + segment.slice(0, end))

            currentLine = segment.slice(end)

            lineSegmentCount = currentLine.length ? 1 : 0
          } else {
            lines.push(currentLine + space)

            currentLine = segment

            lineSegmentCount = 1
          }
        }
      } else {
        const end = maxLineLength - currentLine.length - spaceBetween

        if (currentLine !== '' && segmentLength > end) {
          lines.push(currentLine + space)

          const rec_lines = getTextLines(segment, maxLineLength)

          lines = lines.concat(rec_lines.slice(0, -1))

          currentLine = rec_lines[rec_lines.length - 1]

          lineSegmentCount = currentLine.split(' ').length
        } else {
          lines.push(currentLine + space + segment.slice(0, end))

          const rec_lines = getTextLines(segment.slice(end), maxLineLength)

          lines = lines.concat(rec_lines.slice(0, -1))

          currentLine = rec_lines[rec_lines.length - 1]

          lineSegmentCount = currentLine.split(' ').length
        }
      }
    } else {
      currentLine += space + segment

      lineSegmentCount++
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export function spaces(n: number) {
  let s = ''

  for (let i = 0; i < n; i++) {
    s += ' '
  }

  return s
}

export function countStartSpaces(text: string) {
  let i = 0

  while (text[i] === ' ') {
    i++
  }

  return i
}

export function countEndSpaces(text: string) {
  let i = text.length - 1

  while (text[i] === ' ') {
    i--
  }

  return text.length - 1 - i
}
