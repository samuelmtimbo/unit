import { ElementEE, Element_ } from '../../../../../Class/Element'
import { draw } from '../../../../../client/canvas/draw'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CA } from '../../../../../types/interface/CA'
import { ID_CANVAS } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'
import { Style } from '../../../Style'
import Canvas_, { clearCanvas } from './Component'

export interface I {
  style?: Style
  width?: number
  height?: number
  d?: any[]
  attr?: Dict<string>
}

export interface O {}

export interface CanvasJ {}
export interface CanvasEE extends ElementEE<{}> {}
export interface CanvasC extends Canvas_ {}

export default class Canvas
  extends Element_<I, O, CanvasJ, CanvasEE, CanvasC>
  implements CA
{
  __ = ['U', 'C', 'V', 'J', 'CA', 'EE']

  private _canvas: OffscreenCanvas
  private _ctx: OffscreenCanvasRenderingContext2D

  constructor(system: System) {
    super(
      {
        i: ['style', 'width', 'height', 'd', 'attr'],
        o: [],
      },
      {
        output: {},
      },
      system,
      ID_CANVAS
    )

    const {
      api: {
        window: { OffscreenCanvas },
        document: {},
      },
    } = system

    this._state = {
      d: [],
    }

    if (OffscreenCanvas) {
      this._canvas = new OffscreenCanvas(200, 200)

      this._ctx = this._canvas.getContext('2d')
    }

    this.addListener('reset', () => {
      if (this._ctx) {
        clearCanvas(this._ctx)
      }

      this._state.d = []
    })
  }

  async clear(): Promise<void> {
    if (this._ctx) {
      clearCanvas(this._ctx)
    }

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

    if (this._ctx) {
      this._ctx.drawImage(imageBitmap, x, y, width, height)
    }

    this.emit('call', {
      method: 'drawImage',
      data: [imageBitmap, x, y, width, height],
    })
  }

  strokePath(d: string): void {
    // if (this._ctx) {
    //   this._ctx.strokePath(d)
    // }

    this.emit('call', { method: 'strokePath', data: [d] })
  }

  fillPath(d: string, fillRule: CanvasFillRule): void {
    // if (this._ctx) {
    //   this._ctx.fillPath(d, fillRule)
    // }

    this.emit('call', { method: 'fillPath', data: [d, fillRule] })
  }

  scale(sx: number, sy: number): void {
    if (this._ctx) {
      this._ctx.scale(sx, sy)
    }

    this.emit('call', { method: 'scale', data: [sx, sy] })
  }

  translate(x: number, y: number): void {
    if (this._ctx) {
      this._ctx.translate(x, y)
    }

    this.emit('call', { method: 'translate', data: [x, y] })
  }

  async draw(step: any[]): Promise<void> {
    this._state.d.push(step)

    this._backwarding = true
    this._input.d.pull()
    this._backwarding = false

    if (this._ctx) {
      draw(this._ctx, step)
    }

    this.emit('call', { method: 'draw', data: [step] })

    return
  }

  private async _local_component(): Promise<Canvas_> {
    return firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    ) as Promise<Canvas_>
  }

  async toBlob(type: string, quality: number): Promise<Blob> {
    const component = await this._local_component()

    return component.toBlob(type, quality)
  }

  async toDataUrl(type: string, quality: number): Promise<string> {
    const component = await this._local_component()

    return component.toDataUrl(type, quality)
  }

  async captureStream({
    frameRate,
  }: {
    frameRate: number
  }): Promise<MediaStream> {
    const component = await this._local_component()

    return component.captureStream({ frameRate })
  }

  async getImageData(
    x: number,
    y: number,
    width: number,
    height: number,
    opt: any
  ): Promise<ImageData> {
    const component = await this._local_component()

    return component.getImageData(x, y, width, height, opt)
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
    if (this._ctx) {
      this._ctx.putImageData(image, dx, dy, x, y, width, height)
    }

    this.emit('call', {
      method: 'putImageData',
      data: [image, dx, dy, x, y, width, height],
    })
  }

  onDataInputData<K extends keyof I>(name: K, data: any): void {
    super.onDataInputData(name, data)

    switch (name) {
      case 'width':
        if (typeof data === 'number') {
          if (this._canvas) {
            this._canvas.width = data
          }
        }

        break
      case 'height':
        if (typeof data === 'number') {
          if (this._canvas) {
            this._canvas.height = data
          }
        }

        break
    }
  }
}
