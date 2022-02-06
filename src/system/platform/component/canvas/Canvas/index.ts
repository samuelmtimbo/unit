import { $ } from '../../../../../Class/$'
import { Element } from '../../../../../Class/Element'
import { CSOpt } from '../../../../../interface/async/$CS'
import { CA } from '../../../../../interface/CA'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { Unlisten } from '../../../../../types/Unlisten'
import { listenGlobalComponent } from '../../../../globalComponent'
import { Style } from '../../../Props'
import _Canvas from './Component'

export interface I {
  style?: Style
  width?: number
  height?: number
  d?: any[]
}

export interface O {
  ctx: CA
}

export default class Canvas extends Element<I, O, {}> {
  __ = ['U', 'C', 'V']

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: ['ctx'],
      },
      {
        output: {
          ctx: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this._obj = {
      d: [],
    }

    const self = this

    const ctx = new (class CTX extends $ implements CA {
      __: string[] = ['CA']

      draw(step: any[]): Promise<void> {
        self._obj.d.push(step)
        self._backwarding = true
        self._input.d.pull()
        self._backwarding = false

        self.refEmitter().emit('call', { method: 'draw', data: [step] })

        return
      }
    })(this.__system, this.__pod)

    this._output.ctx.push(ctx)
  }

  captureStream(
    { frameRate }: CSOpt,
    callback: Callback<MediaStream>
  ): Unlisten {
    return listenGlobalComponent(
      this.__system,
      this.__global_id,
      async (component: _Canvas) => {
        const stream = await component.captureStream({ frameRate })
        callback(stream)
      }
    )
  }

  $captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten {
    return this.captureStream(opt, callback)
  }
}
