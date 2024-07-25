import { API } from '../../../../API'
import { BootOpt } from '../../../../system'
import { Size } from '../../../util/geometry/types'
import { measureText } from '../../../util/web/measureText'

export function webText(window: Window, opt: BootOpt): API['text'] {
  const { document } = window

  const canvas: HTMLCanvasElement = document.createElement('canvas')

  let ctx: CanvasRenderingContext2D | null = null

  try {
    ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.textAlign = 'center'
    }
  } catch (err) {
    //
  }

  const text: API['text'] = {
    measureText: (text: string, fontSize: number, maxWidth: number): Size => {
      if (!ctx) {
        throw new Error('canvas context not available')
      }

      return measureText(ctx, text, fontSize, maxWidth)
    },
    // @ts-ignore
    TextEncoder: window.TextEncoder,
    // @ts-ignore
    TextDecoder: window.TextDecoder,
  }

  return text
}
