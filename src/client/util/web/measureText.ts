import { Size } from '../geometry/types'

export function measureText(
  ctx: CanvasRenderingContext2D,
  str: string,
  fontSize: number,
  maxWidth: number
): Size {
  ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = ctx.measureText('xHÁQWÍjgpqy')

  const { fontBoundingBoxAscent, fontBoundingBoxDescent } = textMetrics

  const lineHeight =
    Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)

  const words = str.split(' ')

  const lines: string[] = []

  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width

    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)

      currentLine = word
    }
  }
  lines.push(currentLine)

  const height = lineHeight * lines.length * 1.2

  const width = Math.max(...lines.map((line) => ctx.measureText(line).width))

  return {
    width,
    height,
  }
}
