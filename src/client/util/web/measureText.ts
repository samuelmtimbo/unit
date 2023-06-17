import { Size } from '../geometry'

export function measureText(
  ctx: CanvasRenderingContext2D,
  str: string,
  fontSize: number
): Size {
  ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = ctx.measureText(str)

  const {
    width: _width,
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
  } = textMetrics

  const width = _width + 4
  // const width = Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight) + 4
  const height =
    // Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent) + 4
    Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)

  return {
    width,
    height,
  }
}
