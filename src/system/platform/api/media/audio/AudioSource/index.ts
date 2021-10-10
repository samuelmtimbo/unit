import { Config } from '../../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../../Primitive'

export type I = {
  src: string
}

export type O = {
  stream: MediaStream
}

export default class AudioSource extends Primitive<I, O> {
  private _audioElement: HTMLAudioElement

  constructor(config?: Config) {
    super(
      {
        i: ['src'],
        o: ['stream'],
      },
      config
    )

    this._audioElement = new Audio()

    this.addListener('destroy', () => {
      this._audioElement.srcObject = null
    })
  }

  onDataInputData(name: 'src', src: string) {
    this._audioElement.src = src

    // HACK
    this._audioElement.volume = 0

    this._audioElement.play()
  }

  onDataInputDrop(name: 'src') {
    this._audioElement.src = null
  }
}
