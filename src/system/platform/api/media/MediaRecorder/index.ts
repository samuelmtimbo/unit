import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Waiter } from '../../../../../Waiter'
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
  done: any
}

export type O = {
  blob: B
  err: string
}

export default class _MediaRecorder extends Holder<I, O> {
  private _media_recorder: MediaRecorder

  private _stop_waiter: Waiter<any> = new Waiter()

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
  }

  async f({ opt, stream }: I, done: Done<O>): Promise<void> {
    const _stream: MediaStream = await stream.mediaStream()

    try {
      this._media_recorder = new MediaRecorder(_stream, opt)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    const start = this._input.start.peak()

    if (start !== undefined) {
      this._start_recorder()
    }
  }

  private _listen = () => {
    const { opt } = this._i

    const chunks = []

    this._media_recorder.ondataavailable = (event: BlobEvent) => {
      const { data } = event

      if (data.size > 0) {
        chunks.push(data)
      }
    }

    this._media_recorder.onstop = () => {
      const blob = new Blob(chunks, { type: opt.mimeType ?? 'audio/wav' })

      const blob_ = wrapBlob(blob, this.__system)

      this._output.blob.push(blob_)

      this._stop_waiter.set(true)
      this._stop_waiter.clear()
    }

    this._media_recorder.onerror = (event: Event & { error: DOMException }) => {
      this._output.err.push(
        `error recording stream: ${(event?.error as DOMException)?.name}`
      )
    }
  }

  private _unlisten = () => {
    this._media_recorder.onerror = undefined
    this._media_recorder.ondataavailable = undefined
    this._media_recorder.onstop = undefined
  }

  d() {
    if (this._media_recorder) {
      this._unlisten()

      this._media_recorder.stop()

      this._media_recorder = undefined
    }
  }

  private _start_recorder = (): void => {
    if (this._media_recorder) {
      this._listen()

      try {
        this._media_recorder.start()
      } catch (err) {
        if (err.message.toLowerCase().startsWith('failed to execute')) {
          this.err('failed to start media recorder')
        } else {
          this.err(err.message.toLowerCase())
        }
      }
    }
  }

  async onIterDataInputData(name: keyof I, data: any): Promise<void> {
    super.onIterDataInputData(name, data)

    if (name === 'start') {
      this._start_recorder()
    } else if (name === 'stop') {
      if (this._media_recorder) {
        if (this._media_recorder.state === 'recording') {
          this._media_recorder.stop()
        }

        await this._stop_waiter.once()

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
          this._unlisten()

          this._media_recorder.stop()
        }
      }
    }
  }
}
