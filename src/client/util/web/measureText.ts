import { Size } from '../geometry/types'

export function measureText(
  ctx: CanvasRenderingContext2D,
  str: string,
  fontSize: number,
  maxWidth: number
): Size {
  ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = ctx.measureText(str)

  const {
    width: textWidth,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
  } = textMetrics

  const lineHeight =
    Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)

  const lineCount = Math.ceil(textWidth / Math.ceil(maxWidth))

  const width = Math.min(textWidth, maxWidth)

  const height = lineHeight * lineCount

  return {
    width,
    height,
  }
}
