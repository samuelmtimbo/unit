import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
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
  }

  async f({ stream, id }: I, done: Done<O>) {
    const {
      api: {
        window: { Audio },
      },
    } = this.__system

    this._audio = new Audio()

    this._audio.srcObject = await stream.mediaStream()

    try {
      await this._audio.setSinkId(id)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      this.err(err.message)
    }

    this._audio.play()
  }

  d() {
    if (this._audio) {
      this._audio.pause()
    }
  }
}
