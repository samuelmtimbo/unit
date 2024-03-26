import { ElementEE, Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { CSOpt } from '../../../../../types/interface/async/$CS'
import { ID_CANVAS } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'
import { Style } from '../../../Style'
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
  __ = ['U', 'C', 'V', 'J', 'CA', 'EE']

  private _offscreen: OffscreenCanvas
  private _offscreen_ctx: OffscreenCanvasRenderingContext2D

  constructor(system: System) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: [],
      },
      {
        output: {},
      },
      system,
      ID_CANVAS
    )

    this._state = {
      d: [],
    }

    this._component = new CanvasComp({}, this.__system)

    this._offscreen = new OffscreenCanvas(1000, 1000)
    this._offscreen_ctx = this._offscreen.getContext('2d', {
      willReadFrequently: true,
    })
  }

  async clear(): Promise<void> {
    this._component.clear()

    this.set('d', [])

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
    // console.log('drawImage', imageBitmap, x, y, width, height)

    // this._component.drawImage(imageBitmap, x, y, width, height)
    this._offscreen_ctx.drawImage(imageBitmap, x, y, width, height)

    this.emit('call', {
      method: 'drawImage',
      data: [imageBitmap, x, y, width, height],
    })
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

  async toDataUrl(type: string, quality: string): Promise<string> {
    const component = (await firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    )) as CanvasComp

    return component.toDataUrl(type, quality)
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    return this._component.$element.captureStream(frameRate)
  }

  getImageData(x: number, y: number, width: number, height: number): ImageData {
    const imageData = this._offscreen_ctx.getImageData(x, y, width, height)
    return imageData
  }

  putImageData(
    image: ImageData,
    dx: number,
    dy: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    // this._component.$element
    //   .getContext('2d')
    //   .putImageData(image, dx, dy, x, y, width, height)

    this.emit('call', {
      method: 'putImageData',
      data: [image, dx, dy, x, y, width, height],
    })
  }

  onDataInputData(name: string, data: any): void {
    super.onDataInputData(name, data)

    switch (name) {
      case 'width':
        // if (typeof data === 'string' && data.endsWith('vw')) {
        //   data = 0
        // }
        try {
          this._offscreen.width = data
        } catch (err) {
          // console.log(err)
          //
        }
        // this._component.setProp('width', data)

        break
      case 'height':
        // if (typeof data === 'string' && data.endsWith('vw')) {
        //   data = 0
        // }
        try {
          this._offscreen.height = data
        } catch (err) {
          // console.log(err)
          //
        }
        // this._component.setProp('height', data)

        break
    }
  }
}
