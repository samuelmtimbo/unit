import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Source } from '../../../../../Source'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { CS } from '../../../../../types/interface/CS'
import { MS } from '../../../../../types/interface/MS'
import { Unlisten } from '../../../../../types/Unlisten'
import { wrapMediaStream } from '../../../../../wrap/MediaStream'
import { ID_CAPTURE_STREAM } from '../../../../_ids'

export interface I {
  source: CS
  opt: { frameRate: number }
  stop: any
}

export interface O {
  stream: MS
}

export default class CaptureStream extends Holder<I, O> {
  __ = ['U']

  private _stream: Source<MediaStream> = new Source()

  constructor(system: System) {
    super(
      {
        fi: ['source', 'opt'],
        fo: ['stream'],
        i: [],
        o: [],
      },
      {
        input: {
          source: {
            ref: true,
          },
        },
        output: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_CAPTURE_STREAM,
      'stop'
    )
  }

  async f({ source, opt }: I, done: Done<O>): Promise<void> {
    let _stream: MediaStream

    try {
      _stream = await source.captureStream(opt)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const stream = wrapMediaStream(_stream, this.__system)

    done({ stream })
  }

  d() {
    this._stream.set(null)
  }

  mediaStream(callback: Callback<MediaStream>): Unlisten {
    return this._stream.connect(callback)
  }
}
