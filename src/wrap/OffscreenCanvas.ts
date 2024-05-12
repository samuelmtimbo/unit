import { $ } from '../Class/$'
import { draw } from '../client/canvas/draw'
import { APINotSupportedError } from '../exception/APINotImplementedError'
import { System } from '../system'
import { clearCanvas } from '../system/platform/component/canvas/Canvas/Component'
import { CA } from '../types/interface/CA'
import { readBlobAsDataUrl } from './FileReader'

export function wrapOffscreenCanvas(
  offscreenCanvas: OffscreenCanvas,
  offscreenCanvasCtx: OffscreenCanvasRenderingContext2D,
  system: System
): CA & $ {
  const stream = new (class OffscreenCanvas_ extends $ implements CA {
    __: string[] = ['CA']

    async clear(): Promise<void> {
      clearCanvas(offscreenCanvasCtx)
    }

    async drawImage(
      imageBitmap: ImageBitmap,
      x: number,
      y: number,
      width: number,
      height: number
    ): Promise<void> {
      offscreenCanvasCtx.drawImage(imageBitmap, x, y, width, height)
    }

    strokePath(d: string): void {
      offscreenCanvasCtx.stroke(new Path2D(d))
    }

    fillPath(d: string, fillRule: CanvasFillRule): void {
      offscreenCanvasCtx.fill(new Path2D(d), fillRule)
    }

    scale(sx: number, sy: number): void {
      offscreenCanvasCtx.scale(sx, sy)
    }

    translate(x: number, y: number): void {
      offscreenCanvasCtx.translate(x, y)
    }

    async draw(step: any[]): Promise<void> {
      draw(offscreenCanvasCtx, step)
    }

    async toBlob(type: string, quality: number): Promise<Blob> {
      if ('convertToBlob' in offscreenCanvas) {
        return offscreenCanvas.convertToBlob({ type, quality })
      } else {
        throw new APINotSupportedError('OffscreenCanvas convertToBlob')
      }
    }

    async toDataUrl(type: string, quality: number): Promise<string> {
      const blob = await this.toBlob(type, quality)

      return readBlobAsDataUrl(this.__system, blob)
    }

    async captureStream({
      frameRate,
    }: {
      frameRate: number
    }): Promise<MediaStream> {
      throw new APINotSupportedError('Offscreen Canvas Capture Stream')
    }

    async getImageData(
      x: number,
      y: number,
      width: number,
      height: number
    ): Promise<ImageData> {
      return offscreenCanvasCtx.getImageData(x, y, width, height)
    }

    async putImageData(
      image: ImageData,
      dx: number,
      dy: number,
      x: number,
      y: number,
      width: number,
      height: number
    ): Promise<void> {
      offscreenCanvasCtx.putImageData(image, dx, dy, x, y, width, height)
    }
  })(system)

  return stream
}
