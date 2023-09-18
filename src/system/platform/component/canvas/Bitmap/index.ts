import { ElementEE, Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { IBRC } from '../../../../../types/interface/IBCA'
import { ID_BITMAP } from '../../../../_ids'
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
  implements IBRC
{
  __ = ['EE', 'U', 'C', 'V', 'J', 'IBRC']

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
      ID_BITMAP
    )

    this._state = {}
  }

  async clear(): Promise<void> {
    this._component.clear()

    this.emit('call', { method: 'clear', data: undefined })

    return
  }

  async transferFromImageBitmap(imageBitmap: ImageBitmap): Promise<void> {
    this.emit('call', {
      method: 'transferFromImageBitmap',
      data: [imageBitmap],
    })
  }
}
