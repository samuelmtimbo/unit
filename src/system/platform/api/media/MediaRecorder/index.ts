import { Semifunctional } from '../../../../../Class/Semifunctional'
import { B } from '../../../../../interface/B'
import { ST } from '../../../../../interface/ST'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  stream: ST
  opt: MediaRecorderOptions
  start: number
  stop: any
}

export type O = {
  blob: B
}

export default class _MediaRecorder extends Semifunctional<I, O> {
  private _media_recorder: MediaRecorder

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['opt', 'stream'],
        fo: [],
        i: ['start', 'stop'],
        o: ['blob'],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
        output: {
          blob: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      this._media_recorder.stop()
      this._media_recorder.ondataavailable = null
      this._media_recorder = null
    })
  }

  f({ opt, stream }: I): void {
    stream.stream((_stream: MediaStream): void => {
      if (this._media_recorder) {
        this._media_recorder.stop()
        this._media_recorder.ondataavailable = null
      }

      this._media_recorder = new MediaRecorder(_stream, opt)

      this._media_recorder.ondataavailable = (event: BlobEvent) => {
        const { data } = event

        this._output.blob.push(data)
      }

      const start = this._input.start.peak()
      if (start !== undefined) {
        this._start_recorder(start)
      }
    })
  }

  private _start_recorder = (start: number): void => {
    if (this._media_recorder) {
      if (this._media_recorder.state === 'recording') {
        this._media_recorder.stop()
      }

      this._media_recorder.start(start)
    }
  }

  onIterDataInputData(name: string, data: any): void {
    if (name === 'start') {
      if (this._media_recorder) {
        this._start_recorder(data)
      }
    } else if (name === 'stop') {
      if (this._media_recorder) {
        if (this._media_recorder.state === 'recording') {
          this._media_recorder.stop()
        }

        this._backward('start')
        this._backward('stop')
      }
    }
  }

  onIterDataInputDrop(name: string): void {
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
}
