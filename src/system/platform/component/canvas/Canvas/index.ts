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
    this.emit('call', { method: 'clear', data: undefined })

    return
  }

  drawImage(imageBitmap: ImageBitmap): void {
    this.emit('call', { method: 'drawImage', data: [imageBitmap] }) // TODO
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
      this._component.$element.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject('cannot convert canvas to blob')
          }
        },
        type,
        quality
      )
    })
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    return this._component.$element.captureStream(frameRate)
  }
}
