import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IUserMediaOpt } from '../../../../../types/global/IUserMedia'
import { ST } from '../../../../../types/interface/ST'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'

export type I = {
  opt: IUserMediaOpt
}

export type O = {
  stream: ST
}

export default class UserMedia extends Functional<I, O> {
  private _stream: MediaStream

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['stream'],
      },
      {
        output: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      if (this._stream) {
        stopMediaStream(this._stream)
        this._stream = undefined
      }
    })
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        media: { getUserMedia },
      },
    } = this.__system

    let _stream: MediaStream
    try {
      _stream = await getUserMedia(opt)
    } catch (err) {
      done(undefined, err.message)
      return
    }

    const stream = await wrapMediaStream(_stream, this.__system, this.__pod)

    done({ stream })
  }
}
