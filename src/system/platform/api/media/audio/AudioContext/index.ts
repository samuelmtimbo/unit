import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { AC } from '../../../../../../types/interface/AC'
import { wrapAudioContext } from '../../../../../../wrap/AudioContext'
import { ID_AUDIO_CONTEXT } from '../../../../../_ids'

export type I = {
  opt: {}
}

export type O = {
  ctx: AC
}

export default class AudioContext_ extends Functional<I, O> {
  private _ctx: AudioContext

  constructor(system: System) {
    super(
      {
        i: ['opt'],
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
      ID_AUDIO_CONTEXT
    )
  }

  f({ opt }, done: Done<O>) {
    const {
      api: {
        window: { AudioContext },
      },
    } = this.__system

    // @ts-ignore
    const _ctx = new AudioContext(opt)

    this._ctx = _ctx

    const ctx = wrapAudioContext(_ctx, this.__system)

    done({
      ctx,
    })
  }

  d() {
    if (this._ctx) {
      this._ctx.close()

      this._ctx = undefined
    }
  }
}
