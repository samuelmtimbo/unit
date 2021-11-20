import { Callback } from '../../../../../Callback'
import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { ST } from '../../../../../interface/ST'
import NOOP from '../../../../../NOOP'
import { Unlisten } from '../../../../../Unlisten'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {
  stream: ST
}

export default class GetUserMedia extends Functional<I, O> {
  private _stream: MediaStream

  constructor() {
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
      }
    )

    this.addListener('destroy', () => {
      if (this._stream) {
        this._stream.getTracks().forEach((track) => track.stop())
        this._stream = undefined
      }
    })
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    if (!navigator || !navigator.mediaDevices) {
      done(undefined, 'MediaDevices API not supported')
      return
    }

    if (!navigator.mediaDevices.getUserMedia) {
      done(undefined, 'MediaDevices getUserMedia API not supported')
      return
    }

    let stream: MediaStream

    try {
      stream = await navigator.mediaDevices.getUserMedia(opt)

      this._stream = stream
    } catch (err) {
      let { message } = err

      if (
        message ===
        "Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested"
      ) {
        message = 'at least one of audio or video must be requested'
      }

      this.err(message)

      return
    }

    const _stream = new (class Stream extends $ implements ST {
      __: string[] = ['ST']

      stream(callback: Callback<MediaStream>): Unlisten {
        callback(stream)
        return NOOP
      }
    })()

    done({ stream: _stream })
  }
}
