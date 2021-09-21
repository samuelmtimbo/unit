import { Callback } from '../../../../../Callback'
import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
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
  private _stream: any

  constructor(config?: Config) {
    super(
      {
        i: ['opt'],
        o: ['stream'],
      },
      config
    )

    this.addListener('destroy', () => {
      if (this._stream) {
        this._stream.getTracks().forEach((track) => track.stop())
      }
    })

    this.addListener('take_err', () => {
      this._input.opt.pull()
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
      _: string[] = ['ST']

      stream(callback: Callback<MediaStream>): Unlisten {
        callback(stream)
        return NOOP
      }
    })()

    done({ stream: _stream })
  }
}
