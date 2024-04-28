import { Size } from '../geometry/types'

export function measureText(
  ctx: CanvasRenderingContext2D,
  str: string,
  fontSize: number
): Size {
  ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = ctx.measureText(str)

  const {
    width: _width,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
  } = textMetrics

  const width = _width + 4
  const height =
    Math.abs(fontBoundingBoxAscent) +
    Math.abs(fontBoundingBoxDescent) +
    textMetrics['hangingBaseline'] -
    textMetrics['ideographicBaseline']

  return {
    width,
    height,
  }
}
