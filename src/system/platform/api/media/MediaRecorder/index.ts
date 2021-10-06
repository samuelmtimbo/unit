import { Config } from '../../../../../Class/Unit/Config'
import { ST } from '../../../../../interface/ST'
import { Primitive } from '../../../../../Primitive'

export type I = {
  stream: ST
  opt: MediaRecorderOptions
}

export type O = {}

export default class _MediaRecorder extends Primitive<I, O> {
  private _media_recorder: MediaRecorder

  constructor(config?: Config) {
    super(
      {
        i: ['opt', 'stream', 'start', 'stop'],
        o: ['data'],
      },
      config,
      {
        input: {
          stream: {
            ref: true,
          },
        },
      }
    )

    this.addListener('destroy', () => {})

    this.addListener('take_err', () => {
      this._input.opt.pull()
    })
  }

  onDataInputData(name: string, data: any): void {
    if (name === 'opt') {
      this._setup()
    } else if (name === 'start') {
      const start = data as number

      if (this._media_recorder) {
        if (this._media_recorder.state === 'recording') {
          this._media_recorder.stop()
        }

        this._media_recorder.start(start)
      }
    } else if (name === 'stop') {
      if (this._media_recorder) {
        if (this._media_recorder.state === 'recording') {
          this._media_recorder.stop()
        }

        this._backwarding = true
        this._input.start.pull()
        this._input.stop.pull()
        this._backwarding = false
      }
    }
  }

  onRefInputData(name: string, data: any): void {
    if (name === 'stream') {
      this._setup()
    }
  }

  onDataInputDrop(name: string): void {
    if (this.hasErr()) {
      this.takeErr()
    }

    if (name === 'start') {
      if (!this._backwarding) {
        if (this._media_recorder) {
          this._media_recorder.stop()
        }
      }
    }
  }

  private _setup(): void {
    const _stream = this._input.stream.peak() as ST
    const opt = this._input.opt.peak() as MediaRecorderOptions

    if (_stream && opt) {
      _stream.stream((stream): void => {
        if (this._media_recorder) {
          this._media_recorder.stop()
          this._media_recorder.ondataavailable = null
        }

        console.log(opt.mimeType)

        this._media_recorder = new MediaRecorder(stream, opt)

        this._media_recorder.ondataavailable = (event: BlobEvent) => {
          const { data } = event

          this._output.data.push(data)
        }
      })
    }
  }
}
