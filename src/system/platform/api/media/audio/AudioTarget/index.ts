import { Config } from '../../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../../Primitive'

export type I = {
  deviceId: string
  src: string
}

export type O = {}

export default class AudioTarget extends Primitive<I, O> {
  private _audio: HTMLAudioElement

  constructor(config?: Config) {
    super(
      {
        i: ['deviceId', 'src', 'stream'],
        o: [],
      },
      config
    )
  }

  onDataInputData(name: string, current: any) {
    if (name === 'src') {
      this._audio.src = current
      this._audio.play()
    } else if (name === 'deviceId') {
      if (current !== null) {
        this._audio
          // @ts-ignore
          .setSinkId(current)
          .then(() => {})
          .catch((err) => {
            this.err(err.message)
          })
      }
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'src') {
      this._audio.src = null
    } else {
      this._audio
        // @ts-ignore
        .setSinkId('default')
        .then(() => {})
        .catch((err) => {})
    }
  }
}
