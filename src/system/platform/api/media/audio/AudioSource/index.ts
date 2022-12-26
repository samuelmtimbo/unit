import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { ST } from '../../../../../../types/interface/ST'
import { wrapMediaStream } from '../../../../../../wrap/MediaStream'
import { ID_AUDIO_SOURCE } from '../../../../../_ids'

export type I = {
  src: string
}

export type O = {
  stream: ST
}

export default class AudioSource extends Functional<I, O> {
  private _audio: HTMLAudioElement

  constructor(system: System) {
    super(
      {
        i: ['src'],
        o: ['stream'],
      },
      {},
      system,
      ID_AUDIO_SOURCE
    )

    this._audio = new Audio()
    this._audio.volume = 0
    this._audio.play()

    this.addListener('destroy', () => {
      this._audio.srcObject = null
    })
  }

  f({ src }, done: Done<O>) {
    this._audio.src = src

    const { srcObject } = this._audio

    let stream: ST

    if (srcObject instanceof MediaStream) {
      stream = wrapMediaStream(srcObject, this.__system)
    } else {
      done(undefined, '')

      return
    }

    done({
      stream,
    })
  }

  d() {
    this._audio.src = null
  }
}
