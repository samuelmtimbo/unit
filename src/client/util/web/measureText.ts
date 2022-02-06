import { Size } from '../geometry'

const _canvas: HTMLCanvasElement = document.createElement('canvas')
const _ctx = _canvas.getContext('2d')
_ctx.textAlign = 'center'

export function measureText(str: string, fontSize: number): Size {
  _ctx.font = `${Math.ceil(fontSize)}px Inconsolata`

  const textMetrics = _ctx.measureText(str)

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
    Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent) + 4

  return {
    width,
    height,
  }
}
