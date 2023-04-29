import { ElementEE, Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { CSOpt } from '../../../../../types/interface/async/$CS'
import { CA } from '../../../../../types/interface/CA'
import { ID_CANVAS } from '../../../../_ids'
import { Style } from '../../../Props'
import CanvasComp from './Component'

export interface I {
  style?: Style
  width?: number
  height?: number
  d?: any[]
}

export interface O {}

export interface CanvasJ {}
export interface CanvasEE extends ElementEE<{}> {}
export interface CanvasC extends CanvasComp {}

export default class Canvas
  extends Element_<I, O, CanvasJ, CanvasEE, CanvasC>
  implements CA
{
  __ = ['U', 'C', 'V', 'J']

  constructor(system: System) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: [],
      },
      {
        output: {
          ctx: {
            ref: true,
          },
        },
      },
      system,
      ID_CANVAS
    )

    this._state = {
      d: [],
    }

    this._component = new CanvasComp({}, this.__system)
  }

  async clear(): Promise<void> {
    this._component.clear()

    this.emit('call', { method: 'clear', data: undefined })

    return
  }

  async drawImage(
    imageBitmap: ImageBitmap,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    this._component.drawImage(imageBitmap, x, y, width, height)

    this.emit('call', { method: 'drawImage', data: [imageBitmap] })
  }

  strokePath(d: string): void {
    this._component.strokePath(d)

    this.emit('call', { method: 'strokePath', data: [d] })
  }

  fillPath(d: string, fillRule: CanvasFillRule): void {
    this._component.fillPath(d, fillRule)

    this.emit('call', { method: 'fillPath', data: [d, fillRule] })
  }

  scale(sx: number, sy: number): void {
    this._component.scale(sx, sy)

    this.emit('call', { method: 'scale', data: [sx, sy] })
  }

  translate(x: number, y: number): void {
    this._component.translate(x, y)

    this.emit('call', { method: 'translate', data: [x, y] })
  }

  async draw(step: any[]): Promise<void> {
    this._state.d.push(step)

    this._backwarding = true
    this._input.d.pull()
    this._backwarding = false

    this._component.draw(step)

    this.emit('call', { method: 'draw', data: [step] })

    return
  }

  async toBlob(type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this._component.toBlob({ type, quality }, (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject('cannot convert canvas to blob')
        }
      })
    })
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    return this._component.$element.captureStream(frameRate)
  }
}
