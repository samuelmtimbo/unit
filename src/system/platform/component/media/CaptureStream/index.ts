import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { $CS, CSOpt } from '../../../../../interface/async/$CS'
import { ST } from '../../../../../interface/ST'
import { ObjectSource } from '../../../../../ObjectSource'
import { Primitive } from '../../../../../Primitive'
import { Unlisten } from '../../../../../Unlisten'

export interface I {
  source: $CS
  opt: CSOpt
}

export interface O {}

export default class CaptureStream extends Primitive<I, O> implements ST {
  _ = ['U', 'ST']

  private _stream: ObjectSource<MediaStream> = new ObjectSource()

  constructor(config?: Config) {
    super(
      {
        i: ['source', 'opt', 'stop'],
        o: [],
      },
      config,
      {
        input: {
          media: {
            ref: true,
          },
        },
      }
    )
  }

  onRefInputData(name: string, data: any): void {
    // if (name === 'source') {
    this._setup()
    // }
  }

  onDataInputData(name: string): void {
    if (name === 'opt') {
      this._setup()
    } else if (name === 'stop') {
      this._plunk()
      this._input.opt.pull()
      this._input.stop.pull()
    }
  }

  onRefInputDrop(name: string): void {
    // if (name === 'name') {
    this._plunk()
    // }
  }

  onDataInputDrop(name: string): void {
    if (name === 'opt') {
      this._plunk()
    }
  }

  private _unlisten: Unlisten

  private _setup() {
    const { source, opt } = this._i

    if (source !== undefined && opt !== undefined) {
      this._unlisten = source.$captureStream(opt, (stream: MediaStream) => {
        this._stream.set(stream)
      })
    }
  }

  private _plunk() {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined
    }

    this._stream.set(null)
  }

  stream(callback: Callback<MediaStream>): Unlisten {
    return this._stream.connect(callback)
  }

  $stream({}: {}, callback: Callback<MediaStream>): Unlisten {
    return this.stream(callback)
  }
}
