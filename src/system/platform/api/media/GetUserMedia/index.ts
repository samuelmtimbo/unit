import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { MS } from '../../../../../types/interface/MS'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_GET_USER_MEDIA } from '../../../../_ids'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {
  stream: MS
}

export default class UserMedia extends Holder<I, O> {
  private _stream: MediaStream

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['stream'],
      },
      {
        output: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_USER_MEDIA
    )
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        media: { getUserMedia },
      },
    } = this.__system

    let stream: MS

    try {
      const _stream = await getUserMedia(opt)

      this._stream = _stream

      stream = wrapMediaStream(_stream, this.__system)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ stream })
  }

  d() {
    if (this._stream) {
      stopMediaStream(this._stream)

      this._stream = undefined
    }
  }
}
