import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ST } from '../../../../../types/interface/ST'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_GET_DISPLAY_MEDIA } from '../../../../_ids'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {
  stream: ST
}

export default class GetDisplayMedia extends Functional<I, O> {
  private _stream: MediaStream

  constructor(system: System) {
    super(
      {
        i: ['opt'],
        o: ['stream'],
      },
      {},
      system,
      ID_GET_DISPLAY_MEDIA
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

    const stream = wrapMediaStream(_stream, this.__system)

    done({
      stream,
    })
  }
}
