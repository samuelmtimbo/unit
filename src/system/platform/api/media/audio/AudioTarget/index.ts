import { Functional } from '../../../../../../Class/Functional'
import { System } from '../../../../../../system'
import { ST } from '../../../../../../types/interface/ST'
import { ID_AUDIO_TARGET } from '../../../../../_ids'

export type I = {
  id: string
  stream: ST
}

export type O = {}

export default class AudioTarget extends Functional<I, O> {
  private _audio: HTMLAudioElement

  constructor(system: System) {
    super(
      {
        i: ['id', 'stream'],
        o: [],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_AUDIO_TARGET
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
