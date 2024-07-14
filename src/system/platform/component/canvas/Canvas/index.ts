import { ElementEE, Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CA } from '../../../../../types/interface/CA'
import { ID_CANVAS } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'
import { Style } from '../../../Style'
import CanvasComp from './Component'

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
export interface CanvasC extends CanvasComp {}

export default class Canvas
  extends Element_<I, O, CanvasJ, CanvasEE, CanvasC>
  implements CA
{
  __ = ['U', 'C', 'V', 'J', 'CA', 'EE']

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

    this._state = {
      d: [],
    }

    this._component = new CanvasComp({}, this.__system)
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

    this._component.drawImage(imageBitmap, x, y, width, height)

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

  private async _local_component(): Promise<CanvasComp> {
    return firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    ) as Promise<CanvasComp>
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
    this._component.putImageData(image, dx, dy, x, y, width, height)

    this.emit('call', {
      method: 'putImageData',
      data: [image, dx, dy, x, y, width, height],
    })
  }

  onDataInputData<K extends keyof I>(name: K, data: any): void {
    super.onDataInputData(name, data)

    switch (name) {
      case 'width':
        this._component.setProp('width', data)

        break
      case 'height':
        this._component.setProp('height', data)

        break
    }
  }
}
