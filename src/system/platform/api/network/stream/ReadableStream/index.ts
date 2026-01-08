import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../../Class/Holder'
import { EventEmitter_ } from '../../../../../../EventEmitter'
import { apiNotSupportedError } from '../../../../../../exception/APINotImplementedError'
import { System } from '../../../../../../system'
import { RS } from '../../../../../../types/interface/RS'
import { wrapReadableStream } from '../../../../../../wrap/ReadableStream'
import { ID_READABLE_STREAM } from '../../../../../_ids'

export type I = {
  opt: {}
  done: any
  data: string
  end: any
}

export type O = {
  stream: RS & $
  done: any
}

export default class ReadableStream_ extends Holder<I, O> {
  private _emitter: EventEmitter_

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['stream'],
        i: ['data', 'end'],
        o: ['done'],
      },
      {
        input: {
          body: {
            ref: true,
          },
        },
        output: {
          res: {
            ref: true,
          },
        },
      },
      system,
      ID_READABLE_STREAM
    )
  }

  async f({ opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        window: { ReadableStream },
        text: { TextEncoder },
      },
    } = this.__system

    if (!ReadableStream) {
      fail(apiNotSupportedError('ReadableStream'))

      return
    }

    const emitter = new EventEmitter_<any>()

    this._emitter = emitter

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      start(controller) {
        emitter.addListener('data', (chunk) => {
          controller.enqueue(encoder.encode(chunk))
        })

        emitter.addListener('end', () => {
          controller.close()
        })

        emitter.addListener('error', (err) => {
          controller.error(err)
        })
      },
    })

    const stream = wrapReadableStream(readableStream, this.__system)

    if (this._input.data.active()) {
      this._input_data(this._input.data.peak())
    }

    if (this._input.end.active()) {
      this._input_end()
    }

    done({ stream })
  }

  private _input_data = (data: string) => {
    this._emitter.emit('data', data)

    this._input.data.pull()
  }

  private _input_end = () => {
    this._emitter.emit('end')

    this.d()

    this._input.end.pull()
  }

  onIterDataInputData(name: keyof I, data: any) {
    super.onIterDataInputData(name, data)

    if (this._emitter) {
      if (name === 'data') {
        this._input_data(data)
      } else if (name === 'end') {
        this._input_end()
      }
    }
  }

  b() {
    this._output.done.push(true)
  }
}
