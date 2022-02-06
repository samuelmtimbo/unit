import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { ST } from '../../../../../interface/ST'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {
  stream: ST
}

export default class DisplayMedia extends Functional<I, O> {
  private _stream: MediaStream

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['stream'],
      },
      {},
      system,
      pod
    )

    this.addListener('destroy', () => {
      if (this._stream) {
        stopMediaStream(this._stream)
        this._stream = undefined
      }
    })

    this.addListener('take_err', () => {
      this._input.opt.pull()
    })
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        media: { getDisplayMedia },
      },
    } = this.__system

    const _stream = await getDisplayMedia(opt)

    const stream = wrapMediaStream(_stream)

    done({
      stream,
    })
  }
}
