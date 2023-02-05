import { API } from '../../../../API'
import { BootOpt } from '../../../../system'
import { Size } from '../../../util/geometry'
import { measureText } from '../../../util/web/measureText'

export function webText(window: Window, opt: BootOpt): API['text'] {
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
