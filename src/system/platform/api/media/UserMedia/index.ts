import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { ST } from '../../../../../interface/ST'
import { NOOP } from '../../../../../NOOP'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { IUserMediaOpt } from '../../../../../types/global/IUserMedia'
import { Unlisten } from '../../../../../types/Unlisten'
import { stopMediaStream } from '../../../../../util/stream/stopMediaStream'

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

    const stream = new (class Stream extends $ implements ST {
      __: string[] = ['ST']

      stream(callback: Callback<MediaStream>): Unlisten {
        callback(_stream)
        return NOOP
      }
    })(this.__system, this.__pod)

    done({ stream })
  }
}
