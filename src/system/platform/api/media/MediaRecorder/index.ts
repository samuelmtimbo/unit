import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export type I = {
  stream: Unit
  opt: MediaRecorderOptions
}

export type O = {}

export default class MediaRecorder extends Primitive<I, O> {
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

  onDataInputData(name: string, data: any) {
    if (name === 'opt') {
    } else if (name === 'stream') {
    }
  }

  onDataInputDrop() {
    if (this.hasErr()) {
      this.takeErr()
    }
  }
}
