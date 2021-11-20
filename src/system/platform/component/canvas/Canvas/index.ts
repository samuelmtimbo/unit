import { Callback } from '../../../../../Callback'
import { $ } from '../../../../../Class/$'
import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { CSOpt } from '../../../../../interface/async/$CS'
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

export default class Canvas extends Element<I, O> {
  _ = ['U', 'C', 'V']

  constructor(config?: Config) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: ['ctx'],
      },
      config,
      {
        output: {
          ctx: {
            ref: true,
          },
        },
      }
    )

    this._obj = {
      d: [],
    }

    const self = this

    const ctx = new (class CTX extends $ implements CA {
      _: string[] = ['CA']

      draw(step: any[]): Promise<void> {
        self._obj.d.push(step)
        self._backwarding = true
        self._input.d.pull()
        self._backwarding = false

        self.emit('call', { method: 'draw', data: [step] })

        return
      }
    })()

    this._output.ctx.push(ctx)
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
