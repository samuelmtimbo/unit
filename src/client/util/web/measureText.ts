import { Size } from '../geometry/types'

export function measureText(
  ctx: CanvasRenderingContext2D,
  str: string,
  fontSize: number,
  maxWidth: number
): Size {
  ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = ctx.measureText(str)

  const { width, fontBoundingBoxAscent, fontBoundingBoxDescent } = textMetrics

  const lineHeight =
    Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)

  const lineCount = Math.ceil(width / maxWidth)

  const height = lineHeight * lineCount

  return {
    width,
    height,
  }
}
