import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { MS } from '../../../../../types/interface/MS'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_GET_DISPLAY_MEDIA } from '../../../../_ids'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {
  stream: MS
}

export default class GetDisplayMedia extends Holder<I, O> {
  private _stream: MediaStream

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['stream'],
      },
      {},
      system,
      ID_GET_DISPLAY_MEDIA
    )
  }

  async f({ opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        media: { getDisplayMedia },
      },
    } = this.__system

    let _stream

    try {
      _stream = await getDisplayMedia(opt)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        fail('permission denied')

        return
      }

      fail(err.message)

      return
    }

    const stream = wrapMediaStream(_stream, this.__system)

    done({
      stream,
    })
  }

  d() {
    if (this._stream) {
      stopMediaStream(this._stream)

      this._stream = undefined
    }
  }
}
