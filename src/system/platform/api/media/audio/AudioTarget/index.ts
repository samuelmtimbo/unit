import { Functional } from '../../../../../../Class/Functional'
import { System } from '../../../../../../system'
import { MS } from '../../../../../../types/interface/MS'
import { ID_AUDIO_TARGET } from '../../../../../_ids'

export type I = {
  id: string
  stream: MS
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

    const {
      api: {
        window: { Audio },
      },
    } = this.__system

    this._audio = new Audio()
  }

  async f({ stream, id }: I) {
    stream.mediaStream((_stream) => {
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
