import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { MS } from '../../../../../types/interface/MS'
import { wrapBlob } from '../../../../../wrap/Blob'
import { ID_MEDIA_RECORDER } from '../../../../_ids'

export type I = {
  stream: MS
  opt: MediaRecorderOptions
  start: number
  stop: any
}

export type O = {
  blob: B
  err: string
}

export default class _MediaRecorder extends Semifunctional<I, O> {
  private _media_recorder: MediaRecorder

  constructor(system: System) {
    super(
      {
        fi: ['opt', 'stream'],
        fo: [],
        i: ['start', 'stop'],
        o: ['blob', 'err'],
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
      ID_MEDIA_RECORDER
    )

    this.addListener('destroy', () => {
      this._media_recorder.stop()
      this._media_recorder.ondataavailable = null
      this._media_recorder = null
    })
  }

  f({ opt, stream }: I, done: Done<O>): void {
    const chunks = []

    stream.mediaStream((_stream: MediaStream): void => {
      if (this._media_recorder) {
        this._media_recorder.stop()
        this._media_recorder.ondataavailable = null
      }

      try {
        this._media_recorder = new MediaRecorder(_stream, opt)
      } catch (err) {
        done(undefined, err.message.toLowerCase())

        return
      }

      this._media_recorder.ondataavailable = (event: BlobEvent) => {
        const { data } = event

        if (data.size > 0) {
          chunks.push(data)
        }
      }

      this._media_recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })

        const blob_ = wrapBlob(blob, this.__system)

        this._output.blob.push(blob_)
      }

      this._media_recorder.onerror = (
        event: Event & { error: DOMException }
      ) => {
        this._output.err.push(
          `error recording stream: ${(event?.error as DOMException)?.name}`
        )
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

      try {
        this._media_recorder.start(start)
      } catch (err) {
        if (err.message.toLowerCase().startsWith('failed to execute')) {
          this.err('failed to start media recorder')
        } else {
          this.err(err.message.toLowerCase())
        }
      }
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
