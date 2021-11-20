import { Functional } from '../../../../../../Class/Functional'
import { Config } from '../../../../../../Class/Unit/Config'
import { ST } from '../../../../../../interface/ST'

export type I = {
  id: string
  stream: ST
}

export type O = {}

export default class AudioTarget extends Functional<I, O> {
  private _audio: HTMLAudioElement

  constructor(config?: Config) {
    super(
      {
        i: ['id', 'stream'],
        o: [],
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

    this._audio = new Audio()
  }

  async f({ stream, id }: I) {
    stream.stream((_stream) => {
      this._audio.srcObject = _stream
    })

    this._audio
      // @ts-ignore
      .setSinkId(id)
      .catch((err) => {
        this.err(err.message)
      })

    this._audio.play()
  }

  d() {
    this._audio.pause()
  }
}
