import { CSOpt } from '../../../../../async/$CS'
import { Callback } from '../../../../../Callback'
import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { CA } from '../../../../../interface/CA'
import { Unlisten } from '../../../../../Unlisten'
import { Style } from '../../../Props'
import _Canvas from './Component'

export interface I {
  style?: Style
  width?: number
  height?: number
  d?: any[]
}

export interface O {}

export default class Canvas extends Element<I, O> implements CA {
  _ = ['U', 'C', 'V', 'CA']

  constructor(config?: Config) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: [],
      },
      config
    )

    this._obj = {
      d: [],
    }
  }

  draw(step: any[]): Promise<void> {
    this._obj.d.push(step)
    this._backwarding = true
    this._input.d.pull()
    this._backwarding = false
    this.emit('call', { method: 'draw', data: [step] })
    return
  }

  captureStream(
    { frameRate }: CSOpt,
    callback: Callback<MediaStream>
  ): Unlisten {
    return this._component_source.connect(async (component: _Canvas) => {
      const stream = await component.captureStream({ frameRate })
      callback(stream)
    })
  }

  $captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten {
    return this.captureStream(opt, callback)
  }
}
