import { API } from '../../../../system'
import { Size } from '../../../util/geometry'
import { measureText } from '../../../util/web/measureText'

export function webText(window: Window, prefix: string): API['text'] {
  const { document } = window

  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textAlign = 'center'

  const text: API['text'] = {
    measureText: (text: string, fontSize: number): Size => {
      return measureText(ctx, text, fontSize)
    },
  }

  return text
}
